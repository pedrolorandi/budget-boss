const { PrismaClient } = require("@prisma/client");
const users = require("./users.json");
const accounts = require("./accounts.json");
const categories = require("./categories.json");
const sources = require("./sources.json");
const transactions = require("./transactions.json");

const prisma = new PrismaClient();

async function main() {
  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  for (const account of accounts) {
    await prisma.account.create({
      data: account,
    });
  }

  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
  }

  for (const source of sources) {
    await prisma.source.create({
      data: source,
    });
  }

  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: transaction,
    });
  }
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
