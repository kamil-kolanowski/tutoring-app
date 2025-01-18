import React, { useState } from 'react';
import { Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import styles from './RegisterTeacher.module.scss';
import { validate } from '../../functions/validate';
import { db } from '../../functions/db';
import bcrypt from 'bcryptjs';

export default function RegisterTeacher() {
  const [registerData, setRegisterData] = useState({
    firstName: '',
    secondName: '',
    email: '',
    password: '',
    checkPassword: '',
    hourlyRate: '',
    subjects: '',
  });

  const [errMsgs, setErrMsgs] = useState({
    firstName: '',
    secondName: '',
    email: '',
    password: '',
    checkPassword: '',
    hourlyRate: '',
    subjects: '',
  });

  const handleRegister = async () => {
    const validationResult = validate(registerData);
    setErrMsgs(validationResult.errMsgs);

    if (validationResult.err) {
      console.log('Błędne dane');
      return;
    }

    const hashedPassword = bcrypt.hashSync(registerData.password, 10);

    try {
      await db.teachers.add({
        email: registerData.email,
        password: hashedPassword,
        firstName: registerData.firstName,
        secondName: registerData.secondName,
        hourlyRate: parseFloat(registerData.hourlyRate), 
        subjects: registerData.subjects.split(','),
      });
      console.log('Udało się dodać korepetytora');
      window.location.reload();
    } catch (error) {
      console.log('Błąd podczas rejestracji:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Typography variant="h4" gutterBottom>Rejestracja Korepetytora</Typography>
      <form className={styles.formElement}>
        <div className={styles.labelInputBox}>
          <TextField
            variant="outlined"
            fullWidth
            error={Boolean(errMsgs.firstName)}
            label="Imię"
            helperText={errMsgs.firstName}
            onChange={(ev) => setRegisterData({ ...registerData, firstName: ev.target.value })}
          />
        </div>
        <div className={styles.labelInputBox}>
          <TextField
            variant="outlined"
            fullWidth
            error={Boolean(errMsgs.secondName)}
            label="Nazwisko"
            helperText={errMsgs.secondName}
            onChange={(ev) => setRegisterData({ ...registerData, secondName: ev.target.value })}
          />
        </div>
        <div className={styles.labelInputBox}>
          <TextField
            variant="outlined"
            fullWidth
            error={Boolean(errMsgs.email)}
            label="E-mail"
            helperText={errMsgs.email}
            onChange={(ev) => setRegisterData({ ...registerData, email: ev.target.value })}
          />
        </div>
        <div className={styles.labelInputBox}>
          <TextField
            variant="outlined"
            fullWidth
            error={Boolean(errMsgs.password)}
            label="Hasło"
            helperText={errMsgs.password}
            type="password"
            onChange={(ev) => setRegisterData({ ...registerData, password: ev.target.value })}
          />
        </div>
        <div className={styles.labelInputBox}>
          <TextField
            variant="outlined"
            fullWidth
            error={Boolean(errMsgs.checkPassword)}
            label="Powtórz hasło"
            helperText={errMsgs.checkPassword}
            type="password"
            onChange={(ev) => setRegisterData({ ...registerData, checkPassword: ev.target.value })}
          />
        </div>
        <div className={styles.labelInputBox}>
          <TextField
            variant="outlined"
            fullWidth
            error={Boolean(errMsgs.hourlyRate)}
            label="Stawka godzinowa (PLN)"
            helperText={errMsgs.hourlyRate}
            onChange={(ev) => setRegisterData({ ...registerData, hourlyRate: ev.target.value })}
          />
        </div>
        <div className={styles.labelInputBox}>
          <TextField
            variant="outlined"
            fullWidth
            error={Boolean(errMsgs.subjects)}
            label="Przedmioty (oddzielone przecinkami)"
            helperText={errMsgs.subjects}
            onChange={(ev) => setRegisterData({ ...registerData, subjects: ev.target.value })}
          />
        </div>
        <Button variant="contained" onClick={handleRegister}>Zarejestruj</Button>
      </form>
    </div>
  );
}
