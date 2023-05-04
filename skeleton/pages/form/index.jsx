import React, { useState } from 'react';

export default function MyForm() {
  const {title, setTitle} = useState('')
  const {category, setCategory} = useState('')
  const {amount, setAmount} = useState(0)
  const {account, setAccount} = useState('')
  const {sources, setSources} = useState('')

  function handleSubmit(event) {
    event.preventDefault();
    console.log('submit is clicked!');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <br />
      <br/>

      <label>
        Category:
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
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
  );
}
