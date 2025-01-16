import React, {useState, useEffect} from 'react'
import { getCookie } from './../../functions/cookies';
import styles from './Home.module.scss';
import { Button, Typography, InputLabel, FormControl, Select, MenuItem } from '@mui/material';
import { getDate } from '../../functions/date';
import { getLessonsByStudentId, getSubjects, getAvailableLessonsBySubject, lessonSignUp } from '../../functions/dbQueries';
import { delay } from '../../functions/delay';


export default function Home() {
  const userData = JSON.parse(getCookie("userData"));
  // const userType = getCookie("userType");

  const [currentDate, setCurrentDate] = useState(getDate());
  const [upcomingLessons, setUpcomingLessons] = useState([]);

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');

  const [searchedLessons, setSearchedLessons] = useState([]);

  const [lessonSignUpResult, setLessonSignUpResult] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(getDate());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const lessons = await getLessonsByStudentId(userData.studentId);
        setUpcomingLessons(lessons);
      } catch (error) {
        console.error("Błąd podczas pobierania lekcji:", error);
      }
    };

    fetchLessons();

    const fetchSubjects = async () => {
      try {
        const subjects = await getSubjects();
        setSubjects(subjects); // Ustaw pobrane dane w stanie
      } catch (error) {
        console.error("Błąd podczas pobierania przedmiotów:", error);
      }
    };

    fetchSubjects(); 

    
  },[userData.studentId]); 

  const handleSearchLessons = async () => {
      if (selectedSubject === '') return
      try {
        const freeLessons = await getAvailableLessonsBySubject(selectedSubject);
        setSearchedLessons(freeLessons);
      } catch (error) {
        console.error("Błąd podczas pobierania wolnych lekcji:", error);
      }
  }

  const handleLessonSignUp = async (lessonId) => {
    try {
      const result = await lessonSignUp(userData.studentId, lessonId);
      console.log(result);
      setLessonSignUpResult(result)
      await delay(5000);
      window.location.reload();
  } catch (error) {
      console.error("Błąd:", error);
  }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.greetingBox}>
          <Typography variant="h3" gutterBottom>Dzień dobry, {userData.firstName}</Typography>
          <Typography variant="h4" gutterBottom>Dzisiaj jest {currentDate}</Typography>
        </div>
        <div className={styles.upcomingLessonsBox}>
         <Typography variant="h4" gutterBottom>Najblisze zajęcia:{upcomingLessons.length == 0 ? ' brak' : ''}</Typography>
         <table className={styles.upcomingLessons}>
         <thead><tr><th>Data</th><th>Godzina</th><th>Przedmiot</th></tr></thead>

         {upcomingLessons.slice(0, 3).map((lesson, id) => {
          return (<tbody key={id}><tr className={styles.lessonRow}><td>{lesson.lessonDate}</td><td>{lesson.lessonTime}</td><td>{lesson.subject}</td></tr></tbody>)
         })}
         </table>
        </div>
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
          {searchedLessons.length > 0 && 
            <div className={styles.searchedLessons}>
              <table className={styles.searchedLessons}>
              <thead><tr><th>Data</th><th>Godzina</th><th>Nauczyciel</th></tr><tr></tr></thead>

              {searchedLessons.map((lesson, id) => {
                return (<tbody key={id}><tr className={styles.lessonRow}><td>{lesson.lessonDate}</td><td>{lesson.lessonTime}</td><td>{lesson.teacherId}</td><td><Button onClick={() => handleLessonSignUp(lesson.lessonId)} variant="outlined" color="gray">Zapisz się</Button></td></tr></tbody>)
              })}
            </table>
            </div>
          }
        </div>
        
      </div>
    </div>
  )
}
