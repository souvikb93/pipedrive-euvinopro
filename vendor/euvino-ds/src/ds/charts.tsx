import * as React from 'react';
import { cn } from './cn';
import { Icon } from './icon';
import { ProgressBar } from './feedback';
import { Card } from './display';

const series = (i: number) => `var(--eu-chart-${(i % 6) + 1})`;

export interface ChartDatum {
  /** Name shown in the legend and read by screen readers. */
  label: string;
  /** Number. */
  value: number;
}

function Legend({ data }: { data: ChartDatum[] }) {
  return <ul className="eu-legend eu-type-body-caption">{data.map((d, i) => <li key={d.label}><span className="eu-legend__sw" style={{ background: series(i) }} />{d.label}</li>)}</ul>;
}

export interface BarChartProps {
  /** One bar per item. */
  data: ChartDatum[];
  /** Accessible summary of what the chart shows. */
  label: string;
  /** Show the legend. */
  legend?: boolean;
}

/** Compare values across categories. Colours come from chart/1 to chart/6. */
export function BarChart({ data, label, legend }: BarChartProps) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return <figure className="eu-chart" role="img" aria-label={`${label}: ${data.map((d) => `${d.label} ${d.value}`).join(', ')}`}><div className="eu-bars">{data.map((d, i) => <span key={d.label} className="eu-bars__bar" style={{ height: `${(d.value / max) * 100}%`, background: series(i) }} />)}</div>{legend ? <Legend data={data} /> : null}</figure>;
}

export interface LineChartProps {
  /** Points in order. */
  data: ChartDatum[];
  /** Accessible summary. */
  label: string;
}

/** A trend over time. */
export function LineChart({ data, label }: LineChartProps) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const pts = data.map((d, i) => `${(i / Math.max(1, data.length - 1)) * 100},${40 - (d.value / max) * 38}`).join(' ');
  return <figure className="eu-chart" role="img" aria-label={`${label}: ${data.map((d) => `${d.label} ${d.value}`).join(', ')}`}><svg viewBox="0 0 100 40" preserveAspectRatio="none" className="eu-line"><polyline points={pts} fill="none" stroke="var(--eu-chart-1)" strokeWidth="1" vectorEffect="non-scaling-stroke" /></svg></figure>;
}

export interface DonutChartProps {
  /** Segments, up to 6. */
  data: ChartDatum[];
  /** Accessible summary. */
  label: string;
  /** Text in the middle. */
  center?: string;
  /** Show the legend. */
  legend?: boolean;
}

/** Parts of a whole, 2 to 6 segments. */
export function DonutChart({ data, label, center, legend = true }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let at = 0;
  const stops = data.map((d, i) => { const a = at; at += (d.value / total) * 100; return `${series(i)} ${a}% ${at}%`; }).join(', ');
  return <figure className="eu-chart" role="img" aria-label={`${label}: ${data.map((d) => `${d.label} ${d.value}`).join(', ')}`}><span className="eu-donut" style={{ background: `conic-gradient(${stops})` }}><span className="eu-donut__hole eu-type-ui-label">{center}</span></span>{legend ? <Legend data={data} /> : null}</figure>;
}

export interface GaugeProps {
  /** 0 to 100. */
  value: number;
  /** Label and accessible name. */
  label: string;
}

/** One score against a full range, drawn as a half circle. */
export function Gauge({ value, label }: GaugeProps) {
  const v = Math.max(0, Math.min(100, value));
  return <figure className="eu-chart eu-gauge" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v}><svg viewBox="0 0 100 54"><path d="M5 50a45 45 0 0 1 90 0" fill="none" stroke="var(--eu-background-static-muted)" strokeWidth="9" /><path d="M5 50a45 45 0 0 1 90 0" fill="none" stroke="var(--eu-chart-1)" strokeWidth="9" pathLength={100} strokeDasharray={`${v} 100`} /></svg><figcaption className="eu-type-body-small">{label}: {v}</figcaption></figure>;
}

export interface ProgressListProps {
  /** Rows, with value 0 to 100. */
  items: ChartDatum[];
}

/** Labelled progress bars in a list. */
export function ProgressList({ items }: ProgressListProps) {
  return <div className="eu-progresslist">{items.map((i) => <ProgressBar key={i.label} value={i.value} label={i.label} showLabel showValue />)}</div>;
}

export interface StatProps {
  /** What is measured. */
  label: string;
  /** The number, formatted. */
  value: string;
  /** Change, formatted, such as "+4.2%". */
  delta?: string;
  /** Direction of the change. It is shown with an arrow, not colour alone. */
  trend?: 'up' | 'down' | 'none';
}

/** One KPI: label, value and change. */
export function Stat({ label, value, delta, trend = 'none' }: StatProps) {
  return <div className="eu-stat"><span className="eu-type-body-small eu-check__desc">{label}</span><span className="eu-type-mobile-h4 eu-stat__value">{value}</span>{delta && trend !== 'none' ? <span className={cn('eu-type-body-caption-strong eu-stat__delta', `is-${trend}`)}><Icon name={trend === 'up' ? 'nav-up' : 'nav-down'} size="sm" />{delta}</span> : null}</div>;
}

export interface DataCardProps {
  /** Card title. */
  title: string;
  /** Line under the title. */
  description?: string;
  /** Top-right control: Menu or SegmentedControl. */
  headerAction?: React.ReactNode;
  /** Row of Stat. */
  stats?: React.ReactNode;
  /** The chart. */
  children: React.ReactNode;
}

/** Card for any chart, with an optional row of Stat. */
export function DataCard({ title, description, headerAction, stats, children }: DataCardProps) {
  return <Card title={title} description={description} headerAction={headerAction}>{stats ? <div className="eu-datacard__stats">{stats}</div> : null}{children}</Card>;
}
