import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);
  useEffect(()=>{
    fetch('https://react-hooks-update-1c67d.firebaseio.com/ingredients.json')
    .then(response=> response.json())
    .then(responseData =>{
      console.log(responseData);
      const loadedIngredients = [];
      for(const key in responseData){
        loadedIngredients.push({
          id: key,
          title: responseData[key].title,
          amount: responseData[key].amount
        })
      }
      console.log(loadedIngredients);
      setUserIngredients(loadedIngredients);
    })
  },[]);
  const addIngredientHandler = ingredient => {
    fetch('https://react-hooks-update-1c67d.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      return response.json();
    }).then(responseData => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients,
        { id: responseData.name, ...ingredient }
      ])
    })
  }
  const removeItemHandler = (id) => {
    setUserIngredients(prevIngredients => prevIngredients.filter((userIngredient) => userIngredient.id !== id));
  }
  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeItemHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
