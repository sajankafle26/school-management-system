import type { Student, Teacher, Staff, Notice, Event, Result, Syllabus, FeeStructure, FeeInvoice, Expense, User, Parent, AttendanceRecord, Homework, Book, IssuedBook, LedgerAccount, Transaction, SentSms, ClassRoutine, AcademicYear, WebsiteContent, Bus, RfidLog, Driver } from '../types';

export const mockAcademicYears: AcademicYear[] = [
  { year: '2080/2081', isCurrent: true },
  { year: '2079/2080', isCurrent: false },
];

export const mockParents: Parent[] = [
  { id: 1, name: 'Hari Thapa', contact: '9841234567', email: 'hari.thapa@email.com' },
  { id: 2, name: 'Gopal Sharma', contact: '9841234568', email: 'gopal.sharma@email.com' },
  { id: 3, name: 'Bishnu Rai', contact: '9841234569', email: 'bishnu.rai@email.com' },
];

export const mockStudents: Student[] = [
  { id: 1, name: 'Ram Thapa', nepaliName: 'राम थापा', className: '10', section: 'A', roll: 1, dob: '2008-05-12', guardianName: 'Hari Thapa', contact: '9841234567', address: 'Kathmandu', profilePic: 'https://picsum.photos/seed/student1/100', parentId: 1, busId: 1, rfidCardId: 'RFID001', academicYear: '2080/2081' },
  { id: 2, name: 'Sita Sharma', nepaliName: 'सीता शर्मा', className: '10', section: 'A', roll: 2, dob: '2008-03-22', guardianName: 'Gopal Sharma', contact: '9841234568', address: 'Patan', profilePic: 'https://picsum.photos/seed/student2/100', parentId: 2, busId: 2, rfidCardId: 'RFID002', academicYear: '2080/2081' },
  { id: 3, name: 'Gita Rai', nepaliName: 'गीता राई', className: '9', section: 'B', roll: 5, dob: '2009-01-15', guardianName: 'Bishnu Rai', contact: '9841234569', address: 'Bhaktapur', profilePic: 'https://picsum.photos/seed/student3/100', parentId: 3, busId: 1, rfidCardId: 'RFID003', academicYear: '2080/2081' },
  { id: 4, name: 'Nabin Gurung', nepaliName: 'नवीन गुरुङ', className: '8', section: 'C', roll: 3, dob: '2010-07-30', guardianName: 'Manish Gurung', contact: '9841234570', address: 'Pokhara', profilePic: 'https://picsum.photos/seed/student4/100', parentId: 1, rfidCardId: 'RFID004', academicYear: '2080/2081' },
  { id: 5, name: 'Anjali Lama', nepaliName: 'अन्जली लामा', className: '10', section: 'A', roll: 3, dob: '2008-09-02', guardianName: 'Sunita Lama', contact: '9841234571', address: 'Kathmandu', profilePic: 'https://picsum.photos/seed/student5/100', parentId: 2, busId: 2, rfidCardId: 'RFID005', academicYear: '2080/2081' },
  { id: 6, name: 'Bikash Yadav', nepaliName: 'बिकाश यादव', className: '9', section: 'B', roll: 8, dob: '2009-04-18', guardianName: 'Ramesh Yadav', contact: '9841234572', address: 'Biratnagar', profilePic: 'https://picsum.photos/seed/student6/100', parentId: 3, academicYear: '2080/2081' },
  { id: 7, name: 'Prakriti Karki', nepaliName: 'प्रकृति कार्की', className: '8', section: 'C', roll: 12, dob: '2010-11-05', guardianName: 'Shyam Karki', contact: '9841234573', address: 'Patan', profilePic: 'https://picsum.photos/seed/student7/100', parentId: 1, busId: 1, academicYear: '2080/2081' },
  // Previous Year Students
  { id: 8, name: 'Rajesh Hamal', nepaliName: 'राजेश हमाल', className: '10', section: 'A', roll: 1, dob: '2007-06-09', guardianName: 'Madan Hamal', contact: '9841111111', address: 'Kathmandu', profilePic: 'https://picsum.photos/seed/student8/100', parentId: 1, academicYear: '2079/2080' },
  { id: 9, name: 'Karishma Manandhar', nepaliName: 'करिश्मा मानन्धर', className: '10', section: 'A', roll: 2, dob: '2007-02-04', guardianName: 'Binod Manandhar', contact: '9842222222', address: 'Patan', profilePic: 'https://picsum.photos/seed/student9/100', parentId: 2, academicYear: '2079/2080' },
];

