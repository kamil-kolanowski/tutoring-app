import React, { useState, useEffect } from 'react';
import styles from './MyLessons.module.scss';
import { Typography, Button } from '@mui/material';
import { getCookie } from './../../functions/cookies';
import { getLessonsByStudentId, getLessonsByTeacherId, lessonCancel, findTeacherById, findStudentById } from '../../functions/dbQueries'; // Importujemy getLessonsByTeacherId
import { formatDate } from '../../functions/date';
import { delay } from '../../functions/delay';

export default function MyLessons() {
  const userData = JSON.parse(getCookie("userData"));
  const userType = getCookie("userType"); 

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lessonCancelResult, setLessonCancelResult] = useState(null);

  useEffect(() => {
    if (!userData || !userType) {
      return;
    }
    const fetchLessons = async () => {
      try {
        if (userType === "student" || userType === "parent") { 
          const lessonsData = await getLessonsByStudentId(userData.studentId);

          const lessonsWithTeachers = await Promise.all(
            lessonsData.map(async (lesson) => {

              const teacher = await findTeacherById(lesson.teacherId);
              return { ...lesson, teacher };
            })
          );

          setLessons(lessonsWithTeachers);

        } else if (userType === "teacher") { 
          const lessonsData = await getLessonsByTeacherId(userData.teacherId);

          const lessonsWithStudents = await Promise.all(
            lessonsData.map(async (lesson) => {
              if (lesson.studentId == null) {
                return { ...lesson, student: { firstName: "Brak", secondName: "" } };
              }
              const student = await findStudentById(lesson.studentId);
              return { ...lesson, student };
            })
          );

          setLessons(lessonsWithStudents);
        }
      } catch (error) {
        console.error("Błąd podczas pobierania lekcji:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();

  }, [userData.studentId, userData.teacherId, userType]);

  const handleLessonCancel = async (lessonId) => {
    try {
      const result = await lessonCancel(lessonId);
      console.log(result);
      setLessonCancelResult(result);
      setLoading(true);
      await delay(5000);
      window.location.reload();
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

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
                  <th>Przedmiot</th>
                  <th>{userType === "teacher" ? "Uczeń" : "Nauczyciel"}</th>
                  <th>Data</th>
                  <th>Godzina</th>
                  <th>Cena</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr key={lesson.lessonId}>
                    <td>{lesson.subject}</td>
                    <td>
                      {(userType === "student" || userType==="parent") ? 
                        (lesson.teacher.firstName != undefined) ? `${lesson.teacher.firstName} ${lesson.teacher.secondName}` : "Nie znaleziono nauczyciela" : 
                        (lesson.student.firstName != undefined) ? `${lesson.student.firstName} ${lesson.student.secondName}` : "Brak"
                      }
                    </td>
                    <td>{formatDate(lesson.lessonDate)}</td>
                    <td>{lesson.lessonTime}</td>
                    <td>{lesson.price} zł</td>
                    <td>{lesson.status}</td>
                    {((userType == "student" && userData.isAdult) || userType=="parent") && 
                      <td><Button onClick={() => handleLessonCancel(lesson.lessonId)} variant="outlined" color="red">Anuluj zajęcia</Button></td>
                    }
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
