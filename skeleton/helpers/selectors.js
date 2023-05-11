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
    include: { source: true, category: true },
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
};

export async function add_edit (inputValue, action){
  const prisma = new PrismaClient();
  const inputSource = inputValue.sourceId //user's input of source in text
  const sources = await prisma.source.findMany({
    where: {"userId": 1}
  })
  console.log(sources);

  //check if the recorded source is already in the source table. If not, we'll add a new row to the source table with the recorded source name as well.
  let sourceID = 0
  sources.forEach(item => item.name === inputSource ? sourceID = item.id : false); //record the sourceID when we find it in the sources array
  if (sourceID) { //the recorded source exists in the source table
    inputValue.sourceId = sourceID
    action();
    console.log('inputValue', inputValue);
  } else { //the recorded source doesn't exist in the source table
    const NewSource = await prisma.source.create({data: { //create a new source row
      name: inputSource,
      userId: 1
    }});
    
    inputValue.sourceId = NewSource.id
    action();
    console.log('inputValue', inputValue);
  }

  return;
};

export async function getCategoriesData(userId, month, year) {
  const prisma = new PrismaClient();

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

  const categoriesName = categories.map((category) => category.name);

  let totalTransactions = categories.reduce(
    (sum, cat) => sum + cat.transactions.length,
    0
  );

  if (totalTransactions === 0) totalTransactions = 1;

  const percentagePerCategory = {};

  const categoriesPercentages = categories.map((category) => {
    const numTransactions = category.transactions.length;
    const categoryPercentage = (
      (numTransactions / totalTransactions) *
      100
    ).toFixed(2);

    percentagePerCategory[category.name] = categoryPercentage;
    return categoryPercentage;
  });

  return {
    month,
    year,
    categories: categoriesName,
    categoriesPercentages,
    percentagePerCategory,
  };
}

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
