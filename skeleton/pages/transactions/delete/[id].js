import React from "react";
import { PrismaClient } from "@prisma/client";

import Form from "../../../components/ui/Form";

export default function EditTransaction({ transaction, categories, user }) {
  return (
    <Form
      formType="delete"
      sources={user.sources}
      categories={categories}
      accounts={user.accounts}
      transaction={transaction}
    />
  );
}

export async function getServerSideProps(content) {
  const prisma = new PrismaClient();
  const transactionId = Number(content.params.id); //got the id here

  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { source: true },
  });

  const user = await prisma.user.findUnique({
    where: { id: 1 },
    include: {
      accounts: true,
      sources: true,
    },
  });

  const categories = await prisma.category.findMany();

  return {
    props: {
      transaction: {
        ...transaction,
        date: transaction.date.toISOString(),
      },
      categories,
      user,
    },
  };
}
