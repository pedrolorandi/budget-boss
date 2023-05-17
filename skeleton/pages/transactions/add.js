import React from "react";
import { PrismaClient } from "@prisma/client";

import Form from "../../components/ui/Form";

export default function AddTransaction({ categories, user }) {
  return (
    <Form
      formType="add"
      sources={user.sources}
      categories={categories}
      accounts={user.accounts}
    />
  );
}

export async function getServerSideProps() {
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: { id: 1 },
    include: {
      accounts: true,
      sources: true,
    },
  });

  const categories = await prisma.category.findMany();

  return {
    props: { categories, user },
  };
}
