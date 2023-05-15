import {PrismaClient} from '@prisma/client'

export default async function CreateBudgetInDB(req, res) {
  const prisma = new PrismaClient();
  const inputValue = req.body;
  console.log(inputValue);

  await prisma.budget.create({ data: {
    "date": new Date().toISOString(),
    "userId": 1
  }
  });

  res.status(200).send('Budget Created');
}

//to add to BudgetCategory table:  { "amountDecimal": 3000, "budgetId": 1, "categoryId": 1 }