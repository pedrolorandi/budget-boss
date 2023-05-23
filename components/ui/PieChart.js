import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

export default function PieChart({ chartData, options }) {
  return (
    <div className="flex w-1/3 ms-10 justify-center">
      <div className="flex w-full">
        <Doughnut
          data={chartData}
          plugins={[ChartDataLabels]}
          options={options}
        />
      </div>
    </div>
  );
}
