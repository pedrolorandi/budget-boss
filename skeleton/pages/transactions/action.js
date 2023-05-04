import React, { useState } from 'react';
import Form from "../components/form";

export default function TransactionAction() {

  function handleSubmit(event) {
    event.preventDefault();
    console.log('submit is clicked!');
  }
  
  return(
    <div>
      <div>Add A Transaction</div>
      <Form onSubmit={handleSubmit} name='transaction'/>
    </div>
  )
}

