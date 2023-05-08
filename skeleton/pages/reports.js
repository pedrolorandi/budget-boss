import { useState } from "react";
import PieChart from "../components/ui/PieChart";
import { PrismaClient } from "@prisma/client";

export default function Reports({ categories, categoriesPercentages }) {
  const [categoriesData, setCategoriesData] = useState({
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

  return (
    <>
      <PieChart chartData={categoriesData} />
    </>
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

  const sortedCategoreies = categories.map((category) => category.name);

  const totalTransactions = categories.reduce(
    (sum, cat) => sum + cat.transactions.length,
    0
  );

  const categoriesPercentages = categories.map((category) => {
    const numTransactions = category.transactions.length;
    return ((numTransactions / totalTransactions) * 100).toFixed(2);
  });

  return {
    props: { categories: sortedCategoreies, categoriesPercentages },
  };
}
