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
        <div className="flex flex-col gap-4 justify-center flex-1 w-full">
            {data.map((item) => (
                <div key={item.label} className="flex items-center gap-4 group">
                    <span className="font-mono w-10 text-retro-text text-xs uppercase tracking-widest group-hover:text-retro-primary transition-colors">{item.label}</span>
                    <div className="flex-1 h-[2px] bg-retro-border/20 relative overflow-hidden border border-retro-border/10">
                        <div 
                            className="absolute top-0 left-0 h-full bg-retro-primary transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                            style={{ width: `${(item.count / maxCount) * 100}%` }}
                        />
                    </div>
                    <span className="font-heading w-8 text-right text-retro-text/70 text-sm group-hover:text-retro-text transition-colors">{item.count}</span>
                </div>
            ))}
            
            {data.every(d => d.count === 0) && (
                <p className="font-mono text-retro-text/50 text-[10px] tracking-widest text-center mt-4">NO ENTRIES FOUND.</p>
            )}
        </div>
    );

    const renderPieChart = () => {
        const total = data.reduce((acc, curr) => acc + curr.count, 0);
        if (total === 0) return <p className="font-mono text-retro-text/50 text-[10px] tracking-widest text-center mt-4">NO ENTRIES FOUND.</p>;

        let cumulativePercent = 0;
        
        // Some retro colors varying in opacity for the pie slices
        const colors = [
            'var(--retro-text)',
            'rgba(247,218,214, 0.75)',
            'rgba(247,218,214, 0.5)',
            'rgba(201,65,60, 0.3)',
            'rgba(201,65,60, 0.5)',
            'rgba(201,65,60, 0.75)',
            'var(--retro-primary)'
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
                        <circle cx="0" cy="0" r="1" fill="var(--retro-surface)" className="stroke-[0.02] stroke-retro-border/20" />
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

                            // Calculate text position in the middle of the slice
                            const midPercent = startPercent + percent / 2;
                            const [textX, textY] = getCoordinatesForPercent(midPercent);
                            // Position it slightly outside the center (radius 0.75)
                            // Since the svg is rotated -90deg, x and y are oriented differently for text if we don't rotate back,
                            // but actually we'll just apply transform to the text
                            
                            return (
                                <g key={slice.label} className="group transition-all">
                                    <path 
                                        d={pathData} 
                                        fill={colors[i % colors.length]}
                                        className="stroke-[0.01] stroke-retro-surface group-hover:opacity-80"
                                    >
                                        <title>{`${slice.label}: ${slice.count}`}</title>
                                    </path>
                                    
                                    {/* Text Label on Slice */}
                                    {percent > 0.05 && (
                                        <text
                                            x={textX * 0.75}
                                            y={textY * 0.75}
                                            fill="var(--retro-surface)"
                                            className="font-mono text-[0.14px] font-bold origin-center mix-blend-difference"
                                            textAnchor="middle"
                                            dominantBaseline="central"
                                            transform={`rotate(90, ${textX * 0.75}, ${textY * 0.75})`}
                                            style={{ pointerEvents: 'none' }}
                                        >
                                            {slice.label.substring(0,3)}
                                        </text>
                                    )}
                                </g>
                            );
                        })}
                        {/* Inner cutout for donut chart effect */}
                        <circle cx="0" cy="0" r="0.55" fill="var(--retro-surface)" className="stroke-[0.02] stroke-retro-border/50" />
                        
                        {/* Center decoration */}
                        <circle cx="0" cy="0" r="0.1" fill="transparent" className="stroke-[0.02] stroke-retro-primary animate-pulse" />
                    </svg>
                    
                    {/* Targeting reticle overlay */}
                    <div className="absolute inset-0 border border-retro-border/20 rounded-full pointer-events-none"></div>
                    <div className="absolute top-1/2 -left-2 w-4 h-[1px] bg-retro-primary/50 pointer-events-none"></div>
                    <div className="absolute top-1/2 -right-2 w-4 h-[1px] bg-retro-primary/50 pointer-events-none"></div>
                    <div className="absolute -top-2 left-1/2 w-[1px] h-4 bg-retro-primary/50 pointer-events-none"></div>
                    <div className="absolute -bottom-2 left-1/2 w-[1px] h-4 bg-retro-primary/50 pointer-events-none"></div>
                </div>
                
                <div className="flex flex-col gap-3">
                    {data.map((slice, i) => (
                        <div key={slice.label} className="flex items-center gap-3 min-w-[120px] group">
                            <div className="w-2 h-2" style={{ backgroundColor: colors[i % colors.length] }}></div>
                            <span className="font-mono text-[10px] uppercase tracking-widest text-retro-text group-hover:text-retro-primary transition-colors">{slice.label}</span>
                            <div className="h-[1px] flex-1 bg-retro-border/20 border-dashed border-t"></div>
                            <span className="font-heading text-sm opacity-70 group-hover:opacity-100 transition-opacity">{slice.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-retro-border/20">
                <h2 className="text-xl lg:text-2xl font-heading uppercase m-0 text-retro-text">
                    Distribution
                </h2>
                <div className="border border-retro-border/30 bg-retro-surface/50">
                    <select
                        value={view}
                        onChange={(e) => setView(e.target.value as 'day' | 'month')}
                        className="bg-transparent font-mono text-[10px] tracking-widest uppercase text-retro-text px-3 py-2 outline-none cursor-pointer"
                    >
                        <option value="day">SECTOR: BY DAY</option>
                        <option value="month">SECTOR: BY MONTH</option>
                    </select>
                </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
                {view === 'day' ? renderPieChart() : renderBarChart()}
            </div>
        </div>
    );
}
