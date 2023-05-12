import React from "react";

export default function BarChart(props) {
  let classNames = [];
  if (props.width < 50) {
    classNames.push("bg-turquoise");
  } else if (props.width >= 50 && props.width < 75) {
    classNames.push("bg-yellow-500");
  } else {
    classNames.push("bg-red");
  }

  return (
    <div className="m-5 text-lg">
      <div className="m-2 flex justify-between">
        <span className="font-bold">{props.name}</span>
        <span>
          ${props.currentAmount} / ${props.totalBudget}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
        <div
          className={`${classNames.join(
            " "
          )} text-lg font-medium text-blue-100 text-center p-1 leading-none rounded-full`}
          style={{ width: `${props.width < 100 ? props.width : 100}` + "%" }}
        >
          {props.width}%
        </div>
      </div>
    </div>
  );
}
