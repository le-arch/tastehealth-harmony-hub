import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { History, Search, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface VitalsHistoryProps<T> {
  title: string;
  description?: string;
  entries: T[];
  getDate: (e: T) => string;
  getValue: (e: T) => number;
  getLabel: (e: T) => string;
  unit: string;
  color: string;
}

export function VitalsHistory<T>({ title, description, entries, getDate, getValue, getLabel, unit, color }: VitalsHistoryProps<T>) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return entries.filter(e => {
      const d = new Date(getDate(e));
      if (from && d < new Date(from)) return false;
      if (to) { const end = new Date(to); end.setHours(23,59,59,999); if (d > end) return false; }
      if (search) {
        const txt = `${getLabel(e)} ${getValue(e)} ${d.toLocaleString()}`.toLowerCase();
        if (!txt.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [entries, from, to, search]);

  const chartData = useMemo(() =>
    [...filtered].slice(0, 60).reverse().map((e, i) => ({
      idx: i + 1,
      value: getValue(e),
      label: new Date(getDate(e)).toLocaleDateString(),
    })), [filtered]);

  const reset = () => { setFrom(''); setTo(''); setSearch(''); };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base"><History className="h-4 w-4" />{title}</CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div><Label className="text-xs">From</Label><Input type="date" value={from} onChange={e => setFrom(e.target.value)} /></div>
          <div><Label className="text-xs">To</Label><Input type="date" value={to} onChange={e => setTo(e.target.value)} /></div>
          <div>
            <Label className="text-xs">Search</Label>
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-2 top-3 text-muted-foreground" />
              <Input className="pl-7" placeholder="value, date, label…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>
        {(from || to || search) && (
          <Button variant="ghost" size="sm" onClick={reset} className="h-7 text-xs"><X className="h-3 w-3 mr-1" />Clear filters</Button>
        )}
        <p className="text-xs text-muted-foreground">{filtered.length} of {entries.length} entries</p>

        {chartData.length >= 2 && (
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="idx" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="max-h-60 overflow-y-auto space-y-1">
          {filtered.length === 0 && <p className="text-xs text-muted-foreground text-center py-3">No matching entries</p>}
          {filtered.slice(0, 100).map((e: any, i) => (
            <div key={i} className="flex items-center justify-between text-xs p-2 border rounded">
              <span className="font-medium">{getLabel(e)} <span className="text-muted-foreground">{unit}</span></span>
              <span className="text-muted-foreground">{new Date(getDate(e)).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default VitalsHistory;
