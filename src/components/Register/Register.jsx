import React, {useState} from 'react';
import { Typography, Button, FormControl, InputLabel, Select, MenuItem , TextField} from '@mui/material';
import styles from "./Register.module.scss";
import { validate} from '../../functions/validate';
import {db} from "../../functions/db";
import { useNavigate } from 'react-router';
import { setCookie } from "../../functions/cookies";
import { generateString } from '../../functions/stringGenerator';
import bcrypt from 'bcryptjs';

export default function Register() {

  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    firstName: '',
    secondName: '',
    email: '',
    password: '',
    checkPassword: '',    
  })

  const [errMsgs, setErrMsgs] = useState({
    firstName: '',
    secondName: '',
    email: '',
    password: '',
    checkPassword: '',    
  })
  const [userType, setUserType] = useState("adultStudent")

  const [childCode, setChildCode] = useState("")

  const [childCodeError, setChildCodeError] = useState(false)

  const handleRegister = async () => {
    let fnErrMsgs = validate(registerData)
    setErrMsgs(validate(registerData).errMsgs)
    const hashedPassword = bcrypt.hashSync(registerData.password, 10)
    
    if (!fnErrMsgs.err) {
      if (userType === "parent") {
        const childData = await db.students.where({ childCode: childCode }).toArray();
            if (childData.length !== 1) {
              setChildCodeError(true);
              return;
            } else {
              let childId = childData[0].studentId
              try {
                db.parents.add({
                  email: registerData.email,
                  password: hashedPassword,
                  firstName: registerData.firstName, 
                  secondName: registerData.secondName,
                  studentId: childId
                })
              } catch (e) {
                console.log(e)
              }
            }
            
      }
      else {
        try {
          db.students.add({
            email: registerData.email,
            password: hashedPassword,
            firstName: registerData.firstName, 
            secondName: registerData.secondName,
            isAdult: userType === "minorStudent" ? false : true,
            childCode: userType === "minorStudent" ? generateString(10) : ''
          })
          console.log('Udalo sie dodac');
        }
        catch (e){
          console.log(e);
          return;
        }
      }
    } else {
      console.log('bledne dane')
      return;
    }
      let cookieUserType;
      if (userType == "parent") {
        cookieUserType = "parent"
      } else {
        cookieUserType = "student"
      }
      // setCookie("userData", JSON.stringify({...registerData, password: hashedPassword, checkPassword: hashedPassword}), 7);
      // setCookie("userType", cookieUserType, 7);
      // navigate('/')
      window.location.reload();
  }
  
  console.log(userType, userType === "minorStudent" ? false : true)

  return (
    <div className={styles.container}>
      <Typography variant="h4" gutterBottom>Rejestracja</Typography>
      <form className={styles.formElement}>
        <div className={styles.labelInputBox}>
          <TextField
            variant="outlined"
            fullWidth
            error={errMsgs.firstName}
            label="Imię"
            helperText={errMsgs.firstName}
            onChange={(ev) => setRegisterData({...registerData, firstName: ev.target.value})}
          />
        </div>
        <div className={styles.labelInputBox}>
          <TextField
            variant="outlined"
            fullWidth
            error={errMsgs.secondName}
            label="Nazwisko"
            helperText={errMsgs.secondName}
            onChange={(ev) => setRegisterData({...registerData, secondName: ev.target.value})}
          />
        </div>
        <div className={styles.labelInputBox}>
          <TextField
            variant="outlined"
            fullWidth
            error={errMsgs.email}
            label="E-mail"
            helperText={errMsgs.email}
            onChange={(ev) => setRegisterData({...registerData, email: ev.target.value})}
          />
        </div>
        <div className={styles.labelInputBox}>
          <TextField
            variant="outlined"
            fullWidth
            error={errMsgs.password}
            label="Hasło"
            helperText={errMsgs.password}
            type="password"
            onChange={(ev) => setRegisterData({...registerData, password: ev.target.value})}
          />
        </div>
        <div className={styles.labelInputBox}>
          <TextField
            variant="outlined"
            fullWidth
            error={errMsgs.checkPassword}
            label="Powtórz hasło"
            helperText={errMsgs.checkPassword}
            type="password"
            onChange={(ev) => setRegisterData({...registerData, checkPassword: ev.target.value})}
          />
        </div>
        <FormControl fullWidth>
          <InputLabel>Rola</InputLabel>
          <Select
            value={userType || ''}
            label="Rola"
            onChange={(ev) => setUserType(ev.target.value)}
          >
            <MenuItem value={'minorStudent'}>Niepełnoletni uczeń</MenuItem>
            <MenuItem value={'adultStudent'}>Pełnoletni uczeń</MenuItem>
            <MenuItem value={'parent'}>Rodzic niepełnoletniego ucznia</MenuItem>
          </Select>
        </FormControl>
        {userType === "parent" && <div className={styles.labelInputBox}>
          <TextField
            variant="outlined"
            fullWidth
            error={childCodeError}
            label="Kod dziecka"
            helperText={childCodeError && "Błędny kod dziecka"}
            onChange={(ev) => setChildCode(ev.target.value)}
          />
        </div>}
        <Button variant="contained" onClick={handleRegister}>Zarejestruj</Button>
      </form>
    </div>
  )
}
