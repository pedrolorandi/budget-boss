import React, { useState } from 'react';
import Form from "../components/form";

export default function CategoryAction() {

  function handleSubmit(event) {
    event.preventDefault();
    console.log('submit is clicked!');
  }
  
  return(
    <div>
      <div>Add A Category</div>
      <Form onSubmit={handleSubmit} name='category'/>
    </div>
  )
}