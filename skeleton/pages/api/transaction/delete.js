//see the outputs of console.log() here in the terminal
import { PrismaClient } from '@prisma/client'

export default async function Adding (req, res) {
  const prisma = new PrismaClient();
  const transactionID = req.body.id;
  console.log('res:', transactionID);

  try {
    await prisma.transaction.delete({
    where: {id: transactionID}
  })}
  catch(err) {
    console.log(err);
    res.status(500).send('error deleting transaction');
  };

  res.status(200).send('transaction deleted');
}
