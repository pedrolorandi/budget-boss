import { PrismaClient } from "@prisma/client";

export default async function Deleting(req, res) {
  const prisma = new PrismaClient();

  try {
    await prisma.transaction.delete({
      where: { id: req.body.data.transactionId },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Deleting Transaction");
  }

  res.status(200).send("Transaction Deleted");
}
