import React from "react";
import BarChart from "./BudgetProgressBar";
export default function BudgetCategoriesList(props) {
  const progressCharts = props.budgetAmounts.map((element, i) => {
    return (
      <BarChart
        key={i}
        width={(Math.round(element.budgetPercentage * 100) / 100).toFixed(1)}
        name={element.name}
        currentAmount={element.currentAmount.toFixed(2)}
        totalBudget={element.totalBudget.toFixed(2)}
        isValid={element.isValid}
        onChange={(e) => {
          const clone = [...props.inputValues];
          clone[i] = Number(e.target.value);
          props.setter(clone);
        }}
        value={props.inputValues[i]}
        createEditStatus={props.createEditStatus}
      ></BarChart>
    );
  });

  return (
    <div
      className={`text-center text-3xl font-bold w-full mt-24, ${
        props.indexPage && "bg-budgetsList"
      }`}
    >
      {!props.indexPage && (
        <>
          <div className="font-bold text-xl flex justify-end mr-5">
            Current / Total
          </div>
        </>
      )}
      {progressCharts}
    </div>
  );
}
