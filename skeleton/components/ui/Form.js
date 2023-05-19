import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { formatDateISOString } from "@/helpers/formatters";

export default function Form({
  formType,
  sources,
  categories,
  accounts,
  transaction,
}) {
  const [type, setType] = useState((transaction && transaction.type) || "");
  const [title, setTitle] = useState((transaction && transaction.title) || "");
  const [source, setSource] = useState(
    (transaction && transaction.source.name) || ""
  );
  const [accountId, setAccountId] = useState(
    (transaction && transaction.accountId) || ""
  );
  const [date, setDate] = useState(
    (transaction && transaction.date.slice(0, 10)) || ""
  );
  const [categoryId, setCategoryId] = useState(
    (transaction && transaction.categoryId) || ""
  );
  const [amountDecimal, setAmountDecimal] = useState(
    (transaction && transaction.amountDecimal / 100) || ""
  );
  const [transactionId, setTransactionId] = useState(
    (transaction && transaction.id) || ""
  );

  let router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    const inputValue = {
      date: formatDateISOString(date),
      title,
      type,
      accountId,
      categoryId: Number(categoryId),
    };

    const data = {
      source,
      sources,
      amountDecimal: String(amountDecimal),
      inputValue,
      transactionId,
    };

    if (formType === "add") {
      axios
        .post("/api/transaction/add", {
          data,
        })
        .then((res) => {
          router.push("/transactions");
        });
    }

    if (formType === "edit") {
      axios
        .put("/api/transaction/edit", {
          data,
        })
        .then((res) => {
          router.push("/transactions");
        });
    }

    if (formType === "delete") {
      axios
        .delete("/api/transaction/delete", {
          data,
        })
        .then((res) => {
          router.push("/transactions");
        });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row rounded-2xl p-6 bg-[#FFF] justify-between">
          <h1 className="self-center">
            {formType === "add" ? (
              "New transaction"
            ) : formType === "edit" ? (
              "Edit transaction"
            ) : (
              <span className="text-[#D62828]">Delete this transaction?</span>
            )}
          </h1>
          <div className="flex flex-row self-center">
            <Link
              className="rounded-lg w-36 p-3 bg-cancel font-bold text-center hover:bg-cancelHover"
              href="/transactions"
            >
              Cancel
            </Link>
            <button
              className={`rounded-lg w-36 p-3 font-bold text-white text-center ms-2 ${
                formType === "delete"
                  ? "bg-delete hover:bg-deleteHover"
                  : "bg-selected hover:bg-buttonHover"
              } `}
              type="submit"
            >
              {formType === "delete" ? "Delete" : "Submit"}
            </button>
          </div>
        </div>
        <div className="flex flex-row flex-1 mt-2">
          <input
            type="radio"
            id="income"
            name="type"
            className="hidden peer/income"
            value="Income"
            checked={type === "Income"}
            onChange={(e) => setType(e.target.value)}
            disabled={formType === "delete"}
          />
          <label
            htmlFor="income"
            className={`flex flex-1 cursor-pointer bg-unselected rounded-2xl p-10 text-2xl font-bold ${
              formType !== "delete" && "peer-hover/income:bg-incomeHover"
            } peer-checked/income:bg-income peer-checked/income:text-white peer-disabled/income:cursor-default peer-disabled/income:text-[#888]`}
          >
            Income
          </label>
          <input
            type="radio"
            id="expense"
            name="type"
            className="hidden peer/expense"
            value="Expense"
            checked={type === "Expense"}
            onChange={(e) => setType(e.target.value)}
            disabled={formType === "delete"}
          />
          <label
            htmlFor="expense"
            className={`flex flex-1 cursor-pointer bg-unselected rounded-2xl p-10 text-2xl font-bold ${
              formType !== "delete" && "peer-hover/expense:bg-expenseHover"
            } peer-checked/expense:bg-expense peer-checked/expense:text-white peer-disabled/expense:cursor-default  peer-disabled/expense:text-[#888] ms-2`}
          >
            Expense
          </label>
        </div>
        <div className="flex flex-1 mt-2">
          <input
            type="text"
            className="flex flex-1 py-8 px-10 text-xl rounded-2xl border-2 border-[#CED4DA] disabled:text-[#aaa]"
            placeholder="Title (e.g. Coffee with friends)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={formType === "delete"}
          />
        </div>
        <div className="flex flex-1 mt-2">
          <input
            type="text"
            className="flex flex-1 py-8 px-10 text-xl rounded-2xl border-2 border-[#CED4DA] disabled:text-[#aaa]"
            placeholder="Source (e.g. Starbucks)"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            disabled={formType === "delete"}
          />
        </div>
        <div className="flex flex-row flex-1 mt-2">
          {accounts.map((currAccount, i) => {
            return (
              <div className="flex flex-1" key={currAccount.name}>
                <input
                  type="radio"
                  id={currAccount.name.toLowerCase().replaceAll(" ", "_")}
                  name="currAccount"
                  className="hidden peer"
                  checked={accountId === currAccount.id}
                  value={currAccount.id}
                  onChange={(e) => setAccountId(currAccount.id)}
                  disabled={formType === "delete"}
                />
                <label
                  htmlFor={currAccount.name.toLowerCase().replaceAll(" ", "_")}
                  className={`flex flex-1 cursor-pointer bg-unselected rounded-2xl p-10 text-2xl font-bold ${
                    formType !== "delete" && "peer-hover:bg-buttonHover"
                  } peer-checked:bg-selected peer-checked:text-white peer-disabled:cursor-default peer-disabled:text-[#aaa] ${
                    i === 0 ? "ms-0" : "ms-2"
                  }`}
                >
                  {currAccount.name}
                </label>
              </div>
            );
          })}
        </div>
        <div className="flex flex-row flex-1 mt-2">
          <div className="flex flex-1">
            <input
              type="date"
              className="flex flex-1 py-8 px-10 text-xl rounded-2xl border-2 border-[#CED4DA] cursor-pointer disabled:cursor-default disabled:text-[#aaa]"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={formType === "delete"}
            />
            <style jsx>{`
              .cursor-pointer::-webkit-calendar-picker-indicator {
                cursor: pointer;
              }
            `}</style>
          </div>
          <div className="flex flex-1">
            <select
              className="flex flex-1 py-8 px-10 text-xl rounded-2xl border-2 border-[#CED4DA] cursor-pointer ms-2 disabled:bg-[#CED4DA] disabled:border-[#C7CBCF] disabled:cursor-default disabled:text-[#888]"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={formType === "delete"}
            >
              <option hidden value="">
                Category
              </option>
              {categories.map((category) => {
                return (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex flex-1">
            <span
              className={`absolute text-2xl text-bold ms-12 mt-8 ${
                formType === "delete" && "text-[#bbb]"
              }`}
            >
              $
            </span>
            <input
              type="text"
              className="flex flex-1 py-8 px-10 text-xl rounded-2xl border-2 border-[#CED4DA] ms-2 text-end disabled:text-[#aaa]"
              placeholder="0.00"
              value={amountDecimal}
              onChange={(e) => setAmountDecimal(e.target.value)}
              disabled={formType === "delete"}
            />
          </div>
        </div>
      </form>
    </>
  );
}