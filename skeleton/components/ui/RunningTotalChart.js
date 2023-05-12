import React from "react";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function RunningTotalChart({ chartData }) {
  return <Chart data={chartData} />;
}
