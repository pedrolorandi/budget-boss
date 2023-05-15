import React from "react";
import { PrismaClient } from '@prisma/client'
import axios from 'axios';

import Form from "../../components/ui/Form";
import useHook from '../../hooks/useHook';

export default function AddTransaction({categories, accounts }) {
  const {
    titleRef,
    cateRef,
    amountRef,
    accountRef,
    sourRef,
    typeValue,
    setTypeValue
  } = useHook();
  
  function handleSubmit(event) {
    event.preventDefault();

    const inputValue = {
      type: typeValue,
      title: titleRef.current.value,
      categoryId: Number(cateRef.current.value),
      amountDecimal: amountRef.current.value * 100,
      accountId: Number(accountRef.current.value),
      date: new Date().toISOString()
    }
    const sourceName = sourRef.current.value;

    axios.post('/api/transaction/add', {data: {sourceName, inputValue}})
    .then(res => console.log('res', res))
    .catch(error => console.log(error.response));
  }

  return (
    <div >
      <Form onSubmit={handleSubmit} 
      titleRef={titleRef} cateRef={cateRef} amountRef={amountRef} accountRef={accountRef} sourRef={sourRef} typeValue={typeValue}
      handleOnChange={event => setTypeValue(event.target.value)}
      type='transaction' text='Add A Transaction' 
      categories={categories} accounts={accounts}
      />
    </div>
  );
}

export async function getServerSideProps() {
  const prisma = new PrismaClient();
  const categories = await prisma.category.findMany(); //names of the tables are in the seed.js file
  const accounts = await prisma.account.findMany({
    where: {userId: 1}
  });

  return {
    props: { categories, accounts },
  };
}
