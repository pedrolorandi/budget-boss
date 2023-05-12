import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function BudgetPieChart(props) {
  return (
    <div className="w-1/4 flex justify-center">
      <Doughnut data={props.currentBudgetTotal} />
    </div>
  );
}
