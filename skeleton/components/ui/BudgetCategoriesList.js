import React from "react";

export default function BudgetCategoriesList(props) {
  const transactions = props.transactionsByCategory.map((element) => {
    return (
      <div>
        {element.categoryId} {element.name} {element._sum.amountDecimal / 100}
      </div>
    );
  });

  const budgets = props.budgets.map((element) => {
    return (
      <div>
        {element.Category.id} {element.Category.name}{" "}
        {element.amountDecimal / 100}
      </div>
    );
  });
  return (
    <>
      <div>{transactions}</div>
      <div>{budgets}</div>
    </>
  );
}
