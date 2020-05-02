import React, { useCallback, useReducer , useMemo } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients
    case 'ADD':
      return [...currentIngredients, action.ingredient]
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there!')
  }
}
const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null }
    case 'RESPONSE':
      return { ...curHttpState, loading: false }
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...curHttpState, error: null };
    default:
      throw new Error('Should not get there !')
  }
}
function Ingredients() {
  //const [userIngredients, setUserIngredients] = useState([]);
  //we should consider reducer for state which depends on previous state and also which has lot of action
  //we should consider reducer also for piece of code where two sattes are changing like loading and error
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpRequest, dispatchHttp] = useReducer(httpReducer, { loading: false, error: false });

  const addIngredientHandler = useCallback(ingredient => {
    dispatchHttp({ type: 'SEND' });
    fetch('https://react-hooks-update-1c67d.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      return response.json();
    }).then(responseData => {
      dispatchHttp({ type: 'RESPONSE' })
      //we didnt have get call after adding
      ingredient = {
        ...ingredient,
        id: responseData.name
      }
      dispatch({ type: 'ADD', ingredient: ingredient });
    }).catch(error => {
      dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong' });
    });
    // we define dependency of variable which can call this function 
    //So dispatchHttp cannot change because it is function
  },[])

  const removeItemHandler = useCallback(id => {
    dispatchHttp({ type: 'SEND' });
    fetch(`https://react-hooks-update-1c67d.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then(responseData => {
      dispatchHttp({ type: 'RESPONSE' });
      //setUserIngredients(prevIngredients => prevIngredients.filter((userIngredient) => userIngredient.id !== id));
      dispatch({ type: 'DELETE', id: id });
    }).catch(error => {
      dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong' });
    });
  },[]);
  //onLoadIngredients is getting called hassetUserIngredients and
  // therefore the whole app is getting rendered again and again and
  // also filteredIngredientsHandler is function which is created unique everytime
  //useCallback will call thid funtion only once ref lec437
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);
  const clearErrorMessage = useCallback(() => {
    dispatchHttp({ type: 'CLEAR' })
  },[]);
  const ingredientList = useMemo(()=>{
    return <IngredientList 
    ingredients={userIngredients}
    onRemoveItem={removeItemHandler}/>
  },[userIngredients, removeItemHandler])
  //this memo needs to run again when userIngredients has been created 
  //remove ItemHandler is the funcgiona nd it wont change
  //Memo is used so that we do not recreate when whole compoennt render
  // to avoid rendering i=in virtual dom and not in real dom
  return (
    <div className="App">
      {httpRequest.error && <ErrorModal onClose={clearErrorMessage}>{httpRequest.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpRequest.loading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
