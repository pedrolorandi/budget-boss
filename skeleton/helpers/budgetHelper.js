//Function that uses BudgetCategories and Transactions grouped by Categories to create BudgetCategory List Data
export function getBudgetAmounts(transactions, budgets) {
  let result = [];
  if (budgets.length === 0) {
    for (let c of transactions) {
      result.push({
        categoryId: c.categoryId,
        name: c.name,
        totalBudget: 0,
        currentAmount: c._sum.amountDecimal / 100,
        budgetRemaining: 0,
        budgetPercentage: 100,
        isValid: false,
      });
    }
  } else {
    for (let b of budgets) {
      for (let c of transactions) {
        if (b.category.id === c.categoryId) {
          result.push({
            budgetCategoryId: b.id,
            categoryId: b.category.id,
            name: b.category.name,
            totalBudget: b.amountDecimal / 100,
            currentAmount: c._sum.amountDecimal / 100,
            budgetRemaining: (b.amountDecimal - c._sum.amountDecimal) / 100,
            budgetPercentage:
              b.amountDecimal === 0
                ? 100
                : (c._sum.amountDecimal / b.amountDecimal) * 100,
            isValid: b.amountDecimal === 0 ? false : true,
          });
        }
      }
    }
  }
  return result.sort((a, b) => {
    return b.isValid - a.isValid;
  });
}
//Function that uses BudgetCategories and Transactions grouped by Categories to create Budget Pie Chart Data
export function getBudgetSum(transactions, budgets) {
  let result = { totalBudget: 0, currentBudget: 0, percent: 0 };
  for (let b of budgets) {
    result.totalBudget += b.amountDecimal;
    for (let c of transactions) {
      if (b.category.id === c.categoryId) {
        if (b.amountDecimal > 0) {
          result.currentBudget += c._sum.amountDecimal;
        }
      }
    }
  }
  result.percent = (result.currentBudget / result.totalBudget) * 100;
  result.difference =
    result.percent > 100 ? 0 : result.totalBudget - result.currentBudget;
  return result;
}
//Function that selected Pie Chart Colour by BudgetSum's percent data
export function getBudgetPieChartColour(data) {
  let pieChartColour = [];
  if (data.percent < 50) {
    pieChartColour.push("#52A1A3");
  } else if (data.percent >= 50 && data.percent < 75) {
    pieChartColour.push("#E6B32C");
  } else {
    pieChartColour.push("#DC244B");
  }
  return pieChartColour;
}

//Function that handles Submit button for Budgets Create/Edit mode
export function submit(budgetAmounts, inputValues, budgets) {
  const submitData = [];
  for (let i = 0; i < budgetAmounts.length; i++) {
    if (budgets.length > 0) {
      submitData.push({
        budgetCategoryId: budgetAmounts[i].budgetCategoryId,
        categoryId: budgetAmounts[i].categoryId,
      });
      submitData[i].amountDecimal = inputValues[i] * 100;
    } else {
      submitData.push({
        amountDecimal: inputValues[i] * 100,
        categoryId: budgetAmounts[i].categoryId,
      });
    }
  }
  return submitData;
}
