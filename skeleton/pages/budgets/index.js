import { PrismaClient } from "@prisma/client";

import {
  getDateByMonthYear,
  getTransactionsGroupedByCategory,
  getBudgets,
} from "../../helpers/selectors";
import { useState, useEffect } from "react";
import axios from "axios";

import BudgetCategoriesList from "@/components/ui/BudgetCategoriesList";
import BudgetPieChart from "@/components/ui/BudgetPieChart";

export default function Budgets({
  month,
  year,
  transactionsByCategory,
  budgets,
  budgetSum,
}) {
  let pieChartColour = [];
  if (budgetSum.percent < 50) {
    pieChartColour.push("#52A1A3");
  } else if (budgetSum.percent >= 50 && budgetSum.percent < 75) {
    pieChartColour.push("#E6B32C");
  } else {
    pieChartColour.push("#DC244B");
  }

  const [currentTransactions, setCurrentTransactions] = useState(
    transactionsByCategory
  );
  const [currentBudgets, setCurrentBudgets] = useState(transactionsByCategory);
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentYear, setCurrentYear] = useState(year);
  const [currentBudgetTotal, setCurrentBudgetTotal] = useState({
    labels: ["Total Budget Remaining ($)", "Current Transactions Total ($)"],
    datasets: [
      {
        label: [],
        data: [
          budgetSum.difference.toFixed(2),
          budgetSum.currentBudget.toFixed(2),
        ],
        backgroundColor: ["#E9ECEF", `${pieChartColour}`],
      },
    ],
  });

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
    axios.get("../api/reports", { params: { month, year } }).then((res) => {
      // Updating the state with the fetched data
      setCurrentMonth(Number(res.data.month));
      setCurrentYear(Number(res.data.year));
      setCurrentBudgets(res.data.newTransactions);
      // setCurrentBudgets{
      //   ...currentCategories,
      //   datasets: [
      //     {
      //       ...currentCategories.datasets[0],
      //       data: res.data.categoriesPercentages,
      //     },
      //   ],
    });
  };

  const getBudgetAmounts = (transactions, budgets) => {
    let result = [];

    if (budgets.length === 0) {
      for (let c of transactions) {
        result.push({
          categoryId: c.categoryId,
          name: c.name,
          totalBudget: 0,
          currentAmount: c._sum.amountDecimal / 100,
          budgetRemaining: 0,
          budgetPercentage: 0,
        });
      }
    } else {
      for (let b of budgets) {
        for (let c of transactions) {
          if (b.category.id === c.categoryId) {
            result.push({
              categoryId: b.category.id,
              name: b.category.name,
              totalBudget: b.amountDecimal / 100,
              currentAmount: c._sum.amountDecimal / 100,
              budgetRemaining: (b.amountDecimal - c._sum.amountDecimal) / 100,
              budgetPercentage:
                b.amountDecimal === 0
                  ? 0
                  : (c._sum.amountDecimal / b.amountDecimal) * 100,
            });
          }
        }
      }
    }
    return result;
  };

  const budgetAmounts = getBudgetAmounts(transactionsByCategory, budgets);

  return (
    <div className="flex flex-col items-center content-center w-full">
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
      <div className="text-center text-3xl font-bold">Total Budgets</div>
      <BudgetPieChart
        currentBudgetTotal={currentBudgetTotal}
        budgetSum={budgetSum}
      ></BudgetPieChart>
      <table className="table-fixed w-full text-lg">
        <thead>
          <tr>
            <th className="px-6 py-3 text-right">Current Transactions</th>
            <th className="px-6 py-3 text-left">Budget Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-6 text-right">{`$${(
              budgetSum.currentBudget / 100
            ).toFixed(2)}`}</td>
            <td className="px-6 text-left">{`$${(
              budgetSum.totalBudget / 100
            ).toFixed(2)}`}</td>
          </tr>
        </tbody>
      </table>
      <BudgetCategoriesList
        budgetAmounts={budgetAmounts}
      ></BudgetCategoriesList>
    </div>
  );
}

export async function getServerSideProps() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const transactionsByCategory = await getTransactionsGroupedByCategory(
    1,
    currentMonth,
    currentYear
  );
  const budgets = await getBudgets(1, currentMonth, currentYear);

  const getBudgetSum = (transactions, budgets) => {
    let result = { totalBudget: 0, currentBudget: 0, percent: 0 };

    for (let b of budgets) {
      result.totalBudget += b.amountDecimal;
      for (let c of transactions) {
        if (b.category.id === c.categoryId) {
          if (b.amountDecimal > 0) {
            result.currentBudget += c._sum.amountDecimal;
          }
        }
      }
    }

    result.percent = (result.currentBudget / result.totalBudget) * 100;
    result.difference =
      result.percent > 100 ? 0 : result.totalBudget - result.currentBudget;

    return result;
  };
  const budgetSum = getBudgetSum(transactionsByCategory, budgets);

  return {
    props: {
      month: currentMonth,
      year: currentYear,
      transactionsByCategory: transactionsByCategory,
      budgets: budgets,
      budgetSum: budgetSum,
    },
  };
}
