import React, {useState, useEffect} from 'react'
import { deleteCookie, getCookie } from './../../functions/cookies';
import styles from './MyProfile.module.scss'
import { Typography, Button  } from '@mui/material';
import { getStudentNameById } from '../../functions/dbQueries';
import { useNavigate } from 'react-router';

export default function MyProfile() {

  const [studentName, setStudentName] = useState('')

  const userData = JSON.parse(getCookie("userData"));
  const userType = getCookie("userType");

  const navigate = useNavigate();

  const getRoleByUserType = () => {
    if (userType == 'parent') {
      return "Rodzic";
    } else if (userType == 'student') {
      if (userData.isAdult == true) {
        return "Dorosły uczeń";
      } else {
        return "Niepełnoletni uczeń"
      }
    } else if (userType == 'teacher') {
      return "Korepetytor"
    } else {
      return "Firma korepetytorska"
    }
  }

  const handleLogout = () => {
    deleteCookie("userData");
    deleteCookie("userType")
    navigate('/authentication')
  }

  useEffect(() => {
    if(userType == 'parent') {
     
      const fetchStudents = async () => {
        try {
          const studentNameFetched = await getStudentNameById(userData.studentId);
          setStudentName(studentNameFetched.firstName + ' ' + studentNameFetched.secondName);
        } catch (error) {
          console.error('Błąd podczas pobierania imienia dziecka:', error);
        }
      };
      fetchStudents();
     
    }
    }, [userData.studentId]);

  return (
    
    <div className={styles.container}>
      <div className={styles.content}>
        <Typography variant="h4" gutterBottom>Mój profil</Typography>
        <div className={styles.userInfo}>
          <Typography variant="h5" >Imię i nazwisko:</Typography>
          <p>{userData.firstName + ' ' + userData.secondName}</p>
          <Typography variant="h5" >Adres e-mail:</Typography>
          <p>{userData.email}</p>
          <Typography variant="h5" >Rola:</Typography>
          <p>{getRoleByUserType()}</p>
          {userType == 'parent' && (
            <>
              <Typography variant="h5" >Imię i nazwisko dziecka:</Typography>
              <p>{studentName}</p>
            </>
          )}
          {(userType == 'student' && userData.isAdult == false) && (
            <>
              <Typography variant="h5" >Kod dziecka (do połączenia konta rodzica):</Typography>
              <p>{userData.childCode}</p>
            </>
          )}
          <Button className={styles.logoutButton} variant='outlined' color="gray" onClick={handleLogout}>Wyloguj się</Button>
        </div>
      </div>
    </div>
  )
}
