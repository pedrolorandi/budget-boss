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
  const [currentTransactions, setCurrentTransactions] = useState(
    transactionsByCategory
  );
  const [currentBudgets, setCurrentBudgets] = useState(transactionsByCategory);
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentYear, setCurrentYear] = useState(year);

  const getBudgetAmounts = (transactions, budgets) => {
    let result = [];
    
    for (let b of budgets) {
      for (let c of transactions) {
        console.log('b', b);
        if (b.category.id === c.categoryId) {
          result.push({
            categoryId: b.category.id,
            name: b.category.name,
            totalBudget: b.amountDecimal / 100,
            currentAmount: c._sum.amountDecimal / 100,
            budgetRemaining: (b.amountDecimal - c._sum.amountDecimal) / 100,
            budgetPercentage: (c._sum.amountDecimal / b.amountDecimal) * 100,
          });
        }
      }
    }
    return result;
  };

  const budgetAmounts = getBudgetAmounts(transactionsByCategory, budgets);

  return (
    <div>
      <BudgetCategoriesList
        budgetAmounts={budgetAmounts}
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