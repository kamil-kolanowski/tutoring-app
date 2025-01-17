import React, { useState, useEffect } from 'react';
import styles from './MyLessons.module.scss';
import { Typography, Button } from '@mui/material';
import { getCookie } from './../../functions/cookies';
import { getLessonsByStudentId, lessonCancel } from '../../functions/dbQueries';
import { findTeacherById } from '../../functions/findTeacherById';
import { formatDate } from '../../functions/date';
import { delay } from '../../functions/delay';

export default function MyLessons() {
  const userData = JSON.parse(getCookie("userData")); 
  const [lessons, setLessons] = useState([]); 
  const [loading, setLoading] = useState(true); 


  const [lessonCancelResult, setLessonCancelResult] = useState(null)

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const lessonsData = await getLessonsByStudentId(userData.studentId);

        const lessonsWithTeachers = await Promise.all(
          lessonsData.map(async (lesson) => {
            const teacher = await findTeacherById(lesson.teacherId);
            return { ...lesson, teacher }; 
          })
        );

        setLessons(lessonsWithTeachers); 
      } catch (error) {
        console.error("Błąd podczas pobierania lekcji i nauczycieli:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchLessons();
  }, [userData.studentId]);


    const handleLessonCancel = async (lessonId) => {
      try {
        const result = await lessonCancel(lessonId);
        console.log(result);
        setLessonCancelResult(result)
        setLoading(true)
        await delay(5000);
        window.location.reload();
    } catch (error) {
        console.error("Błąd:", error);
    }
    }

  
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Typography variant="h4" gutterBottom>Moje zajęcia</Typography>
        {loading ? (
          <>
            <Typography color={'green'} variant="h5" gutterBottom>{lessonCancelResult}</Typography>
            <p>Ładowanie zajęć...</p>
          </>
        ) : (
          <>
          
          <table className={styles.lessonsTable}>
            <thead>
              <tr>
                <th>Przedmiot</th><th>Nauczyciel</th><th>Data</th><th>Godzina</th><th>Cena</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
          {lessons.map((lesson) => (
              <tr key={lesson.lessonId}>
                <td>{lesson.subject}</td>
                <td>{lesson.teacher ? `${lesson.teacher.firstName} ${lesson.teacher.secondName}` : "Nie znaleziono nauczyciela"}</td>
                <td>{formatDate(lesson.lessonDate)}</td>
                <td>{lesson.lessonTime} </td>
                <td>{lesson.price} zł </td>
                <td>{lesson.status}</td>
                <td><Button onClick={() => handleLessonCancel(lesson.lessonId)} variant="outlined" color="red">Anuluj zajęcia</Button></td>
              </tr>
          ))}
          </tbody>
          </table>
          </>
        )}
      </div>
    </div>
  );
}
