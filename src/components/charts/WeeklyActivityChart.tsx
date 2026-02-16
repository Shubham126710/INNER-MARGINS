'use client';

interface WeeklyActivityChartProps {
  data: { day: string; count: number }[];
}

export default function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="w-full h-64 flex items-end justify-between gap-2 md:gap-4 pt-8">
      {data.map((item) => {
        const heightPercentage = (item.count / maxCount) * 100;
        
        return (
          <div key={item.day} className="flex-1 flex flex-col items-center group">
            <div className="relative w-full flex-1 flex items-end bg-retro-text/5 border-2 border-transparent hover:border-retro-border/50 rounded-sm transition-all h-full">
               {/* Bar */}
              <div 
                className="w-full bg-retro-primary opacity-80 group-hover:opacity-100 transition-all relative min-h-[4px]"
                style={{ height: `${heightPercentage}%` }}
              >
                 {/* Pixel top effect */}
                 <div className="absolute top-0 left-0 right-0 h-1 bg-retro-text/20" />
                 
                 {/* Tooltip */}
                 <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-retro-text text-retro-surface text-xs font-mono py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    {item.count} entries
                 </div>
              </div>
            </div>
            <span className="mt-3 text-xs md:text-sm font-mono uppercase text-retro-text/60 tracking-wider">
              {item.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}
