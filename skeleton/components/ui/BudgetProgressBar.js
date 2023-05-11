import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function arChart(props) {
  return (
    <div className="w-5/6">
      <Bar data={props.data}></Bar>;
    </div>
  );
}
