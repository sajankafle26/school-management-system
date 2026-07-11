'use client';

import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { User } from '../types';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItemConfig {
  label: string;
  icon?: string;
  path?: string;
  tab?: string;
  badge?: { text: string; color: string };
  children?: NavItemConfig[];
}

const navConfig: Record<string, { section: string; items: NavItemConfig[] }[]> = {
  admin: [
    {
      section: 'MAIN NAVIGATION', items: [
        { label: 'Dashboard', icon: 'speedometer', path: '/dashboard/admin', tab: 'overview' },
      ]
    },
    {
      section: 'MANAGEMENT', items: [
        { label: 'Students', icon: 'people', path: '/dashboard/admin/students' },
        { label: 'Teachers', icon: 'person', path: '/dashboard/admin/teachers' },
        { label: 'Parents', icon: 'people', path: '/dashboard/admin/parents' },
        { label: 'Staff', icon: 'briefcase', path: '/dashboard/admin/staff' },
        { label: 'Drivers', icon: 'truck', path: '/dashboard/admin/drivers' },
        {
          label: 'Attendance', icon: 'calendar-check', children: [
            { label: 'Student Attendance', path: '/dashboard/admin/attendance', tab: 'student' },
            { label: 'Teacher Attendance', path: '/dashboard/admin/attendance', tab: 'teacher' },
            { label: 'Staff Attendance', path: '/dashboard/admin/attendance', tab: 'staff' },
          ]
        },
      ]
    },
    {
      section: 'ACADEMIC', items: [
        {
          label: 'Classes', icon: 'building', children: [
            { label: 'Class 8', path: '/dashboard/admin/class-sections', tab: '8' },
            { label: 'Class 9', path: '/dashboard/admin/class-sections', tab: '9' },
            { label: 'Class 10', path: '/dashboard/admin/class-sections', tab: '10' },
          ]
        },
        { label: 'Subject', icon: 'book', path: '/dashboard/admin/subjects' },
        { label: 'Section', icon: 'building', path: '/dashboard/admin/class-sections' },
        { label: 'Routine', icon: 'table', path: '/dashboard/admin', tab: 'routines' },
        { label: 'Academic Years', icon: 'calendar', path: '/dashboard/admin/academic-years' },
        { label: 'Assignment', icon: 'pencil', path: '/dashboard/admin/homework' },
      ]
    },
    {
      section: 'ASSESSMENT', items: [
        { label: 'Results', icon: 'graph-up', path: '/dashboard/admin/results' },
        {
          label: 'Exams', icon: 'pencil', children: [
            { label: 'Exam List', path: '/dashboard/admin/exams' },
            { label: 'Exam Schedule', path: '/dashboard/admin/exams', tab: 'schedule' },
            { label: 'Grades', path: '/dashboard/admin/grades' },
          ]
        },
        { label: 'Question Bank', icon: 'pencil', path: '/dashboard/admin/question-bank' },
        { label: 'Syllabus', icon: 'book', path: '/dashboard/admin', tab: 'syllabus' },
      ]
    },
    {
      section: 'LIBRARY', items: [
        {
          label: 'Library', icon: 'book', children: [
            { label: 'Books', path: '/dashboard/admin/library', tab: 'books' },
            { label: 'Issue/Return', path: '/dashboard/admin/library', tab: 'issue' },
          ]
        },
      ]
    },
    {
      section: 'FINANCE', items: [
        { label: 'Fee Invoices', icon: 'wallet', path: '/dashboard/admin/fee-invoices' },
        { label: 'Expenses', icon: 'cash', path: '/dashboard/admin/expenses' },
      ]
    },
    {
      section: 'TRANSPORT & HOSTEL', items: [
        { label: 'Transport Routes', icon: 'truck', path: '/dashboard/admin/transport-routes' },
        { label: 'Drivers', icon: 'truck', path: '/dashboard/admin/drivers' },
        { label: 'Hostel', icon: 'building', path: '/dashboard/admin/hostel' },
      ]
    },
    {
      section: 'ADMISSION', items: [
        { label: 'Online Admissions', icon: 'people', path: '/dashboard/admin/online-admissions' },
      ]
    },
    {
      section: 'SERVICES', items: [
        { label: 'Notices', icon: 'megaphone', path: '/dashboard/admin/notices' },
        { label: 'Events', icon: 'calendar-event', path: '/dashboard/admin/events' },
        { label: 'SMS Services', icon: 'chat', path: '/dashboard/admin', tab: 'sms' },
      ]
    },
    {
      section: 'SETTINGS', items: [
        { label: 'Website CMS', icon: 'globe', path: '/dashboard/admin', tab: 'website' },
      ]
    },
  ],
  teacher: [
    {
      section: 'MAIN NAVIGATION', items: [
        { label: 'Dashboard', icon: 'speedometer', path: '/dashboard/teacher', tab: 'overview' },
      ]
    },
    {
      section: 'MANAGEMENT', items: [
        {
          label: 'Attendance', icon: 'calendar-check', children: [
            { label: 'Mark Attendance', path: '/dashboard/teacher', tab: 'attendance' },
            { label: 'Attendance Report', path: '/dashboard/teacher', tab: 'attendance-report' },
          ]
        },
      ]
    },
    {
      section: 'ACADEMIC', items: [
        { label: 'Subject', icon: 'book', path: '/dashboard/teacher', tab: 'subject' },
        { label: 'Routine', icon: 'table', path: '/dashboard/teacher', tab: 'routines' },
        { label: 'Assignment', icon: 'pencil', path: '/dashboard/teacher', tab: 'homework' },
      ]
    },
    {
      section: 'ASSESSMENT', items: [
        { label: 'Results', icon: 'graph-up', path: '/dashboard/teacher', tab: 'results' },
        { label: 'Syllabus', icon: 'book', path: '/dashboard/teacher', tab: 'syllabus' },
      ]
    },
    {
      section: 'SERVICES', items: [
        { label: 'Notices', icon: 'megaphone', path: '/dashboard/teacher', tab: 'notices' },
        { label: 'Events', icon: 'calendar-event', path: '/dashboard/teacher', tab: 'events' },
        { label: 'Library', icon: 'book', path: '/dashboard/teacher', tab: 'library' },
        { label: 'SMS Services', icon: 'chat', path: '/dashboard/teacher', tab: 'sms' },
      ]
    },
  ],
  student: [
    {
      section: 'MAIN NAVIGATION', items: [
        { label: 'Dashboard', icon: 'speedometer', path: '/dashboard/student', tab: 'overview' },
      ]
    },
    {
      section: 'ACADEMIC', items: [
        { label: 'Results', icon: 'graph-up', path: '/dashboard/student', tab: 'results' },
        { label: 'Homework', icon: 'pencil', path: '/dashboard/student', tab: 'homework' },
        {
          label: 'Attendance', icon: 'calendar-check', children: [
            { label: 'My Attendance', path: '/dashboard/student', tab: 'attendance' },
            { label: 'Attendance Report', path: '/dashboard/student', tab: 'attendance-report' },
          ]
        },
        { label: 'Routines', icon: 'table', path: '/dashboard/student', tab: 'routines' },
        { label: 'Syllabus', icon: 'book', path: '/dashboard/student', tab: 'syllabus' },
        { label: 'Library', icon: 'book', path: '/dashboard/student', tab: 'library' },
      ]
    },
    {
      section: 'SERVICES', items: [
        { label: 'Notices', icon: 'megaphone', path: '/dashboard/student', tab: 'notices' },
        { label: 'Events', icon: 'calendar-event', path: '/dashboard/student', tab: 'events' },
        { label: 'Fee Status', icon: 'wallet', path: '/dashboard/student', tab: 'fees' },
      ]
    },
  ],
  parent: [
    {
      section: 'MAIN NAVIGATION', items: [
        { label: 'Dashboard', icon: 'speedometer', path: '/dashboard/parent', tab: 'overview' },
      ]
    },
    {
      section: 'CHILDREN', items: [
        { label: 'Results', icon: 'graph-up', path: '/dashboard/parent', tab: 'results' },
        {
          label: 'Attendance', icon: 'calendar-check', children: [
            { label: 'My Child\'s Attendance', path: '/dashboard/parent', tab: 'attendance' },
            { label: 'Attendance Report', path: '/dashboard/parent', tab: 'attendance-report' },
          ]
        },
        { label: 'Homework', icon: 'pencil', path: '/dashboard/parent', tab: 'homework' },
      ]
    },
    {
      section: 'FINANCE', items: [
        { label: 'Fee Details', icon: 'wallet', path: '/dashboard/parent', tab: 'fees' },
        { label: 'Payment History', icon: 'clock', path: '/dashboard/parent', tab: 'payments' },
      ]
    },
    {
      section: 'SERVICES', items: [
        { label: 'Notices', icon: 'megaphone', path: '/dashboard/parent', tab: 'notices' },
        { label: 'Events', icon: 'calendar-event', path: '/dashboard/parent', tab: 'events' },
        { label: 'Messages', icon: 'chat', path: '/dashboard/parent', tab: 'messages' },
      ]
    },
  ],
};

