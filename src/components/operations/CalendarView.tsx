import type { Task } from '../../types';

interface CalendarViewProps {
  tasks: Task[];
}

export default function CalendarView({ tasks }: CalendarViewProps) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => i);

  const getTasksForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter((t) => t.dueDate === dateStr || t.startDate === dateStr);
  };

  return (
    <div>
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">
          {new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d} className="text-center text-[10px] text-[#666] uppercase py-2">
            {d}
          </div>
        ))}
        {blanks.map((i) => (
          <div key={`blank-${i}`} className="min-h-[80px] rounded-lg" />
        ))}
        {days.map((day) => {
          const dayTasks = getTasksForDay(day);
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          return (
            <div
              key={day}
              className={`min-h-[80px] rounded-lg p-1.5 border transition-colors ${
                isToday
                  ? 'border-[#8B0000]/50 bg-[#8B0000]/5'
                  : 'border-[#2A2A2A] hover:border-[#3A3A3A] bg-white/[0.02]'
              }`}
            >
              <span className={`text-xs font-medium ${isToday ? 'text-[#8B0000]' : 'text-[#A0A0A0]'}`}>
                {day}
              </span>
              <div className="mt-1 space-y-0.5">
                {dayTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="text-[8px] px-1 py-0.5 rounded bg-[#8B0000]/10 text-[#A0A0A0] truncate"
                  >
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-[8px] text-[#666]">+{dayTasks.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
