//Budgets page
//Import Prisma Selectors
import {
  getDateByMonthYear,
  getTransactionsGroupedByCategory,
  getBudgets,
  getCategoryInfo,
} from "../../helpers/selectors";

//Import Budget Helper Functions
import {
  getBudgetAmounts,
  getBudgetSum,
  getBudgetPieChartColour,
  submit,
} from "@/helpers/budgetHelper";

//Import React and Axios
import { useState } from "react";
import axios from "axios";

//Import BudgetCategoriesList and BudgetPieChart components
import BudgetCategoriesList from "@/components/ui/BudgetCategoriesList";
import BudgetPieChart from "@/components/ui/BudgetPieChart";

//Import FontAwesomeIcons
import {
  faCircleLeft,
  faCircleRight,
  faCirclePlus,
  faAngleDoubleDown,
} from "@fortawesome/free-solid-svg-icons";
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
  indexPage,
}) {
  const [currentCreateEditStatus, setCurrentCreateEditStatus] = useState(false);
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
      currentBudgets
    );
    setCurrentCreateEditStatus(false);
    const date = new Date(currentYear, currentMonth - 1);

    axios
      .put("/api/addEditBudget", { date, userInputs })
      .then(() => {
        getBudgetsAPI(currentMonth, currentYear);
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <div className="flex flex-row rounded-2xl p-6 h-[6.5rem] bg-base-white justify-between w-full mb-2 sticky top-0 drop-shadow-sm z-20">
        <h1 className="self-center">Budgets</h1>
        <div className="flex flex-row self-center">
          {!currentCreateEditStatus && currentBudgets.length > 0 && (
            <button
              className={`rounded-lg w-36 p-3 font-bold text-white text-center ms-2 bg-selected hover:bg-buttonHover `}
              onClick={() => setCurrentCreateEditStatus(true)}
            >
              Edit
            </button>
          )}
          {currentCreateEditStatus && (
            <button
              className={`rounded-lg w-36 p-3 bg-cancel font-bold text-center hover:bg-cancelHover`}
              onClick={() => {
                setCurrentCreateEditStatus(false);
                setCurrentInputValues(
                  currentBudgetAmounts.map((element) => {
                    if (element.totalBudget) {
                      return element.totalBudget;
                    } else {
                      return "";
                    }
                  })
                );
              }}
            >
              Cancel
            </button>
          )}
          {currentCreateEditStatus && (
            <button
              className={`rounded-lg w-36 p-3 font-bold text-white text-center ms-2 bg-selected hover:bg-buttonHover `}
              onClick={() => handleOnClick()}
            >
              Submit
            </button>
          )}
        </div>
      </div>
      <div className="flex rounded-2xl p-5 bg-base-white space-x-5 justify-center w-full mb-2 sticky top-[5rem] drop-shadow-sm z-20">
        {!currentCreateEditStatus && (
          <>
            <button
              className="flex"
              onClick={() => getBudgetsAPI(currentMonth - 1, currentYear)}
            >
              <FontAwesomeIcon
                icon={faCircleLeft}
                size="2xl"
                className="hover:text-linkHover"
              />
            </button>
          </>
        )}

        <h1 className="flex w-60 justify-center">
          {getDateByMonthYear(currentMonth, currentYear)}
        </h1>
        {!currentCreateEditStatus && (
          <>
            <button
              className="flex"
              onClick={() => getBudgetsAPI(currentMonth + 1, currentYear)}
            >
              <FontAwesomeIcon
                icon={faCircleRight}
                size="2xl"
                className="hover:text-linkHover"
              />
            </button>
          </>
        )}
      </div>
      <div className="flex flex-col rounded-2xl p-5 bg-budgetsList justify-center items-center w-full mb-2">
        {!indexPage && currentBudgets.length > 0 && (
          <>
            <div className="text-left w-full">
              <h1>Total Budget</h1>
            </div>
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
        {!indexPage && currentBudgets.length === 0 && (
          <div className="flex flex-col justify-center items-center my-36">
            {" "}
            <span className="text-2xl py-24">
              A budget has not yet been created for{" "}
              {getDateByMonthYear(currentMonth, currentYear)}. Please create a
              budget.
            </span>
            {!indexPage &&
              currentBudgets.length === 0 &&
              !currentCreateEditStatus && (
                <button
                  className={`rounded-lg bg-selected text-xl w-64 p-6 font-bold text-white text-center hover:bg-buttonHover`}
                  onClick={() => setCurrentCreateEditStatus(true)}
                >
                  <FontAwesomeIcon icon={faCirclePlus} className="me-2" />
                  Create Budget
                </button>
              )}
          </div>
        )}
      </div>
      <div className="flex flex-col rounded-2xl p-5 bg-budgetsList justify-center w-full">
        <div className="text-left">
          <h1 className="self-center flex justify-between">
            Budget List
            {currentCreateEditStatus && (
              <FontAwesomeIcon
                icon={faAngleDoubleDown}
                size="xl"
                className="text-red fa-bounce inline pr-16"
              />
            )}
          </h1>
        </div>
        <BudgetCategoriesList
          budgetAmounts={currentBudgetAmounts}
          indexPage={indexPage}
          inputValues={currentInputValues}
          setter={setCurrentInputValues}
          createEditStatus={currentCreateEditStatus}
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
  const budgetAmounts = await getBudgetAmounts(
    transactionsByCategory,
    budgets,
    await getCategoryInfo()
  );
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
