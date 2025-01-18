import Dexie from "dexie"
import relationships from 'dexie-relationships'
import bcrypt from 'bcryptjs';


export const db = new Dexie("tutoringAppDb", {addons: [relationships]});

db.version(11).stores({
    teachers: '++teacherId, email, password, firstName, secondName, subjects, hourlyRate, image',
    students: '++studentId, email, password, firstName, secondName, isAdult, childCode',
    parents: '++parentId, email, password, firstName, secondName, studentId -> students.studentId',
    company: '++companyId, email, password, firstName, secondName',
    lessons: '++lessonId, teacherId -> teachers.teacherId, studentId -> students.studentId, subject, lessonDate, lessonTime, price, status',
    reviews: '++reviewId, [teacherId+reviewerName], stars, comment',
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
                        password: bcrypt.hashSync("Janek1980!", 10), 
                        firstName: 'Jan', 
                        secondName: 'Nowak', 
                        subjects: ['matematyka', 'fizyka'], 
                        hourlyRate: 120,
                        image: null
                    },
                    {
                        teacherId: 2, 
                        email: "pawelkowalski@wp.pl", 
                        password: bcrypt.hashSync("Pawelek1975@",10), 
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
                        password: bcrypt.hashSync("Emilka2002!", 10), 
                        firstName: "Emilia", 
                        secondName: "Król", 
                        isAdult: true,
                        childCode: ''
                    },
                    {
                        studentId: 2, 
                        email: 'filiptygrysiak@wp.pl', 
                        password: bcrypt.hashSync("Filipek2006@", 10), 
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
                        password: bcrypt.hashSync("Grzechu1980@", 10), 
                        firstName: "Grzegorz", 
                        secondName: "Tygrysiak", 
                        studentId: 2
                    }
                );
    
                db.company.add(
                    {
                        // companyId, 
                        email: "administrator@o2.pl", 
                        password: bcrypt.hashSync("admin", 10), 
                        firstName: "Admin 1", 
                        secondName: 'Admin 1'
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
                        status: 'Wolny termin'
                    },
                    {
                        // lessonId, 
                        teacherId: 2, 
                        studentId: 7, 
                        subject: 'język polski', 
                        lessonDate: '09-01-2025',
                        lessonTime: "12:00",
                        price: 90, 
                        status: 'Wolny termin'
                    },
                    {
                        // lessonId, 
                        teacherId: 1, 
                        studentId: 7, 
                        subject: 'matematyka', 
                        lessonDate: '12-01-2025', 
                        lessonTime: "17:40",
                        price: 120, 
                        status: 'Wolny termin'
                    }
                ])
    
            })
        } catch (e) {
            console.log(e)
        }
    }
}

addNew();