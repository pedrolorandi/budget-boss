import { formatCategoryClassName, pieChartColors } from "@/helpers/formatters";
import PieChart from "../components/ui/PieChart";

import {
  getDateByMonthYear,
  getCategoriesData,
  getPieChartColors,
} from "../helpers/selectors";
import axios from "axios";
import { useState } from "react";

export default function Reports({
  month,
  year,
  categories,
  categoriesPercentages,
  percentagePerCategory,
}) {
  const [currentPercentagePerCategory, setCurrentPercentagePerCategory] =
    useState(percentagePerCategory);
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
    </main>
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

  return {
    props: {
      month,
      year,
      categories,
      categoriesPercentages,
      percentagePerCategory,
    },
  };
}
