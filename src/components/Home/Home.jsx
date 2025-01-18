import React, { useState, useEffect } from 'react';
import { getCookie } from './../../functions/cookies';
import styles from './Home.module.scss';
import { Button, Typography, InputLabel, FormControl, Select, MenuItem } from '@mui/material';
import { getDate, convertToDate } from '../../functions/date';
import { getLessonsByStudentId, getSubjects, getAvailableLessonsBySubject, lessonSignUp, findTeacherById, getLessonsByTeacherId, findStudentById } from '../../functions/dbQueries';
import { delay } from '../../functions/delay';

export default function Home() {
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState(JSON.parse(getCookie("userData")));
  const [userType, setUserType] = useState(getCookie("userType"));

  const [currentDate, setCurrentDate] = useState(getDate());
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [teacherUpcomingLessons, setTeacherUpcomingLessons] = useState([]);

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');

  const [searchedLessons, setSearchedLessons] = useState([]);
  const [lessonSignUpResult, setLessonSignUpResult] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(getDate());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!userData || !userType) return;

    const fetchLessons = async () => {
      if (userType === "parent" || userType === "student") {
        try {
          const lessons = await getLessonsByStudentId(userData.studentId);
          const lessonsWithTeachers = await Promise.all(
            lessons.map(async (lesson) => {
              const teacher = await findTeacherById(lesson.teacherId);
              return { ...lesson, teacher: teacher };
            })
          );
          const sortedLessons = lessonsWithTeachers.sort((a, b) => {
            return convertToDate(a.lessonDate) - convertToDate(b.lessonDate);
          });

          setUpcomingLessons(sortedLessons);

        } catch (error) {
          console.error("Błąd podczas pobierania lekcji:", error);
        } finally {
          setLoading(false);
        }
      } else if (userType === "teacher") {
        try {
          const lessons = await getLessonsByTeacherId(userData.teacherId);
          const lessonsWithStudents = await Promise.all(
            lessons.map(async (lesson) => {
              if (lesson.studentId == null) {
                return { ...lesson, student: { firstName: "Brak", secondName: "" } };
              }
              const student = await findStudentById(lesson.studentId);
              return { ...lesson, student: student };
            })
          );
          const sortedTeacherLessons = lessonsWithStudents.sort((a, b) => {
            return convertToDate(a.lessonDate) - convertToDate(b.lessonDate);
          });

          setTeacherUpcomingLessons(sortedTeacherLessons);
        } catch (error) {
          console.error("Błąd podczas pobierania lekcji nauczyciela:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLessons();

    const fetchSubjects = async () => {
      try {
        const subjects = await getSubjects();
        setSubjects(subjects);
      } catch (error) {
        console.error("Błąd podczas pobierania przedmiotów:", error);
      }
    };

    fetchSubjects();

  }, [userData, userType]); 

  const handleSearchLessons = async () => {
    if (selectedSubject === '') return;
    try {
      const freeLessons = await getAvailableLessonsBySubject(selectedSubject);
      const lessonsWithTeachers = await Promise.all(
        freeLessons.map(async (lesson) => {
          const teacher = await findTeacherById(lesson.teacherId);
          return {
            ...lesson,
            teacherName: teacher ? `${teacher.firstName} ${teacher.secondName}` : "Nie znaleziono nauczyciela",
          };
        })
      );

      setSearchedLessons(lessonsWithTeachers);
    } catch (error) {
      console.error("Błąd podczas pobierania wolnych lekcji:", error);
    }
  };

  const handleLessonSignUp = async (lessonId) => {
    try {
      const result = await lessonSignUp(userData.studentId, lessonId);
      console.log(result);
      setLessonSignUpResult(result);
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
        <div className={styles.greetingBox}>
          <Typography variant="h3" gutterBottom>Dzień dobry, {userData.firstName}</Typography>
          <Typography variant="h4" gutterBottom>Dzisiaj jest {currentDate}</Typography>
        </div>

        {(userType === "parent" || userType === "student") && 
        <div className={styles.upcomingLessonsBox}>
         <Typography variant="h4" gutterBottom>Najbliższe zajęcia:</Typography>
         {upcomingLessons.length === 0 ? <Typography variant="h5">Brak</Typography> : <>
          {loading ? (
            <p>Ładowanie zajęć...</p>
            ) : (
              <table className={styles.upcomingLessons}>
                <thead><tr><th>Data</th><th>Godzina</th><th>Przedmiot</th><th>Nauczyciel</th></tr></thead>
                {upcomingLessons.slice(0, 3).map((lesson, id) => {
                  return (
                    <tbody key={id}>
                      <tr className={styles.lessonRow}>
                        <td>{lesson.lessonDate}</td>
                        <td>{lesson.lessonTime}</td>
                        <td>{lesson.subject}</td>
                        <td>{lesson.teacher.firstName + ' ' + lesson.teacher.secondName}</td>
                      </tr>
                    </tbody>
                  );
                })}
              </table>
            )}
            </>
          }
        </div>}

        {userType === "teacher" && 
          <div className={styles.upcomingLessonsBox}>
            <Typography variant="h4" gutterBottom>Twoje nadchodzące lekcje:</Typography>
            {teacherUpcomingLessons.length === 0 ? <Typography variant="h5">Brak</Typography> : <>
              {loading ? (
                <p>Ładowanie zajęć...</p>
              ) : (
                <table className={styles.upcomingLessons}>
                  <thead><tr><th>Data</th><th>Godzina</th><th>Przedmiot</th><th>Uczeń</th></tr></thead>
                  {teacherUpcomingLessons.slice(0, 3).map((lesson, id) => {
                    return (
                      <tbody key={id}>
                        <tr className={styles.lessonRow}>
                          <td>{lesson.lessonDate}</td>
                          <td>{lesson.lessonTime}</td>
                          <td>{lesson.subject}</td>
                          <td>{lesson.student.firstName != undefined ? `${lesson.student.firstName} ${lesson.student.secondName}` : "Brak"}</td>
                        </tr>
                      </tbody>
                    );
                  })}
                </table>
              )}
            </>
            }
          </div>
        }

        {(userType === "parent" || (userType === "student" && userData.isAdult === true)) && 
          <>
            <div className={styles.searchLessonBox}>
              <Typography variant="h4" gutterBottom>Wyszukaj zajęcia:</Typography>
              <div className={styles.searchInputs}>
                <FormControl fullWidth>
                  <InputLabel>Przedmiot</InputLabel>
                  <Select
                    value={selectedSubject}
                    label="Przedmiot"
                    onChange={(ev) => setSelectedSubject(ev.target.value)}
                  >
                    {subjects.map(subject => {
                      return <MenuItem key={subject} value={subject}> {subject}</MenuItem>
                    })}
                  </Select>
                </FormControl>
                <Button variant="outlined" color="gray" onClick={handleSearchLessons}>Szukaj</Button>
              </div>
              <Typography color={'green'} variant="h5" gutterBottom>{lessonSignUpResult}</Typography>
              {(searchedLessons.length > 0 && !loading) && 
                <div className={styles.searchedLessons}>
                  <table className={styles.searchedLessons}>
                    <thead><tr><th>Data</th><th>Godzina</th><th>Nauczyciel</th></tr></thead>
                    {searchedLessons.map((lesson, id) => {
                      return (
                        <tbody key={id}>
                          <tr className={styles.lessonRow}>
                            <td>{lesson.lessonDate}</td>
                            <td>{lesson.lessonTime}</td>
                            <td>{lesson.teacherName}</td>
                            <td><Button onClick={() => handleLessonSignUp(lesson.lessonId)} variant="outlined" color="gray">Zapisz się</Button></td>
                          </tr>
                        </tbody>
                      );
                    })}
                  </table>
                </div>
              }
            </div>
          </>
        }

      </div>
    </div>
  );
}
