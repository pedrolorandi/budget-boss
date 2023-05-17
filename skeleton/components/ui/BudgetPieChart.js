import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function BudgetPieChart(props) {
  return (
    <div className="w-1/4 container relative">
      <div className="z-10 flex justify-center text-4xl absolute m-auto right-1 left-1 bottom-1/3 top-1/2">
        {props.budgetSumPercent}
      </div>
      <Doughnut className="-z-10" data={props.budgetPieData} />
    </div>
  );
}