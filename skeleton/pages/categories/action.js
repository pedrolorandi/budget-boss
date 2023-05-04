import React, { useState } from 'react';
import Form from "../components/form";

export default function CategoryAction() {

  function handleSubmit(event) {
    event.preventDefault();
    console.log('submit is clicked!');
  }
  
  return(
    <div>
      <Form onSubmit={handleSubmit} name='category' text='Add A Category' />
    </div>
  )
}