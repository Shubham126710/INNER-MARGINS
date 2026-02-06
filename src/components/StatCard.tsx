export function StatCard({ label, value, suffix, highlight }: { label: string, value: number, suffix?: string, highlight?: boolean }) {
    return (
        <div className={`p-6 border-4 border-retro-border bg-retro-surface relative group hover:-translate-y-1 transition-transform ${highlight ? 'bg-retro-secondary/5' : ''}`}>
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="2" y="2" width="4" height="4" />
                    <rect x="8" y="2" width="4" height="4" />
                    <rect x="14" y="2" width="4" height="4" />
                    <rect x="2" y="8" width="4" height="4" />
                    <rect x="8" y="8" width="4" height="4" />
                    <rect x="14" y="8" width="4" height="4" />
                    <rect x="2" y="14" width="4" height="4" />
                    <rect x="8" y="14" width="4" height="4" />
                    <rect x="14" y="14" width="4" height="4" />
                </svg>
            </div>
            <p className="font-code uppercase text-sm text-retro-text/60 mb-2">{label}</p>
            <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-display tracking-tight ${highlight ? 'text-retro-primary' : 'text-retro-text'}`}>
                    {value}
                </span>
                {suffix && <span className="font-code text-sm text-retro-text/60 lowercase">{suffix}</span>}
            </div>
        </div>
    )
}