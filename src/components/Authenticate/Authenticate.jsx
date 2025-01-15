import React, {useState, useEffect} from 'react'
import Login from '../Login/Login'
import Register from '../Register/Register'
import { Button } from '@mui/material'
import styles from './Authenticate.module.scss'
import { useNavigate } from "react-router";
import { getCookie } from './../../functions/cookies';

export default function Authenticate() {
    const [register, setRegister] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
      if (getCookie("userData")) {
        navigate('/')
      }
    }, [navigate])

    if (!register) {
        return (
        <div className={styles.componentWrapper}>
            <Login />
            <Button onClick={() => setRegister(true)}>Nie masz konta? Zarejestruj się...</Button>
        </div>
    )}
  return (
    <div className={styles.componentWrapper}>
        <Register />
        <Button onClick={() => setRegister(false)}>Masz konto? Zaloguj się...</Button>
    </div>
  )
}
