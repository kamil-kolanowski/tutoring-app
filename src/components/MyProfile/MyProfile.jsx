import React, { useState, useEffect } from 'react';
import { deleteCookie, getCookie } from './../../functions/cookies';
import styles from './MyProfile.module.scss';
import { Typography, Button } from '@mui/material';
import { getStudentNameById } from '../../functions/dbQueries';
import { useNavigate } from 'react-router';
import { db } from '../../functions/db';

export default function MyProfile() {
  const [studentName, setStudentName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const userData = JSON.parse(getCookie('userData'));
  const userType = getCookie('userType');
  const navigate = useNavigate();

  const getRoleByUserType = () => {
    if (userType === 'parent') {
      return 'Rodzic';
    } else if (userType === 'student') {
      return userData.isAdult === true ? 'Dorosły uczeń' : 'Niepełnoletni uczeń';
    } else if (userType === 'teacher') {
      return 'Korepetytor';
    } else {
      return 'Firma korepetytorska';
    }
  };

  const handleLogout = () => {
    deleteCookie('userData');
    deleteCookie('userType');
    navigate('/authenticate');
  };

  useEffect(() => {
    if (!userData || !userType) return
    if (userType === 'parent') {
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

    if (userType === "teacher") {
      
      const fetchProfilePicture = async () => {
        try {
          const teacher = await db.teachers.where('teacherId').equals(userData.teacherId).first();
          if (teacher && teacher.image) {
            const imageUrl = URL.createObjectURL(teacher.image);
            setProfilePicture(imageUrl);
          }
        } catch (error) {
          console.error('Błąd podczas ładowania zdjęcia profilowego:', error);
        }
      };

      fetchProfilePicture();

    }
  }, []);

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const blob = new Blob([reader.result], { type: file.type });
        
        try {
          await db.teachers.update(userData.teacherId, { image: blob });
          setProfilePicture(URL.createObjectURL(blob)); 
        } catch (error) {
          console.error('Błąd podczas zapisywania zdjęcia:', error);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Typography variant="h4" gutterBottom>Mój profil</Typography>
        <div className={styles.userInfo}>
          <Typography variant="h5">Imię i nazwisko:</Typography>
          <p>{userData.firstName + ' ' + userData.secondName}</p>
          <Typography variant="h5">Adres e-mail:</Typography>
          <p>{userData.email}</p>
          <Typography variant="h5">Rola:</Typography>
          <p>{getRoleByUserType()}</p>
          {userType === 'parent' && (
            <>
              <Typography variant="h5">Imię i nazwisko dziecka:</Typography>
              <p>{studentName}</p>
            </>
          )}
          {(userType === 'student' && userData.isAdult === false) && (
            <>
              <Typography variant="h5">Kod dziecka (do połączenia konta rodzica):</Typography>
              <p>{userData.childCode}</p>
            </>
          )}
          {userType==="teacher" && 
            <>
              <div className={styles.profilePicture}>
              <Typography variant="h5">Zdjęcie profilowe:</Typography>
                {profilePicture ? (
                  <img src={profilePicture} alt="zzdjecie profilowe" className={styles.profileImage} />
                ) : (
                  <Typography variant="h5">Brak zdjęcia profilowego</Typography>
                )}
              </div>
              <div className={styles.buttons}>
                <Button variant="outlined" color="gray"component="label" className={styles.imageButton}>
                  Zmień zdjęcie
                  <input type="file" hidden onChange={handleProfilePictureChange} />
                </Button>
              </div>
            </>
          }

          <Button className={styles.logoutButton} variant="outlined" color="error" onClick={handleLogout}>Wyloguj się</Button>
              
        </div>
      </div>
    </div>
  );
}
