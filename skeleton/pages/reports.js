import { useState } from "react";
import PieChart from "../components/ui/PieChart";
import { PrismaClient } from "@prisma/client";

export default function Reports({ categories, categoriesPercentages }) {
  const [categoriesData, setCategoriesData] = useState({
    labels: categories,
    datasets: [{ label: "Test", data: categoriesPercentages }],
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

  console.log(categories);
  const sortedCategoreies = categories.map((category) => category.name);

  const totalTransactions = categories.reduce(
    (sum, cat) => sum + cat.transactions.length,
    0
  );

  const categoriesPercentages = categories.map((category) => {
    const numTransactions = category.transactions.length;
    return (numTransactions / totalTransactions) * 100;
  });

  return {
    props: { categories: sortedCategoreies, categoriesPercentages },
  };
}
