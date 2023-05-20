// import { Inter } from "next/font/google";
import { PrismaClient } from "@prisma/client";
import {useRouter} from 'next/router';

import {
  getTransactionsGroupedByDate,
  getThreeTransactions,
  getCurrentRunningTotal,
  getTransactionsGroupedByCategory,
  getBudgets,
  getCategoriesData,
  getRecentAndUpcomingTransactions,
  getRunnigTotalByAccount,
  getDateByMonthYear,
} from "../helpers/selectors";
import { getBudgetAmounts, getBudgetSum } from "../helpers/budgetHelper";
import { formatDate } from "../helpers/formatters";
import AccountTile from '../components/ui/AccountTile';
import TransactionsList from "../components/ui/TransactionsList";
import Chart from "../components/ui/RunningTotalChart";
import BudgetCategoriesList from "@/components/ui/BudgetCategoriesList";

export default function Home({
  month,
  year,
  accounts,
  runningTotalbyAccount,
  budgetSum,
  budgets,
  formattedDates,
  firstSixBudgets,
  nextFiveBudgets,
  lastFiveBudgets,
  indexPage,
  accountIndex,
  transactionsRecent,
  transactionsUpcoming,
  inputValues,
  currentRunningTotal
}) {
  const route = useRouter();
  const runningTotalOptions = {
    plugins: {
      title: {
        font: {
          size: 20,
        },
        color: "#212529",
        display: true,
        text: "Running Total",
        padding: {
          top: 5,
          bottom: 5,
        },
        align: "start",
      },
    },
  };

  return (
    <div className="bg-[#FFF] flex flex-col flex-1 rounded-lg p-5">
      <div className="flex flex-row items-center">
        <img src="images/user-icon.png" className="flex h-20" />
        <h1 className="text-4xl ms-5">Hi, Jane!</h1>
      </div>

      <section
        className="flex"
        style={{ marginTop: "30px", marginLeft: "30px" }}
      >
        <div
          className="w-1/2 p-32"
          style={{ padding: "20px", width: "100%"}}
          onClick={() => route.push("/reports")}
        >
          <Chart chartData={currentRunningTotal} options={runningTotalOptions} />
        </div>
        <div
          className="w-1/2 p-32, flex flex-col mb-2 space-y-6"
          style={{ padding: "20px", marginTop: "110px", marginLeft: "60px" }}
          onClick={() => route.push("/transactions")}
        >
         {accounts.map((account) => {
          return (
            <AccountTile
              key={account.id}
              account={account}
              currentRunningTotalbyAccount={runningTotalbyAccount}
              currentMonth={month}
              currentYear={year}
              accountIndex={accountIndex}
            />
          );
        })}
        </div>
      </section>

      <div
        className="flex"
        style={{ marginTop: "50px", marginLeft: "30px" }}
        onClick={() => route.push("/transactions")}
      >
        <div className="w-1/2 p-32" style={{ padding: "10px" }}>
          <TransactionsList
            transactions={transactionsRecent}
            formattedDates={formattedDates}
            indexPage={indexPage}
            text="Recent Transactions"
          />
        </div>
        <div
          className="w-1/2 p-32"
          style={{ padding: "10px", marginLeft: "70px" }}
        >
          <TransactionsList
            transactions={transactionsUpcoming}
            formattedDates={formattedDates}
            indexPage={indexPage}
            text="Upcoming Transactions"
          />
        </div>
      </div>

      <div
        className='bg-yellow-100'
        style={{ marginTop: "60px", marginLeft: "30px" }} 
      >
          <div className="text-left ml-4 mt-2">
              <h1 className="self-center">Budget List {getDateByMonthYear(month, year)}</h1>
          </div>

          <div
            className="flex"
            onClick={() => route.push("/budgets")}
          >
            <div
              className="w-1/2 p-32 rounded-2xl p-2"
              style={{ padding: "10px" }}
            >
              <BudgetCategoriesList
                indexPage={indexPage}
                budgetSum={budgetSum}
                budgets={budgets}
                inputValues={inputValues}
                budgetAmounts={firstSixBudgets}
              />
            </div>
            <div
              className="w-1/2 p-32 rounded-2xl p-2"
              style={{ padding: "10px", marginLeft: "70px" }}
            >
              <BudgetCategoriesList
                indexPage={indexPage}
                budgetSum={budgetSum}
                budgets={budgets}
                inputValues={inputValues}
                budgetAmounts={nextFiveBudgets}
              />
            </div>
            <div
              className="w-1/2 p-32 rounded-2xl p-2"
              style={{ padding: "10px", marginLeft: "70px" }}
            >
              <BudgetCategoriesList
                indexPage={indexPage}
                budgetSum={budgetSum}
                budgets={budgets}
                inputValues={inputValues}
                budgetAmounts={lastFiveBudgets}
              />
            </div>
          </div>
      </div>

    </div>
  );
}

