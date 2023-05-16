import { PrismaClient } from "@prisma/client";

import {
  getDateByMonthYear,
  getTransactionsGroupedByCategory,
  getBudgets,
} from "../../helpers/selectors";
import {
  getBudgetAmounts,
  getBudgetSum,
  getBudgetPieChartColour,
} from "@/helpers/budgetHelper";
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
  budgetAmounts,
  budgetPieChartColour,
}) {
  const [currentTransactionsByCategory, setCurrentTransactionsByCategory] =
    useState(transactionsByCategory);
  const [currentBudgets, setCurrentBudgets] = useState(budgets);
  const [currentBudgetSum, setCurrentBudgetSum] = useState(budgetSum);
  const [currentBudgetAmounts, setCurrentBudgetAmounts] =
    useState(budgetAmounts);
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentYear, setCurrentYear] = useState(year);
  const [currentBudgetPieData, setCurrentBudgetPieData] = useState({
    labels: ["Total Budget Remaining ($)", "Current Transactions Total ($)"],
    datasets: [
      {
        label: [],
        data: [
          budgetSum.difference.toFixed(2),
          budgetSum.currentBudget.toFixed(2),
        ],
        backgroundColor: ["#E9ECEF", `${budgetPieChartColour}`],
      },
    ],
    plugins: [
      {
        beforeDraw: function (chart) {
          const width = chart.width,
            height = chart.height,
            ctx = chart.ctx;
          ctx.restore();
          const fontSize = (height / 160).toFixed(2);
          ctx.font = fontSize + "em sans-serif";
          ctx.textBaseline = "top";
          const text = `${Math.round(budgetSum.percent).toFixed(0)}%`,
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2;
          ctx.fillText(text, textX, textY);
          ctx.save();
        },
      },
    ],
  });
  const getBudgetsAPI = (month, year) => {
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
    axios.get("../api/budgets", { params: { month, year } }).then((res) => {
      let pieChartColour = [];
      if (budgetSum.percent < 50) {
        pieChartColour.push("#52A1A3");
      } else if (budgetSum.percent >= 50 && budgetSum.percent < 75) {
        pieChartColour.push("#E6B32C");
      } else {
        pieChartColour.push("#DC244B");
      }
      // Updating the state with the fetched data
      setCurrentMonth(Number(res.data.reqMonth));
      setCurrentYear(Number(res.data.reqYear));
      setCurrentBudgetAmounts(res.data.newBudgetAmounts);
      setCurrentTransactionsByCategory(res.data.newTransactions);
      setCurrentBudgets(res.data.newBudgets);
      setCurrentBudgetSum(res.data.newBudgetSum);
      setCurrentBudgetPieData({
        ...currentBudgetPieData,
        datasets: [
          {
            ...currentBudgetPieData.datasets[0],
            data: [
              res.data.newBudgetSum.difference.toFixed(2),
              res.data.newBudgetSum.currentBudget.toFixed(2),
            ],
            backgroundColor: [
              "#E9ECEF",
              `${getBudgetPieChartColour(res.data.newBudgetSum)}`,
            ],
          },
        ],
        plugins: [
          {
            beforeDraw: function (chart) {
              const width = chart.width,
                height = chart.height,
                ctx = chart.ctx;
              ctx.restore();
              const fontSize = (height / 160).toFixed(2);
              ctx.font = fontSize + "em sans-serif";
              ctx.textBaseline = "top";
              const text = `${Math.round(res.data.newBudgetSum.percent).toFixed(
                  0
                )}%`,
                textX = Math.round((width - ctx.measureText(text).width) / 2),
                textY = height / 2;
              ctx.fillText(text, textX, textY);
              ctx.save();
            },
          },
        ],
      });
    });
  };

  return (
    <div className="flex flex-col items-center content-center w-full">
      <div className="flex space-x-5 justify-center mb-5">
        <button
          className="flex"
          onClick={() => getBudgetsAPI(currentMonth - 1, currentYear)}
        >
          Previous month
        </button>
        <h1 className="flex">
          {getDateByMonthYear(currentMonth, currentYear)}
        </h1>
        <button
          className="flex"
          onClick={() => getBudgetsAPI(currentMonth + 1, currentYear)}
        >
          Next month
        </button>
      </div>
      {currentBudgets.length > 0 && (
        <>
          <div className="text-center text-3xl font-bold">Total Budgets</div>
          <BudgetPieChart budgetPieData={currentBudgetPieData}></BudgetPieChart>
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
                  currentBudgetSum.currentBudget / 100
                ).toFixed(2)}`}</td>
                <td className="px-6 text-left">{`$${(
                  currentBudgetSum.totalBudget / 100
                ).toFixed(2)}`}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
      {currentBudgets.length === 0 && (
        <span className="text-xl my-48">
          A budget has not yet been created for{" "}
          {getDateByMonthYear(currentMonth, currentYear)}. Please create a
          budget.
        </span>
      )}
      <BudgetCategoriesList
        budgetAmounts={currentBudgetAmounts}
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
  const budgetAmounts = await getBudgetAmounts(transactionsByCategory, budgets);
  const budgetSum = await getBudgetSum(transactionsByCategory, budgets);
  const budgetPieChartColour = await getBudgetPieChartColour(budgetSum);

  return {
    props: {
      month: currentMonth,
      year: currentYear,
      transactionsByCategory: transactionsByCategory,
      budgets: budgets,
      budgetSum: budgetSum,
      budgetAmounts: budgetAmounts,
      budgetPieChartColour: budgetPieChartColour,
    },
  };
}
