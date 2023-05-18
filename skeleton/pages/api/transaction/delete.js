import { PrismaClient } from "@prisma/client";

export default async function Deleting(req, res) {
  const prisma = new PrismaClient();

  await prisma.transaction.delete({
    where: { id: req.body.transactionId },
  });
  res.status(200).send("Transaction Deleted");
}
