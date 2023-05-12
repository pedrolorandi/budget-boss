import React, {useRef, useState} from 'react';
import {useRouter} from 'next/router';

export default function useHook () {
  const titleRef = useRef(); //create a mutable value that persists across re-renders and doesn't trigger a re-render when it is updated.
  const cateRef = useRef(); 
  const amountRef = useRef(); 
  const accountRef = useRef(); 
  const sourRef = useRef(); 
  const [typeValue, setTypeValue] = useState('');
  const route = useRouter();

  return {
    titleRef,
    cateRef,
    amountRef,
    accountRef,
    sourRef,
    typeValue, 
    setTypeValue,
    route
  }
}