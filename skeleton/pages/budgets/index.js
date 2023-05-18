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

//Import left and right circle icons
import { faCircleLeft, faCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        backgroundColor: ["#D2D5DB", `${budgetPieChartColour}`],
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
              "#D2D5DB",
              `${getBudgetPieChartColour(res.data.newBudgetSum)}`,
            ],
          },
        ],
      });
    });
  };

  return (
    <>
      <div className="flex bg-[#FFF] space-x-5 justify-center mb-2 p-5 rounded-lg">
        <button
          className="flex"
          onClick={() => getBudgetsAPI(currentMonth - 1, currentYear)}
        >
          <FontAwesomeIcon icon={faCircleLeft} size="2xl" />
        </button>
        <h1 className="flex w-60 justify-center">
          {getDateByMonthYear(currentMonth, currentYear)}
        </h1>
        <button
          className="flex"
          onClick={() => getBudgetsAPI(currentMonth + 1, currentYear)}
        >
          <FontAwesomeIcon icon={faCircleRight} size="2xl" />
        </button>
      </div>

      <div className="text-left flex flex-col items-center bg-[#F2F7FC] mb-2 p-5 rounded-lg w-full">
        {currentBudgets.length > 0 && (
          <>
            <h1 className="flex text-left w-full">Total Budget</h1>
            <BudgetPieChart
              budgetPieData={currentBudgetPieData}
              budgetSumPercent={`${Math.round(currentBudgetSum.percent).toFixed(
                1
              )}%`}
            ></BudgetPieChart>
            <table className="table-fixed w-full text-lg mt-2">
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
          <span className="text-xl my-48">
            A budget has not yet been created for{" "}
            {getDateByMonthYear(currentMonth, currentYear)}. Please create a
            budget.
          </span>
        )}
      </div>
      <div className="flex flex-col items-center bg-[#F2F7FC] p-5 rounded-lg w-full">
        <BudgetCategoriesList
          budgetAmounts={currentBudgetAmounts}
        ></BudgetCategoriesList>
      </div>
    </>
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
