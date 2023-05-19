import { PrismaClient } from "@prisma/client";

export default async function handler (req, res) {
  const userInputs = req.body;
  const prisma = new PrismaClient();

  const newBudget = await prisma.budget.create({ data: {
    "date": new Date().toISOString(),
    "userId": 1
    }
  });

  userInputs.forEach(obj => {
    obj['budgetId'] = newBudget.id;
  })
  console.log('userInputs', userInputs);

  for (const userInput of userInputs) {
    await prisma.budgetCategory.create({
    data: userInput,
    });
  };
  
  res.status(200).send('budget created');
}