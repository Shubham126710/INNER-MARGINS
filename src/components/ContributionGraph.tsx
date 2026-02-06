export function ContributionGraph({ data }: { data: { [date: string]: number } }) {
    const today = new Date();
    // Start date = Today - 365 days
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    // Adjust to previous Sunday to always start on a Sunday
    while(startDate.getDay() !== 0) {
        startDate.setDate(startDate.getDate() - 1);
    }

    const weeks: { date: string, count: number, isFuture: boolean }[][] = [];
    
    // Iterate 53 weeks * 7 days
    const iterDate = new Date(startDate);
    
    for (let w = 0; w < 53; w++) {
        const week = [];
        for (let d = 0; d < 7; d++) {
            const dateStr = iterDate.toISOString().split('T')[0];
            // Check if iterDate is in the future relative to "today" (stripping time if needed)
            const isFuture = iterDate > new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
            
            week.push({
                date: dateStr,
                count: isFuture ? -1 : (data[dateStr] || 0),
                isFuture
            });
            iterDate.setDate(iterDate.getDate() + 1);
        }
        weeks.push(week);
    }
    
    // Color scale
    const getColor = (count: number, isFuture: boolean) => {
        if (isFuture) return 'invisible';
        if (count === 0) return 'bg-retro-text/10 hover:bg-retro-text/20'; // Empty
        if (count === 1) return 'bg-retro-primary/40 hover:bg-retro-primary/50';
        if (count === 2) return 'bg-retro-primary/70 hover:bg-retro-primary/80';
        return 'bg-retro-primary hover:bg-retro-primary/90'; // 3+
    };

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return (
        <div className="w-full overflow-x-auto pb-2">
            <div className="min-w-fit">
                {/* Month Labels */}
                <div className="flex gap-[2px] text-xs font-code text-retro-text/60 mb-2 h-4">
                    {weeks.map((week, i) => {
                        const date = new Date(week[0].date);
                        const prevWeekDate = i > 0 ? new Date(weeks[i-1][0].date) : null;
                        const showMonth = i === 0 || (prevWeekDate && date.getMonth() !== prevWeekDate.getMonth());
                        
                        return (
                            <div key={i} className="w-3 overflow-visible relative">
                                {showMonth && <span className="absolute top-0 left-0">{months[date.getMonth()]}</span>}
                            </div>
                        )
                    })}
                </div>
                
                <div className="flex gap-[2px]">
                    {weeks.map((week, i) => (
                        <div key={i} className="flex flex-col gap-[2px]">
                            {week.map((day, j) => (
                                <div 
                                    key={day.date}
                                    className={`w-3 h-3 rounded-[1px] ${getColor(day.count, day.isFuture)} transition-colors duration-200 cursor-default relative group`}
                                    title={`${day.date}: ${day.count > 0 ? day.count : 'No'} entries`}
                                >
                                     {/* Simple Tooltip */}
                                     {!day.isFuture && (
                                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-retro-text text-retro-surface text-[10px] font-code whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10 hidden sm:block">
                                         {day.date}: {day.count} {day.count === 1 ? 'entry' : 'entries'}
                                     </div>
                                     )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                
                {/* Legend */}
                <div className="mt-4 flex items-center justify-end gap-2 text-xs font-code text-retro-text/60">
                    <span>Less</span>
                    <div className="w-3 h-3 rounded-[1px] bg-retro-text/10"></div>
                    <div className="w-3 h-3 rounded-[1px] bg-retro-primary/40"></div>
                    <div className="w-3 h-3 rounded-[1px] bg-retro-primary/70"></div>
                    <div className="w-3 h-3 rounded-[1px] bg-retro-primary"></div>
                    <span>More</span>
                </div>
            </div>
        </div>
    );
}