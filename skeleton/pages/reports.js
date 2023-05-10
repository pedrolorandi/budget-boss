import { formatCategoryClassName, pieChartColors } from "@/helpers/formatters";
import PieChart from "../components/ui/PieChart";
import Chart from "../components/ui/RunningTotalChart";

import {
  getDateByMonthYear,
  getCategoriesData,
  getPieChartColors,
} from "../helpers/selectors";
import axios from "axios";
import { useState } from "react";
import { PrismaClient } from "@prisma/client";

export default function Reports({
  month,
  year,
  categories,
  categoriesPercentages,
  percentagePerCategory,
  dates,
  incomes,
  expenses,
  currentRunningTotal,
}) {
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentYear, setCurrentYear] = useState(year);
  const [currentCategories, setCurrentCategories] = useState({
    datasets: [
      {
        label: "Percentage",
        data: categoriesPercentages,
        backgroundColor: getPieChartColors(),
      },
    ],
  });
  const [currentPercentagePerCategory, setCurrentPercentagePerCategory] =
    useState(percentagePerCategory);
  const [currentRunningTotalData, setCurrentRunningTotalData] = useState({
    labels: dates,
    datasets: [
      {
        type: "line",
        label: "Running Total",
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        fill: true,
        data: currentRunningTotal,
      },
      {
        type: "bar",
        label: "Incomes",
        backgroundColor: "rgb(75, 192, 192)",
        data: incomes,
      },
      {
        type: "bar",
        label: "Expenses",
        backgroundColor: "rgb(53, 162, 235)",
        data: expenses,
      },
    ],
  });

  const getTransactionsAPI = (month, year) => {
    if (month === 0) {
      month = 12;
      year--;
    }

    if (month === 13) {
      month = 1;
      year++;
    }

    axios.get("../api/categories", { params: { month, year } }).then((res) => {
      setCurrentMonth(Number(res.data.month));
      setCurrentYear(Number(res.data.year));
      setCurrentPercentagePerCategory(res.data.percentagePerCategory);
      setCurrentCategories({
        ...currentCategories,
        datasets: [
          {
            ...currentCategories.datasets[0],
            data: res.data.categoriesPercentages,
          },
        ],
      });
    });
  };

  return (
    <main className="flex flex-col p-5">
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
      <div className="flex flex-row items-center">
        <ul className="flex flex-col w-full">
          {categories.map((category) => {
            return (
              <li key={category} className="flex flex-row mb-2">
                <div
                  className={`flex bg-${formatCategoryClassName(
                    category
                  )} w-10 me-3`}
                ></div>
                <div className="flex-1">{category}</div>
                <div>{currentPercentagePerCategory[category]} %</div>
              </li>
            );
          })}
        </ul>

        <div className="flex w-full ms-10">
          <PieChart chartData={currentCategories} />
        </div>
      </div>
      <div className="flex w-full">
        <Chart chartData={currentRunningTotalData} />
      </div>
    </main>
  );
}

export async function getServerSideProps() {
  const prisma = new PrismaClient();
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const {
    month,
    year,
    categories,
    categoriesPercentages,
    percentagePerCategory,
  } = await getCategoriesData(1, currentMonth, currentYear);

  /*--------------*/
  // Running Total
  const transactions = await prisma.transaction.findMany({
    where: {
      source: { user: { id: 1 } },
    },
    include: { source: true, category: true },
    orderBy: {
      date: "asc",
    },
  });

  // Refactor

  const dates = [];
  const incomes = [];
  const expenses = [];
  const runningTotal = [];
  const currentRunningTotal = [];
  let currentTotal = 0;

  transactions.forEach(({ date, type, amountDecimal }, i) => {
    const formattedDate = date.toLocaleDateString();

    type === "Income"
      ? (currentTotal += amountDecimal / 100)
      : (currentTotal -= amountDecimal / 100);

    if (
      transactions[i - 1] &&
      formattedDate === transactions[i - 1].date.toLocaleDateString()
    ) {
      runningTotal[runningTotal.length - 1] = currentTotal;
    } else {
      runningTotal.push(currentTotal);
    }

    if (
      Number(formattedDate.split("/")[0]) === currentMonth &&
      Number(formattedDate.split("/")[2]) === currentYear
    ) {
      if (
        transactions[i - 1] &&
        formattedDate === transactions[i - 1].date.toLocaleDateString()
      ) {
        incomes[incomes.length - 1] +=
          type === "Income" ? amountDecimal / 100 : 0;
        expenses[expenses.length - 1] +=
          type === "Expenses" ? amountDecimal / 100 : 0;
        currentRunningTotal[currentRunningTotal.length - 1] =
          runningTotal[runningTotal.length - 1];
      } else {
        dates.push(formattedDate);
        incomes.push(type === "Income" ? amountDecimal / 100 : 0);
        expenses.push(type === "Expense" ? amountDecimal / 100 : 0);
        currentRunningTotal.push(currentTotal);
      }
    }
  });

  return {
    props: {
      month,
      year,
      categories,
      categoriesPercentages,
      percentagePerCategory,
      dates,
      incomes,
      expenses,
      currentRunningTotal,
    },
  };
}