export const mockTeachers: Teacher[] = [
  { id: 1, name: 'Hari Prasad Adhikari', nepaliName: 'हरि प्रसाद अधिकारी', subject: 'Mathematics', contact: '9851012345', email: 'hari.p@school.edu.np', profilePic: 'https://picsum.photos/seed/teacher1/100', classTeacherOf: '10 A' },
  { id: 2, name: 'Shanti Devi Shrestha', nepaliName: 'शान्ति देवी श्रेष्ठ', subject: 'Science', contact: '9851012346', email: 'shanti.d@school.edu.np', profilePic: 'https://picsum.photos/seed/teacher2/100', classTeacherOf: '9 B' },
  { id: 3, name: 'Manoj Kumar Chaudhary', nepaliName: 'मनोज कुमार चौधरी', subject: 'English', contact: '9851012347', email: 'manoj.k@school.edu.np', profilePic: 'https://picsum.photos/seed/teacher3/100' },
  { id: 4, name: 'Srijana Maharjan', nepaliName: 'सृजना महर्जन', subject: 'Nepali', contact: '9851012348', email: 'srijana.m@school.edu.np', profilePic: 'https://picsum.photos/seed/teacher4/100', classTeacherOf: '8 C' },
];

export const mockStaff: Staff[] = [
  { id: 1, name: 'Ramesh Bhandari', nepaliName: 'रमेश भण्डारी', jobTitle: 'Accountant', contact: '9841000111', email: 'ramesh.b@school.edu.np', profilePic: 'https://picsum.photos/seed/staff1/100' },
  { id: 2, name: 'Srijana Tamang', nepaliName: 'सृजना तामाङ', jobTitle: 'Librarian', contact: '9841000222', email: 'srijana.t@school.edu.np', profilePic: 'https://picsum.photos/seed/staff2/100' },
  { id: 3, name: 'Bikram Shah', nepaliName: 'बिक्रम शाह', jobTitle: 'Admin Officer', contact: '9841000333', email: 'bikram.s@school.edu.np', profilePic: 'https://picsum.photos/seed/staff3/100' },
];

export const mockDrivers: Driver[] = [
    { id: 1, name: 'Ram Bahadur', contact: '9841000112', licenseNumber: 'NP-A-12345', profilePic: 'https://picsum.photos/seed/driver1/100', busId: 1 },
    { id: 2, name: 'Shyam Karki', contact: '9841000113', licenseNumber: 'NP-B-67890', profilePic: 'https://picsum.photos/seed/driver2/100', busId: 2 },
    { id: 3, name: 'Gopal Tamang', contact: '9841000114', licenseNumber: 'NP-C-54321', profilePic: 'https://picsum.photos/seed/driver3/100', busId: 3 },
];

