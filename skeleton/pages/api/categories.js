export default async function handler(req, res) {
  const userId = 1;
  const month = req.query.month;
  const year = req.query.year;

  const categories = await prisma.category.findMany({
    include: {
      transactions: {
        where: {
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

  console.log(categories);

  const sortedCategories = categories.map((category) => category.name);

  const totalTransactions = categories.reduce(
    (sum, cat) => sum + cat.transactions.length,
    0
  );

  const categoriesPercentages = categories.map((category) => {
    const numTransactions = category.transactions.length;
    return ((numTransactions / totalTransactions) * 100).toFixed(2);
  });

  res.send(
    JSON.stringify({
      month,
      year,
      categories: sortedCategories,
      categoriesPercentages,
    })
  );
}
