import React from "react";

export default function BarChart(props) {
  //Class Name helper for Progress Bar colour based on width value and isValid
  let classNames = [];
  if (props.width < 50 && props.isValid) {
    classNames.push("bg-turquoise");
  } else if (props.width >= 50 && props.width < 75 && props.isValid) {
    classNames.push("bg-yellow-500");
  } else if (props.width >= 75 && props.isValid) {
    classNames.push("bg-red");
  } else {
    classNames.push("bg-gray-400");
  }

  return (
    <div className="m-5 text-lg">
      <div className="m-2 flex justify-between">
        <span className="font-bold">{props.name}</span>
        <span className="font-normal">
          ${props.currentAmount} /{" "}
          {props.createEditStatus ? (
            <span>
              $
              <input
                onChange={props.onChange}
                value={props.value}
                type="number"
              ></input>
            </span>
          ) : (
            "$" + props.totalBudget
          )}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full">
        <div
          className={`${classNames.join(
            " "
          )} text-lg font-medium text-blue-100 text-center p-1 leading-none rounded-full`}
          style={{
            width: `${props.width < 100 ? props.width : 100}` + "%",
          }}
        >
          {`${props.isValid ? props.width + "%" : "N/A"} `}
        </div>
      </div>
    </div>
  );
}
