import React from "react";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      type: "line",
      label: "Running Total",
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      fill: true,
      data: [1, 2, 3, 4, 5],
    },
    {
      type: "bar",
      label: "Incomes",
      backgroundColor: "rgb(75, 192, 192)",
      data: [10, 20, 30, 40, 50],
      borderColor: "white",
    },
    {
      type: "bar",
      label: "Expenses",
      backgroundColor: "rgb(53, 162, 235)",
      data: [0, 0, 50, 0, 0],
    },
  ],
};

export default function RunningTotalChart({ chartData }) {
  return <Chart data={chartData} />;
}
