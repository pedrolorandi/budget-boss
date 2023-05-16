import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function PieChart({ chartData }) {
  return (
    <div className="flex w-1/3 ms-10 justify-center">
      <div className="flex w-full">
        <Doughnut data={chartData} />
      </div>
    </div>
  );
}
