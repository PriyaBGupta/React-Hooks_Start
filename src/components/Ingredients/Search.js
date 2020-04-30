import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();
  useEffect(() => {
    // we dont want to call after keystroke in search input box.
    // we can wait for 500msec and see if the keystroke is same or not
    //so thats why we add setTimeout but we want to compare input before 500msec and after 500 msec
    // we use ref to store that previous value
    // everytime useEffect is called a new timer is set 
    //so in order to kill previous one we have added it in return statetment
    //return statement executes at start of useEffect call and not at end of first useEffect call
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 ? '' : `orderBy="title"&equalTo="${enteredFilter}`;
        fetch('https://react-hooks-update-1c67d.firebaseio.com/ingredients.json' + query)
          .then(response => response.json())
          .then(responseData => {
            const loadedIngredients = [];
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount
              })
            }
            onLoadIngredients(loadedIngredients);
          })
      }
    }, 500);
    return  () => {
      clearTimeout(timer);
    }
  }, [enteredFilter, onLoadIngredients, inputRef]);
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text"
            ref={inputRef}
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
