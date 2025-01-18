import React, {useState, useEffect} from 'react'
import Login from '../Login/Login'
import Register from '../Register/Register'
import { Button } from '@mui/material'
import styles from './Authenticate.module.scss'
import { useNavigate } from "react-router";
import { getCookie } from './../../functions/cookies';
import AdminLogin from '../AdminLogin/AdminLogin'

export default function Authenticate() {
    const [register, setRegister] = useState(false)
    const [adminLogin, setAdminLogin] = useState(false)
    const navigate = useNavigate();


    useEffect(() => {
      if (getCookie("userData")) {
        navigate('/')
      }
    }, [navigate])

    const handleAdminLogin = (isAdminLogin) => {
      setAdminLogin(isAdminLogin)
    }

    if (adminLogin) {
      return (
        <div className={styles.componentWrapper}>
          <AdminLogin />
          <Button onClick={() => handleAdminLogin(false)}>Logowanie uzytkownika</Button>
        </div>
      )
    }

    if (!register) {
        return (
        <div className={styles.componentWrapper}>
            <Login />
            <Button onClick={() => setRegister(true)}>Nie masz konta? Zarejestruj się...</Button>
            <Button onClick={() => handleAdminLogin(true)}>Logowanie administratora</Button>
        </div>
    )}
  return (
    <div className={styles.componentWrapper}>
        <Register />
        <Button onClick={() => setRegister(false)}>Masz konto? Zaloguj się...</Button>
    </div>
  )
}