export const mockUsers: User[] = [
  // Admin user
  { id: 101, username: 'admin', password: 'password', role: 'admin', name: 'School Admin', profilePic: 'https://picsum.photos/seed/admin/100', referenceId: 999 },
  // Teacher users (username: T + teacherId)
  { id: 201, username: 'T1', password: 'password', role: 'teacher', name: mockTeachers[0].name, profilePic: mockTeachers[0].profilePic, referenceId: 1 },
  { id: 202, username: 'T2', password: 'password', role: 'teacher', name: mockTeachers[1].name, profilePic: mockTeachers[1].profilePic, referenceId: 2 },
  // Student users (username: S + studentId)
  { id: 301, username: 'S1', password: 'password', role: 'student', name: mockStudents[0].name, profilePic: mockStudents[0].profilePic, referenceId: 1 },
  { id: 302, username: 'S2', password: 'password', role: 'student', name: mockStudents[1].name, profilePic: mockStudents[1].profilePic, referenceId: 2 },
  // Parent users (username: P + parentId)
  { id: 401, username: 'P1', password: 'password', role: 'parent', name: mockParents[0].name, profilePic: 'https://picsum.photos/seed/parent1/100', referenceId: 1 },
  { id: 402, username: 'P2', password: 'password', role: 'parent', name: mockParents[1].name, profilePic: 'https://picsum.photos/seed/parent2/100', referenceId: 2 },
  // Staff users (username: ST + staffId)
  { id: 501, username: 'ST1', password: 'password', role: 'staff', name: mockStaff[0].name, profilePic: mockStaff[0].profilePic, referenceId: 1 },
  { id: 502, username: 'ST2', password: 'password', role: 'staff', name: mockStaff[1].name, profilePic: mockStaff[1].profilePic, referenceId: 2 },
  // Driver users (username: D + driverId)
  { id: 601, username: 'D1', password: 'password', role: 'driver', name: mockDrivers[0].name, profilePic: mockDrivers[0].profilePic, referenceId: 1 },
];


export const mockNotices: Notice[] = [
  { id: 1, title: 'Annual Sports Day', date: '2024-07-20', content: 'The annual sports day will be held on the last Friday of this month. All students are requested to participate.', author: 'Principal Office', targetClass: 'All', targetSection: 'All', academicYear: '2080/2081' },
  { id: 2, title: 'Parent-Teacher Meeting', date: '2024-07-18', content: 'A parent-teacher meeting is scheduled for this Saturday to discuss the mid-term exam results.', author: 'Administration', targetClass: 'All', targetSection: 'All', academicYear: '2080/2081' },
  { id: 3, title: 'Holiday Notice: Bhanu Jayanti', date: '2024-07-14', content: 'The school will remain closed tomorrow on the occasion of Bhanu Jayanti.', author: 'Principal Office', targetClass: 'All', targetSection: 'All', academicYear: '2080/2081' },
  { id: 4, title: 'Class 10 Project Submission', date: '2024-07-22', content: 'All students of class 10 are required to submit their science projects by this Friday.', author: 'Science Dept.', targetClass: '10', targetSection: 'All', academicYear: '2080/2081' },
  { id: 5, title: 'Section A Assembly Duty', date: '2024-07-23', content: 'Students of section A of class 10 will be responsible for the morning assembly tomorrow.', author: 'Discipline In-charge', targetClass: '10', targetSection: 'A', academicYear: '2080/2081' },
  { id: 6, title: 'Previous Year Welcome', date: '2023-04-15', content: 'Welcome to the new academic session 2079/2080.', author: 'Principal Office', targetClass: 'All', targetSection: 'All', academicYear: '2079/2080' },
];

export const mockEvents: Event[] = [
  { id: 1, title: 'Bhanu Jayanti', date: '2024-07-14', description: 'Holiday for Bhanu Jayanti.', type: 'Holiday', academicYear: '2080/2081' },
  { id: 2, title: 'Mid-Term Exams Begin', date: '2024-08-01', description: 'Mid-term examinations for all classes will start from August 1st.', type: 'Exam', academicYear: '2080/2081' },
  { id: 3, title: 'Annual Sports Day', date: '2024-08-15', description: 'Annual sports competition for all students.', type: 'Event', academicYear: '2080/2081' },
  { id: 4, title: 'Science Exhibition', date: '2024-09-05', description: 'Inter-school science exhibition.', type: 'Event', academicYear: '2080/2081' },
  { id: 5, title: 'Last Year\'s Final Exams', date: '2024-03-10', description: 'Final exams for the session 2079/2080.', type: 'Exam', academicYear: '2079/2080' },
];

