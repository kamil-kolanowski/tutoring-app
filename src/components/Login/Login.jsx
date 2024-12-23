import React, {useState } from 'react'
import { Button, TextField, Typography, InputLabel } from '@mui/material';
import {db} from "../../functions/db"
import { useNavigate } from 'react-router';
import { setCookie } from "../../functions/cookies";
import styles from './Login.module.scss'


export default function Login() {

  const navigate = useNavigate();

  const [errMsgs, setErrMsgs] = useState({email: "", password: ""})
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const userFetchedData = await db.students.where({ email: email }).toArray();
    if (userFetchedData.length === 0) {
      setErrMsgs({...errMsgs, email: "Brak uzytkownika o podanym mailu"})
      return;
    } 

    const userPassword = userFetchedData[0].password
    if (userPassword !== password) {
      setErrMsgs({...errMsgs, password: "Podano błędne hasło"})
    } else {
      setErrMsgs({ email: "", password: ""})
      setCookie("userData", JSON.stringify(userFetchedData[0]), 7);
      navigate('/')
    }
  }

  
  return (
    <div className={styles.container}>
      <Typography variant="h4" gutterBottom>Logowanie</Typography>
      {/* {errorMessage && <Alert severity="error">{errorMessage}</Alert>} */}
      <form className={styles.formElement}>
        <div className={styles.labelInputBox}>
        <TextField
          variant="outlined"
          fullWidth
          error={errMsgs.email}
          label="E-mail"
          helperText={errMsgs.email}
          onChange={(ev) => setEmail(ev.target.value)}
        />
        </div>
        <div className={styles.labelInputBox}>
        <TextField
          type="password"
          variant="outlined"
          fullWidth
          error={errMsgs.password}
          label="Hasło"
          helperText={errMsgs.password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        </div>
        <Button variant="contained" onClick={handleLogin}>Zaloguj</Button>
      </form>
    </div>
  )
}
