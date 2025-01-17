import { db } from './db';

export const findTeacherById = async (id) => {
    try {
        const teacher = await db.teachers.get(id);
        return teacher ? teacher : "Nauczyciel o podanym ID nie został znaleziony.";
    } catch (error) {
        console.error("Błąd podczas pobierania nauczyciela:", error);
        return "Wystąpił błąd podczas wyszukiwania nauczyciela.";
    }
};
