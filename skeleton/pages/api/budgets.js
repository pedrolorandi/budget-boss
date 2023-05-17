// Importing necessary functions from the 'selectors' module
import {
  getBudgets,
  getTransactionsGroupedByCategory,
} from "@/helpers/selectors";

import {
  getBudgetAmounts,
  getBudgetSum,
  getBudgetPieChartColour,
} from "@/helpers/budgetHelper";

// Defining an asynchronous function called 'handler' with 'req' and 'res' as parameters
export default async function handler(req, res) {
  // Setting a constant variable 'userId' to 1
  const userId = 1;
  // Extracting the 'month' and 'year' values from the 'req.query' object
  const reqMonth = req.query.month;
  const reqYear = req.query.year;

  // Calling the 'getBudgets' function with the provided parameters and storing the returned data in variables
  const newBudgets = await getBudgets(userId, reqMonth, reqYear);

  // Calling the 'getTransactionsGroupedByCategory' function with the provided parameters and storing the returned data in variables
  const newTransactions = await getTransactionsGroupedByCategory(
    userId,
    reqMonth,
    reqYear
  );

  const newBudgetAmounts = getBudgetAmounts(newTransactions, newBudgets);
  const newBudgetSum = getBudgetSum(newTransactions, newBudgets);
  const newBudgetPieChartColour = getBudgetPieChartColour(newBudgetSum);

  // Sending the response as a JSON string containing the retrieved data
  res.send(
    JSON.stringify({
      reqMonth,
      reqYear,
      newBudgets,
      newTransactions,
      newBudgetSum,
      newBudgetAmounts,
      newBudgetPieChartColour,
    })
  );
}
