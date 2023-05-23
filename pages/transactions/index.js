import TransactionList from "@/components/ui/TransactionsList";
import {
  faCircleLeft,
  faCirclePlus,
  faCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  getDateByMonthYear,
  getTransactionsGroupedByDate,
  getRunnigTotalByAccount,
} from "../../helpers/selectors";
import axios from "axios";

import { PrismaClient } from "@prisma/client";
import { useEffect, useState } from "react";
import { formatDate } from "@/helpers/formatters";
import AccountTile from "@/components/ui/AccountTile";
import Link from "next/link";

export default function Transactions({
  month,
  year,
  transactions,
  accounts,
  runningTotalbyAccount,
}) {
  const [currentTransactions, setCurrentTransactions] = useState(transactions);
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentYear, setCurrentYear] = useState(year);
  const [currentAccount, setCurrentAccount] = useState(undefined);
  const [formattedDates, setFormattedDates] = useState({});
  const [currentRunningTotalbyAccount, setCurrentRunningTotalByAccount] =
    useState(runningTotalbyAccount);

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
    <>
      <div className="flex flex-row rounded-2xl p-6 h-[6.5rem] bg-base-white justify-between sticky top-0 drop-shadow-sm">
        <h1 className="self-center">Transactions</h1>
        <div className="flex flex-row self-center">
          <Link href="/transactions/add">
            <button
              className={`rounded-lg bg-selected w-52 ms-2 p-3 font-bold text-white text-center hover:bg-buttonHover`}
              type="submit"
            >
              <FontAwesomeIcon icon={faCirclePlus} className="me-2" />
              {` New Transaction`}
            </button>
          </Link>
        </div>
      </div>
      <div className="flex rounded-2xl mt-2 p-5 space-x-5 bg-base-white justify-center sticky top-[5rem] drop-shadow-sm">
        <button
          className="flex"
          onClick={() =>
            getTransactionsAPI(currentMonth - 1, currentYear, currentAccount)
          }
        >
          <FontAwesomeIcon
            icon={faCircleLeft}
            size="2xl"
            className="hover:text-linkHover"
          />
        </button>
        <h1 className="flex w-60 justify-center">
          {getDateByMonthYear(currentMonth, currentYear)}
        </h1>
        <button
          className="flex"
          onClick={() =>
            getTransactionsAPI(currentMonth + 1, currentYear, currentAccount)
          }
        >
          <FontAwesomeIcon
            icon={faCircleRight}
            size="2xl"
            className="hover:text-linkHover"
          />
        </button>
      </div>
      <div className={"flex flex-row mb-2 space-x-2"}>
        {accounts.map((account) => {
          return (
            <AccountTile
              key={account.id}
              account={account}
              currentAccount={currentAccount}
              currentRunningTotalbyAccount={currentRunningTotalbyAccount}
              getTransactionsAPI={getTransactionsAPI}
              currentMonth={currentMonth}
              currentYear={currentYear}
            />
          );
        })}
      </div>
      <TransactionList
        transactions={currentTransactions}
        formattedDates={formattedDates}
      />
    </>
  );
}

export async function getServerSideProps() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const prisma = new PrismaClient();

  const accounts = await prisma.account.findMany({
    where: { userId: 1 },
  });

  const runningTotalbyAccount = await getRunnigTotalByAccount(1);

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
      runningTotalbyAccount,
    },
  };
}
