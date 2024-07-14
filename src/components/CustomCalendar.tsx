import React, {useMemo} from 'react';
import {calculateHighlightedDays} from "../utils/TaxCalculator";
import './CustomCalendar.css';

const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
];


interface CustomCalendarProps {
    year: number;
    percentage: number;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({year, percentage}) => {

    // Calculate number of days to be highlighted
    const highlightedDays = useMemo(() => calculateHighlightedDays(year, percentage), [year, percentage]);

    // Generate days for the entire year
    const daysArray = useMemo(() => {
        const days: { month: string, day: number, highlight: boolean }[] = [];
        let dayCounter = 0;
        for (let monthIndex = 0; monthIndex < months.length; monthIndex++) {
            const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                dayCounter++;
                days.push({
                    month: months[monthIndex], day,
                    highlight: dayCounter <= highlightedDays
                });
            }
        }
        return days;
    }, [year, highlightedDays]);

    return (
        <div className="calendar-container">
            {months.map((month, monthIndex) => (
                <div key={monthIndex} className="month">
                    <h2 style={{ color: "#691f74" }}>{month}</h2>
                    {daysArray
                        .filter(dayObj => dayObj.month === month)
                        .map((dayObj, dayIndex) => (
                            <div key={dayIndex} className={`day ${dayObj.highlight ? 'highlight' : ''}`}>
                                {dayObj.day}
                            </div>
                        ))}
                </div>
            ))}
        </div>
    );
};

export default CustomCalendar;
