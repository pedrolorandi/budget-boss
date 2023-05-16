import { formatCategoryClassName } from "@/helpers/formatters";
import PieChart from "../components/ui/PieChart";
import Chart from "../components/ui/RunningTotalChart";

import {
  getDateByMonthYear,
  getCategoriesData,
  getPieChartColors,
  getRunningTotalData,
} from "../helpers/selectors";
import axios from "axios";
import { useState } from "react";

export default function Reports({
  month,
  year,
  categories,
  categoriesPercentages,
  percentagePerCategory,
  dates,
  incomes,
  expenses,
  runningTotal,
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
  const [currentRunningTotal, setCurrentRunningTotal] = useState({
    labels: dates,
    datasets: [
      {
        type: "line",
        label: "Running Total",
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        fill: true,
        data: runningTotal,
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
    axios.get("../api/reports", { params: { month, year } }).then((res) => {
      // Updating the state with the fetched data
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
      setCurrentRunningTotal({
        labels: res.data.dates,
        datasets: [
          {
            ...currentRunningTotal.datasets[0],
            data: res.data.runningTotal,
          },
          {
            ...currentRunningTotal.datasets[1],
            data: res.data.incomes,
          },
          {
            ...currentRunningTotal.datasets[2],
            data: res.data.expenses,
          },
        ],
      });
    });
  };

  return (
    <>
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
        <Chart chartData={currentRunningTotal} />
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const {
    month,
    year,
    categories,
    categoriesPercentages,
    percentagePerCategory,
  } = await getCategoriesData(1, currentMonth, currentYear);

  const { dates, incomes, expenses, runningTotal } = await getRunningTotalData(
    1,
    currentMonth,
    currentYear
  );

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
      runningTotal,
    },
  };
}
