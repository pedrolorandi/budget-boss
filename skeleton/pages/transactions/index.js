import TransactionList from "@/components/ui/TransactionsList";

import {
  getAllTransactions,
  getDateByMonthYear,
  getTransactions,
  getTransactionsGroupedByDate,
} from "../../helpers/selectors";
import axios from "axios";

import { PrismaClient } from "@prisma/client";
import { useEffect, useState } from "react";
import { formatDate } from "@/helpers/formatters";
import AccountTile from "@/components/ui/AccountTile";

export default function Transactions({ month, year, transactions, accounts }) {
  const [currentTransactions, setCurrentTransactions] = useState(transactions);
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentYear, setCurrentYear] = useState(year);
  const [currentAccount, setCurrentAccount] = useState(undefined);
  const [formattedDates, setFormattedDates] = useState({});

  console.log();

  useEffect(() => {
    const transactionDates = formatDate(currentTransactions);
    setFormattedDates(transactionDates);
  }, []);

  // Function to fetch transactions data from the API
  const getTransactionsAPI = (month, year, accountId) => {
    // Adjusting month and year values for previous and next month
    if (month === 0) {
      month = 12;
      year--;
    }

    if (month === 13) {
      month = 1;
      year++;
    }

    if (accountId === Number(currentAccount)) accountId = undefined;

    // Making an API call to retrieve data for the specified month and year
    axios
      .get("../api/transactions", { params: { month, year, accountId } })
      .then((res) => {
        // Updating the state with the fetched data
        setCurrentMonth(Number(res.data.month));
        setCurrentYear(Number(res.data.year));
        setCurrentTransactions(res.data.transactions);
        setCurrentAccount(res.data.accountId);
        setFormattedDates(formatDate(res.data.transactions));
      });
  };

  return (
    <main className="flex flex-col p-5">
      <div className="flex flex-row mb-5 space-x-5">
        {accounts.map((account) => {
          return (
            <AccountTile
              key={account.id}
              account={account}
              currentAccount={currentAccount}
              getTransactionsAPI={getTransactionsAPI}
              currentMonth={currentMonth}
              currentYear={currentYear}
            />
          );
        })}
      </div>
      <div className="flex space-x-5 justify-center mb-5">
        <button
          className="flex"
          onClick={() =>
            getTransactionsAPI(currentMonth - 1, currentYear, currentAccount)
          }
        >
          Previous month
        </button>
        <h1 className="flex">
          {getDateByMonthYear(currentMonth, currentYear)}
        </h1>
        <button
          className="flex"
          onClick={() =>
            getTransactionsAPI(currentMonth + 1, currentYear, currentAccount)
          }
        >
          Next month
        </button>
      </div>
      <TransactionList
        transactions={currentTransactions}
        formattedDates={formattedDates}
      />
    </main>
  );
}

export async function getServerSideProps() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const prisma = new PrismaClient();

  const accounts = await prisma.account.findMany({
    where: { userId: 1 },
  });

  const transactions = await getTransactionsGroupedByDate(
    1,
    currentMonth,
    currentYear,
    undefined
  );

  return {
    props: {
      month: currentMonth,
      year: currentYear,
      transactions,
      accounts,
    },
  };
}