export const mockResults: Result[] = [
  {
    id: 1, studentId: 1, examType: 'Mid Terminal', className: '10', section: 'A',
    marks: [ { subject: 'Nepali', marksObtained: 85, fullMarks: 100 }, { subject: 'English', marksObtained: 92, fullMarks: 100 }, { subject: 'C. Maths', marksObtained: 95, fullMarks: 100 }, { subject: 'Science', marksObtained: 88, fullMarks: 100 }, { subject: 'Social Studies', marksObtained: 90, fullMarks: 100 }, { subject: 'EPH', marksObtained: 89, fullMarks: 100 }, ],
    totalMarks: 539, percentage: 89.83, grade: 'A+', remarks: 'Excellent', academicYear: '2080/2081'
  },
  {
    id: 2, studentId: 2, examType: 'Mid Terminal', className: '10', section: 'A',
    marks: [ { subject: 'Nepali', marksObtained: 78, fullMarks: 100 }, { subject: 'English', marksObtained: 85, fullMarks: 100 }, { subject: 'C. Maths', marksObtained: 80, fullMarks: 100 }, { subject: 'Science', marksObtained: 82, fullMarks: 100 }, { subject: 'Social Studies', marksObtained: 75, fullMarks: 100 }, { subject: 'EPH', marksObtained: 81, fullMarks: 100 }, ],
    totalMarks: 481, percentage: 80.17, grade: 'A', remarks: 'Very Good', academicYear: '2080/2081'
  },
  {
    id: 3, studentId: 5, examType: 'Mid Terminal', className: '10', section: 'A',
    marks: [ { subject: 'Nepali', marksObtained: 65, fullMarks: 100 }, { subject: 'English', marksObtained: 72, fullMarks: 100 }, { subject: 'C. Maths', marksObtained: 55, fullMarks: 100 }, { subject: 'Science', marksObtained: 68, fullMarks: 100 }, { subject: 'Social Studies', marksObtained: 70, fullMarks: 100 }, { subject: 'EPH', marksObtained: 66, fullMarks: 100 }, ],
    totalMarks: 396, percentage: 66.0, grade: 'B', remarks: 'Good', academicYear: '2080/2081'
  },
  {
    id: 4, studentId: 3, examType: 'Mid Terminal', className: '9', section: 'B',
    marks: [ { subject: 'Nepali', marksObtained: 88, fullMarks: 100 }, { subject: 'English', marksObtained: 90, fullMarks: 100 }, { subject: 'C. Maths', marksObtained: 92, fullMarks: 100 }, { subject: 'Science', marksObtained: 85, fullMarks: 100 }, { subject: 'Social Studies', marksObtained: 89, fullMarks: 100 }, { subject: 'Accountancy', marksObtained: 91, fullMarks: 100 }, ],
    totalMarks: 535, percentage: 89.17, grade: 'A+', remarks: 'Excellent', academicYear: '2080/2081'
  },
  // Previous Year Results
  {
    id: 5, studentId: 8, examType: 'Final Terminal', className: '10', section: 'A',
    marks: [ { subject: 'Nepali', marksObtained: 90, fullMarks: 100 }, { subject: 'English', marksObtained: 95, fullMarks: 100 }, { subject: 'C. Maths', marksObtained: 98, fullMarks: 100 }, { subject: 'Science', marksObtained: 92, fullMarks: 100 }, { subject: 'Social Studies', marksObtained: 93, fullMarks: 100 }, { subject: 'EPH', marksObtained: 91, fullMarks: 100 }, ],
    totalMarks: 559, percentage: 93.17, grade: 'A+', remarks: 'Excellent', academicYear: '2079/2080'
  },
];

export const mockSyllabus: Syllabus[] = [
    { className: '10', subjects: ['Nepali', 'English', 'C. Maths', 'Science', 'Social Studies', 'EPH'] },
    { className: '9', subjects: ['Nepali', 'English', 'C. Maths', 'Science', 'Social Studies', 'Accountancy'] },
    { className: '8', subjects: ['Nepali', 'English', 'Maths', 'Science', 'Social Studies', 'Moral Science'] },
];

export const mockFeeStructures: FeeStructure[] = [
  { className: '10', tuition: 15000, library: 500, lab: 1000, other: 200 },
  { className: '9', tuition: 14000, library: 500, lab: 1000, other: 200 },
  { className: '8', tuition: 13000, library: 500, lab: 0, other: 200 },
];

