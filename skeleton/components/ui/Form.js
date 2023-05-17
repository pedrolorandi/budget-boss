import Link from "next/link";
import React from "react";

export default function Form({
  onSubmit,
  type,
  text,
  categories,
  accounts,
  titleRef,
  cateRef,
  amountRef,
  accountRef,
  sourRef,
  typeValue,
  handleOnChange,
  transaction,
  transactionSource,
}) {
  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="flex flex-row rounded-lg p-6 bg-[#FFF] justify-between">
          <h1 className="self-center">New transaction</h1>
          <div className="flex flex-row self-center">
            <Link
              className="rounded-lg w-36 p-3 bg-[#CED4DA] font-bold text-center"
              href="/transactions"
            >
              Cancel
            </Link>
            <button
              className="rounded-lg w-36 p-3 bg-[#62929E] font-bold text-white text-center ms-2"
              type="submit"
            >
              Submit
            </button>
          </div>
        </div>
        <div className="flex flex-row flex-1 mt-2">
          <input
            type="radio"
            id="income"
            name="type"
            className="hidden peer/income"
            required
          />
          <label
            htmlFor="income"
            className="flex flex-1 cursor-pointer bg-unselected rounded-lg p-10 text-2xl font-bold peer-checked/income:bg-[#50B99B]"
          >
            Income
          </label>
          <input
            type="radio"
            id="expense"
            name="type"
            className="hidden peer/expense"
            required
          />
          <label
            htmlFor="expense"
            className="flex flex-1 cursor-pointer bg-unselected rounded-lg p-10 text-2xl font-bold peer-checked/expense:bg-[#DC244B] ms-2"
          >
            Expense
          </label>
        </div>
        <div className="flex flex-1 mt-2">
          <input
            type="text"
            className="flex flex-1 py-8 px-10 text-xl rounded-lg border-2 border-[#CED4DA]"
            placeholder="Title (e.g. Coffee with friends)"
          />
        </div>
        <div className="flex flex-1 mt-2">
          <input
            type="text"
            className="flex flex-1 py-8 px-10 text-xl rounded-lg border-2 border-[#CED4DA]"
            placeholder="Source (e.g. Starbucks)"
          />
        </div>
        <div className="flex flex-row flex-1 mt-2">
          {accounts.map((account) => {
            return (
              <>
                <div className="flex flex-1">
                  <input
                    type="radio"
                    id={account.name.toLowerCase()}
                    name="account"
                    className={`hidden peer`}
                    required
                  />
                  <label
                    htmlFor={account.name.toLowerCase()}
                    className={`flex flex-1 cursor-pointer bg-unselected rounded-lg p-10 text-2xl font-bold peer-checked:bg-[#50B99B]`}
                  >
                    {account.name}
                  </label>
                </div>
              </>
            );
          })}
        </div>
        {/* <input
          className="p-5 rounded-full bg-[#ccc] cursor-pointer"
          type="date"
        />
        <style jsx>{`
          .cursor-pointer::-webkit-calendar-picker-indicator {
            cursor: pointer;
          }
        `}</style> */}
      </form>
    </>

    // <div className="flex items-center h-screen">
    //     <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mx-auto">
    //       <h1 className="text-xl font-bold mb-4">{text}</h1>

    //       {type === 'transaction' && (
    //         <>
    //           <label style={{paddingRight: "160px"}}>
    //             <input
    //               type='radio' name='circle' value='Income' onChange={handleOnChange} checked={typeValue === 'Income'}
    //               style={{ display: 'inline-block', width: '20px', height: '20px', borderRadius: '50%', border: '1px solid black', marginRight: '5px', backgroundColor: typeValue === "Income" ? 'black' : '#FFFFFF' }}
    //               />
    //             Income
    //           </label>

    //           <label>
    //             <input
    //             type='radio' name='circle' value='Expense' onChange={handleOnChange} checked={typeValue === 'Expense'}
    //             style={{ display: 'inline-block', width: '20px', height: '20px', borderRadius: '50%', border: '1px solid black', marginRight: '5px', backgroundColor: typeValue === "Expense" ? 'black' : '#FFFFFF' }}
    //             />
    //             Expense
    //           </label>
    //           <br />
    //         </>
    //       )}
    //       <br />

    //       <label>
    //         Title:
    //         <input
    //         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    //         type="text" ref={titleRef} placeholder={transaction && transaction.title}
    //         />
    //       </label>
    //       <br />
    //       <br/>

    //       <label>
    //         Category:
    //         <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
    //           <select
    //           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    //           id='category' ref={cateRef}
    //           >
    //           {categories && categories.map(category => {
    //             return <option value={category.id} key={category.id}>{category.name}</option>
    //           })}
    //           </select>
    //         </div>
    //       </label>
    //       <br />

    //       <label>
    //         Expense Amount:
    //         <input
    //         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    //         type="text" ref={amountRef} placeholder={transaction && transaction.amountDecimal/100}
    //         />
    //       </label>
    //       <br />
    //       <br/>

    //       <label>
    //         Payment Account:
    //         <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
    //           <select
    //           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    //           id='account' ref={accountRef}
    //           >
    //           {accounts && accounts.map(account => {
    //             return <option value={account.id} key={account.id}>{account.name}</option>
    //           })}
    //           </select>
    //         </div>
    //       </label>
    //       <br/>

    //       <label>
    //         Source:
    //         <input
    //         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    //         type='text' ref={sourRef} placeholder={transaction && transactionSource}
    //         />
    //       </label>
    //       <br/>
    //       <br/>

    //       <button type="submit" className="bg-indigo-500 text-white font-bold py-2 px-4 rounded">
    //         Submit
    //       </button>
    //     </form>
    // </div>
  );
}
