import { useEffect, useState } from "react";

export default function AccountTile({
  account,
  currentAccount,
  currentRunningTotalbyAccount,
  getTransactionsAPI,
  currentMonth,
  currentYear,
  accountIndex,
}) {
  const [backgroundColor, setBackgroundColor] = useState("bg-selected");

  useEffect(() => {
    currentAccount === undefined || Number(currentAccount) === account.id
      ? setBackgroundColor("bg-selected")
      : setBackgroundColor("bg-unselected");
  }, [currentAccount]);

  return (
    <button
      className={`flex flex-1 flex-col ${
        accountIndex ? "bg-selected" : backgroundColor
      } rounded-2xl mt-2 p-5`}
      onClick={() => accountIndex ? true : getTransactionsAPI(currentMonth, currentYear, account.id)}
    >
      <span className="font-bold">{account.name}</span>
      <span className="mt-4 text-3xl">
        ${currentRunningTotalbyAccount[account.id]}
      </span>
      {}
    </button>
  );
}
