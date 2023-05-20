import React, {useRef, useState} from 'react';
import {useRouter} from 'next/router';

export default function useHook () {
  const route = useRouter();

  return {
    route
  }
}