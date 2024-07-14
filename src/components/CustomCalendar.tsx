import React, { useEffect } from 'react';
import './CustomCalendar.css';

interface CustomCalendarProps {
    year: number;
    percentage: number;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ year, percentage }) => {
    const months = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];

    return (
        <div className="calendar-container">
            {months.map((month, index) => (
                <div key={index} className="month">
                    <h2 style={{color: "#691f74"}}>{month}</h2>
                    {Array.from({length: new Date(year, index + 1, 0).getDate()}, (_, day) => (
                        <div key={day + 1} className="day">
                            {day + 1}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default CustomCalendar;
