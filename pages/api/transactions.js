import { getTransactionsGroupedByDate } from "@/helpers/selectors";

export default async function handler(req, res) {
  const userId = 1;
  const month = req.query.month;
  const year = req.query.year;
  const accountId = req.query.accountId;

  const transactions = await getTransactionsGroupedByDate(
    userId,
    month,
    year,
    accountId
  );

  res.send(
    JSON.stringify({
      month,
      year,
      transactions,
      accountId,
    })
  );
}
