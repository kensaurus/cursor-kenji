---
name: data-visualization
description: Create interactive charts, graphs, and data visualizations. Use when user wants "chart", "graph", "visualization", "dashboard", "analytics", "D3", "Recharts", "data display", "metrics", or "statistics".
---

# Data Visualization Skill

Create beautiful, accessible, and interactive data visualizations for dashboards and reports.

## CRITICAL: Check Existing First

**Before creating ANY visualization, verify:**

1. **Check for existing chart libraries:**
```bash
cat package.json | grep -i "recharts\|chart\|d3\|visx\|nivo\|tremor"
rg "LineChart|BarChart|PieChart" --type tsx -l | head -10
```

2. **Check for existing chart components:**
```bash
ls -la src/components/charts/ src/components/dashboard/ 2>/dev/null
rg "ResponsiveContainer|Chart" --type tsx | head -10
```

3. **Check for design tokens:**
```bash
cat tailwind.config.* | grep -A10 "chart\|colors"
```

**Why:** Use existing chart library and styling conventions.

## Recharts (Recommended for React)

### Line Chart
```tsx
'use client'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const data = [
  { month: 'Jan', revenue: 4000, users: 2400 },
  { month: 'Feb', revenue: 3000, users: 1398 },
  { month: 'Mar', revenue: 2000, users: 9800 },
]

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="month" 
          className="text-xs fill-muted-foreground"
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          className="text-xs fill-muted-foreground"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          content={<CustomTooltip />}
          cursor={{ stroke: 'hsl(var(--muted))' }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--primary))' }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="users"
          stroke="hsl(var(--secondary))"
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--secondary))' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null
  
  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <p className="text-sm font-medium">{label}</p>
      {payload.map((entry: any, index: number) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}
```

### Bar Chart
```tsx
'use client'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'

const data = [
  { name: 'Mon', value: 12 },
  { name: 'Tue', value: 19 },
  { name: 'Wed', value: 3 },
  { name: 'Thu', value: 5 },
  { name: 'Fri', value: 2 },
]

export function WeeklyChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis 
          dataKey="name" 
          tickLine={false}
          axisLine={false}
          className="text-xs fill-muted-foreground"
        />
        <YAxis hide />
        <Bar 
          dataKey="value" 
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        >
          {data.map((entry, index) => (
            <Cell 
              key={index}
              className={index === data.length - 1 ? 'fill-primary' : 'fill-primary/60'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
```

### Area Chart with Gradient
```tsx
'use client'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts'

export function GradientAreaChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" hide />
        <YAxis hide />
        <Area
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fill="url(#colorValue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
```

### Pie/Donut Chart
```tsx
'use client'
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts'

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--muted))',
]

export function DonutChart({ data, total }: { data: any[]; total: number }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
          <Label
            value={total}
            position="center"
            className="fill-foreground text-2xl font-bold"
          />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
```

## Sparklines (Mini Charts)

```tsx
'use client'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface SparklineProps {
  data: number[]
  color?: string
  height?: number
}

export function Sparkline({ data, color = 'hsl(var(--primary))', height = 40 }: SparklineProps) {
  const chartData = data.map((value, index) => ({ index, value }))
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// Usage in stats card
<div className="flex items-center justify-between">
  <div>
    <p className="text-sm text-muted-foreground">Revenue</p>
    <p className="text-2xl font-bold">$45,231</p>
  </div>
  <div className="w-20">
    <Sparkline data={[10, 15, 8, 22, 18, 25, 30]} />
  </div>
</div>
```

## Stat Cards with Trends

```tsx
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string
  change: number
  trend: 'up' | 'down'
  sparklineData?: number[]
}

export function StatCard({ title, value, change, trend, sparklineData }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <p className="text-3xl font-semibold">{value}</p>
        <div className={cn(
          'flex items-center text-sm font-medium',
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        )}>
          {trend === 'up' ? (
            <ArrowUpIcon className="mr-1 h-4 w-4" />
          ) : (
            <ArrowDownIcon className="mr-1 h-4 w-4" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      {sparklineData && (
        <div className="mt-4">
          <Sparkline 
            data={sparklineData} 
            color={trend === 'up' ? 'rgb(22 163 74)' : 'rgb(220 38 38)'} 
          />
        </div>
      )}
    </div>
  )
}
```

## Real-time Data Updates

```tsx
'use client'
import { useEffect, useState } from 'react'
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts'

export function RealtimeChart() {
  const [data, setData] = useState<{ time: number; value: number }[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newPoint = {
          time: Date.now(),
          value: Math.random() * 100,
        }
        // Keep last 20 points
        const updated = [...prev, newPoint].slice(-20)
        return updated
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <ResponsiveContainer width="100%" height={100}>
      <LineChart data={data}>
        <YAxis domain={[0, 100]} hide />
        <Line
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

## D3.js for Custom Visualizations

```tsx
'use client'
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export function CustomD3Chart({ data }: { data: { label: string; value: number }[] }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    const svg = d3.select(svgRef.current)
    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight
    const margin = { top: 20, right: 20, bottom: 30, left: 40 }

    svg.selectAll('*').remove()

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.1)

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .nice()
      .range([height - margin.bottom, margin.top])

    // Bars
    svg
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (d) => x(d.label) || 0)
      .attr('y', height - margin.bottom)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', 'hsl(var(--primary))')
      .attr('rx', 4)
      .transition()
      .duration(750)
      .attr('y', (d) => y(d.value))
      .attr('height', (d) => y(0) - y(d.value))

    // X Axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll('text')
      .attr('class', 'fill-muted-foreground text-xs')

  }, [data])

  return <svg ref={svgRef} className="w-full h-64" />
}
```

## Accessibility

```tsx
// Always include ARIA labels and descriptions
<div role="img" aria-label="Revenue chart showing monthly data from January to December">
  <ResponsiveContainer>
    <LineChart data={data} aria-hidden="true">
      {/* Chart content */}
    </LineChart>
  </ResponsiveContainer>
  
  {/* Screen reader alternative */}
  <table className="sr-only">
    <caption>Monthly Revenue Data</caption>
    <thead>
      <tr><th>Month</th><th>Revenue</th></tr>
    </thead>
    <tbody>
      {data.map((d) => (
        <tr key={d.month}>
          <td>{d.month}</td>
          <td>${d.revenue}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

## Validation

After creating visualizations:

1. **Responsive** → Charts resize properly on all screens
2. **Accessible** → Screen reader alternatives provided
3. **Performance** → Large datasets use virtualization/sampling
4. **Loading states** → Skeleton shown while data loads
5. **Empty states** → Meaningful message when no data
6. **Color contrast** → Meets WCAG guidelines
7. **Tooltips** → Provide detailed data on hover
