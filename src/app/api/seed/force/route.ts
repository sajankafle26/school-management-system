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
import ClassSection from '@/lib/models/ClassSection';

export async function POST() {
  try {
    await connectDB();

    await Promise.all([
      AcademicYear.deleteMany({}),
      User.deleteMany({}),
      Student.deleteMany({}),
      Teacher.deleteMany({}),
      Parent.deleteMany({}),
      Staff.deleteMany({}),
      Driver.deleteMany({}),
      Notice.deleteMany({}),
      Event.deleteMany({}),
      Result.deleteMany({}),
      FeeInvoice.deleteMany({}),
      Expense.deleteMany({}),
      WebsiteContent.deleteMany({}),
      ClassSection.deleteMany({}),
    ]);

    const academicYears = await AcademicYear.insertMany([
      { year: '2080/2081', isCurrent: true },
      { year: '2079/2080', isCurrent: false },
      { year: '2081/2082', isCurrent: false },
    ]);

    const currentYear = academicYears[0].year;

    const classSections = await ClassSection.insertMany([
      { className: '8', section: 'A', classTeacherId: 'T1', capacity: 40, academicYear: currentYear, description: 'Grade 8 Section A' },
      { className: '8', section: 'B', classTeacherId: 'T2', capacity: 40, academicYear: currentYear, description: 'Grade 8 Section B' },
      { className: '9', section: 'A', classTeacherId: 'T3', capacity: 40, academicYear: currentYear, description: 'Grade 9 Section A' },
      { className: '9', section: 'B', classTeacherId: 'T4', capacity: 40, academicYear: currentYear, description: 'Grade 9 Section B' },
      { className: '10', section: 'A', classTeacherId: 'T5', capacity: 40, academicYear: currentYear, description: 'Grade 10 Section A' },
      { className: '10', section: 'B', classTeacherId: 'T6', capacity: 40, academicYear: currentYear, description: 'Grade 10 Section B' },
    ]);

    const parents = await Parent.insertMany([
      { name: 'Hari Thapa', contact: '9841234567', email: 'hari.thapa@email.com', address: 'Kathmandu' },
      { name: 'Gopal Sharma', contact: '9841234568', email: 'gopal.sharma@email.com', address: 'Patan' },
      { name: 'Bishnu Rai', contact: '9841234569', email: 'bishnu.rai@email.com', address: 'Bhaktapur' },
      { name: 'Manish Gurung', contact: '9841234570', email: 'manish.gurung@email.com', address: 'Pokhara' },
      { name: 'Sunita Lama', contact: '9841234571', email: 'sunita.lama@email.com', address: 'Kathmandu' },
      { name: 'Ramesh Karki', contact: '9841234572', email: 'ramesh.karki@email.com', address: 'Lalitpur' },
      { name: 'Sita Devi', contact: '9841234573', email: 'sita.devi@email.com', address: 'Bhaktapur' },
      { name: 'Krishna Bahadur', contact: '9841234574', email: 'krishna.bahadur@email.com', address: 'Kathmandu' },
      { name: 'Maya Tamang', contact: '9841234575', email: 'maya.tamang@email.com', address: 'Kirtipur' },
      { name: 'Ram Prasad', contact: '9841234576', email: 'ram.prasad@email.com', address: 'Madhyapur' },
    ]);

    const teachers = await Teacher.insertMany([
      { name: 'Hari Prasad Adhikari', nepaliName: 'हरि प्रसाद अधिकारी', subject: 'Mathematics', contact: '9851012345', email: 'hari.p@school.edu.np', profilePic: 'https://picsum.photos/seed/teacher1/100', classTeacherOf: '10 A' },
      { name: 'Shanti Devi Shrestha', nepaliName: 'शान्ति देवी श्रेष्ठ', subject: 'Science', contact: '9851012346', email: 'shanti.d@school.edu.np', profilePic: 'https://picsum.photos/seed/teacher2/100', classTeacherOf: '9 B' },
      { name: 'Manoj Kumar Chaudhary', nepaliName: 'मनोज कुमार चौधरी', subject: 'English', contact: '9851012347', email: 'manoj.k@school.edu.np', profilePic: 'https://picsum.photos/seed/teacher3/100', classTeacherOf: '8 A' },
      { name: 'Srijana Maharjan', nepaliName: 'सृजना महर्जन', subject: 'Nepali', contact: '9851012348', email: 'srijana.m@school.edu.np', profilePic: 'https://picsum.photos/seed/teacher4/100', classTeacherOf: '10 B' },
      { name: 'Bimal Raj Sharma', nepaliName: 'बिमल राज शर्मा', subject: 'Social Studies', contact: '9851012349', email: 'bimal.r@school.edu.np', profilePic: 'https://picsum.photos/seed/teacher5/100', classTeacherOf: '9 A' },
      { name: 'Anju Karki', nepaliName: 'अन्जु कार्की', subject: 'EPH', contact: '9851012350', email: 'anju.k@school.edu.np', profilePic: 'https://picsum.photos/seed/teacher6/100', classTeacherOf: '8 B' },
    ]);

    const students = await Student.insertMany([
      { name: 'Ram Thapa', nepaliName: 'राम थापा', className: '10', section: 'A', roll: 1, dob: '2008-05-12', guardianName: 'Hari Thapa', contact: '9841234567', address: 'Kathmandu', profilePic: 'https://picsum.photos/seed/student1/100', parentId: 1, busId: 1, rfidCardId: 'RFID001', academicYear: currentYear },
      { name: 'Sita Sharma', nepaliName: 'सीता शर्मा', className: '10', section: 'A', roll: 2, dob: '2008-03-22', guardianName: 'Gopal Sharma', contact: '9841234568', address: 'Patan', profilePic: 'https://picsum.photos/seed/student2/100', parentId: 2, busId: 2, rfidCardId: 'RFID002', academicYear: currentYear },
      { name: 'Gita Rai', nepaliName: 'गीता राई', className: '9', section: 'B', roll: 1, dob: '2009-01-15', guardianName: 'Bishnu Rai', contact: '9841234569', address: 'Bhaktapur', profilePic: 'https://picsum.photos/seed/student3/100', parentId: 3, busId: 1, rfidCardId: 'RFID003', academicYear: currentYear },
      { name: 'Nabin Gurung', nepaliName: 'नवीन गुरुङ', className: '8', section: 'A', roll: 1, dob: '2010-07-30', guardianName: 'Manish Gurung', contact: '9841234570', address: 'Pokhara', profilePic: 'https://picsum.photos/seed/student4/100', parentId: 4, rfidCardId: 'RFID004', academicYear: currentYear },
      { name: 'Anjali Lama', nepaliName: 'अन्जली लामा', className: '10', section: 'A', roll: 3, dob: '2008-09-02', guardianName: 'Sunita Lama', contact: '9841234571', address: 'Kathmandu', profilePic: 'https://picsum.photos/seed/student5/100', parentId: 5, busId: 2, rfidCardId: 'RFID005', academicYear: currentYear },
      { name: 'Suman Karki', nepaliName: 'सुमन कार्की', className: '9', section: 'A', roll: 1, dob: '2009-11-10', guardianName: 'Ramesh Karki', contact: '9841234572', address: 'Lalitpur', profilePic: 'https://picsum.photos/seed/student6/100', parentId: 6, busId: 1, rfidCardId: 'RFID006', academicYear: currentYear },
      { name: 'Pooja Devi', nepaliName: 'पूजा देवी', className: '8', section: 'B', roll: 1, dob: '2010-02-18', guardianName: 'Sita Devi', contact: '9841234573', address: 'Bhaktapur', profilePic: 'https://picsum.photos/seed/student7/100', parentId: 7, rfidCardId: 'RFID007', academicYear: currentYear },
      { name: 'Bikash Bahadur', nepaliName: 'बिकाश बहादुर', className: '10', section: 'B', roll: 1, dob: '2008-12-25', guardianName: 'Krishna Bahadur', contact: '9841234574', address: 'Kathmandu', profilePic: 'https://picsum.photos/seed/student8/100', parentId: 8, busId: 2, rfidCardId: 'RFID008', academicYear: currentYear },
      { name: 'Nisha Tamang', nepaliName: 'निशा तामाङ', className: '9', section: 'B', roll: 2, dob: '2009-06-08', guardianName: 'Maya Tamang', contact: '9841234575', address: 'Kirtipur', profilePic: 'https://picsum.photos/seed/student9/100', parentId: 9, busId: 1, rfidCardId: 'RFID009', academicYear: currentYear },
      { name: 'Arjun Prasad', nepaliName: 'अर्जुन प्रसाद', className: '8', section: 'A', roll: 2, dob: '2010-04-14', guardianName: 'Ram Prasad', contact: '9841234576', address: 'Madhyapur', profilePic: 'https://picsum.photos/seed/student10/100', parentId: 10, rfidCardId: 'RFID010', academicYear: currentYear },
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
      { username: 'T3', password: 'password', role: 'teacher', name: teachers[2].name, profilePic: teachers[2].profilePic, referenceId: 3 },
      { username: 'T4', password: 'password', role: 'teacher', name: teachers[3].name, profilePic: teachers[3].profilePic, referenceId: 4 },
      { username: 'T5', password: 'password', role: 'teacher', name: teachers[4].name, profilePic: teachers[4].profilePic, referenceId: 5 },
      { username: 'T6', password: 'password', role: 'teacher', name: teachers[5].name, profilePic: teachers[5].profilePic, referenceId: 6 },
      { username: 'S1', password: 'password', role: 'student', name: students[0].name, profilePic: students[0].profilePic, referenceId: 1 },
      { username: 'S2', password: 'password', role: 'student', name: students[1].name, profilePic: students[1].profilePic, referenceId: 2 },
      { username: 'S3', password: 'password', role: 'student', name: students[2].name, profilePic: students[2].profilePic, referenceId: 3 },
      { username: 'S4', password: 'password', role: 'student', name: students[3].name, profilePic: students[3].profilePic, referenceId: 4 },
      { username: 'S5', password: 'password', role: 'student', name: students[4].name, profilePic: students[4].profilePic, referenceId: 5 },
      { username: 'P1', password: 'password', role: 'parent', name: parents[0].name, profilePic: 'https://picsum.photos/seed/parent1/100', referenceId: 1 },
      { username: 'P2', password: 'password', role: 'parent', name: parents[1].name, profilePic: 'https://picsum.photos/seed/parent2/100', referenceId: 2 },
      { username: 'P3', password: 'password', role: 'parent', name: parents[2].name, profilePic: 'https://picsum.photos/seed/parent3/100', referenceId: 3 },
      { username: 'ST1', password: 'password', role: 'staff', name: 'Ramesh Bhandari', profilePic: 'https://picsum.photos/seed/staff1/100', referenceId: 1 },
      { username: 'D1', password: 'password', role: 'driver', name: 'Ram Bahadur', profilePic: 'https://picsum.photos/seed/driver1/100', referenceId: 1 },
    ]);

    await Notice.insertMany([
      { title: 'Annual Sports Day', date: '2024-07-20', content: 'The annual sports day will be held on the last Friday of this month. All students must participate.', author: 'Principal Office', targetClass: 'All', targetSection: 'All', academicYear: currentYear },
      { title: 'Parent-Teacher Meeting', date: '2024-07-18', content: 'A parent-teacher meeting is scheduled for this Saturday at 10 AM. Please attend.', author: 'Administration', targetClass: 'All', targetSection: 'All', academicYear: currentYear },
      { title: 'Mid-Term Exam Schedule', date: '2024-07-15', content: 'Mid-term examinations begin from August 1st. Please check the detailed schedule.', author: 'Exam Committee', targetClass: 'All', targetSection: 'All', academicYear: currentYear },
      { title: 'School Bus Route Change', date: '2024-07-12', content: 'Bus route 2 has been modified. Please check new timings.', author: 'Transport Dept', targetClass: 'All', targetSection: 'All', academicYear: currentYear },
      { title: 'Library New Books', date: '2024-07-10', content: 'New books have arrived in the library. Students can borrow from Monday.', author: 'Librarian', targetClass: 'All', targetSection: 'All', academicYear: currentYear },
    ]);

    await Event.insertMany([
      { title: 'Bhanu Jayanti', date: '2024-07-14', description: 'Holiday for Bhanu Jayanti.', type: 'Holiday', academicYear: currentYear },
      { title: 'Mid-Term Exams Begin', date: '2024-08-01', description: 'Mid-term examinations for all classes.', type: 'Exam', academicYear: currentYear },
      { title: 'Sports Day', date: '2024-07-25', description: 'Annual Sports Day celebration.', type: 'Event', academicYear: currentYear },
      { title: 'Parent Day', date: '2024-08-15', description: 'Parent Day celebration and PTM.', type: 'Event', academicYear: currentYear },
      { title: 'Independence Day', date: '2024-08-15', description: 'National holiday.', type: 'Holiday', academicYear: currentYear },
    ]);

    await Result.insertMany([
      { studentId: 1, examType: 'Mid Terminal', className: '10', section: 'A', marks: [{ subject: 'Nepali', marksObtained: 85, fullMarks: 100 }, { subject: 'English', marksObtained: 92, fullMarks: 100 }, { subject: 'C. Maths', marksObtained: 95, fullMarks: 100 }, { subject: 'Science', marksObtained: 88, fullMarks: 100 }, { subject: 'Social Studies', marksObtained: 90, fullMarks: 100 }, { subject: 'EPH', marksObtained: 89, fullMarks: 100 }], totalMarks: 539, percentage: 89.83, grade: 'A+', remarks: 'Excellent', academicYear: currentYear },
      { studentId: 2, examType: 'Mid Terminal', className: '10', section: 'A', marks: [{ subject: 'Nepali', marksObtained: 78, fullMarks: 100 }, { subject: 'English', marksObtained: 85, fullMarks: 100 }, { subject: 'C. Maths', marksObtained: 80, fullMarks: 100 }, { subject: 'Science', marksObtained: 82, fullMarks: 100 }, { subject: 'Social Studies', marksObtained: 75, fullMarks: 100 }, { subject: 'EPH', marksObtained: 81, fullMarks: 100 }], totalMarks: 481, percentage: 80.17, grade: 'A', remarks: 'Very Good', academicYear: currentYear },
      { studentId: 3, examType: 'Mid Terminal', className: '9', section: 'B', marks: [{ subject: 'Nepali', marksObtained: 82, fullMarks: 100 }, { subject: 'English', marksObtained: 78, fullMarks: 100 }, { subject: 'C. Maths', marksObtained: 85, fullMarks: 100 }, { subject: 'Science', marksObtained: 80, fullMarks: 100 }, { subject: 'Social Studies', marksObtained: 77, fullMarks: 100 }, { subject: 'EPH', marksObtained: 79, fullMarks: 100 }], totalMarks: 481, percentage: 80.17, grade: 'A', remarks: 'Very Good', academicYear: currentYear },
      { studentId: 4, examType: 'Mid Terminal', className: '8', section: 'A', marks: [{ subject: 'Nepali', marksObtained: 90, fullMarks: 100 }, { subject: 'English', marksObtained: 88, fullMarks: 100 }, { subject: 'C. Maths', marksObtained: 92, fullMarks: 100 }, { subject: 'Science', marksObtained: 85, fullMarks: 100 }, { subject: 'Social Studies', marksObtained: 87, fullMarks: 100 }, { subject: 'EPH', marksObtained: 88, fullMarks: 100 }], totalMarks: 530, percentage: 88.33, grade: 'A+', remarks: 'Excellent', academicYear: currentYear },
      { studentId: 5, examType: 'Mid Terminal', className: '10', section: 'A', marks: [{ subject: 'Nepali', marksObtained: 80, fullMarks: 100 }, { subject: 'English', marksObtained: 82, fullMarks: 100 }, { subject: 'C. Maths', marksObtained: 88, fullMarks: 100 }, { subject: 'Science', marksObtained: 79, fullMarks: 100 }, { subject: 'Social Studies', marksObtained: 81, fullMarks: 100 }, { subject: 'EPH', marksObtained: 78, fullMarks: 100 }], totalMarks: 488, percentage: 81.33, grade: 'A', remarks: 'Very Good', academicYear: currentYear },
    ]);

    await FeeInvoice.insertMany([
      { studentId: 1, amount: 16700, dueDate: '2024-07-15', status: 'Paid', academicYear: currentYear },
      { studentId: 2, amount: 16700, dueDate: '2024-07-15', status: 'Paid', academicYear: currentYear },
      { studentId: 3, amount: 15700, dueDate: '2024-08-15', status: 'Unpaid', academicYear: currentYear },
      { studentId: 4, amount: 14700, dueDate: '2024-07-20', status: 'Paid', academicYear: currentYear },
      { studentId: 5, amount: 16700, dueDate: '2024-07-15', status: 'Partial', academicYear: currentYear },
      { studentId: 6, amount: 15700, dueDate: '2024-08-15', status: 'Unpaid', academicYear: currentYear },
      { studentId: 7, amount: 14700, dueDate: '2024-07-20', status: 'Paid', academicYear: currentYear },
      { studentId: 8, amount: 16700, dueDate: '2024-07-15', status: 'Unpaid', academicYear: currentYear },
      { studentId: 9, amount: 15700, dueDate: '2024-08-15', status: 'Paid', academicYear: currentYear },
      { studentId: 10, amount: 14700, dueDate: '2024-07-20', status: 'Partial', academicYear: currentYear },
    ]);

    await Expense.insertMany([
      { date: '2024-07-01', category: 'Salaries', description: 'Teacher and Staff Salaries for June', amount: 550000 },
      { date: '2024-07-05', category: 'Utilities', description: 'Electricity and Water Bill', amount: 35000 },
      { date: '2024-07-10', category: 'Supplies', description: 'Stationery and Office Supplies', amount: 25000 },
      { date: '2024-07-15', category: 'Maintenance', description: 'Building Maintenance and Repairs', amount: 45000 },
      { date: '2024-07-20', category: 'Transport', description: 'Bus Fuel and Maintenance', amount: 30000 },
    ]);

    await WebsiteContent.create({
      schoolName: 'Shree Adarsha Secondary School',
      logoUrl: 'https://emojicdn.elk.sh/🇳🇵',
      themeColor: '#4f46e5',
      topBar: { showTopBar: true, phone: '+977-1-4412345', email: 'info@adarshaschool.edu.np', address: 'Kathmandu, Nepal' },
      hero: { title: 'Quality Education for Tomorrow\'s Leaders', subtitle: 'Shree Adarsha Secondary School - Established 2050 BS', backgroundImage: 'https://picsum.photos/seed/school-hero/1920', ctaText: 'Admissions Open', ctaLink: '/contact' },
      stats: { students: 500, teachers: 35, passRate: 98, years: 28 },
      features: [
        { title: 'Experienced Faculty', description: 'Highly qualified teachers dedicated to student success', icon: '👨‍🏫' },
        { title: 'Modern Facilities', description: 'Well-equipped labs, library, and sports facilities', icon: '🏫' },
        { title: 'Digital Learning', description: 'Smart classrooms with modern technology', icon: '💻' },
        { title: 'Holistic Development', description: 'Sports, arts, and extracurricular activities', icon: '🎭' },
      ],
      about: { mission: 'To provide quality education that nurtures intellectual, physical, and moral development of students.', vision: 'To be a leading educational institution producing responsible global citizens.', history: 'Established in 2050 BS, Shree Adarsha Secondary School has been serving the community for over 28 years with excellence in education.' },
      contact: { phone: '+977-1-4412345', email: 'info@adarshaschool.edu.np', address: 'Kathmandu, Nepal', mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.1234!2d85.324!3d27.717!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQzJzAxLjIiTiA4NcKwMTknMjYuNCJF!5e0!3m2!1sen!2snp!4v1234567890' },
      notices: [],
      galleries: [{ title: 'Sports Day 2024', images: ['https://picsum.photos/seed/sports1/400', 'https://picsum.photos/seed/sports2/400', 'https://picsum.photos/seed/sports3/400'] }, { title: 'Annual Function', images: ['https://picsum.photos/seed/function1/400', 'https://picsum.photos/seed/function2/400'] }],
    });

    return NextResponse.json({ 
      message: 'Database force-seeded successfully',
      counts: {
        academicYears: academicYears.length,
        classSections: classSections.length,
        parents: parents.length,
        teachers: teachers.length,
        students: students.length,
        staff: 3,
        drivers: 2,
        users: 1 + teachers.length + students.length + parents.length + 1 + 1,
        notices: 5,
        events: 5,
        results: 5,
        feeInvoices: 10,
        expenses: 5,
      }
    });
  } catch (error) {
    console.error('Force seed error:', error);
    return NextResponse.json({ error: 'Failed to force seed database' }, { status: 500 });
  }
}