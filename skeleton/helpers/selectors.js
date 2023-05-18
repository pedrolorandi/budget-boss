// Importing necessary dependencies
import { PrismaClient } from "@prisma/client";
import { convertDate } from "./formatters";

// Function to get the formatted date string by month and year
export function getDateByMonthYear(month, year) {
  const monthName = new Date(year, month - 1, 1).toLocaleString("default", {
    month: "long",
  });

  return `${monthName} ${year}`;
}

// Function to get all transactions for a specific user
export async function getAllTransactions(userId) {
  // Create a new instance of PrismaClient
  const prisma = new PrismaClient();

  // Fetch transactions from the Prisma database based on the specified criteria
  const transactions = await prisma.transaction.findMany({
    where: { source: { user: { id: userId } } },
    include: { source: true, category: true, account: true }, // Include the related source and category data for each transaction // Filter transactions by user ID}
  });

  // Format the transaction dates and group transactions by date
  const formattedTransactions = transactions
    .map((transaction) => {
      const date = JSON.stringify(transaction.date).substring(1, 11);

      return {
        ...transaction,
        date, // Format the transaction date as a localized string
      };
    })
    .sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

  return formattedTransactions;
}

// Function to retrieve and group transactions by date, filtered by the specified month and year
export async function getTransactionsGroupedByDate(
  userId,
  month,
  year,
  accountId
) {
  // Retrieve all transactions for the specified user
  const transactions = await getAllTransactions(userId);

  // Create a string representing the current month and year in the format "YYYY-MM"
  const currentMonthAndYear = `${year}-${month < 10 ? "0" + month : month}`;

  // Filter transactions to include only those that match the current month and year
  let filteredTransactions = transactions.filter((transaction) => {
    return transaction.date.slice(0, 7) === currentMonthAndYear;
  });

  // If there's an account, filter the transactions by accountId
  if (accountId) {
    filteredTransactions = filteredTransactions.filter((transaction) => {
      return transaction.accountId === Number(accountId);
    });
  }

  // Group the filtered transactions by date
  const groupedTransactions = filteredTransactions.reduce(
    (result, transaction) => {
      // Create a string representing the current month and year in the format "YYYY-MM"
      const currentMonthAndYear = `${year}-${month < 10 ? "0" + month : month}`;

      // If the transaction date matches the current month and year, add it to the corresponding group
      if (transaction.date.slice(0, 7) === currentMonthAndYear) {
        !result[transaction.date]
          ? (result[transaction.date] = [transaction])
          : result[transaction.date].push(transaction);
      }

      return result;
    },
    {}
  );

  // Create an array of transactions grouped by date
  const transactionsByDate = Object.keys(groupedTransactions).map((date) => {
    return {
      date: date,
      transactions: groupedTransactions[date],
    };
  });

  // Return the transactions grouped by date
  return transactionsByDate;
}

// Function to calculate the running total by account for a user,
// based on the filtered transactions and their amounts
export async function getRunnigTotalByAccount(userId) {
  // Retrieve all transactions for the specified user
  const transactions = await getAllTransactions(userId);

  // Get the current date in the "YYYY-MM-DD" format
  const today = convertDate(new Date());

  // Filter transactions to include only those up to the current date,
  // and reverse the order to start with the oldest transaction
  const filteredTransactions = transactions
    .reverse()
    .filter((transaction) => transaction.date <= today);

  // Initialize an empty object to store the running total by account
  const accounts = {};

  // Calculate the running total for each transaction, grouped by account
  filteredTransactions.forEach((transaction) => {
    // If the account doesn't exist in the accounts object, initialize it with a running total of 0
    if (!accounts[transaction.account.id]) accounts[transaction.account.id] = 0;

    // Update the running total based on the transaction type (income or expense)
    accounts[transaction.account.id] +=
      transaction.type === "Income"
        ? transaction.amountDecimal / 100
        : -transaction.amountDecimal / 100;
  });

  // Format the running total to have two decimal places for each account
  Object.keys(accounts).forEach((accountId) => {
    accounts[accountId] = accounts[accountId].toFixed(2);
  });

  // Return the running total by account
  return accounts;
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
    const formattedDate = JSON.stringify(date).substring(1, 11);
    const [transactionYear, transactionMonth, _] = formattedDate.split("-");

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

// Function to retrieve and group Transaction sums by Category, filtered by the specified month and year
export async function getTransactionsGroupedByCategory(userId, month, year) {
  const prisma = new PrismaClient();
  const categoryTransaction = await prisma.transaction.groupBy({
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

  //Retrieve Category IDs and Names
  const categoryNames = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  //Combine Names into Transactions Data by Category ID
  const result = [];

  for (let i of categoryTransaction) {
    for (let j of categoryNames)
      if (i.categoryId === j.id) {
        let element = {
          ...i,
          name: j.name,
        };
        result.push(element);
      }
  }

  //Return resulting object containing Transaction sums grouped by Categories
  return result;
}

// Function to retrieve sums and names by Category from Transactions, filtered by the specified month and year
export async function getCategoryBarChartData(userId, month, year) {
  //Call "getTransactionsGroupedByCategory" into result
  const result = await getTransactionsGroupedByCategory(userId, month, year);

  //Destructure result into separate arrays
  const sums = [];
  const categoryNameList = [];

  result.forEach(({ _sum, name }, i) => {
    sums.push(_sum.amountDecimal / 100);
    categoryNameList.push(name);
  });

  //Return resulting objects containing Transaction sums grouped by Categories and Category Names
  return { sums, categoryNameList };
}

// Function to retrieve BudgetCategories amounts, Category Name and IDs, filtered by the specified month and year
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
  //Return resulting object containing BudgetCategories amounts, Category Name and IDs
  return budgets;
}

export function getLinks() {
  return [
    { label: "Overview", path: "/" },
    { label: "Accounts", path: "/transactions" },
    { label: "Budgets", path: "/" },
    { label: "Reports", path: "/reports" },
  ];
}