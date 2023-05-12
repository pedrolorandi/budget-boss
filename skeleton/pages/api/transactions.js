import { getTransactions } from "@/helpers/selectors";

export default async function handler(req, res) {
  const userId = 1;
  const month = req.query.month;
  const year = req.query.year;
  const account = req.query.account;

  const transactions = await getTransactions(userId, month, year, account);

  res.send(JSON.stringify({ month, year, transactions }));
}
