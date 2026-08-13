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

    const renderBarChart = () => (
        <div className="flex flex-col gap-6 justify-center flex-1 w-full">
            {data.map((item) => (
                <div key={item.label} className="flex items-center gap-4 group">
                    <span className="font-sans w-12 text-muted text-xs uppercase tracking-widest">{item.label}</span>
                    <div className="flex-1 h-[1px] bg-ink/10 relative">
                        <div 
                            className="absolute top-1/2 -translate-y-1/2 left-0 h-[4px] bg-ink transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                            style={{ width: `${(item.count / maxCount) * 100}%` }}
                        />
                    </div>
                    <span className="font-display w-8 text-right text-ink text-xl">{item.count}</span>
                </div>
            ))}
            
            {data.every(d => d.count === 0) && (
                <p className="font-sans text-muted text-sm text-center mt-4">No entries found.</p>
            )}
        </div>
    );

    const renderPieChart = () => {
        const total = data.reduce((acc, curr) => acc + curr.count, 0);
        if (total === 0) return <p className="font-sans text-muted text-sm text-center mt-4">No entries found.</p>;

        let cumulativePercent = 0;
        
        // Distinct minimal colors for pie slices
        const colors = [
            '#111111', // ink
            '#333333',
            '#555555',
            '#77736C', // muted
            '#999999',
            '#BBBBBB',
            '#DDDDDD'
        ];

        const getCoordinatesForPercent = (percent: number) => {
            const x = Math.cos(2 * Math.PI * percent);
            const y = Math.sin(2 * Math.PI * percent);
            return [x, y];
        };

        return (
            <div className="flex flex-col md:flex-row items-center justify-center gap-10 w-full h-full py-4">
                <div className="relative">
                    <svg viewBox="-1.2 -1.2 2.4 2.4" className="w-48 h-48 md:w-64 md:h-64 -rotate-90">
                        <circle cx="0" cy="0" r="1" fill="transparent" className="stroke-[0.02] stroke-ink/10" />
                        {data.map((slice, i) => {
                            const percent = slice.count / total;
                            if (percent === 0) return null;
                            const startPercent = cumulativePercent;
                            cumulativePercent += percent;
                            const endPercent = cumulativePercent;

                            const [startX, startY] = getCoordinatesForPercent(startPercent);
                            const [endX, endY] = getCoordinatesForPercent(endPercent);
                            const largeArcFlag = percent > .5 ? 1 : 0;
                            
                            const pathData = percent === 1 ?
                                `M 1,0 A 1,1 0 1,1 0.999,-0.045 L 0,0` :
                                `M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;

                            return (
                                <g key={slice.label} className="group transition-all">
                                    <path 
                                        d={pathData} 
                                        fill={colors[i % colors.length]}
                                        className="stroke-[0.02] stroke-paper group-hover:opacity-80"
                                    >
                                        <title>{`${slice.label}: ${slice.count}`}</title>
                                    </path>
                                </g>
                            );
                        })}
                        {/* Inner cutout for donut chart effect */}
                        <circle cx="0" cy="0" r="0.65" fill="var(--color-paper)" className="stroke-[0.02] stroke-paper" />
                    </svg>
                </div>
                
                <div className="flex flex-col gap-3">
                    {data.map((slice, i) => (
                        <div key={slice.label} className="flex items-center gap-3 min-w-[120px] group">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }}></div>
                            <span className="font-sans text-xs uppercase tracking-widest text-muted group-hover:text-ink transition-colors">{slice.label}</span>
                            <div className="h-[1px] flex-1 bg-ink/10 border-dashed border-t"></div>
                            <span className="font-display text-xl text-ink">{slice.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-8">
                <div className="border border-ink/20 bg-transparent">
                    <select
                        value={view}
                        onChange={(e) => setView(e.target.value as 'day' | 'month')}
                        className="bg-transparent font-sans text-xs tracking-widest uppercase text-muted hover:text-ink px-4 py-2 outline-none cursor-pointer"
                    >
                        <option value="day">By Day</option>
                        <option value="month">By Month</option>
                    </select>
                </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
                {view === 'day' ? renderPieChart() : renderBarChart()}
            </div>
        </div>
    );
}
