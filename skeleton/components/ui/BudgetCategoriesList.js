import React from "react";

export default function BudgetCategoriesList(props) {
  const transactions = props.transactionsByCategory.map((element, i) => {
    return (
      <div key={i}>
        {element.categoryId} {element.name} {element._sum.amountDecimal / 100}
      </div>
    );
  });

  const budgets = props.budgets.map((element, i) => {
    return (
      <div key={i}>
        {element.Category.id} {element.Category.name}{" "}
        {element.amountDecimal / 100}
      </div>
    );
  });
  // console.log(props.transactionsByCategory);
  // console.log(props.budgets);

  const getBudgetAmounts = (transactions, budgets) => {
    let result = [];

    for (let b of budgets) {
      for (let c of transactions) {
        if (b.Category.id === c.categoryId) {
          result.push({
            categoryId: b.Category.id,
            name: b.Category.name,
            totalBudget: b.amountDecimal / 100,
            currentAmount: c._sum.amountDecimal / 100,
            budgetRemaining: (b.amountDecimal - c._sum.amountDecimal) / 100,
            budgetPercentage: (c._sum.amountDecimal / b.amountDecimal) * 100,
          });
        }
      }
    }
    console.log(result);
  };

  getBudgetAmounts(props.transactionsByCategory, props.budgets);

  return (
    <>
      <div>{transactions}</div>
      <div>{budgets}</div>
    </>
  );
}

/*

result

for b in budgets {
  found = myList.filter(e => e.cat === b.cat && e.amount < b.amount)
  result = [...result, ...found]
}

return result

*/
