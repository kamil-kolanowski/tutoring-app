import React, { useState, useEffect } from 'react';
import { db } from '../../functions/db'; // Import bazy danych Dexie
import { Typography, CircularProgress } from '@mui/material';
import styles from './AllReviews.module.scss'

export default function AllReviews() {
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
            averageRating: isNaN(averageRating) ? 0 : averageRating.toFixed(1) + ' (' +reviews.length+ ')'
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
            <Typography variant="h4"  sx={{ width: '100%', textAlign: 'center' }} gutterBottom>Średnie oceny nauczycieli</Typography>
            {teachers.length === 0 ? (
                <Typography variant="h6">Brak nauczycieli </Typography>
            ) : (
                <table className={styles.reviewsTable}>
                <thead>
                    <tr>
                    <th>Imię i nazwisko</th>
                    <th>Średnia ocena (ilość ocen)</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.map((teacher) => (
                    <tr className={styles.reviewsTableRow} key={teacher.teacherId}>
                        <td>{teacher.firstName} {teacher.secondName}</td>
                        <td>{teacher.averageRating || 'Brak ocen'}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
        </div>
    </div>
  );
}
