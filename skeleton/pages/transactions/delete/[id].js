import React from "react";
import axios from 'axios';

import useHook from '../../../hooks/useHook';

export default function DeleteTransaction({transactionID}) {
  const {route} = useHook();

  function Delete () {
    axios.post('/api/transaction/delete', {id: transactionID})
    .then(res => {
      console.log('res', res)
      route.push('/transactions')
    })
    .catch(error => console.log(error.response));
  }

  return(
    <div>
      <p>Are you sure you wanna delete this transaction?</p>
      <button onClick={Delete} style={{paddingRight: "20px"}}>Delete</button>
      <button onClick={() => route.push('/transactions')}>Cancel</button>
    </div>
  )
}

export async function getServerSideProps(content) {
  const transactionID = Number(content.params.id); //got the id here

  return {
    props: {transactionID}
  }
};

