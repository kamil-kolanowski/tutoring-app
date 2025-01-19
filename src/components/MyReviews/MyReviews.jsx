import React, { useState, useEffect } from 'react';
import { getCookie } from './../../functions/cookies';
import { getTeacherReviews } from '../../functions/dbQueries'; 
import { Rating, Typography, Box } from '@mui/material';
import styles from './MyReviews.module.scss';

export default function MyReviews() {
  const userData = JSON.parse(getCookie("userData"));
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const fetchedReviews = await getTeacherReviews(userData.teacherId); 
        setReviews(fetchedReviews);

        const totalStars = fetchedReviews.reduce((acc, review) => acc + Number(review.stars), 0);
        const average = totalStars / fetchedReviews.length;
        setAverageRating(average);
      } catch (error) {
        console.error("Błąd podczas pobierania ocen:", error);
      }
    };

    fetchReviews();
  }, [userData.teacherId]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Typography variant="h4" gutterBottom  sx={{ width: '100%', textAlign: 'center' }}>Moje oceny</Typography>

        {reviews.length === 0 ? (
          <Typography variant="h5">Brak ocen</Typography>
        ) : (
          reviews.map((review) => (
            <Box key={review.reviewId} className={styles.review}>
              <Rating name="read-only" value={review.stars} readOnly />
              {review.comment ? <Typography variant="body1">{review.comment}</Typography> : <Typography  style={{ fontStyle: 'italic', color: 'gray' }} variant="body1">Brak komentarza</Typography>}
            </Box>
          ))
        )}

        {reviews.length > 0 && (
          <Box className={styles.averageRating}>
            <Typography variant="h5" gutterBottom>Średnia ocena: {averageRating.toFixed(1)}</Typography>
            <Rating name="read-only" value={averageRating} readOnly precision={0.1} />
          </Box>
        )}
      </div>
    </div>
  );
}
