export type Page = 'Dashboard' | 'Students' | 'Parents' | 'Teachers' | 'Staff' | 'Attendance' | 'Notices' | 'Academic Calendar' | 'Results' | 'Academics' | 'Accounting' | 'Library' | 'SMS Services' | 'Routines' | 'Homework' | 'Academic Settings' | 'Website CMS' | 'Transport' | 'Class Sections';

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | 'staff' | 'driver';

export interface User {
  id: number;
  username: string;
  password?: string; // Should not be sent to client in real app
  role: UserRole;
  name: string;
  profilePic: string;
  referenceId: number; // e.g., studentId, teacherId, parentId, staffId, driverId
}

export interface AcademicYear {
  _id?: string;
  year: string;
  isCurrent: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Parent {
  _id?: string;
  id: number;
  name: string;
  contact: string;
  email: string;
  address?: string;
}

export interface Student {
  _id?: string;
  id: number;
  name: string;
  nepaliName: string;
  className: string;
  section: string;
  roll: number;
  dob: string;
  guardianName: string;
  contact: string;
  address: string;
  profilePic: string;
  parentId: number;
  busId?: number;
  rfidCardId?: string;
  academicYear: string;
  attendance?: { present: number; absent: number; total: number };
}

export interface Teacher {
  _id?: string;
  id: number;
  name: string;
  nepaliName: string;
  subject: string;
  contact: string;
  email: string;
  profilePic: string;
  classTeacherOf?: string;
}

export interface Staff {
  _id?: string;
  id: number;
  name: string;
  nepaliName: string;
  jobTitle: string;
  contact: string;
  email: string;
  profilePic: string;
}

export interface Driver {
  _id?: string;
  id: number;
  name: string;
  contact: string;
  licenseNumber: string;
  profilePic: string;
  busId: number;
}

export interface Notice {
  _id?: string;
  id: number;
  title: string;
  date: string;
  content: string;
  author: string;
  targetClass?: string;
  targetSection?: string;
  academicYear: string;
}

export interface Event {
  _id?: string;
  id: number;
  title: string;
  date: string;
  description: string;
  type: 'Holiday' | 'Event' | 'Exam';
  academicYear: string;
}

export interface ClassSection {
  _id: string;
  className: string;
  section: string;
  classTeacherId?: string;
  capacity: number;
  academicYear: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubjectMark {
  subject: string;
  marksObtained: number;
  fullMarks: number;
}

export interface Result {
  _id?: string;
  id: number;
  studentId: number;
  examType: 'First Terminal' | 'Mid Terminal' | 'Final Terminal';
  className: string;
  section: string;
  marks: SubjectMark[];
  totalMarks: number;
  percentage: number;
  grade: string;
  remarks: 'Excellent' | 'Very Good' | 'Good' | 'Needs Improvement';
  rank?: number;
  academicYear: string;
}

export interface Syllabus {
  className: string;
  subjects: string[];
}

// New Financials Types
export interface FeeStructure {
  className: string;
  tuition: number;
  library: number;
  lab: number;
  other: number;
}

export interface FeeInvoice {
  _id?: string;
  id: number;
  studentId: number;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue' | 'Partial';
  academicYear: string;
}

export interface Expense {
  _id?: string;
  id: number;
  date: string;
  category: 'Salaries' | 'Utilities' | 'Supplies' | 'Maintenance' | 'Other';
  description: string;
  amount: number;
}

export interface AttendanceRecord {
  studentId: number;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'late';
  academicYear: string;
}

// RFID Attendance Log
export interface RfidLog {
    id: number;
    studentId: number;
    timestamp: string; // ISO string
    status: 'Check-in' | 'Check-out';
}

export interface Homework {
  id: number;
  className: string;
  section: string;
  subject: string;
  title: string;
  description: string;
  assignedByTeacherId: number;
  dueDate: string; // YYYY-MM-DD
  imageUrl?: string;
  academicYear: string;
  status?: 'Pending' | 'Due Today' | 'Upcoming' | 'Completed' | 'Draft';
  priority?: 'High' | 'Medium' | 'Low';
}

// Library Types
export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  totalCopies: number;
  availableCopies: number;
}

export interface IssuedBook {
  id: number;
  bookId: number;
  studentId: number;
  issueDate: string; // YYYY-MM-DD
  returnDate: string | null; // YYYY-MM-DD or null if not returned
  dueDate: string; // YYYY-MM-DD
  academicYear: string;
}

// New Accounting Types
export type LedgerAccountType = 'Asset' | 'Liability' | 'Income' | 'Expense' | 'Capital';

export interface LedgerAccount {
  id: number;
  name: string;
  type: LedgerAccountType;
}

export interface Transaction {
  id: number;
  date: string; // YYYY-MM-DD
  description: string;
  debitAccountId: number;
  creditAccountId: number;
  amount: number;
  academicYear: string;
}

// SMS Service Types
export interface SentSms {
    id: number;
    recipientGroup: string;
    recipientCount: number;
    message: string;
    sentDate: string; // YYYY-MM-DD HH:mm
}

// Routines Management Types
export interface Period {
  period: number;
  time: string;
}

export interface RoutineEntry {
  period: number;
  subject: string;
  teacherId: number | null;
}

export interface ClassRoutine {
  className: string;
  section: string;
  routine: {
    [day: string]: RoutineEntry[]; // day: "Sunday", "Monday", etc.
  };
  academicYear: string;
}

// Transport Management Types
export interface Bus {
    id: number;
    busNumber: string;
    driverName: string;
    driverContact: string;
    route: string;
    currentPosition: { x: number, y: number }; // x as percentage (0-100)
}

// Website CMS Types
export interface GalleryImage {
  id: number;
  url: string;
  caption: string;
}

export interface Gallery {
  id: number;
  title: string;
  images: GalleryImage[];
}

export interface WebsiteContent {
  schoolName: string;
  logoUrl: string;
  themeColor: string; // hex code
  topBar: {
    showTopBar: boolean;
    phone: string;
    email: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroImageUrl: string;
    welcomeTitle: string;
    welcomeMessage: string;
  };
  about: {
    title: string;
    content: string;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    mapEmbedUrl: string;
  };
  galleries: Gallery[];
}