export async function getServerSideProps() {
  const prisma = new PrismaClient();
  const currentMonth = new Date().getMonth() + 1;
  const nextMonth = new Date().getMonth() + 2;
  const currentYear = new Date().getFullYear();
  const {
    month,
    year
  } = await getCategoriesData(1, currentMonth, currentYear);

  //data for transactions section
  const today = new Date().toLocaleDateString().slice(0, 10);
  const currentTransactionList = await getTransactionsGroupedByDate(
    1,
    currentMonth,
    currentYear,
    undefined
  );
  const NextMonthTransactionList = await getTransactionsGroupedByDate(
    1,
    nextMonth,
    currentYear,
    undefined
  );
  Array.prototype.unshift.apply(currentTransactionList, NextMonthTransactionList);
  const recentTransactionList = currentTransactionList //a transaction list of both current and next months
  const formattedDates = formatDate(recentTransactionList);
  const upcomingTransactionList = JSON.parse(JSON.stringify(recentTransactionList))
  .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  const arrObj = getRecentAndUpcomingTransactions(today, recentTransactionList, upcomingTransactionList);
  const transactionsRecent = getThreeTransactions(arrObj.arrRecent);
  const transactionsUpcoming = getThreeTransactions(arrObj.arrUpcoming, true);

  //boolean values
  const indexPage = true;
  const accountIndex = true;

  //data for accounts section
  const accounts = await prisma.account.findMany({
    where: { userId: 1 },
  });
  const runningTotalbyAccount = await getRunnigTotalByAccount(1);

  //data for budgets section
  const budgets = await getBudgets(1, currentMonth, currentYear);
  const budgetAmounts = await getBudgetAmounts(
    await getTransactionsGroupedByCategory(1, currentMonth, currentYear),
    await getBudgets(1, currentMonth, currentYear)
  );
  const inputValues = budgetAmounts.map((element) => {
    if (element.totalBudget) {
      return element.totalBudget;
    } else {
      return "";
    }
  });
  const copiedBudgetAmounts = JSON.parse(JSON.stringify(budgetAmounts));
  const firstSixBudgets = copiedBudgetAmounts.slice(0, 6);
  const nextFiveBudgets = copiedBudgetAmounts.splice(6, 5);
  const lastFiveBudgets = copiedBudgetAmounts.splice(6, 5);
  const transactionsByCategory = await getTransactionsGroupedByCategory(
    1,
    currentMonth,
    currentYear
  );
  const budgetSum = await getBudgetSum(transactionsByCategory, budgets);

  //data for runningTotal chart
  const currentRunningTotal = await getCurrentRunningTotal(currentMonth, currentYear);

  return {
    props: {
      month,
      year,
      runningTotalbyAccount,
      transactionsRecent: transactionsRecent,
      transactionsUpcoming: transactionsUpcoming,
      formattedDates,
      indexPage: indexPage,
      accountIndex,
      budgets,
      budgetAmounts,
      firstSixBudgets,
      nextFiveBudgets,
      lastFiveBudgets,
      budgetSum,
      accounts,
      inputValues,
      currentRunningTotal
    },
  };
}
