import React, { useState, useEffect } from 'react';
import styles from './Teachers.module.scss';
import { Typography, Avatar, Rating } from '@mui/material';
import { db } from '../../functions/db';

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchTeachersRatings = async () => {
        try {
          const teachersList = await db.teachers.toArray(); 
          const teachersWithRatings = await Promise.all(teachersList.map(async (teacher) => {
            const reviews = await db.reviews.where('teacherId').equals(teacher.teacherId).toArray();
            const averageRating = reviews.reduce((sum, review) => sum + Number(review.stars), 0) / reviews.length;
            
            return {
              ...teacher,
              averageRating: isNaN(averageRating) ? 0 : averageRating
            };
          }));
  
          setTeachers(teachersWithRatings);
        } catch (error) {
          console.error("Błąd podczas pobierania nauczycieli i ocen:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchTeachersRatings();
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
                  <Rating name="read-only" value={teacher.averageRating ? teacher.averageRating : 0} readOnly precision={0.1} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
