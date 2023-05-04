import React, { useState } from 'react';
import Category from '../components/category'

export default function Form({onSubmit, name}) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState(0)
  const [account, setAccount] = useState('')
  const [sources, setSources] = useState('')

  console.log(title); //for testing
  
  return (
    <div>
      {name === 'transaction' ? (
        <form onSubmit={onSubmit}>
          <label>
            Title:
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <br />
          <br/>
          
          <label>
            Category:
            <Category />
          </label>
          <br />
          <br/>
          
          <label>
            Expense Amount:
            <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
          <br />
          <br/>
          
          <label>
            Payment Account:
            <input type='text' value={account} onChange={e => setAccount(e.target.value)}/>
          </label>
          <br/>
          <br/>
          
          <label>
            Sources:
            <input type='text' value={sources} onChange={e => setSources(e.target.value)}/>
          </label>
          <br/>
          <br/>
          
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Submit
          </button>
        </form>
        ) : (
          <Category />
        )}
    </div>
  );
}
