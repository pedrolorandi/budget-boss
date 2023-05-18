import { PrismaClient } from "@prisma/client";
import { add_edit } from "../../../helpers/crud";

export default async function handler(req, res) {
  const prisma = new PrismaClient();
  let amountDecimal = 0;

  if (req.body.data.amountDecimal.includes(".")) {
    const amountArray = req.body.data.amountDecimal.split(".");

    amountDecimal = Number(
      amountArray[0] +
        (amountArray[1].length === 1 ? amountArray[1] + "0" : amountArray[1])
    );
  } else {
    amountDecimal = Number(req.body.data.amountDecimal) * 100;
  }

  const sourceId = await add_edit(req.body.data.sources, req.body.data.source);

  let inputValue = req.body.data.inputValue;
  inputValue["amountDecimal"] = amountDecimal;
  inputValue["sourceId"] = sourceId;

  await prisma.transaction.update({
    where: { id: req.body.data.transactionId },
    data: inputValue,
  });
  res.status(200).send("Transaction Edited");
}
