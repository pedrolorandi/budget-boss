import { formatCategoryClassName } from "@/helpers/formatters";
import PieChart from "../components/ui/PieChart";
import Chart from "../components/ui/RunningTotalChart";
import CategoryBarChart from "@/components/ui/CategoryBarChart";
import { faCircleLeft, faCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  getDateByMonthYear,
  getCategoriesData,
  getPieChartColors,
  getRunningTotalData,
  getCategoryBarChartData,
  getTransactionsGroupedByCategory,
  getBudgets,
} from "../helpers/selectors";

import { getBudgetAmounts } from "@/helpers/budgetHelper";
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
  sums,
  categoryNameList,
  budgetAmounts,
  indexPage,
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
        borderColor: "rgb(222, 226, 230)",
        backgroundColor: "rgba(173, 181, 189, 0.4)",
        fill: true,
        data: runningTotal,
      },
      {
        type: "bar",
        label: "Incomes",
        backgroundColor: "rgb(80, 185, 155)",
        data: incomes,
      },
      {
        type: "bar",
        label: "Expenses",
        backgroundColor: "rgb(220, 36, 75)",
        data: expenses,
      },
    ],
  });
  const [currentCategoryBarData, setCurrentCategoryBarData] = useState({
    labels: categoryNameList,
    datasets: [
      {
        type: "bar",
        label: "Current Transactions",
        backgroundColor: "rgb(80, 185, 155)",
        data: sums,
      },
      {
        type: "bar",
        label: "Total Budget",
        backgroundColor: "rgb(220, 36, 75)",
        data: budgetAmounts.map((e) => e.totalBudget),
      },
    ],
  });

  const pieChartOptions = {
    plugins: {
      datalabels: {
        color: "#fff",
        font: {
          size: 18,
        },
      },
    },
  };

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
          top: 20,
          bottom: 10,
        },
        align: "start",
      },
    },
  };

  //Bar Chart Options to
  const options = {
    plugins: {
      legend: {
        display: false,
      },
      title: {
        font: {
          size: 20,
        },
        color: "#212529",
        display: true,
        text: "Actual Vs Budget by Category",
        padding: {
          top: 20,
          bottom: 40,
        },
        align: "start",
      },
    },
  };

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
      setCurrentCategoryBarData({
        labels: res.data.categoryNameList,
        datasets: [
          {
            ...currentCategoryBarData.datasets[0],
            data: res.data.sums,
          },
          {
            ...currentCategoryBarData.datasets[1],
            data: res.data.budgetAmounts.map((e) => e.totalBudget),
          },
        ],
      });
    });
  };

  return (
    <>
      {!indexPage && (
        <>
          <div className="flex flex-row rounded-2xl p-6 h-[6.5rem] bg-base-white justify-between">
            <h1 className="self-center">Reports</h1>
          </div>
          <div className="flex rounded-2xl mt-2 p-5 space-x-5 bg-base-white justify-center">
            <button
              className="flex"
              onClick={() => getTransactionsAPI(currentMonth - 1, currentYear)}
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
              onClick={() => getTransactionsAPI(currentMonth + 1, currentYear)}
            >
              <FontAwesomeIcon
                icon={faCircleRight}
                size="2xl"
                className="hover:text-linkHover"
              />
            </button>
          </div>
        </>
      )}

      {!indexPage && (
        <div className="flex relative flex-row rounded-2xl items-center p-5 space-x-10 mt-2 bg-[#E7F3FE]">
          <h1 className="absolute top-0 mt-5 text-[1.3rem] text-[#212529]">
            Percentage by Category
          </h1>
          <ul className="flex flex-col w-1/3">
            {categories.slice(0, 8).map((category) => {
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
          <ul className="flex flex-col w-1/3">
            {categories.slice(8, 16).map((category) => {
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
          <PieChart chartData={currentCategories} options={pieChartOptions} />
        </div>
      )}
      <Chart chartData={currentRunningTotal} options={runningTotalOptions} />
      {!indexPage && (
        <CategoryBarChart
          chartData={currentCategoryBarData}
          options={options}
        />
      )}
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

  const { sums, categoryNameList } = await getCategoryBarChartData(
    1,
    currentMonth,
    currentYear
  );

  const budgetAmounts = await getBudgetAmounts(
    await getTransactionsGroupedByCategory(1, currentMonth, currentYear),
    await getBudgets(1, currentMonth, currentYear)
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
      sums,
      categoryNameList,
      budgetAmounts,
    },
  };
}
