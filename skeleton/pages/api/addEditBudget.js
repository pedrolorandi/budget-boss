import { PrismaClient } from "@prisma/client";

export default async function handler (req, res) {
  const {date, userInputs} = req.body;
  const prisma = new PrismaClient();

  if (!userInputs[0].id) {
    const newBudget = await prisma.budget.create({ data: {
      date: date,
      userId: 1
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
  } else {
    for (const userInput of userInputs) {
      await prisma.budgetCategory.update({
        where: {id: userInput.id},
        data: userInput,
      })
    }
  }
  
  res.status(200).send('budget created');
}