import React, { useState, useEffect } from 'react';
import styles from './Teachers.module.scss';
import { Typography, Avatar } from '@mui/material';
import { getTeachers } from '../../functions/dbQueries';

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teachersData = await getTeachers();
        setTeachers(teachersData);
      } catch (error) {
        console.error("Błąd podczas pobierania korepetytorów:", error);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Typography variant="h4" gutterBottom>Korepetytorzy</Typography>
        {teachers.length === 0 ? (
          <Typography variant="h5">Brak</Typography>
        ) : (
          <div className={styles.teachersBox}>
            {teachers.map((teacher, id) => {
              const teacherImage = teacher.image ? URL.createObjectURL(teacher.image) : './images/avatar.jpg';

              return (
                <div key={id} className={styles.teacherBox}>
                  <Avatar
                    alt={`${teacher.firstName} ${teacher.secondName}`}
                    src={teacherImage}
                    sx={{ width: 124, height: 124, marginBottom: '20px' }}
                  />
                  <Typography variant="h6">{`${teacher.firstName} ${teacher.secondName}`} </Typography>
                  {teacher.subjects.map((subject) => {
                    return (
                      <p key={subject} className={styles.subjectText}>
                        {subject}
                      </p>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
