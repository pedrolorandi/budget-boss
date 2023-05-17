import React from "react";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function CategoryBarChart({ chartData }) {
  return (
    <div className="flex w-full bg-[#F2F7FC] p-5 rounded-lg mt-2">
      <Chart data={chartData} />
    </div>
  );
}
