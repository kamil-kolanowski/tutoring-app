import React, { useState, useEffect } from 'react';
import { getCookie } from './../../functions/cookies';
import { getTeachersByStudentId, addOrUpdateReview } from '../../functions/dbQueries';
import styles from './MyTeachers.module.scss';
import { Typography, Avatar, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function MyTeachers() {
  const userData = JSON.parse(getCookie('userData'));
  const userType = getCookie("userType");

  const [teachers, setTeachers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [comment, setComment] = useState(""); // Nowa zmienna do komentarza

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teachers = await getTeachersByStudentId(userData.studentId);
        setTeachers(teachers);
      } catch (error) {
        console.error('Błąd podczas pobierania korepetytorów:', error);
      }
    };
    fetchTeachers();
  }, [userData.studentId]);

  const handleClickOpen = (teacherId) => {
    setSelectedTeacherId(teacherId);
    setDialogOpen(true);
    setComment(""); // Resetowanie komentarza przy otwieraniu dialogu
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedTeacherId(null);
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const grade = formData.get('grade');

    try {
      await addOrUpdateReview(selectedTeacherId, userData.studentId, grade, comment); // Dodanie komentarza do funkcji
    } catch (error) {
      console.error('Błąd podczas dodawania oceny: ', error);
    }

    handleClose();
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <Typography variant="h4" gutterBottom>Moi korepetytorzy</Typography>
          {teachers.length == 0 ? (
            <Typography variant="h5">Brak</Typography>
            ) : (
              <div className={styles.teachersBox}>
                {teachers.map((teacher, id) => (
                  <div key={id} className={styles.teacherBox}>
                    <Avatar
                      alt={`${teacher.firstName} ${teacher.secondName}`}
                      src="./images/avatar.jpg"
                      sx={{ width: 124, height: 124, marginBottom: '20px' }}
                    />
                    <Typography variant="h6">{`${teacher.firstName} ${teacher.secondName}`}</Typography>
                    {((userType == "student" && userData.isAdult) || userType=="parent") && 
                    <Button
                      onClick={() => handleClickOpen(teacher.teacherId)} 
                      variant="outlined"
                    >
                      Wystaw ocenę
                    </Button>}
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        PaperProps={{
          component: 'form',
          onSubmit: handleReviewSubmit, 
        }}
      >
        <DialogTitle id="dialog-title">Wystawianie oceny</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            Wystaw ocenę korepetytorowi w skali od 1 do 5 oraz dodaj komentarz, jeśli chcesz.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="grade"
            name="grade"
            label="Twoja ocena"
            type="number"
            step="1"
            max="5"
            min="1"
            onInput={(e) => {
              const value = parseInt(e.target.value, 10);
              if (value < 1) e.target.value = 1;
              if (value > 5) e.target.value = 5;
            }}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="comment"
            name="comment"
            label="Twój komentarz"
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)} // Aktualizacja komentarza
            fullWidth
            multiline
            rows={4}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Anuluj</Button>
          <Button type="submit">Zapisz</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
