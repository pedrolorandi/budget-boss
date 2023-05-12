import TransactionList from "@/components/ui/TransactionsList";

import { getDateByMonthYear, getTransactions } from "../../helpers/selectors";
import axios from "axios";
import { useState } from "react";
import { PrismaClient } from "@prisma/client";

export default function Transactions({ month, year, transactions, accounts }) {
  const [currentTransactions, setCurrentTransactions] = useState(transactions);
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentYear, setCurrentYear] = useState(year);
  const [currentAccount, setCurrentAccount] = useState(accounts);

  // Function to fetch transactions data from the API
  const getTransactionsAPI = (month, year) => {
    // Adjusting month and year values for previous and next month
    if (month === 0) {
      month = 12;
      year--;
    }

    if (month === 13) {
      month = 1;
      year++;
    }

    // Making an API call to retrieve data for the specified month and year
    axios
      .get("../api/transactions", { params: { month, year, currentAccount } })
      .then((res) => {
        // Updating the state with the fetched data
        setCurrentMonth(Number(res.data.month));
        setCurrentYear(Number(res.data.year));
        setCurrentTransactions(res.data.transactions);
      });
  };

  return (
    <main className="flex flex-col p-5">
      <div className="flex flex-row mb-5 space-x-5">
        {accounts.map((account) => {
          return (
            <div key={account.id} className="flex-1 bg-nav-gray rounded-lg p-5">
              {account.name}
            </div>
          );
        })}
      </div>
      <div className="flex space-x-5 justify-center mb-5">
        <button
          className="flex"
          onClick={() => getTransactionsAPI(currentMonth - 1, currentYear)}
        >
          Previous month
        </button>
        <h1 className="flex">
          {getDateByMonthYear(currentMonth, currentYear)}
        </h1>
        <button
          className="flex"
          onClick={() => getTransactionsAPI(currentMonth + 1, currentYear)}
        >
          Next month
        </button>
      </div>
      <TransactionList transactions={currentTransactions} />
    </main>
  );
}

export async function getServerSideProps() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const transactions = await getTransactions(1, currentMonth, currentYear);

  const prisma = new PrismaClient();

  const accounts = await prisma.account.findMany({
    where: { userId: 1 },
  });

  return {
    props: {
      month: currentMonth,
      year: currentYear,
      transactions,
      accounts,
    },
  };
}
