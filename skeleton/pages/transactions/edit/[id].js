import React, { useRef } from "react";
import Form from "../../../components/add-edit-delete/form"
import { PrismaClient } from '@prisma/client'
import axios from 'axios';

export default function AddTransaction({transaction, categories, accounts, sources }) {
  const titleRef = useRef(); 
  const cateRef = useRef(); 
  const amountRef = useRef(); 
  const accountRef = useRef(); 
  const sourRef = useRef(); 
  
  const transactionSource = sources.find(source => source.id === transaction.sourceId).name;
  
  function handleSubmit(event) {
    event.preventDefault();
    const inputValue = {
      id: transaction.id,
      type: transaction.type,
      title: titleRef.current.value,
      categoryId: Number(cateRef.current.value),
      amountDecimal: amountRef.current.value*100,
      accountId: Number(accountRef.current.value),
      sourceId: sourRef.current.value,
      date: new Date().toISOString()
    }
    console.log('submit is clicked!', 'inputValue', inputValue);
    axios.post('/api/transaction/edit', inputValue)
    .then(res => console.log('res', res))
    .catch(error => console.log(error.response.status));
  }
  
  return(
    <div>
      <Form onSubmit={handleSubmit} 
      titleRef={titleRef} cateRef={cateRef} amountRef={amountRef} accountRef={accountRef} sourRef={sourRef}
      type='Edit' text='Edit A Transaction' transaction={transaction} categories={categories} accounts={accounts} transactionSource={transactionSource} />
    </div>
  )
}

export async function getServerSideProps(content) {
  const prisma = new PrismaClient();
  const userId = Number(content.params.id); //got the id here
  const transaction = await prisma.transaction.findUnique({
    where: {id: userId}
  })

  const categories = await prisma.category.findMany();
  const accounts = await prisma.account.findMany();
  const sources = await prisma.source.findMany();

  return {
    props: {
      transaction: {
        ...transaction,
        date: transaction.date.toISOString()
      },
      categories,
      accounts,
      sources
    }
  }
};

