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