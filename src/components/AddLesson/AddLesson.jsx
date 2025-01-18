import React, { useState } from "react";
import { Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import styles from "./AddLesson.module.scss";
import { validateLessonData } from "../../functions/validate";
import { db } from "../../functions/db";
import { getCookie } from "../../functions/cookies";

export default function AddLesson() {
  const userData = JSON.parse(getCookie("userData"));
  const userType = getCookie("userType");

  const [lessonData, setLessonData] = useState({
    subject: "",
    studentId: "", 
    lessonDate: "",
    lessonTime: "",
    price: "",
  });

  const [errMsgs, setErrMsgs] = useState({
    subject: "",
    studentId: "",
    lessonDate: "",
    lessonTime: "",
    price: "",
  });

  const handleAddLesson = async () => {
    const formatDate = (date) => {
      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year}`;
    };
    const validationResult = validateLessonData({ ...lessonData, teacherId: userData.teacherId });
    setErrMsgs(validationResult.errMsgs);

    if (validationResult.err) {
      console.log("Dane lekcji zawierają błędy.");
      return;
    }

    console.log(
      lessonData
    )
    try {
      const formattedDate = formatDate(lessonData.lessonDate);
      await db.lessons.add({
        subject: lessonData.subject,
        teacherId: parseInt(userData.teacherId),
        studentId: null,
        lessonDate: formattedDate,
        lessonTime: lessonData.lessonTime,
        price: parseFloat(lessonData.price),
        status: "Wolny termin",
      });
      console.log("Lekcja została dodana.");
      
      setLessonData({
        subject: "",
        studentId: "",
        lessonDate: "",
        lessonTime: "",
        price: "",
        status: "Wolny termin",
      });
    } catch (e) {
      console.error("Błąd podczas dodawania lekcji:", e);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Typography variant="h4" gutterBottom>
          Dodaj nową lekcję
        </Typography>
        <form className={styles.formElement}>
          <div className={styles.labelInputBox}>
            <TextField
              variant="outlined"
              fullWidth
              error={!!errMsgs.subject}
              label="Przedmiot"
              helperText={errMsgs.subject}
              value={lessonData.subject}
              onChange={(ev) => setLessonData({ ...lessonData, subject: ev.target.value })}
            />
          </div>
          <div className={styles.labelInputBox}>
            <TextField
              variant="outlined"
              fullWidth
              type="date"
              error={!!errMsgs.lessonDate}
              helperText={errMsgs.lessonDate}
              value={lessonData.lessonDate}
              onChange={(ev) => setLessonData({ ...lessonData, lessonDate: ev.target.value })}
            />
          </div>
          <div className={styles.labelInputBox}>
            <TextField
              variant="outlined"
              fullWidth
              type="time"
              error={!!errMsgs.lessonTime}
              helperText={errMsgs.lessonTime}
              value={lessonData.lessonTime}
              onChange={(ev) => setLessonData({ ...lessonData, lessonTime: ev.target.value })}
            />
          </div>
          <div className={styles.labelInputBox}>
            <TextField
              variant="outlined"
              fullWidth
              type="number"
              error={!!errMsgs.price}
              label="Cena (w zł)"
              helperText={errMsgs.price}
              value={lessonData.price}
              onChange={(ev) => setLessonData({ ...lessonData, price: ev.target.value })}
            />
          </div>
          <Button variant="contained" onClick={handleAddLesson}>
            Dodaj lekcję
          </Button>
        </form>
      </div>
    </div>
  );
}
