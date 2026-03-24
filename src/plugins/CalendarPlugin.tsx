import { useState } from 'react';
import type { PluginInstance } from '../registry/PluginRegistry';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarWidget = () => {
  const [date, setDate] = useState(new Date());

  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const prevMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  const nextMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="plugin-widget calendar-plugin">
      <div className="plugin-header calendar-header">
        <CalendarIcon size={16} />
        <h3>{monthNames[date.getMonth()]} {date.getFullYear()}</h3>
        <div className="calendar-nav">
          <button onClick={prevMonth}><ChevronLeft size={16}/></button>
          <button onClick={nextMonth}><ChevronRight size={16}/></button>
        </div>
      </div>
      <div className="plugin-body">
        <div className="calendar-grid">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-cell empty"></div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => (
            <div 
              key={`day-${i}`} 
              className={`calendar-cell ${i + 1 === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear() ? 'today' : ''}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CalendarPlugin: PluginInstance = {
  meta: {
    id: 'calendar',
    name: 'Calendar',
    description: 'Track your writing consistency and view deadlines.',
    defaultEnabled: true,
  },
  render: () => <CalendarWidget />
};
