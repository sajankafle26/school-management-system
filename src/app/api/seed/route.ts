import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import AcademicYear from '@/lib/models/AcademicYear';
import User from '@/lib/models/User';
import Student from '@/lib/models/Student';
import Teacher from '@/lib/models/Teacher';
import Parent from '@/lib/models/Parent';
import Staff from '@/lib/models/Staff';
import Driver from '@/lib/models/Driver';
import Notice from '@/lib/models/Notice';
import Event from '@/lib/models/Event';
import Result from '@/lib/models/Result';
import FeeInvoice from '@/lib/models/FeeInvoice';
import Expense from '@/lib/models/Expense';
import WebsiteContent from '@/lib/models/WebsiteContent';

export async function POST() {
  try {
    await connectDB();

    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      return NextResponse.json({ message: 'Database already seeded' });
    }

    await AcademicYear.insertMany([
      { year: '2080/2081', isCurrent: true },
      { year: '2079/2080', isCurrent: false },
    ]);

    const parents = await Parent.insertMany([
      { name: 'Hari Thapa', contact: '9841234567', email: 'hari.thapa@email.com' },
      { name: 'Gopal Sharma', contact: '9841234568', email: 'gopal.sharma@email.com' },
      { name: 'Bishnu Rai', contact: '9841234569', email: 'bishnu.rai@email.com' },
    ]);

    const teachers = await Teacher.insertMany([
      { name: 'Hari Prasad Adhikari', nepaliName: 'हरि प्रसाद अधिकारी', subject: 'Mathematics', contact: '9851012345', email: 'hari.p@school.edu.np', profilePic: 'https://picsum.photos/seed/teacher1/100', classTeacherOf: '10 A' },
      { name: 'Shanti Devi Shrestha', nepaliName: 'शान्ति देवी श्रेष्ठ', subject: 'Science', contact: '9851012346', email: 'shanti.d@school.edu.np', profilePic: 'https://picsum.photos/seed/teacher2/100', classTeacherOf: '9 B' },
      { name: 'Manoj Kumar Chaudhary', nepaliName: 'मनोज कुमार चौधरी', subject: 'English', contact: '9851012347', email: 'manoj.k@school.edu.np', profilePic: 'https://picsum.photos/seed/teacher3/100' },
      { name: 'Srijana Maharjan', nepaliName: 'सृजना महर्जन', subject: 'Nepali', contact: '9851012348', email: 'srijana.m@school.edu.np', profilePic: 'https://picsum.photos/seed/teacher4/100', classTeacherOf: '8 C' },
    ]);

    const students = await Student.insertMany([
      { name: 'Ram Thapa', nepaliName: 'राम थापा', className: '10', section: 'A', roll: 1, dob: '2008-05-12', guardianName: 'Hari Thapa', contact: '9841234567', address: 'Kathmandu', profilePic: 'https://picsum.photos/seed/student1/100', parentId: 1, busId: 1, rfidCardId: 'RFID001', academicYear: '2080/2081' },
      { name: 'Sita Sharma', nepaliName: 'सीता शर्मा', className: '10', section: 'A', roll: 2, dob: '2008-03-22', guardianName: 'Gopal Sharma', contact: '9841234568', address: 'Patan', profilePic: 'https://picsum.photos/seed/student2/100', parentId: 2, busId: 2, rfidCardId: 'RFID002', academicYear: '2080/2081' },
      { name: 'Gita Rai', nepaliName: 'गीता राई', className: '9', section: 'B', roll: 5, dob: '2009-01-15', guardianName: 'Bishnu Rai', contact: '9841234569', address: 'Bhaktapur', profilePic: 'https://picsum.photos/seed/student3/100', parentId: 3, busId: 1, rfidCardId: 'RFID003', academicYear: '2080/2081' },
      { name: 'Nabin Gurung', nepaliName: 'नवीन गुरुङ', className: '8', section: 'C', roll: 3, dob: '2010-07-30', guardianName: 'Manish Gurung', contact: '9841234570', address: 'Pokhara', profilePic: 'https://picsum.photos/seed/student4/100', parentId: 1, rfidCardId: 'RFID004', academicYear: '2080/2081' },
      { name: 'Anjali Lama', nepaliName: 'अन्जली लामा', className: '10', section: 'A', roll: 3, dob: '2008-09-02', guardianName: 'Sunita Lama', contact: '9841234571', address: 'Kathmandu', profilePic: 'https://picsum.photos/seed/student5/100', parentId: 2, busId: 2, rfidCardId: 'RFID005', academicYear: '2080/2081' },
    ]);

    await Staff.insertMany([
      { name: 'Ramesh Bhandari', nepaliName: 'रमेश भण्डारी', jobTitle: 'Accountant', contact: '9841000111', email: 'ramesh.b@school.edu.np', profilePic: 'https://picsum.photos/seed/staff1/100' },
      { name: 'Srijana Tamang', nepaliName: 'सृजना तामाङ', jobTitle: 'Librarian', contact: '9841000222', email: 'srijana.t@school.edu.np', profilePic: 'https://picsum.photos/seed/staff2/100' },
      { name: 'Bikram Shah', nepaliName: 'बिक्रम शाह', jobTitle: 'Admin Officer', contact: '9841000333', email: 'bikram.s@school.edu.np', profilePic: 'https://picsum.photos/seed/staff3/100' },
    ]);

    await Driver.insertMany([
      { name: 'Ram Bahadur', contact: '9841000112', licenseNumber: 'NP-A-12345', profilePic: 'https://picsum.photos/seed/driver1/100', busId: 1 },
      { name: 'Shyam Karki', contact: '9841000113', licenseNumber: 'NP-B-67890', profilePic: 'https://picsum.photos/seed/driver2/100', busId: 2 },
    ]);

    await User.insertMany([
      { username: 'admin', password: 'password', role: 'admin', name: 'School Admin', profilePic: 'https://picsum.photos/seed/admin/100', referenceId: 999 },
      { username: 'T1', password: 'password', role: 'teacher', name: teachers[0].name, profilePic: teachers[0].profilePic, referenceId: 1 },
      { username: 'T2', password: 'password', role: 'teacher', name: teachers[1].name, profilePic: teachers[1].profilePic, referenceId: 2 },
      { username: 'S1', password: 'password', role: 'student', name: students[0].name, profilePic: students[0].profilePic, referenceId: 1 },
      { username: 'S2', password: 'password', role: 'student', name: students[1].name, profilePic: students[1].profilePic, referenceId: 2 },
      { username: 'P1', password: 'password', role: 'parent', name: parents[0].name, profilePic: 'https://picsum.photos/seed/parent1/100', referenceId: 1 },
      { username: 'P2', password: 'password', role: 'parent', name: parents[1].name, profilePic: 'https://picsum.photos/seed/parent2/100', referenceId: 2 },
    ]);

    await Notice.insertMany([
      { id: 1, title: 'Annual Sports Day', date: '2024-07-20', content: 'The annual sports day will be held on the last Friday of this month.', author: 'Principal Office', targetClass: 'All', targetSection: 'All', academicYear: '2080/2081' },
      { id: 2, title: 'Parent-Teacher Meeting', date: '2024-07-18', content: 'A parent-teacher meeting is scheduled for this Saturday.', author: 'Administration', targetClass: 'All', targetSection: 'All', academicYear: '2080/2081' },
    ]);

    await Event.insertMany([
      { id: 1, title: 'Bhanu Jayanti', date: '2024-07-14', description: 'Holiday for Bhanu Jayanti.', type: 'Holiday', academicYear: '2080/2081' },
      { id: 2, title: 'Mid-Term Exams Begin', date: '2024-08-01', description: 'Mid-term examinations for all classes.', type: 'Exam', academicYear: '2080/2081' },
    ]);

    await Result.insertMany([
      { studentId: 1, examType: 'Mid Terminal', className: '10', section: 'A', marks: [
        { subject: 'Nepali', marksObtained: 85, fullMarks: 100 },
        { subject: 'English', marksObtained: 92, fullMarks: 100 },
        { subject: 'C. Maths', marksObtained: 95, fullMarks: 100 },
        { subject: 'Science', marksObtained: 88, fullMarks: 100 },
        { subject: 'Social Studies', marksObtained: 90, fullMarks: 100 },
        { subject: 'EPH', marksObtained: 89, fullMarks: 100 },
      ], totalMarks: 539, percentage: 89.83, grade: 'A+', remarks: 'Excellent', academicYear: '2080/2081' },
      { studentId: 2, examType: 'Mid Terminal', className: '10', section: 'A', marks: [
        { subject: 'Nepali', marksObtained: 78, fullMarks: 100 },
        { subject: 'English', marksObtained: 85, fullMarks: 100 },
        { subject: 'C. Maths', marksObtained: 80, fullMarks: 100 },
        { subject: 'Science', marksObtained: 82, fullMarks: 100 },
        { subject: 'Social Studies', marksObtained: 75, fullMarks: 100 },
        { subject: 'EPH', marksObtained: 81, fullMarks: 100 },
      ], totalMarks: 481, percentage: 80.17, grade: 'A', remarks: 'Very Good', academicYear: '2080/2081' },
    ]);

    await FeeInvoice.insertMany([
      { studentId: 1, amount: 16700, dueDate: '2024-07-15', status: 'Paid', academicYear: '2080/2081' },
      { studentId: 2, amount: 16700, dueDate: '2024-07-15', status: 'Paid', academicYear: '2080/2081' },
      { studentId: 3, amount: 15700, dueDate: '2024-08-15', status: 'Unpaid', academicYear: '2080/2081' },
    ]);

    await Expense.insertMany([
      { date: '2024-07-01', category: 'Salaries', description: 'Teacher and Staff Salaries for June', amount: 550000 },
      { date: '2024-07-05', category: 'Utilities', description: 'Electricity and Water Bill', amount: 35000 },
    ]);

    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
