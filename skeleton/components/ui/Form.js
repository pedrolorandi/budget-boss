import React from 'react';

import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'

export default function Form({onSubmit, type, text, categories, accounts, titleRef, cateRef, amountRef, accountRef, sourRef, typeValue, handleOnChange, transaction, transactionSource}) {
  
  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="flex items-center h-screen">
          <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mx-auto" style={{marginBottom: "780px", marginLeft: "330px"}}>
            <h1 className="text-xl font-bold mb-4">{text}</h1>

            {type === 'transaction' && (
              <>
                <label style={{paddingRight: "160px"}}>
                  <input 
                    type='radio' name='circle' value='Income' onChange={handleOnChange} checked={typeValue === 'Income'}
                    style={{ display: 'inline-block', width: '20px', height: '20px', borderRadius: '50%', border: '1px solid black', marginRight: '5px', backgroundColor: typeValue === "Income" ? 'black' : '#FFFFFF' }}
                    />
                  Income
                </label>

                <label>
                  <input 
                  type='radio' name='circle' value='Expense' onChange={handleOnChange} checked={typeValue === 'Expense'} 
                  style={{ display: 'inline-block', width: '20px', height: '20px', borderRadius: '50%', border: '1px solid black', marginRight: '5px', backgroundColor: typeValue === "Expense" ? 'black' : '#FFFFFF' }}
                  /> 
                  Expense 
                </label>
                <br />
              </>
            )}
            <br />

            <label>
              Title:
              <input 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text" ref={titleRef} placeholder={transaction && transaction.title}
              />
            </label>
            <br />
            <br/>
            
            <label>
              Category:
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <select 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id='category' ref={cateRef} 
                >
                {categories && categories.map(category => {
                  return <option value={category.id} key={category.id}>{category.name}</option>
                })}
                </select>
              </div>
            </label>
            <br />
            
            <label>
              Expense Amount:
              <input 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text" ref={amountRef} placeholder={transaction && transaction.amountDecimal/100}
              />
            </label>
            <br />
            <br/>
            
            <label>
              Payment Account:
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <select 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id='account' ref={accountRef} 
                >
                {accounts && accounts.map(account => {
                  return <option value={account.id} key={account.id}>{account.name}</option>
                })}
                </select>
              </div>
            </label>
            <br/>
            
            <label>
              Source:
              <input 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type='text' ref={sourRef} placeholder={transaction && transactionSource}
              />
            </label>
            <br/>
            <br/>
            
            <button type="submit" className="bg-indigo-500 text-white font-bold py-2 px-4 rounded">
              Submit
            </button>
          </form>
      </div>
    </>
  );
}