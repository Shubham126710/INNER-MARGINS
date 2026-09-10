'use client';

import { useState } from 'react';

type DataItem = {
    label: string;
    count: number;
};

interface PatternChartProps {
    weeklyPattern: { day: string, count: number }[];
    monthlyPattern: { month: string, count: number }[];
}

export default function PatternChart({ weeklyPattern, monthlyPattern }: PatternChartProps) {
    const [view, setView] = useState<'day' | 'month'>('day');
    
    // Map to normalized data
    const data: DataItem[] = view === 'day' 
        ? weeklyPattern.map(d => ({ label: d.day, count: d.count }))
        : monthlyPattern.map(d => ({ label: d.month, count: d.count }));
        
    const maxCount = Math.max(...data.map(d => d.count), 1); // Avoid division by zero

    return (
        <div className="border-4 border-retro-border bg-retro-surface p-4 sm:p-8 shadow-retro flex flex-col h-full overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-8 border-b-2 border-retro-border pb-4">
                <h2 className="text-xl sm:text-2xl font-display uppercase m-0">
                    Distribution
                </h2>
                <div className="bg-retro-bg border-2 border-retro-border self-start sm:self-auto shrink-0">
                    <select
                        value={view}
                        onChange={(e) => setView(e.target.value as 'day' | 'month')}
                        className="bg-transparent font-code text-sm uppercase text-retro-text px-2 py-1 outline-none cursor-pointer"
                    >
                        <option value="day">By Day</option>
                        <option value="month">By Month</option>
                    </select>
                </div>
            </div>
            
            <div className="flex flex-col gap-4 justify-center flex-1">
                {data.map((item) => (
                    <div key={item.label} className="flex items-center gap-4">
                        <span className="font-code w-10 text-retro-text text-xs uppercase">{item.label}</span>
                        <div className="flex-1 h-3 bg-retro-bg relative rounded-sm overflow-hidden">
                            <div 
                                className="absolute top-0 left-0 h-full bg-retro-primary transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                                style={{ width: `${(item.count / maxCount) * 100}%` }}
                            />
                        </div>
                        <span className="font-code w-8 text-right text-retro-text/70 text-sm">{item.count}</span>
                    </div>
                ))}
                
                {data.every(d => d.count === 0) && (
                    <p className="font-code text-retro-text/50 text-center mt-4 text-sm">No entries yet.</p>
                )}
            </div>
        </div>
    );
}
