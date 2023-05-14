import { useEffect, useState } from "react";

export default function AccountTile({
  account,
  currentAccount,
  getTransactionsAPI,
  currentMonth,
  currentYear,
}) {
  const [backgroundColor, setBackgroundColor] = useState("bg-selected");
  const [accountTotal, setAccountTotal] = useState(0);

  useEffect(() => {
    currentAccount === undefined || Number(currentAccount) === account.id
      ? setBackgroundColor("bg-selected")
      : setBackgroundColor("bg-unselected");
  }, [currentAccount]);

  useEffect(() => {
    setAccountTotal(1);
  }, []);

  return (
    <button
      className={`flex-1 ${backgroundColor} rounded-lg p-5`}
      onClick={() => getTransactionsAPI(currentMonth, currentYear, account.id)}
    >
      <span>{account.name}</span>
      <span>{accountTotal}</span>
    </button>
  );
}
