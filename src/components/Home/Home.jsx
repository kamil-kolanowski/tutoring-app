import React, {useState} from 'react'
import { getCookie } from './../../functions/cookies';

export default function Home() {
  const userType = getCookie("userType")
  console.log(userType)

  return (
    <div>Home</div>
  )
}
