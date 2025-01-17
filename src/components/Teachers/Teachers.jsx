import React, {useState, useEffect} from 'react'
import styles from './Teachers.module.scss'
import { Typography, Avatar } from '@mui/material';
import { getTeachers } from '../../functions/dbQueries';



export default function Teachers() {
  const [teachers, setTeachers] = useState([])

  useEffect(() => {
      const fetchTeachers = async () => {
        try {
          const teachers = await getTeachers();
          setTeachers(teachers);
        } catch (error) {
          console.error("Błąd podczas pobierania korepetytorów:", error);
        }
      };
  
      fetchTeachers();
    },[]);

  console.log(teachers)


  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Typography variant="h4" gutterBottom>Korepetytorzy</Typography>
        <div className={styles.teachersBox}>
          {teachers.map((teacher, id) => {
            return <div key={id} className={styles.teacherBox}> 
              <Avatar alt={`${teacher.firstName} ${teacher.secondName}`} src="./images/avatar.jpg" sx={{ width: 124, height: 124, marginBottom: '20px' }} />
              <Typography variant="h6">{`${teacher.firstName} ${teacher.secondName}`} </Typography>
              {/* <p>Przedmioty:</p> */}
              {teacher.subjects.map(subject => {
                return <p key={subject} className={styles.subjectText} >{subject}</p>
              })}
            </div>
          })}
        </div>
      </div>
    </div>
    
  )
}
