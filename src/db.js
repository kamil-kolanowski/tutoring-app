import Dexie from "dexie"
import relationships from 'dexie-relationships'

export const db = new Dexie("tutoringAppDb", {addons: [relationships]});

db.version(1).stores({
    // todos: '++id, title, completed'
    teachers: '++teacherId, email, password, firstName, secondName, subjects, hourlyRate',
    students: '++studentId, email, password, firstName, secondName, isAdult',
    parents: '++parentId, email, password, firstName, secondName, studentId -> students.studentId',
    company: '++companyId, email, password, firstName, secondName',
    lessons: '++lessonId, teacherId -> teachers.teacherId, studentId -> students.studentId, subject, lessonDate, price, status',
    reviews: '++reviewId, teacherId -> teachers.teacherId, reviewerName, stars, comment'
});

// db.open()

const addNew = async () => {
    const teachers = await db.teachers.toArray()
    if (teachers.length === 0 ) {

        db.transaction('rw', [db.teachers, db.students, db.parents, db.company, db.lessons], function () {
            db.teachers.bulkAdd([
                {
                    teacherId: 1, 
                    email: "jannowak@wp.pl", 
                    password: "Janek1980!", 
                    firstName: 'Jan', 
                    secondName: 'Nowak', 
                    subjects: ['matematyka', 'fizyka'], 
                    hourlyRate: 120
                },
                {
                    teacherId: 2, 
                    email: "pawelkowalski@wp.pl", 
                    password: "Pawelek1975@", 
                    firstName: 'Paweł', 
                    secondName: 'Kowalski', 
                    subjects: ['język polski', 'geografia'], 
                    hourlyRate: 90
                }
            ]);

            db.students.bulkAdd([
                {
                    studentId: 1, 
                    email: 'emilakrol@wp.pl', 
                    password: "Emilka2002!", 
                    firstName: "Emilia", 
                    secondName: "Król", 
                    isAdult: true
                },
                {
                    studentId: 2, 
                    email: 'filiptygrysiak@wp.pl', 
                    password: "Filipek2006@", 
                    firstName: "Filip", 
                    secondName: "Tygrysiak", 
                    isAdult: false
                }
            ]);

            db.parents.add(
                {
                    // parentId, 
                    email: "grzegorztygrysiak@o2.pl", 
                    password: "Grzechu1980@", 
                    firstName: "Grzegorz", 
                    secondName: "Tygrysiak", 
                    studentId: 2
                }
            );

            db.company.add(
                {
                    // companyId, 
                    email: "eliaszmusk@wp.pl", 
                    password: "Eliasz1960!", 
                    firstName: "Eliasz", 
                    secondName: 'Mózg'
                }
            )

            db.lessons.bulkAdd([
                {
                    // lessonId, 
                    teacherId: 1, 
                    studentId: 1, 
                    subject: 'matematyka', 
                    lessonDate: '05-01-2025', 
                    price: 120, 
                    status: 'upcoming'
                },
                {
                    // lessonId, 
                    teacherId: 2, 
                    studentId: 1, 
                    subject: 'język polski', 
                    lessonDate: '09-01-2025', 
                    price: 90, 
                    status: 'upcoming'
                },
                {
                    // lessonId, 
                    teacherId: 1, 
                    studentId: 2, 
                    subject: 'matematyka', 
                    lessonDate: '12-01-2025', 
                    price: 120, 
                    status: 'upcoming'
                }
            ])

        })
    }
}

addNew();