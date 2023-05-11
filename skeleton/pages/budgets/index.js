import { PrismaClient } from "@prisma/client";

import {
  getDateByMonthYear,
  getTransactions,
  getTransactionsGroupedByCategory,
  getBudgets,
} from "../../helpers/selectors";
import axios from "axios";
import { useState } from "react";

import BudgetCategoriesList from "@/components/ui/BudgetCategoriesList";

export default function Budgets({
  month,
  year,
  transactionsByCategory,
  budgets,
}) {
  const [currentBudgets, setCurrentBudgets] = useState(transactionsByCategory);
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentYear, setCurrentYear] = useState(year);

  console.log(budgets);
  return (
    <div>
      <BudgetCategoriesList
        transactionsByCategory={transactionsByCategory}
        budgets={budgets}
      ></BudgetCategoriesList>
    </div>
  );
}

export async function getServerSideProps() {
  const prisma = new PrismaClient();

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const transactionsByCategory = await getTransactionsGroupedByCategory(
    1,
    currentMonth,
    currentYear
  );
  const budgets = await getBudgets(1, currentMonth, currentYear);

  return {
    props: {
      month: currentMonth,
      year: currentYear,
      transactionsByCategory: transactionsByCategory,
      budgets: budgets,
    },
  };
}
