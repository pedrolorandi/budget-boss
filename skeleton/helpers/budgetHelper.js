//Function that uses BudgetCategories and Transactions grouped by Categories to create BudgetCategory List Data
export function getBudgetAmounts(transactions, budgets, categories) {
  // console.log(categories);
  let result = [];
  const res = categories.map((element) => {
    return {
      budgetCategoryId: 0,
      categoryId: element.id,
      name: element.name,
      totalBudget: 0,
      currentAmount: 0,
      budgetRemaining: 0,
      budgetPercentage: 100,
      isValid: false,
    };
  });

  for (let i = 0; i < res.length; i++) {
    for (let c of transactions) {
      if (res[i].categoryId === c.categoryId) {
        res[i].currentAmount = c._sum.amountDecimal / 100;
      }
    }
  }

  if (budgets.length === 0) {
    return res;
  } else {
    for (let i = 0; i < res.length; i++) {
      for (let b of budgets) {
        if (res[i].categoryId === b.category.id) {
          res[i].budgetCategoryId = b.id;
          res[i].totalBudget = b.amountDecimal / 100;
          res[i].budgetRemaining =
            (b.amountDecimal - res[i].currentAmount) / 100;
          res[i].budgetPercentage =
            b.amountDecimal === 0
              ? 100
              : (res[i].currentAmount / b.amountDecimal) * 10000;
          res[i].isValid = b.amountDecimal === 0 ? false : true;
        }
      }
    }
    // console.log(res);
    return res.sort((a, b) => {
      return b.isValid - a.isValid;
    });
  }
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
        id: budgetAmounts[i].budgetCategoryId,
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
