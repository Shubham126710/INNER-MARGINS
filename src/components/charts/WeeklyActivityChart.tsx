'use client';

interface WeeklyActivityChartProps {
  data: { day: string; count: number }[];
}

export default function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="w-full h-64 flex items-end justify-between gap-2 md:gap-8 pt-8">
      {data.map((item) => {
        const heightPercentage = (item.count / maxCount) * 100;
        
        return (
          <div key={item.day} className="flex-1 flex flex-col items-center group">
            <div className="relative w-full flex-1 flex items-end bg-transparent transition-all h-full">
               {/* Bar */}
              <div 
                className="w-full bg-ink/10 group-hover:bg-ink transition-colors relative min-h-[1px]"
                style={{ height: `${heightPercentage}%` }}
              >
                 
                 {/* Tooltip */}
                 <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-ink text-white text-xs font-sans py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-sm">
                    {item.count} entries
                 </div>
              </div>
            </div>
            <span className="mt-4 text-xs font-sans uppercase tracking-widest text-muted group-hover:text-ink transition-colors">
              {item.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}
