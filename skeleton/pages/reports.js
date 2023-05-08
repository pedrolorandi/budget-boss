import PieChart from "../components/ui/PieChart";
import { PrismaClient } from "@prisma/client";

import { getDateByMonthYear } from "../helpers/selectors";
import axios from "axios";
import { useState } from "react";

export default function Reports({
  month,
  year,
  categories,
  categoriesPercentages,
}) {
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentYear, setCurrentYear] = useState(year);
  const [currentCategories, setCurrentCategories] = useState({
    labels: categories,
    datasets: [
      {
        label: "Categories",
        data: categoriesPercentages,
        backgroundColor: [
          "#FCED29",
          "#FBB03B",
          "#F15A25",
          "#ED1B24",
          "#C2272F",
          "#93268F",
          "#652D92",
          "#2D3194",
          "#0071BD",
          "#2AABE4",
          "#01A89E",
          "#23B574",
          "#006837",
          "#019247",
          "#3AB54D",
          "#8DC640",
        ],
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
      // setCurrentCategories(res.data.transactions);
    });
  };

  return (
    <main className="flex flex-col p-5">
      <div className="flex flex-row mb-5 space-x-5">
        <div className="flex-1 bg-nav-gray rounded-lg p-5">Checkings</div>
        <div className="flex-1 bg-nav-gray rounded-lg p-5">Savings</div>
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
      <PieChart chartData={currentCategories} />
    </main>
  );
}

export async function getServerSideProps() {
  const prisma = new PrismaClient();
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const categories = await prisma.category.findMany({
    include: {
      transactions: {
        where: {
          date: {
            gte: new Date(currentYear, currentMonth - 1, 1),
            lt: new Date(currentYear, currentMonth, 1),
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const sortedCategories = categories.map((category) => category.name);

  const totalTransactions = categories.reduce(
    (sum, cat) => sum + cat.transactions.length,
    0
  );

  const categoriesPercentages = categories.map((category) => {
    const numTransactions = category.transactions.length;
    return ((numTransactions / totalTransactions) * 100).toFixed(2);
  });

  return {
    props: {
      month: currentMonth,
      year: currentYear,
      categories: sortedCategories,
      categoriesPercentages,
    },
  };
}
