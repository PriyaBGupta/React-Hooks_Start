import React, { useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState()
  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://react-hooks-update-1c67d.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      return response.json();
    }).then(responseData => {
      setIsLoading(false);
      setUserIngredients(prevIngredients => [
        ...prevIngredients,
        { id: responseData.name, ...ingredient }
      ])
    }).catch(error => {
      setIsLoading(false);
      setErrorMessage('Something went wrong');
    });
  }
  const removeItemHandler = (id) => {
    setIsLoading(true);
    fetch(`https://react-hooks-update-1c67d.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
  }).then(responseData => {
    setIsLoading(false)
    setUserIngredients(prevIngredients => prevIngredients.filter((userIngredient) => userIngredient.id !== id));
  })
}
  //onLoadIngredients is getting called hassetUserIngredients and
  // therefore the whole app is getting rendered again and again and
  // also filteredIngredientsHandler is function which is created unique everytime
  //useCallback will call thid funtion only once ref lec437
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  },[]);
  const clearErrorMessage = () => {
    setErrorMessage(null)
  }
  return (
    <div className="App">
      {errorMessage && <ErrorModal onClose={clearErrorMessage}>{errorMessage}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={userIngredients} 
        onRemoveItem={removeItemHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