export const mockFeeInvoices: FeeInvoice[] = [
  { id: 1, studentId: 1, amount: 16700, dueDate: '2024-07-15', status: 'Paid', academicYear: '2080/2081' },
  { id: 2, studentId: 2, amount: 16700, dueDate: '2024-07-15', status: 'Paid', academicYear: '2080/2081' },
  { id: 3, studentId: 3, amount: 15700, dueDate: '2024-08-15', status: 'Unpaid', academicYear: '2080/2081' },
  { id: 4, studentId: 4, amount: 13700, dueDate: '2024-06-15', status: 'Overdue', academicYear: '2080/2081' },
  { id: 5, studentId: 5, amount: 16700, dueDate: '2024-08-15', status: 'Unpaid', academicYear: '2080/2081' },
  { id: 6, studentId: 6, amount: 15700, dueDate: '2024-08-15', status: 'Unpaid', academicYear: '2080/2081' },
  { id: 7, studentId: 8, amount: 16000, dueDate: '2024-02-15', status: 'Paid', academicYear: '2079/2080' },
];

export const mockExpenses: Expense[] = [
  { id: 1, date: '2024-07-01', category: 'Salaries', description: 'Teacher and Staff Salaries for June', amount: 550000 },
  { id: 2, date: '2024-07-05', category: 'Utilities', description: 'Electricity and Water Bill', amount: 35000 },
  { id: 3, date: '2024-07-10', category: 'Supplies', description: 'Stationery and Lab Supplies', amount: 22000 },
  { id: 4, date: '2024-07-12', category: 'Maintenance', description: 'Classroom repairs', amount: 15000 },
];

export const mockAttendance: AttendanceRecord[] = [
  { studentId: 1, date: new Date().toISOString().split('T')[0], status: 'absent', academicYear: '2080/2081' },
  { studentId: 2, date: new Date().toISOString().split('T')[0], status: 'present', academicYear: '2080/2081' },
  { studentId: 3, date: new Date().toISOString().split('T')[0], status: 'present', academicYear: '2080/2081' },
  { studentId: 4, date: new Date().toISOString().split('T')[0], status: 'late', academicYear: '2080/2081' },
];

export const mockRfidLogs: RfidLog[] = [
    { id: 1, studentId: 1, timestamp: new Date(new Date().setHours(8, 2, 15)).toISOString(), status: 'Check-in' },
    { id: 2, studentId: 2, timestamp: new Date(new Date().setHours(8, 3, 40)).toISOString(), status: 'Check-in' },
    { id: 3, studentId: 5, timestamp: new Date(new Date().setHours(8, 5, 22)).toISOString(), status: 'Check-in' },
];

export const mockHomework: Homework[] = [
  { id: 1, className: '10', section: 'A', subject: 'C. Maths', title: 'Chapter 5: Geometry', description: 'Solve all problems from exercise 5.1 and 5.2.', assignedByTeacherId: 1, dueDate: '2024-07-28', imageUrl: 'https://picsum.photos/seed/math-hw/400/300', academicYear: '2080/2081' },
  { id: 2, className: '10', section: 'A', subject: 'Science', title: 'Physics Lab Report', description: 'Submit the lab report for the light reflection experiment.', assignedByTeacherId: 2, dueDate: '2024-07-27', academicYear: '2080/2081' },
  { id: 3, className: '9', section: 'B', subject: 'English', title: 'Essay Writing', description: 'Write a 500-word essay on "The Importance of Technology".', assignedByTeacherId: 3, dueDate: '2024-07-29', academicYear: '2080/2081' },
  { id: 4, className: '8', section: 'C', subject: 'Nepali', title: 'कविता लेखन', description: '"मेरो देश" शीर्षकमा एउटा कविता लेख्नुहोस्।', assignedByTeacherId: 4, dueDate: '2024-07-26', imageUrl: 'https://picsum.photos/seed/nepali-hw/400/300', academicYear: '2080/2081' },
  { id: 5, className: '10', section: 'A', subject: 'English', title: 'Book Review', description: 'Write a review of the book "Muna Madan".', assignedByTeacherId: 3, dueDate: '2024-03-01', academicYear: '2079/2080' },
];

