import React, {useState } from 'react'
import { Button, Alert } from '@mui/material';
import {db} from "../../db"
import { useNavigate } from 'react-router';
import { setCookie } from "../../cookies";


export default function Login() {

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("")
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const userFetchedData = await db.students.where({ email: email }).toArray();

    if (userFetchedData.length === 0) {
      setErrorMessage("Brak uzytkownika o podanym emailu.")
      return;
    }

    const userPassword = userFetchedData[0].password

    if (userPassword !== password) {
      setErrorMessage("Podano błędne hasło")
    } else {
      setCookie("userData", JSON.stringify(userFetchedData[0]), 7);
      setErrorMessage("")
      navigate('/')
    }
  }
  return (
    <div>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <form>
      <input onChange={(ev) => setEmail(ev.target.value)} placeholder='E-mail'/>
      <input type="password" onChange={(ev) => setPassword(ev.target.value)} placeholder='Hasło'/>
      <Button variant="contained" onClick={handleLogin}>Zaloguj</Button>
      </form>
    </div>
  )
}
