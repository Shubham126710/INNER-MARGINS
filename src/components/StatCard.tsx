export function StatCard({ label, value, suffix, highlight }: { label: string, value: number, suffix?: string, highlight?: boolean }) {
    return (
        <div className={`p-6 border bg-retro-surface/60 relative group transition-all hover:bg-retro-surface ${
            highlight ? 'border-retro-primary shadow-[inset_0_0_15px_rgba(201,65,60,0.1)]' : 'border-retro-border/30 hover:border-retro-border/60'
        }`}>
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="2" y="2" width="2" height="2" />
                    <rect x="10" y="2" width="2" height="2" />
                    <rect x="18" y="2" width="2" height="2" />
                    <rect x="2" y="10" width="2" height="2" />
                    <rect x="10" y="10" width="2" height="2" />
                    <rect x="18" y="10" width="2" height="2" />
                    <rect x="2" y="18" width="2" height="2" />
                    <rect x="10" y="18" width="2" height="2" />
                    <rect x="18" y="18" width="2" height="2" />
                </svg>
            </div>
            <p className="font-mono uppercase tracking-widest text-[10px] sm:text-xs text-retro-text/50 mb-3">{label}</p>
            <div className="flex items-baseline gap-2 flex-wrap">
                <span className={`text-2xl md:text-4xl font-heading tracking-tight ${highlight ? 'text-retro-primary animate-pulse' : 'text-retro-text'}`}>
                    {value}
                </span>
                {suffix && <span className="font-mono tracking-widest text-[10px] md:text-sm text-retro-text/60 lowercase">{suffix}</span>}
            </div>
            <div className={`absolute bottom-0 left-0 h-[2px] bg-retro-primary transition-all duration-500 w-0 group-hover:w-full ${highlight ? 'w-full opacity-50' : 'opacity-0 group-hover:opacity-50'}`}></div>
        </div>
    )
}
