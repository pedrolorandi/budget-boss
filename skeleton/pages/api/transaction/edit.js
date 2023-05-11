//see the outputs of console.log() here in the terminal
import { PrismaClient } from '@prisma/client'
import {add_edit} from '../../../helpers/selectors'

export default async function Editing (req, res) {
  const prisma = new PrismaClient();
  const inputValue = req.body;
  async function editing () {
    await prisma.transaction.update({
      where: {id: inputValue.id},
      data: inputValue
    });
  }

  add_edit(inputValue, editing);

  res.status(200).send('Transaction Edited');
}

/* inputValue = req.body = { (passed in from the front-end)
  id: 2, (number)
  title: "dining-out",
  accountId: 1, (CIBC)
  amountDecimal: 1200,
  categoryId: 1, ("Clothing")
  sourceId: 1, ("Amazon")
  date: (today's date and time)
}
*/