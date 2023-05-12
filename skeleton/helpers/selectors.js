// Importing necessary dependencies
import { PrismaClient } from "@prisma/client";

// Function to get the formatted date string by month and year
export function getDateByMonthYear(month, year) {
  const monthName = new Date(year, month - 1, 1).toLocaleString("default", {
    month: "long",
  });

  return `${monthName} ${year}`;
}

// Function to retrieve transactions for a given user, month, and year
export async function getTransactions(userId, month, year) {
  const prisma = new PrismaClient();

  // Querying the Prisma client to fetch transactions based on user, month, and year
  const transactions = await prisma.transaction.findMany({
    where: {
      source: { user: { id: userId } },
      AND: [
        { date: { gte: new Date(year, month - 1, 1) } },
        { date: { lt: new Date(year, month, 1) } },
      ],
    },
    include: { source: true, category: true },
  });

  // Formatting the transaction dates and grouping transactions by date
  const formattedTransactions = transactions.map((transaction) => {
    return {
      ...transaction,
      date: transaction.date.toLocaleDateString(),
    };
  });

  const groupedTransactions = formattedTransactions.reduce(
    (result, transaction) => {
      !result[transaction.date]
        ? (result[transaction.date] = [transaction])
        : result[transaction.date].push(transaction);

      return result;
    },
    {}
  );

  // Sorting the grouped transactions by date in descending order
  const sortedKeys = Object.keys(groupedTransactions).sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  // Creating an array of sorted transactions with date and corresponding grouped transactions
  const sortedTransactions = sortedKeys.map((date) => {
    return {
      date: date,
      transactions: groupedTransactions[date],
    };
  });

  return sortedTransactions;
}

// Function to retrieve category data for a given user, month, and year
export async function getCategoriesData(userId, month, year) {
  const prisma = new PrismaClient();

  // Querying the Prisma client to fetch categories and their associated transactions
  const categories = await prisma.category.findMany({
    where: {
      name: {
        not: "Income",
      },
    },
    include: {
      transactions: {
        where: {
          source: { user: { id: userId } },
          date: {
            gte: new Date(year, month - 1, 1),
            lt: new Date(year, month, 1),
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  // Extracting category names from the retrieved data
  const categoriesName = categories.map((category) => category.name);

  // Calculating the total number of transactions across all categories
  let totalTransactions = categories.reduce(
    (sum, cat) => sum + cat.transactions.length,
    0
  );

  // If there are no transactions, set the totalTransactions to 1 to avoid division by zero
  if (totalTransactions === 0) totalTransactions = 1;

  // Object to store the percentage per category
  const percentagePerCategory = {};

  // Calculating the percentage of transactions for each category
  const categoriesPercentages = categories.map((category) => {
    const numTransactions = category.transactions.length;
    const categoryPercentage = (
      (numTransactions / totalTransactions) *
      100
    ).toFixed(2);

    // Storing the category percentage in the percentagePerCategory object
    percentagePerCategory[category.name] = categoryPercentage;
    return categoryPercentage;
  });

  // Returning an object containing the month, year, category names, category percentages, and percentage per category
  return {
    month,
    year,
    categories: categoriesName,
    categoriesPercentages,
    percentagePerCategory,
  };
}

// Function to retrieve an array of colors for a pie
export function getPieChartColors() {
  return [
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
  ];
}

// Function to retrieve running total data for a given user, month, and year
export async function getRunningTotalData(userId, month, year) {
  const prisma = new PrismaClient();

  // Querying the Prisma client to fetch transactions for the specified user
  const transactions = await prisma.transaction.findMany({
    where: {
      source: { user: { id: userId } },
    },
    include: { source: true, category: true },
    orderBy: {
      date: "asc",
    },
  });

  // Arrays to store dates, incomes, expenses, running total, and current running total
  const dates = [];
  const incomes = [];
  const expenses = [];
  const runningTotal = [];
  const currentRunningTotal = [];
  let currentTotal = 0;

  // Looping through transactions to calculate running totals, incomes, expenses, and dates
  transactions.forEach(({ date, type, amountDecimal }, i) => {
    const formattedDate = date.toLocaleDateString();
    const [transactionMonth, _, transactionYear] = formattedDate.split("/");

    // Calculating the running total based on transaction type and amount
    currentTotal +=
      type === "Income" ? amountDecimal / 100 : -amountDecimal / 100;

    // Checking if the current transaction has the same date as the previous transaction
    if (
      transactions[i - 1] &&
      formattedDate === transactions[i - 1].date.toLocaleDateString()
    ) {
      // Updating the running total for the current date
      runningTotal[runningTotal.length - 1] = currentTotal;

      // Checking if the transaction falls within the specified month and year
      if (
        Number(transactionMonth) === Number(month) &&
        Number(transactionYear) === Number(year)
      ) {
        // Updating the incomes, expenses, and current running total for the current date
        incomes[incomes.length - 1] +=
          type === "Income" ? amountDecimal / 100 : 0;
        expenses[expenses.length - 1] +=
          type === "Expense" ? amountDecimal / 100 : 0;
        currentRunningTotal[currentRunningTotal.length - 1] =
          runningTotal[runningTotal.length - 1];
      }
    } else {
      // Adding a new entry for the current date in running total, incomes, expenses, and dates
      runningTotal.push(currentTotal);

      // Checking if the transaction falls within the specified month and year
      if (
        Number(transactionMonth) === Number(month) &&
        Number(transactionYear) === Number(year)
      ) {
        // Adding a new entry for the current date in incomes, expenses, current running total, and dates
        incomes.push(type === "Income" ? amountDecimal / 100 : 0);
        expenses.push(type === "Expense" ? amountDecimal / 100 : 0);
        currentRunningTotal.push(currentTotal);
        dates.push(formattedDate);
      }
    }
  });

  // Returning an object containing dates, incomes, expenses, and current running total
  return { dates, incomes, expenses, runningTotal: currentRunningTotal };
}

export async function getTransactionsGroupedByCategory(userId, month, year) {
  const prisma = new PrismaClient();
  const categories = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      source: { user: { id: userId } },
      AND: [
        { date: { gte: new Date(year, month - 1, 1) } },
        { date: { lt: new Date(year, month, 1) } },
      ],
      type: "Expense",
    },
    _sum: {
      amountDecimal: true,
    },
  });

  const categoryNames = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const result = [];

  for (let i of categories) {
    for (let j of categoryNames)
      if (i.categoryId === j.id) {
        let element = {
          ...i,
          name: j.name,
        };
        result.push(element);
      }
  }
  return result;
}

export async function getBudgets(userId, month, year) {
  const prisma = new PrismaClient();

  const budgets = await prisma.budgetCategory.findMany({
    where: {
      budget: {
        userId: userId,
        AND: [
          { date: { gte: new Date(year, month - 1, 1) } },
          { date: { lt: new Date(year, month, 1) } },
        ],
      },
    },
    select: {
      amountDecimal: true,
      category: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  return budgets;
}
