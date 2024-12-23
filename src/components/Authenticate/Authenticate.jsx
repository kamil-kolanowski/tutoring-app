import React, {useState} from 'react'
import Login from '../Login/Login'
import Register from '../Register/Register'
import { Button } from '@mui/material'
import styles from './Authenticate.module.scss'

export default function Authenticate() {
    const [register, setRegister] = useState(false)

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
