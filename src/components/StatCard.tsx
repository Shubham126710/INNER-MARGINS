export function StatCard({ label, value, suffix, highlight }: { label: string, value: number, suffix?: string, highlight?: boolean }) {
    return (
        <div className={`p-4 sm:p-6 border bg-retro-surface/60 relative group transition-colors duration-150 hover:bg-retro-surface ${
            highlight ? 'border-retro-primary shadow-retro-sm' : 'border-retro-border/30 hover:border-retro-border/60'
        }`}>
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
            <p className="font-body text-xs text-retro-text/70 mb-3">{label}</p>
            <div className="flex items-baseline gap-2 flex-wrap">
                <span className={`text-2xl sm:text-3xl md:text-4xl font-heading tracking-tight break-words ${highlight ? 'text-retro-primary animate-pulse motion-reduce:animate-none' : 'text-retro-text'}`}>
                    {value}
                </span>
                {suffix && <span className="font-body text-xs text-retro-text/60 lowercase">{suffix}</span>}
            </div>
            <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-retro-primary origin-left transition-transform duration-300 motion-reduce:transform-none ${highlight ? 'scale-x-100 opacity-50' : 'scale-x-0 group-hover:scale-x-100 opacity-50'}`}></div>
        </div>
    )
}
