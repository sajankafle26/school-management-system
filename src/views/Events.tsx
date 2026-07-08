import React, { useState, useMemo, useEffect } from 'react';
import type { Event } from '../types';
import AddEventModal from '../components/AddEventModal';

interface EventsProps {
    selectedAcademicYear: string;
}

const Events: React.FC<EventsProps> = ({ selectedAcademicYear }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetch(`/api/events?academicYear=${selectedAcademicYear}`)
            .then(res => res.json())
            .then(setEvents)
            .catch(console.error);
    }, [selectedAcademicYear]);

    const yearEvents = useMemo(() => events.filter(e => e.academicYear === selectedAcademicYear), [events, selectedAcademicYear]);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startingDay = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const calendarDays = [];
    for (let i = 0; i < startingDay; i++) {
        calendarDays.push({ key: `blank-${i}`, day: null, date: null, events: [] });
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateString = date.toISOString().split('T')[0];
        const dayEvents = yearEvents.filter(event => event.date === dateString);
        calendarDays.push({ key: `day-${day}`, day, date, events: dayEvents });
    }

    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    const handleAddEvent = async (newEventData: Omit<Event, 'id' | 'academicYear'>) => {
        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newEventData, academicYear: selectedAcademicYear }),
            });
            const created = await res.json();
            setEvents(prevEvents => [...prevEvents, created].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to add event:', error);
        }
    };

    const getEventPill = (event: Event) => {
        const colorMap = {
            Holiday: 'bg-red-500 hover:bg-red-600',
            Event: 'bg-purple-500 hover:bg-purple-600',
            Exam: 'bg-indigo-500 hover:bg-indigo-600',
        };
        return (
            <div 
                key={event.id} 
                className={`${colorMap[event.type]} text-white text-xs rounded px-2 py-1 truncate cursor-pointer transition-colors`} 
                title={`${event.title} (${event.type})`}
            >
                {event.title}
            </div>
        );
    };
    
    const ChevronLeftIcon = () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    );

    const ChevronRightIcon = () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Academic Calendar</h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add New Event
                </button>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Previous month">
                        <ChevronLeftIcon />
                    </button>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Next month">
                        <ChevronRightIcon />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                    {daysOfWeek.map(day => (
                        <div key={day} className="font-semibold text-gray-600 text-sm py-2 uppercase">{day}</div>
                    ))}
                    
                    {calendarDays.map(({ key, day, date, events }) => {
                        const isToday = date?.toDateString() === new Date().toDateString();
                        return (
                            <div key={key} className={`border rounded-lg p-2 h-36 flex flex-col overflow-hidden ${day === null ? 'bg-gray-50' : 'bg-white'}`}>
                                {day && (
                                    <>
                                        <span className={`font-medium text-sm self-start ${isToday ? 'bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center' : 'text-gray-700'}`}>
                                            {day}
                                        </span>
                                        <div className="mt-1 space-y-1 overflow-y-auto flex-grow">
                                            {events.map(event => getEventPill(event))}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <AddEventModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddEvent={handleAddEvent}
            />
        </div>
    );
};

export default Events;
