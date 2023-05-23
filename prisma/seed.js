const { PrismaClient } = require("@prisma/client");
const users = require("./users.json");
const accounts = require("./accounts.json");
const categories = require("./categories.json");
const sources = require("./sources.json");
const transactions = require("./transactions.json");
const budgets = require("./budgets.json");
const budgetCategories = require("./budgetCategory.json");

const prisma = new PrismaClient();

async function main() {
  // Users
  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  // Accounts
  for (const account of accounts) {
    await prisma.account.create({
      data: account,
    });
  }

  // Categories
  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
  }

  // Sources
  for (const source of sources) {
    await prisma.source.create({
      data: source,
    });
  }

  // Transactions
  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: transaction,
    });
  }

  // Budgets
  for (const budget of budgets) {
    await prisma.budget.create({
      data: budget,
    });
  }

  // BudgetCategory
  for (const budgetCategory of budgetCategories) {
    await prisma.budgetCategory.create({
      data: budgetCategory,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
