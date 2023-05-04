import React, {useState} from 'react';

export default function Category() {
  const [category, setCategory] = useState('')
  console.log(category); //for testing

  return (
    <div>
      <select id='category' value={category} onChange={e => setCategory(e.target.value)}> {/* the value property of the select element = user's selection */}
        <option value='Clothing'>Clothing</option>
        <option value='Dining Out'>Dining Out</option>
        <option value='Education'>Education</option>
        <option value='Electronics'>Electronics</option>
        <option value='Fast-Food'>Fast-Food</option>
        <option value='Gifts'>Gifts</option>
        <option value='Groceries'>Groceries</option>
        <option value='Household'>Household</option>
        <option value='Internet & Phone'>Internet & Phone</option>
        <option value='Loans'>Loans</option>
        <option value='Medical'>Medical</option>
        <option value='Personal'>Personal</option>
        <option value='Pet'>Pet</option>
        <option value='Rent'>Rent</option>
        <option value='Subscriptions'>Subscriptions</option>
        <option value='Transportation'>Transportation</option>
      </select>
    </div>
  )
}
