import React, {useRef} from 'react';
import axios from 'axios';

import {getUserInput} from '../../helpers/selectors';

export default function CreateBudget() {
  const input = useRef({});
  let elements = [];

  function handleSubmit(event) {
    event.preventDefault();
    const inputValue = input.current;
    getUserInput(inputValue);
    console.log(inputValue);

    axios.put('/api/budget/create', inputValue)
    .then(res => console.log('res', res))
    .catch(error => console.log(error.response));
  }

  for (let i = 0; i < 10; i++) {
    elements.push(<input key={i} placeholder={i} type='text' ref={enter => (input.current[`${i}`] = enter)}/>);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {elements}
        <button type="submit">Submit</button>
      </form>
    </>
  )
}

