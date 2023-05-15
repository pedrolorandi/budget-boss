import { useEffect, useState } from "react";

export default function AccountTile({
  account,
  currentAccount,
  currentRunningTotalbyAccount,
  getTransactionsAPI,
  currentMonth,
  currentYear,
}) {
  const [backgroundColor, setBackgroundColor] = useState("bg-selected");

  useEffect(() => {
    currentAccount === undefined || Number(currentAccount) === account.id
      ? setBackgroundColor("bg-selected")
      : setBackgroundColor("bg-unselected");
  }, [currentAccount]);

  return (
    <button
      className={`flex flex-1 flex-col ${backgroundColor} rounded-lg p-5`}
      onClick={() => getTransactionsAPI(currentMonth, currentYear, account.id)}
    >
      <span className="font-bold">{account.name}</span>
      <span className="mt-4 text-3xl">
        ${currentRunningTotalbyAccount[account.id]}
      </span>
      {}
    </button>
  );
}
