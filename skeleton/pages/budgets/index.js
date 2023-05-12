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
import BudgetPieChart from "@/components/ui/BudgetPieChart";

export default function Budgets({
  month,
  year,
  transactionsByCategory,
  budgets,
  budgetSum,
}) {
  let pieChartColour = [];
  if (budgetSum.percent < 50) {
    pieChartColour.push("#52A1A3");
  } else if (budgetSum.percent >= 50 && budgetSum.percent < 75) {
    pieChartColour.push("#E6B32C");
  } else {
    pieChartColour.push("#DC244B");
  }
  const [currentTransactions, setCurrentTransactions] = useState(
    transactionsByCategory
  );
  const [currentBudgets, setCurrentBudgets] = useState(transactionsByCategory);
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentYear, setCurrentYear] = useState(year);
  const [currentBudgetTotal, setCurrentBudgetTotal] = useState({
    labels: ["Total Budget Remaining ($)", "Current Transactions Total ($)"],
    datasets: [
      {
        label: [],
        data: [
          (budgetSum.difference / 100).toFixed(2),
          (budgetSum.currentBudget / 100).toFixed(2),
        ],
        backgroundColor: ["#E9ECEF", `${pieChartColour}`],
      },
    ],
  });

  const getBudgetAmounts = (transactions, budgets) => {
    let result = [];

    for (let b of budgets) {
      for (let c of transactions) {
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
      <div className="text-center text-3xl font-bold">Total Budgets</div>
      <BudgetPieChart currentBudgetTotal={currentBudgetTotal}></BudgetPieChart>
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

  const getBudgetSum = (transactions, budgets) => {
    let result = { totalBudget: 0, currentBudget: 0 };

    for (let b of budgets) {
      result.totalBudget += b.amountDecimal;
      for (let c of transactions) {
        if (b.category.id === c.categoryId) {
          result.currentBudget += c._sum.amountDecimal;
        }
      }
    }
    console.log({
      ...result,
      percent: (result.currentBudget / result.totalBudget) * 100,
      difference:
        result.percent > 100 ? 0 : result.totalBudget - result.currentBudget,
    });
    return {
      ...result,
      percent: (result.currentBudget / result.totalBudget) * 100,
      difference:
        result.percent > 100 ? 0 : result.totalBudget - result.currentBudget,
    };
  };
  const budgetSum = getBudgetSum(transactionsByCategory, budgets);

  return {
    props: {
      month: currentMonth,
      year: currentYear,
      transactionsByCategory: transactionsByCategory,
      budgets: budgets,
      budgetSum: budgetSum,
    },
  };
}
