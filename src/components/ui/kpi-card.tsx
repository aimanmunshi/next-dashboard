import { ReactNode } from "react"

export function KpiCard({
  title,
  value,
  icon,
  subtext,
}: {
  title: string
  value: string | number
  icon: ReactNode
  subtext?: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-muted/40 p-4 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <span className="text-3xl font-bold leading-tight">{value}</span>
        {subtext && (
          <span className="mt-1 text-xs text-muted-foreground">{subtext}</span>
        )}
      </div>
      <div className="text-4xl text-muted-foreground opacity-70">{icon}</div>
    </div>
  )
}
