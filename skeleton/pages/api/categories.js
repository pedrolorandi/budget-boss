import { getCategoriesData } from "@/helpers/selectors";

export default async function handler(req, res) {
  const userId = 1;
  const reqMonth = req.query.month;
  const reqYear = req.query.year;

  const {
    month,
    year,
    categories,
    categoriesPercentages,
    percentagePerCategory,
  } = await getCategoriesData(userId, reqMonth, reqYear);

  res.send(
    JSON.stringify({
      month,
      year,
      categories,
      categoriesPercentages,
      percentagePerCategory,
    })
  );
}
