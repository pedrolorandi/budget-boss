import { PrismaClient } from "@prisma/client";

import {
  getBudgets,
  getDateByMonthYear,
  getTransactions,
  getTransactionsGroupedByCategory,
} from "../../helpers/selectors";
import axios from "axios";
import { useState } from "react";

import BudgetCategoriesList from "@/components/ui/BudgetCategoriesList";

export default function Budgets({ month, year, budgets }) {
  const [currentBudgets, setCurrentBudgets] = useState(budgets);
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentYear, setCurrentYear] = useState(year);

  console.log(budgets);
  return (
    <div>
      <BudgetCategoriesList budgets={budgets}></BudgetCategoriesList>
    </div>
  );
}

export async function getServerSideProps() {
  const prisma = new PrismaClient();

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const budgets = await getBudgets(1, currentMonth, currentYear);

  return {
    props: {
      month: currentMonth,
      year: currentYear,
      budgets: budgets,
    },
  };
}
