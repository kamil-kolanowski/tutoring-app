import {db} from "./db";

export const getLessonsByStudentId = async (studentId) => {
    const lessonsFetchedData = await db.lessons.where({studentId: studentId}).toArray();
    return lessonsFetchedData;
}

export const getSubjects = async () => {
    // const today = new Date();
    const lessons = await db.lessons.toArray()
    const subjects = lessons
        .map(lesson => lesson.subject)
        .filter((value, index, self) => {
            return self.indexOf(value) === index;
          });
    return subjects;
  };
  
export const getAvailableLessonsBySubject = async (subject) => {
    const lessons = await db.lessons
        .where({subject: subject})
        .toArray();
    const availableLessons = lessons
        .filter(lesson => {
            return lesson.studentId == null
        }) 
    return availableLessons;
    
}
export const lessonSignUp = async (studentId, lessonId) => {
    const updated = await db.lessons.update(lessonId, { studentId: studentId });

    if (updated) {
        return "Pomyślnie zapisano na lekcję.";
    } else {
        return "Wystąpił błąd podczas zapisywania na lekcję.";
    }
};

export const getTeachers = async () => {
    const teachers = await db.teachers.toArray();
    return teachers;
}

export const lessonCancel = async ( lessonId) => {
    const updated = await db.lessons.update(lessonId, { studentId: null });

    if (updated) {
        return "Pomyślnie anulowano lekcję.";
    } else {
        return "Wystąpił błąd podczas anulowania lekcji.";
    }
};

export const findTeacherById = async (id) => {
    try {
        const teacher = await db.teachers.get(id);
        return teacher ? teacher : "Nauczyciel o podanym ID nie został znaleziony.";
    } catch (error) {
        console.error("Błąd podczas pobierania nauczyciela:", error);
        return "Wystąpił błąd podczas wyszukiwania nauczyciela.";
    }
};


export const getTeachersByStudentId = async (studentId) => {
    try {
        const lessonsFetchedData = await db.lessons.where({ studentId: studentId }).toArray();

        const uniqueTeacherIds = [...new Set(lessonsFetchedData.map(lesson => lesson.teacherId))];

        const teachers = await Promise.all(
            uniqueTeacherIds.map(async (teacherId) => {
                const teacher = await findTeacherById(teacherId);
                return teacher;
            })
        );
        return teachers;
    } catch (error) {
        console.error("Błąd podczas pobierania nauczycieli:", error);
        return [];
    }
};

export const addOrUpdateReview = async (teacherId, reviewerId, stars) => {
    try {
      const existingReview = await db.reviews
        .where({ teacherId, reviewerName: reviewerId })
        .first();
  
      if (existingReview) {
        await db.reviews.update(existingReview.reviewId, { stars });
      } else {
        await db.reviews.add({
          teacherId,
          reviewerName: reviewerId,
          stars,
          comment: '', 
        });
      }
    } catch (error) {
      console.error('Błąd przy dodawaniu lub zmienianiu oceny:', error);
    }
  };

  export const getStudentNameById = async (studentId) => {
    try {
        const student = await db.students.get(studentId); // Pobierz rekord dziecka na podstawie jego ID
        if (student) {
            return {
                firstName: student.firstName,
                secondName: student.secondName
            };
        } else {
            throw new Error(`Nie znaleziono studenta o ID: ${studentId}`);
        }
    } catch (error) {
        console.error("Błąd podczas pobierania danych dziecka:", error);
    }
}