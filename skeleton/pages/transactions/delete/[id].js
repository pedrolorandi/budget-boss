import React from "react";
import axios from 'axios';
import { useRouter } from 'next/router';

export default function AddTransaction({transactionID}) {
  const route = useRouter();

  function handleOnClick () {
    axios.post('/api/transaction/delete', {id: transactionID})
    .then(res => {
      console.log('res', res)
      route.push('/transactions/add')
    })
    .catch(error => console.log(error.response.status));
  }

  return(
    <div>
      <p>Are you sure you wanna delete this transaction?</p>
      <button onClick={handleOnClick}>Delete</button>
    </div>
  )
}

export async function getServerSideProps(content) {
  const transactionID = Number(content.params.id); //got the id here

  return {
    props: {transactionID}
  }
};

