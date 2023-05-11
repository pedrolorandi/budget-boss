import { PrismaClient } from '@prisma/client'

export default async function Deleting (req, res) {
  const prisma = new PrismaClient();
  const transactionID = req.body.id;

  try {
    await prisma.transaction.delete({
      where: {id: transactionID}
    })
  }
  catch(err) {
    console.log(err);
    res.status(500).send('Error Deleting Transaction');
  }

  res.status(200).send('Transaction Deleted');
}