export const mockBooks: Book[] = [
  { id: 1, title: 'Muna Madan', author: 'Laxmi Prasad Devkota', isbn: '978-9937-9191-1-6', totalCopies: 5, availableCopies: 2 },
  { id: 2, title: 'The C Programming Language', author: 'Brian W. Kernighan', isbn: '978-0131103627', totalCopies: 3, availableCopies: 3 },
  { id: 3, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', totalCopies: 4, availableCopies: 1 },
  { id: 4, title: 'Seto Bagh', author: 'Diamond Shumsher Rana', isbn: '978-9937862803', totalCopies: 6, availableCopies: 6 },
  { id: 5, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', isbn: '978-0618640157', totalCopies: 2, availableCopies: 2 },
];

export const mockIssuedBooks: IssuedBook[] = [
  { id: 1, bookId: 1, studentId: 1, issueDate: '2024-07-01', dueDate: '2024-07-15', returnDate: null, academicYear: '2080/2081' },
  { id: 2, bookId: 1, studentId: 2, issueDate: '2024-07-05', dueDate: '2024-07-19', returnDate: null, academicYear: '2080/2081' },
  { id: 3, bookId: 3, studentId: 1, issueDate: '2024-06-20', dueDate: '2024-07-04', returnDate: '2024-07-02', academicYear: '2080/2081' },
  { id: 4, bookId: 1, studentId: 3, issueDate: '2024-07-10', dueDate: '2024-07-24', returnDate: null, academicYear: '2080/2081' },
  { id: 5, bookId: 3, studentId: 5, issueDate: '2024-07-12', dueDate: '2024-07-26', returnDate: null, academicYear: '2080/2081' },
  { id: 6, bookId: 2, studentId: 8, issueDate: '2024-02-10', dueDate: '2024-02-24', returnDate: '2024-02-20', academicYear: '2079/2080' },
];

export const mockLedgerAccounts: LedgerAccount[] = [
  { id: 1, name: 'Bank Account', type: 'Asset' },
  { id: 2, name: 'Accounts Receivable (Fees)', type: 'Asset' },
  { id: 3, name: 'Furniture & Fixtures', type: 'Asset' },
  { id: 10, name: 'Capital Account', type: 'Capital' },
  { id: 11, name: 'Accounts Payable', type: 'Liability' },
  { id: 20, name: 'Tuition Fee Income', type: 'Income' },
  { id: 21, name: 'Donations', type: 'Income' },
  { id: 30, name: 'Salaries Expense', type: 'Expense' },
  { id: 31, name: 'Utilities Expense', type: 'Expense' },
  { id: 32, name: 'Supplies Expense', type: 'Expense' },
  { id: 33, name: 'Maintenance Expense', type: 'Expense' },
];

export const mockTransactions: Transaction[] = [
  { id: 1, date: '2024-07-01', description: 'Teacher and Staff Salaries for June', debitAccountId: 30, creditAccountId: 1, amount: 550000, academicYear: '2080/2081' },
  { id: 2, date: '2024-07-05', description: 'Electricity and Water Bill', debitAccountId: 31, creditAccountId: 1, amount: 35000, academicYear: '2080/2081' },
  { id: 3, date: '2024-07-10', description: 'Stationery and Lab Supplies', debitAccountId: 32, creditAccountId: 1, amount: 22000, academicYear: '2080/2081' },
  { id: 4, date: '2024-07-12', description: 'Classroom repairs', debitAccountId: 33, creditAccountId: 1, amount: 15000, academicYear: '2080/2081' },
  { id: 5, date: '2024-07-15', description: 'Tuition fees received - Batch 1', debitAccountId: 1, creditAccountId: 20, amount: 350000, academicYear: '2080/2081' },
  { id: 6, date: '2024-07-18', description: 'Donation received from local business', debitAccountId: 1, creditAccountId: 21, amount: 50000, academicYear: '2080/2081' },
  { id: 7, date: '2024-07-20', description: 'Purchase of new desks', debitAccountId: 3, creditAccountId: 1, amount: 75000, academicYear: '2080/2081' },
  { id: 8, date: '2024-07-22', description: 'Tuition fees received - Batch 2', debitAccountId: 1, creditAccountId: 20, amount: 420000, academicYear: '2080/2081' },
  { id: 9, date: '2024-01-01', description: 'Salaries for Dec 2023', debitAccountId: 30, creditAccountId: 1, amount: 500000, academicYear: '2079/2080' },
];

export const mockSentSms: SentSms[] = [
    { id: 1, recipientGroup: 'All Parents', recipientCount: 3, message: 'Dear Parents, the Parent-Teacher meeting is scheduled for this Saturday. Please attend.', sentDate: '2024-07-18 10:30' },
    { id: 2, recipientGroup: 'All Teachers', recipientCount: 4, message: 'Reminder: Staff meeting today at 3 PM in the main hall to discuss upcoming sports day.', sentDate: '2024-07-19 09:00' },
    { id: 3, recipientGroup: 'Students of Class 10 A', recipientCount: 3, message: 'Dear students, your science project submission deadline has been extended to next Monday.', sentDate: '2024-07-20 14:00' },
];

export const mockRoutines: ClassRoutine[] = [
    {
        className: '10', section: 'A', academicYear: '2080/2081',
        routine: { "Sunday": [ { period: 1, subject: 'C. Maths', teacherId: 1 }, { period: 2, subject: 'Science', teacherId: 2 }, { period: 3, subject: 'English', teacherId: 3 }, { period: 4, subject: 'Nepali', teacherId: 4 }, ], "Monday": [ { period: 1, subject: 'English', teacherId: 3 }, { period: 2, subject: 'Nepali', teacherId: 4 }, { period: 3, subject: 'C. Maths', teacherId: 1 }, { period: 4, subject: 'Science', teacherId: 2 }, ], "Tuesday": [ { period: 1, subject: 'Science', teacherId: 2 }, { period: 2, subject: 'Social Studies', teacherId: 3 }, { period: 3, subject: 'English', teacherId: 3 }, { period: 4, subject: 'EPH', teacherId: 1 }, ], "Wednesday": [ { period: 1, subject: 'C. Maths', teacherId: 1 }, { period: 2, subject: 'Science', teacherId: 2 }, { period: 3, subject: 'Nepali', teacherId: 4 }, { period: 4, subject: 'Social Studies', teacherId: 3 }, ], "Thursday": [ { period: 1, subject: 'EPH', teacherId: 1 }, { period: 2, subject: 'English', teacherId: 3 }, { period: 3, subject: 'C. Maths', teacherId: 1 }, { period: 4, subject: 'Science', teacherId: 2 }, ], "Friday": [ { period: 1, subject: 'Nepali', teacherId: 4 }, { period: 2, subject: 'Social Studies', teacherId: 3 }, { period: 3, subject: 'EPH', teacherId: 1 }, { period: 4, subject: 'Extra Curricular', teacherId: null }, ] }
    },
    {
        className: '9', section: 'B', academicYear: '2080/2081',
        routine: { "Sunday": [ { period: 1, subject: 'Science', teacherId: 2 }, { period: 2, subject: 'C. Maths', teacherId: 1 }, { period: 3, subject: 'Nepali', teacherId: 4 }, { period: 4, subject: 'English', teacherId: 3 }, ], "Monday": [ { period: 1, subject: 'Accountancy', teacherId: 1 }, { period: 2, subject: 'English', teacherId: 3 }, { period: 3, subject: 'Science', teacherId: 2 }, { period: 4, subject: 'C. Maths', teacherId: 1 }, ], "Tuesday": [], "Wednesday": [], "Thursday": [], "Friday": [] }
    },
    {
        className: '10', section: 'A', academicYear: '2079/2080',
        routine: { "Sunday": [ { period: 1, subject: 'C. Maths', teacherId: 1 }, { period: 2, subject: 'Science', teacherId: 2 }, { period: 3, subject: 'English', teacherId: 3 }, { period: 4, subject: 'Nepali', teacherId: 4 }, ], "Monday": [ { period: 1, subject: 'English', teacherId: 3 }, { period: 2, subject: 'Nepali', teacherId: 4 }, { period: 3, subject: 'C. Maths', teacherId: 1 }, { period: 4, subject: 'Science', teacherId: 2 }, ], "Tuesday": [], "Wednesday": [], "Thursday": [], "Friday": [] }
    }
];

export const mockPeriods = [
    { period: 1, time: '10:00 - 10:45' },
    { period: 2, time: '10:45 - 11:30' },
    { period: 3, time: '11:30 - 12:15' },
    { period: 4, time: '12:15 - 01:00' },
];

export const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const mockBuses: Bus[] = [
    { id: 1, busNumber: 'BA 1 K 1234', driverName: 'Ram Bahadur', driverContact: '9841000112', route: 'Ring Road East', currentPosition: { x: 0, y: 50 } },
    { id: 2, busNumber: 'BA 2 K 5678', driverName: 'Shyam Karki', driverContact: '9841000113', route: 'Ring Road West', currentPosition: { x: 0, y: 50 } },
    { id: 3, busNumber: 'BA 3 K 9012', driverName: 'Gopal Tamang', driverContact: '9841000114', route: 'Bhaktapur Route', currentPosition: { x: 0, y: 50 } },
];

export const mockWebsiteContent: WebsiteContent = {
  schoolName: 'Shree Adarsha Secondary School',
  logoUrl: 'https://emojicdn.elk.sh/🇳🇵',
  themeColor: '#4f46e5', // indigo-600
  topBar: {
    showTopBar: true,
    phone: '+977-1-4412345',
    email: 'info@adarshaschool.edu.np',
  },
  home: {
    heroTitle: 'Welcome to Paathshala',
    heroSubtitle: 'Nurturing Minds, Shaping Futures',
    heroImageUrl: 'https://picsum.photos/seed/school-hero/1600/900',
    welcomeTitle: 'A Message from the Principal',
    welcomeMessage: 'It is my pleasure to welcome you to our school\'s official website. We are a community dedicated to academic excellence and the holistic development of every student. Our commitment is to provide a safe and intellectually challenging environment that will empower students to become innovative thinkers, creative problem solvers and inspired learners prepared to thrive in the twenty-first century.',
  },
  about: {
    title: 'Our History and Mission',
    content: 'Founded in 1985, Shree Adarsha Secondary School has a long-standing tradition of academic excellence in Nepal. Our mission is to provide quality education that fosters intellectual and personal growth. We aim to equip our students with the skills and values necessary to succeed in a rapidly changing world. We believe in a balanced approach to education, combining rigorous academic programs with a wide range of extracurricular activities.',
  },
  contact: {
    address: 'Kathmandu, Nepal',
    phone: '+977-1-4412345',
    email: 'info@adarshaschool.edu.np',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56518.35185998348!2d85.29111344040909!3d27.708942724445834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb5137c1bf18db1ea!2sKathmandu%2C%20Nepal!5e0!3m2!1sen!2sus!4v1691654321098!5m2!1sen!2sus',
  },
  galleries: [
    {
      id: 1,
      title: 'Annual Sports Day 2024',
      images: [
        { id: 101, url: 'https://picsum.photos/seed/sports1/800/600', caption: 'Opening Ceremony' },
        { id: 102, url: 'https://picsum.photos/seed/sports2/800/600', caption: 'High Jump Event' },
        { id: 103, url: 'https://picsum.photos/seed/sports3/800/600', caption: 'Winners Receiving Medals' },
        { id: 104, url: 'https://picsum.photos/seed/sports4/800/600', caption: 'Team Spirit' },
      ],
    },
    {
      id: 2,
      title: 'Science Exhibition 2024',
      images: [
        { id: 201, url: 'https://picsum.photos/seed/science1/800/600', caption: 'Volcano Model' },
        { id: 202, url: 'https://picsum.photos/seed/science2/800/600', caption: 'Robotics Project' },
        { id: 203, url: 'https://picsum.photos/seed/science3/800/600', caption: 'Observing the projects' },
      ],
    },
  ],
};