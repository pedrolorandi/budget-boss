//see the outputs of console.log() here in the terminal
import { PrismaClient } from '@prisma/client'
import {add_edit} from '../../../helpers/crud'

export default async function Editing (req, res) {
  const prisma = new PrismaClient();
  let inputValue = req.body.data.inputValue;
  const sourceName = req.body.data.sourceName;

  inputValue = await add_edit(inputValue, sourceName); //inputValue with sourceId 
  console.log(inputValue);
  await prisma.transaction.update({
    where: {id: inputValue.id},
    data: inputValue
  });

  res.status(200).send('Transaction Edited');
}

/* (passed in from the front-end)
req.body.data = {
  sourceName: 'dango',
  inputValue: {
  id: 3,
  type: 'Expense',
  title: 'da',
  categoryId: 1,
  amountDecimal: 1200,
  accountId: 1,
  date: '2023-05-11T20:08:26.860Z'
  }
}
*/