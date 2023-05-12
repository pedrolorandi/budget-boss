import { PrismaClient } from "@prisma/client";

export function getDateByMonthYear(month, year) {
  const monthName = new Date(year, month - 1, 1).toLocaleString("default", {
    month: "long",
  });

  return `${monthName} ${year}`;
}

export async function getTransactions(userId, month, year) {
  const prisma = new PrismaClient();
  const transactions = await prisma.transaction.findMany({
    where: {
      source: { user: { id: userId } },
      AND: [
        { date: { gte: new Date(year, month - 1, 1) } },
        { date: { lt: new Date(year, month, 1) } },
      ],
    },
    include: { Source: true, Category: true },
  });

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

  const sortedKeys = Object.keys(groupedTransactions).sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  const sortedTransactions = sortedKeys.map((date) => {
    return {
      date: date,
      transactions: groupedTransactions[date],
    };
  });

  return sortedTransactions;
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