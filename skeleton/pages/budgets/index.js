//Budgets page
//Import Prisma Selectors
import {
  getDateByMonthYear,
  getTransactionsGroupedByCategory,
  getBudgets,
} from "../../helpers/selectors";
//Import Budget Helper Functions
import {
  getBudgetAmounts,
  getBudgetSum,
  getBudgetPieChartColour,
  submit,
} from "@/helpers/budgetHelper";

//Import React and Axios
import { useState, useEffect } from "react";
import axios from "axios";
//Import BudgetCategoriesList and BudgetPieChart components
import BudgetCategoriesList from "@/components/ui/BudgetCategoriesList";
import BudgetPieChart from "@/components/ui/BudgetPieChart";
//Budgets page component to display transactions grouped by Categories, and compared to User's Budgets
export default function Budgets({
  month,
  year,
  transactionsByCategory,
  budgets,
  budgetSum,
  budgetAmounts,
  budgetPieChartColour,
}) {
  const [currentCreateEditStatus, setcurrentCreateEditStatus] = useState(false);
  const [currentTransactionsByCategory, setCurrentTransactionsByCategory] =
    useState(transactionsByCategory);
  const [currentBudgets, setCurrentBudgets] = useState(budgets);
  const [currentBudgetSum, setCurrentBudgetSum] = useState(budgetSum);
  const [currentBudgetAmounts, setCurrentBudgetAmounts] =
    useState(budgetAmounts);
  const [currentInputValues, setCurrentInputValues] = useState(
    currentBudgetAmounts.map((element) => {
      if (element.totalBudget) {
        return element.totalBudget;
      } else {
        return "";
      }
    })
  );
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentYear, setCurrentYear] = useState(year);
  const [currentBudgetPieData, setCurrentBudgetPieData] = useState({
    labels: ["Total Budget Remaining ($)", "Current Transactions Total ($)"],
    datasets: [
      {
        label: [],
        data: [
          (budgetSum.difference / 100).toFixed(2),
          (budgetSum.currentBudget / 100).toFixed(2),
        ],
        backgroundColor: ["#E9ECEF", `${budgetPieChartColour}`],
      },
    ],
  });
  const getBudgetsAPI = (month, year) => {
    // Adjusting month and year values for previous and next month
    if (month === 0) {
      month = 12;
      year--;
    }
    if (month === 13) {
      month = 1;
      year++;
    }

    // Making an API call to retrieve data for the specified month and year
    axios.get("../api/budgets", { params: { month, year } }).then((res) => {
      // Updating the states with the fetched data
      setCurrentMonth(Number(res.data.reqMonth));
      setCurrentYear(Number(res.data.reqYear));
      setCurrentBudgetAmounts(res.data.newBudgetAmounts);
      setCurrentTransactionsByCategory(res.data.newTransactions);
      setCurrentBudgets(res.data.newBudgets);
      setCurrentBudgetSum(res.data.newBudgetSum);
      setCurrentInputValues(
        res.data.newBudgetAmounts.map((element) => {
          if (element.totalBudget) {
            return element.totalBudget;
          } else {
            return "";
          }
        })
      );
      setCurrentBudgetPieData({
        ...currentBudgetPieData,
        datasets: [
          {
            ...currentBudgetPieData.datasets[0],
            data: [
              (res.data.newBudgetSum.difference / 100).toFixed(2),
              (res.data.newBudgetSum.currentBudget / 100).toFixed(2),
            ],
            backgroundColor: [
              "#E9ECEF",
              `${getBudgetPieChartColour(res.data.newBudgetSum)}`,
            ],
          },
        ],
      });
    });
  };

  function handleOnClick() {
    const userInputs = submit(
      currentBudgetAmounts,
      currentInputValues,
      currentBudgets,
    );
    setcurrentCreateEditStatus(false);
    const date = new Date(currentYear, currentMonth - 1);
    
    axios.put('/api/addEditBudget', {date, userInputs})
    .then(res => console.log(res))
    .catch(err => console.log(err.response));
  }

  return (
    <div className="flex flex-col items-center content-center w-full">
      <div className="flex space-x-5 justify-center mb-5">
        {!currentCreateEditStatus && currentBudgets.length > 0 && (
          <button
            className="bg-turquoise text-white font-bold py-2 px-4 rounded"
            onClick={() => setcurrentCreateEditStatus(true)}
          >
            Edit
          </button>
        )}
        {!currentCreateEditStatus && (
          <>
            <button
              className="flex"
              onClick={() => getBudgetsAPI(currentMonth - 1, currentYear)}
            >
              Previous month
            </button>
          </>
        )}

        <h1 className="flex">
          {getDateByMonthYear(currentMonth, currentYear)}
        </h1>
        {!currentCreateEditStatus && (
          <>
            <button
              className="flex"
              onClick={() => getBudgetsAPI(currentMonth + 1, currentYear)}
            >
              Next month
            </button>
          </>
        )}
      </div>
      {currentBudgets.length > 0 && (
        <>
          <div className="text-center text-3xl font-bold">Total Budgets</div>
          <BudgetPieChart
            budgetPieData={currentBudgetPieData}
            budgetSumPercent={`${Math.round(currentBudgetSum.percent).toFixed(
              1
            )}%`}
          ></BudgetPieChart>
          <table className="table-fixed w-full text-lg">
            <thead>
              <tr>
                <th className="px-6 py-3 text-right">Current Transactions</th>
                <th className="px-6 py-3 text-left">Budget Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-6 text-right">{`$${(
                  currentBudgetSum.currentBudget / 100
                ).toFixed(2)}`}</td>
                <td className="px-6 text-left">{`$${(
                  currentBudgetSum.totalBudget / 100
                ).toFixed(2)}`}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
      {currentBudgets.length === 0 && (
        <>
          <span className="text-xl my-48">
            A budget has not yet been created for{" "}
            {getDateByMonthYear(currentMonth, currentYear)}. Please create a
            budget.
          </span>
          {!currentCreateEditStatus && (
            <button onClick={() => setcurrentCreateEditStatus(true)}>
              Create Budget
            </button>
          )}
        </>
      )}
      {currentCreateEditStatus && (
        <div>
          <button
            className="bg-turquoise text-white font-bold py-2 px-4 rounded"
            type="submit"
            onClick={handleOnClick}
          >
            Submit
          </button>
        </div>
      )}
      {currentCreateEditStatus && (
        <button
          className="bg-gray-400 text-white font-bold py-2 px-4 rounded"
          onClick={() => setcurrentCreateEditStatus(false)}
        >
          Cancel
        </button>
      )}

      <BudgetCategoriesList
        budgetAmounts={currentBudgetAmounts}
        createEditStatus={currentCreateEditStatus}
        inputValues={currentInputValues}
        setter={(param) => {
          setCurrentInputValues(param);
        }}
      ></BudgetCategoriesList>
    </div>
  );
}
//Retrieve initial Budgets data
export async function getServerSideProps() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const transactionsByCategory = await getTransactionsGroupedByCategory(
    1,
    currentMonth,
    currentYear
  );
  const budgets = await getBudgets(1, currentMonth, currentYear);
  const budgetAmounts = await getBudgetAmounts(transactionsByCategory, budgets);
  const budgetSum = await getBudgetSum(transactionsByCategory, budgets);
  const budgetPieChartColour = await getBudgetPieChartColour(budgetSum);
  return {
    props: {
      month: currentMonth,
      year: currentYear,
      transactionsByCategory: transactionsByCategory,
      budgets: budgets,
      budgetSum: budgetSum,
      budgetAmounts: budgetAmounts,
      budgetPieChartColour: budgetPieChartColour,
    },
  };
}
