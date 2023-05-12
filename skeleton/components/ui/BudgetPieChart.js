import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function BudgetPieChart(props) {
  const plugins = [
    {
      beforeDraw: function (chart) {
        const width = chart.width,
          height = chart.height,
          ctx = chart.ctx;
        ctx.restore();
        const fontSize = (height / 160).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "top";
        const text = `${Math.round(props.budgetSum.percent).toFixed(0)}%`,
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 2;
        ctx.fillText(text, textX, textY);
        ctx.save();
      },
    },
  ];
  return (
    <div className="w-1/4">
      <Doughnut data={props.currentBudgetTotal} plugins={plugins} />
    </div>
  );
}