const icons: Record<string, React.ReactNode> = {
  speedometer: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 2a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V2.5A.5.5 0 0 1 8 2zM3.732 3.732a.5.5 0 0 1 .707 0l.457.457a.5.5 0 1 1-.707.707l-.457-.457a.5.5 0 0 1 0-.707zM12.268 3.732a.5.5 0 0 1 0 .707l-.457.457a.5.5 0 1 1-.707-.707l.457-.457a.5.5 0 0 1 .707 0zM8 5a5 5 0 1 0 0 10A5 5 0 0 0 8 5zm0 1a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V9a.5.5 0 0 1 .5-.5z"/></svg>,
  people: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>,
  person: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg>,
  briefcase: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5zm1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0zM1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5z"/></svg>,
  truck: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H6a2 2 0 1 1-4 0 1 1 0 0 1-1-1v-1.5-.5-.5v-1-.5A.5.5 0 0 1 1.5 7H3V3.5zm1 4.5H3v4.5a1 1 0 0 0 2 0V8h1v3.5a1 1 0 0 0 2 0V4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5V8zm11 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-8-7v3h8V8.5a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5z"/></svg>,
  'calendar-check': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>,
  'graph-up': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M0 0h1v15h15v1H0V0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07z"/></svg>,
  building: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.898V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022zM6 8.56 1.26 10.23 6 11.918l4.74-1.688L6 8.56zm7.5-1.476-7.5 3.089v4.01l7.5-3.09V7.084z"/></svg>,
  calendar: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>,
  pencil: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>,
  book: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M1 2.828c.885-.37 2.154-.769 4-.388C6.5 2.802 8.6 4 10 4c.423 0 .815-.018 1.168-.057C12.6 3.683 14.47 2.83 15 2.5v11c-.53.33-2.4 1.183-3.832 1.443A10.247 10.247 0 0 1 10 15c-1.4 0-3.5-1.198-5-1.598-1.846-.381-3.115-.018-4 .388V2.828zm-.5 10.69V2.263c-.47.248-.5.502-.5.737v10c0 .235.03.489.5.737zm.5-.737v-10.69c-.5.248-.5.502-.5.737v10c0 .235.03.489.5.737zM15 2.5v11c.5-.248.5-.502.5-.737V3c0-.235-.03-.489-.5-.737z"/></svg>,
  table: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"/></svg>,
  wallet: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-.5a.5.5 0 0 1 0 1H14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a2 2 0 0 1-2-2V3z"/><path d="M3 5.5A.5.5 0 0 1 3.5 5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 8.5A.5.5 0 0 1 3.5 8h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 3A.5.5 0 0 1 3.5 11h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5z"/></svg>,
  cash: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0-1a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/><path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V4zm1 0v4h.5a.5.5 0 0 0 .5-.5v-.5a.5.5 0 0 1 .5-.5H3a.5.5 0 0 1 .5.5v.5a.5.5 0 0 0 .5.5H5a.5.5 0 0 0 .5-.5V7a.5.5 0 0 1 .5-.5h.5A.5.5 0 0 1 7 7v.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V7a.5.5 0 0 1 .5-.5H10a.5.5 0 0 1 .5.5v.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V7a.5.5 0 0 1 .5-.5h.5a.5.5 0 0 1 .5.5v.5a.5.5 0 0 0 .5.5H15V4H1zm11 7a.5.5 0 0 1 .5-.5h.5a.5.5 0 0 1 .5.5v.5a.5.5 0 0 0 .5.5H15v-3h-.5a.5.5 0 0 1-.5-.5V8a.5.5 0 0 0-.5-.5H13a.5.5 0 0 0-.5.5v.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V8a.5.5 0 0 0-.5-.5H9.5a.5.5 0 0 0-.5.5v.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V8a.5.5 0 0 0-.5-.5H6a.5.5 0 0 0-.5.5v.5a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V8a.5.5 0 0 0-.5-.5h-.5A.5.5 0 0 0 2 8v.5a.5.5 0 0 1-.5.5H1v3h.5a.5.5 0 0 0 .5-.5v-.5A.5.5 0 0 1 3 11h.5a.5.5 0 0 1 .5.5v.5a.5.5 0 0 0 .5.5H5a.5.5 0 0 0 .5-.5v-.5a.5.5 0 0 1 .5-.5h.5a.5.5 0 0 1 .5.5v.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-.5a.5.5 0 0 1 .5-.5H10a.5.5 0 0 1 .5.5v.5a.5.5 0 0 0 .5.5h.5a.5.5 0 0 0 .5-.5v-.5z"/></svg>,
  megaphone: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M14 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-1 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0z"/><path fillRule="evenodd" d="M0 8a3 3 0 0 1 3-3h1l5-3v12L4 11H3a3 3 0 0 1-3-3zm3-2a2 2 0 0 0-2 2 2 2 0 0 0 2 2h.5V6H3zm5 4.53V3.47l-3.5 2.1V10.5l3.5 2.03zM11 9V7h1.5a.5.5 0 0 1 0 1H11z"/></svg>,
  'calendar-event': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>,
  chat: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/></svg>,
  globe: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4c.147-.707.38-1.345.678-1.9C3.7 2.567 2.87 3.584 2.315 4H4.09zm-.582 3.5A7.59 7.59 0 0 1 4.09 5h-1.78c.26.966.566 1.945.967 2.5H3.508zm1.974 0c.203-1.275.658-2.39 1.213-3.2C6.268 3.247 5.825 4.374 5.605 5.8l-.123 1.7h1.022zM4.717 11.5c-.514-.586-.965-1.36-1.299-2.17H2.08c.414.806.968 1.556 1.63 2.17h1.007zm-.884 1A8.056 8.056 0 0 1 2.2 9.117c-.262.534-.448 1.103-.553 1.69.537.285 1.12.513 1.742.693h.444zm2.206 1.497c-.744-.216-1.44-.553-2.073-1H4.35a6.622 6.622 0 0 0 1.69 1h.026v0zm.46 0v-1.5h-.457q.017.04.057.09c.128.167.259.373.4.644V14zm1.5.197c.2-.327.398-.69.563-1.1.024-.058.047-.117.07-.177H7.5V14c.341 0 .668-.045.98-.13zm1.67-1.71c.044.09.088.18.13.27.162.381.286.72.354 1.01h.5a6.79 6.79 0 0 0 1.355-.897c.07-.062.138-.126.205-.19.08-.077.158-.156.233-.238l-.05-.143c-.273-.78-.715-1.377-1.074-1.722a1.464 1.464 0 0 0-.332-.245c-.168-.092-.367-.132-.572-.132h-.554l-.067.35c-.07.362-.186.7-.33.994-.047.097-.1.19-.154.28l.097.3c.06.183.124.36.2.533l.1.023v.001zm1.06-3.355c.25.215.518.56.74 1.028.066.139.126.286.18.44.057-.325.079-.66.062-1H12c.133 0 .254.021.36.054l.106-.522h-.779z"/></svg>,
  clock: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/></svg>,
};

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, collapsed, onToggle }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const allSections = new Set<string>();
  Object.values(navConfig).forEach(roleSections => roleSections.forEach(s => { if (s.section) allSections.add(`__section__${s.section}`); }));
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(allSections));

  const navSections = navConfig[user.role] || [];

  const isActive = (path?: string, tab?: string) => {
    if (!path) return false;
    if (pathname !== path) return false;
    if (!tab) return currentTab === 'overview';
    return currentTab === tab;
  };

  const hasActiveChild = (items: NavItemConfig[]): boolean => {
    return items.some(item => {
      if (isActive(item.path, item.tab)) return true;
      if (item.children) return hasActiveChild(item.children);
      return false;
    });
  };

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const handleNavClick = (path?: string, tab?: string) => {
    if (path && tab) {
      router.push(`${path}?tab=${tab}`);
    } else if (path) {
      router.push(path);
    }
  };

  return (
    <aside
      className={`app-sidebar d-flex flex-column flex-shrink-0 ${collapsed ? 'collapsed' : ''}`}
      data-bs-theme="dark"
      style={{
        width: collapsed ? '62px' : '280px',
        backgroundColor: '#1a1e21',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
      }}
    >
      {/* Brand */}
      <div className="sidebar-brand d-flex align-items-center px-3" style={{ height: '57px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="d-flex align-items-center gap-2 w-100" style={{ overflow: 'hidden' }}>
          <div className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-1" style={{ width: '34px', height: '34px', backgroundColor: '#007bff' }}>
            <span style={{ fontSize: '16px', lineHeight: 1, color: '#fff' }}>🇳🇵</span>
          </div>
          {!collapsed && (
            <div className="flex-fill" style={{ overflow: 'hidden' }}>
              <div className="fw-bold text-truncate" style={{ fontSize: '1rem', color: '#fff', lineHeight: 1.3 }}>Shree Adarsha</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>School Management</div>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <div className="sidebar-wrapper flex-fill overflow-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
        <nav className="mt-2" aria-label="Main navigation">
          <ul className="nav nav-sidebar flex-column" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {navSections.map((section, si) => (
              <li key={si} className="nav-item" style={{ marginBottom: '0.25rem' }}>
                {!collapsed && section.section && (
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); toggleMenu(`__section__${section.section}`); }}
                    className="nav-link d-flex align-items-center px-3 py-1"
                    style={{
                      color: 'rgba(255,255,255,0.5)',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <span className="flex-fill">{section.section}</span>
                    <span className="nav-arrow d-flex align-items-center" style={{ transition: 'transform 0.3s', transform: expandedMenus.has(`__section__${section.section}`) ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                      </svg>
                    </span>
                  </a>
                )}
                <ul className="nav nav-section flex-column" style={{ listStyle: 'none', padding: 0, margin: 0, display: !collapsed && section.section && !expandedMenus.has(`__section__${section.section}`) ? 'none' : '' }}>
                  {section.items.map((item, ii) => {
                    const active = isActive(item.path, item.tab);
                    const hasChildren = item.children && item.children.length > 0;
                    const childActive = hasChildren && hasActiveChild(item.children!);
                    const isExpanded = expandedMenus.has(item.label) || active || childActive;

                    return (
                      <li key={ii} className={`nav-item ${isExpanded ? 'menu-open' : ''}`}>
                        {hasChildren ? (
                          <>
                            <a
                              href="#"
                              onClick={(e) => { e.preventDefault(); if (!collapsed) toggleMenu(item.label); else handleNavClick(item.path, item.tab); }}
                              className={`nav-link d-flex align-items-center px-3 py-2 ${active || childActive ? 'active' : ''}`}
                              style={{
                                color: active || childActive ? '#fff' : 'rgba(255,255,255,0.65)',
                                backgroundColor: active || childActive ? 'rgba(13,110,253,0.15)' : 'transparent',
                                borderRight: active || childActive ? '3px solid #007bff' : '3px solid transparent',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                transition: 'all 0.1s ease',
                              }}
                              onMouseEnter={(e) => { if (!active && !childActive) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; } }}
                              onMouseLeave={(e) => { if (!active && !childActive) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; } }}
                            >
                              <span className="nav-icon d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '24px', height: '24px', marginRight: collapsed ? 0 : '10px' }}>
                                {item.icon ? icons[item.icon] : null}
                              </span>
                              {!collapsed && <span className="flex-fill text-truncate">{item.label}</span>}
                              {!collapsed && (
                                <span className="nav-arrow ms-auto d-flex align-items-center" style={{ transition: 'transform 0.3s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                                  </svg>
                                </span>
                              )}
                              {item.badge && !collapsed && (
                                <span className={`nav-badge badge ms-2`} style={{ backgroundColor: item.badge.color, fontSize: '0.7rem' }}>{item.badge.text}</span>
                              )}
                            </a>
                            {!collapsed && (
                              <ul className="nav nav-treeview" style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0,
                                display: isExpanded ? 'block' : 'none',
                              }}>
                                {item.children!.map((child, ci) => {
                                  const childActive = isActive(child.path, child.tab);
                                  return (
                                    <li key={ci}>
                                      <a
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); handleNavClick(child.path, child.tab); }}
                                        className={`nav-link d-flex align-items-center px-3 py-2 ${childActive ? 'active' : ''}`}
                                        style={{
                                          paddingLeft: '46px',
                                          color: childActive ? '#fff' : 'rgba(255,255,255,0.55)',
                                          backgroundColor: childActive ? 'rgba(13,110,253,0.15)' : 'transparent',
                                          borderRight: childActive ? '3px solid #007bff' : '3px solid transparent',
                                          textDecoration: 'none',
                                          cursor: 'pointer',
                                          fontSize: '0.825rem',
                                          transition: 'all 0.1s ease',
                                        }}
                                        onMouseEnter={(e) => { if (!childActive) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; } }}
                                        onMouseLeave={(e) => { if (!childActive) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; } }}
                                      >
                                        <span className="nav-icon d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '16px', height: '16px', marginRight: '8px', fontSize: '6px', color: childActive ? '#007bff' : 'rgba(255,255,255,0.4)' }}>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8"/></svg>
                                        </span>
                                        <span className="text-truncate">{child.label}</span>
                                      </a>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </>
                        ) : (
                          <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); handleNavClick(item.path, item.tab); }}
                            className={`nav-link d-flex align-items-center px-3 py-2 ${active ? 'active' : ''}`}
                            style={{
                              color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                              backgroundColor: active ? 'rgba(13,110,253,0.15)' : 'transparent',
                              borderRight: active ? '3px solid #007bff' : '3px solid transparent',
                              textDecoration: 'none',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              transition: 'all 0.1s ease',
                            }}
                            onMouseEnter={(e) => { if (!active) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; } }}
                            onMouseLeave={(e) => { if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; } }}
                          >
                            <span className="nav-icon d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '24px', height: '24px', marginRight: collapsed ? 0 : '10px' }}>
                                {item.icon ? icons[item.icon] : null}
                              </span>
                            {!collapsed && <span className="flex-fill text-truncate">{item.label}</span>}
                            {item.badge && !collapsed && (
                              <span className="nav-badge badge ms-2" style={{ backgroundColor: item.badge.color, fontSize: '0.7rem' }}>{item.badge.text}</span>
                            )}
                            {active && !collapsed && <span className="ms-auto" style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#007bff' }} />}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>

          {/* Docs CTA */}
          {!collapsed && (
            <div className="p-3 mt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); router.push('/dashboard/admin?tab=website'); }}
                className="d-flex align-items-center justify-content-center gap-2 btn btn-sm w-100"
                style={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M1 2.828c.885-.37 2.154-.769 4-.388C6.5 2.802 8.6 4 10 4c.423 0 .815-.018 1.168-.057C12.6 3.683 14.47 2.83 15 2.5v11c-.53.33-2.4 1.183-3.832 1.443A10.247 10.247 0 0 1 10 15c-1.4 0-3.5-1.198-5-1.598-1.846-.381-3.115-.018-4 .388V2.828z"/></svg>
                View Documentation
              </a>
            </div>
          )}
        </nav>
      </div>

      {/* User info at bottom */}
      <div className="border-top px-3 py-3 d-flex align-items-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 overflow-hidden" style={{ width: '34px', height: '34px', backgroundColor: '#007bff' }}>
          {user.profilePic ? (
            <img src={user.profilePic} alt={user.name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
          ) : (
            <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>{user.name.charAt(0)}</span>
          )}
        </div>
        {!collapsed && (
          <div className="flex-fill" style={{ overflow: 'hidden' }}>
            <div className="fw-semibold text-truncate" style={{ color: '#fff', fontSize: '0.875rem', lineHeight: 1.3 }}>{user.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{user.role}</div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;