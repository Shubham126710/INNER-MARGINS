export function StatCard({ label, value, suffix, highlight }: { label: string, value: number, suffix?: string, highlight?: boolean }) {
    return (
        <div className={`py-6 border-b border-ink/10 relative transition-all group`}>
            <p className="font-sans text-xs uppercase tracking-widest text-muted mb-4 font-medium">{label}</p>
            <div className="flex items-baseline gap-2 flex-wrap">
                <span className={`text-4xl md:text-5xl font-display tracking-tight text-ink ${highlight ? 'text-opacity-100' : 'text-opacity-90'}`}>
                    {value}
                </span>
                {suffix && <span className="font-sans text-sm text-muted lowercase italic">{suffix}</span>}
            </div>
        </div>
    )
}
