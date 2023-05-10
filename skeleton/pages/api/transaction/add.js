//see the outputs of console.log() here in the terminal
import { PrismaClient } from '@prisma/client'
import {add_edit} from '../../../helpers/selectors'

export default async function Adding (req, res) {
  const prisma = new PrismaClient();
  const inputValue = req.body;
  async function adding() {
    await prisma.transaction.create({data: inputValue});
  }

  await add_edit(inputValue, adding);

  res.status(200).json({add: 'transaction'});
}

/* inputValue = { (passed in from the front-end)
  title: "da",
  accountId: 1 ("Checking"),
  amountDecimal: 1200,
  categoryId: 1 ("Clothing"),
  sourceId: "Presto",
  date: ("today's time")
}
*/