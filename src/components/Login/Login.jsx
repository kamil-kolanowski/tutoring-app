import React, {useState, useEffect } from 'react'
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

  const handleEmailChange = (email) => {
    setEmail(email)
    const newErrMsgs = { email: "", password: "" };
    setErrMsgs(newErrMsgs);
  }
  const handlePasswordChange = (password) => {
    setPassword(password)
    const newErrMsgs = { email: "", password: "" };
    setErrMsgs(newErrMsgs);
  }
  

  const handleLogin = async () => {
    const studentFetchedData = await db.students.where({ email: email }).toArray();
    const parentFetchedData = await db.parents.where({ email: email }).toArray();
    const teacherFetchedData = await db.teachers.where({ email: email }).toArray();
    let userFetchedData;
    let userType;

    if (studentFetchedData.length !== 0) {
      userFetchedData = studentFetchedData;
      userType = "student"
    } else if (parentFetchedData.length !== 0) {
      userFetchedData = parentFetchedData;
      userType = "parent"
    } else if (teacherFetchedData.length !== 0) {
      userFetchedData = teacherFetchedData;
      userType = "teacher"
    } else {
      userFetchedData = "";
    }

    if (userFetchedData === "") {
      const newErrMsgs = { password: "", email: "Brak użytkownika o podanym mailu" };
      setErrMsgs(newErrMsgs);
      return;
    }
    
    const userPassword = userFetchedData[0].password
    if (userPassword !== password) {
      setErrMsgs({...errMsgs, password: "Podano błędne hasło"})
    } else {
      setErrMsgs({ email: "", password: ""})
      setCookie("userData", JSON.stringify(userFetchedData[0]), 7);
      setCookie("userType", userType, 7);
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
          onChange={(ev) => handleEmailChange(ev.target.value)}
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
          onChange={(ev) => handlePasswordChange(ev.target.value)}
        />
        </div>
        <Button variant="contained" onClick={handleLogin}>Zaloguj</Button>
      </form>
    </div>
  )
}
