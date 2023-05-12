import React from "react";
import { useState } from "react";

import BarChart from "./BudgetProgressBar";

export default function BudgetCategoriesList(props) {
  // const [chartData, setChartData] = useState({
  //   labels: props.budgetAmounts.map((data) => data.name),
  //   datasets: [
  //     {
  //       labels: props.budgetAmounts.map((data) => data.name),
  //       data: props.budgetAmounts.map((data) => data.budgetPercentage),
  //       backgroundColor: ["green", "blue"],
  //       borderWidth: 1,
  //       borderSkipped: false,
  //       borderRadius: 5,
  //       barPercentage: 0.2,
  //       categoryPercentage: 0.9,
  //     },
  //   ],
  // });

  // const [chartOptions, setChartOptions] = useState({
  //   indexAxis: "y",
  //   scales: {
  //     x: {
  //       suggestedMin: 0,
  //       suggestedMax: 100,
  //       grid: { display: false },
  //       ticks: { display: false },
  //     },
  //     y: {
  //       beginAtZero: true,
  //       grid: { display: false },
  //       ticks: { display: false },
  //     },
  //   },
  //   plugins: {
  //     legend: {
  //       display: false,
  //     },
  //   },
  // });

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

  console.log(props.budgetAmounts);

  const progressCharts = props.budgetAmounts.map((element, i) => {
    return (
      <BarChart
        key={i}
        width={(Math.round(element.budgetPercentage * 100) / 100).toFixed(1)}
        name={element.name}
        currentAmount={(Math.round(element.currentAmount * 100) / 100).toFixed(
          2
        )}
        totalBudget={(Math.round(element.totalBudget * 100) / 100).toFixed(2)}
      ></BarChart>
    );
  });

  return (
    <>
      <div>{transactions}</div>
      <div>{budgets}</div>
      {progressCharts}
    </>
  );
}
