import React from "react";
import { useState } from "react";

import BarChart from "./BudgetProgressBar";

export default function BudgetCategoriesList(props) {
  const [chartData, setChartData] = useState({
    labels: props.budgetAmounts.map((data) => data.name),
    datasets: [
      {
        labels: "%",
        data: props.budgetAmounts.map((data) => data.budgetRemaining),
      },
    ],
  });
  const transactions = props.transactionsByCategory.map((element, i) => {
    return (
      <div key={i}>
        {element.categoryId} {element.name} {element._sum.amountDecimal / 100}
      </div>
    );
  });

  const budgets = props.budgets.map((element, i) => {
    return (
      <div key={i}>
        {element.Category.id} {element.Category.name}{" "}
        {element.amountDecimal / 100}
      </div>
    );
  });

  return (
    <>
      <div>{transactions}</div>
      <div>{budgets}</div>
      <BarChart data={chartData}></BarChart>
    </>
  );
}
