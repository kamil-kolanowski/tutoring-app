import Dexie from "dexie"
import relationships from 'dexie-relationships'



export const db = new Dexie("tutoringAppDb", {addons: [relationships]});

db.version(11).stores({
    teachers: '++teacherId, email, password, firstName, secondName, subjects, hourlyRate, image',
    students: '++studentId, email, password, firstName, secondName, isAdult, childCode',
    parents: '++parentId, email, password, firstName, secondName, studentId -> students.studentId',
    company: '++companyId, email, password, firstName, secondName',
    lessons: '++lessonId, teacherId -> teachers.teacherId, studentId -> students.studentId, subject, lessonDate, lessonTime, price, status',
    reviews: '++reviewId, [teacherId+reviewerName], stars, comment',
    // userLocalSession: '++sessionId, userData'
});

// db.open()

const addNew = async () => {
    const teachers = await db.teachers.toArray()
    if (teachers.length === 0 ) {
        try {

            db.transaction('rw', [db.teachers, db.students, db.parents, db.company, db.lessons], function () {
                db.teachers.bulkAdd([
                    {
                        teacherId: 1, 
                        email: "jannowak@wp.pl", 
                        password: "Janek1980!", 
                        firstName: 'Jan', 
                        secondName: 'Nowak', 
                        subjects: ['matematyka', 'fizyka'], 
                        hourlyRate: 120,
                        image: null
                    },
                    {
                        teacherId: 2, 
                        email: "pawelkowalski@wp.pl", 
                        password: "Pawelek1975@", 
                        firstName: 'Paweł', 
                        secondName: 'Kowalski', 
                        subjects: ['język polski', 'geografia'], 
                        hourlyRate: 90,
                        image: null
                    }
                ]);
    
                db.students.bulkAdd([
                    {
                        studentId: 1, 
                        email: 'emilakrol@wp.pl', 
                        password: "Emilka2002!", 
                        firstName: "Emilia", 
                        secondName: "Król", 
                        isAdult: true,
                        childCode: ''
                    },
                    {
                        studentId: 2, 
                        email: 'filiptygrysiak@wp.pl', 
                        password: "Filipek2006@", 
                        firstName: "Filip", 
                        secondName: "Tygrysiak", 
                        isAdult: false,
                        childCode: "SJFRIWUT2J"
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
                );
    
                db.lessons.bulkAdd([
                    {
                        // lessonId, 
                        teacherId: 1, 
                        studentId: 7, 
                        subject: 'matematyka', 
                        lessonDate: '05-01-2025', 
                        lessonTime: '10:00',
                        price: 120, 
                        status: 'upcoming'
                    },
                    {
                        // lessonId, 
                        teacherId: 2, 
                        studentId: 7, 
                        subject: 'język polski', 
                        lessonDate: '09-01-2025',
                        lessonTime: "12:00",
                        price: 90, 
                        status: 'upcoming'
                    },
                    {
                        // lessonId, 
                        teacherId: 1, 
                        studentId: 7, 
                        subject: 'matematyka', 
                        lessonDate: '12-01-2025', 
                        lessonTime: "17:40",
                        price: 120, 
                        status: 'upcoming'
                    }
                ])
    
            })
        } catch (e) {
            console.log(e)
        }
    }
}

addNew();