import React from "react";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function RunningTotalChart({ chartData, options }) {
  return (
    <div className="flex rounded-2xl items-center p-5 space-x-10 mt-2 bg-[#F2F7FC]">
      <Chart data={chartData} options={options} />
    </div>
  );
}
