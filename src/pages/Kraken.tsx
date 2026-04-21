import { 
  useGetMetricHistory, 
  useGetKrakenEquity,
  getGetMetricHistoryQueryKey
} from "@workspace/api-client-react";
import { formatUsd, formatRelativeTime } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format } from "date-fns";
import { Map, TrendingUp, Building2, HelpCircle } from "lucide-react";

export default function Kraken() {
  const { data: priceHistory, isLoading: isLoadingPrice } = useGetMetricHistory(
    { metric: 'kraken_share_price', days: 90 },
    { query: { queryKey: getGetMetricHistoryQueryKey({ metric: 'kraken_share_price', days: 90 }) } }
  );
  
  const { data: oddsHistory, isLoading: isLoadingOdds } = useGetMetricHistory(
    { metric: 'kraken_ipo_odds', days: 90 },
    { query: { queryKey: getGetMetricHistoryQueryKey({ metric: 'kraken_ipo_odds', days: 90 }) } }
  );

  const { data: equity, isLoading: isLoadingEquity } = useGetKrakenEquity();

  return (
    <div className="flex flex-col gap-12">
      {/* Header */}
      <section className="border-b border-border pb-6">
        <h1 className="text-4xl font-bold font-serif italic text-primary mb-2 flex items-center gap-3">
          <Map className="h-8 w-8" /> Kraken Map
        </h1>
        <p className="text-muted-foreground">Charting Payward Inc.'s private market valuation and IPO trajectory.</p>
      </section>

      {/* Snapshot Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SnapshotCard 
          title="Share Price" 
          value={isLoadingEquity ? null : formatUsd(equity?.sharePrice)} 
          icon={<TrendingUp className="h-5 w-5 text-primary" />}
        />
        <SnapshotCard 
          title="Implied IPO Odds" 
          value={isLoadingEquity ? null : (equity?.ipoOdds != null ? `${(equity.ipoOdds * 100).toFixed(1)}%` : "—")} 
          icon={<HelpCircle className="h-5 w-5 text-primary" />}
        />
        <SnapshotCard 
          title="Active Venues" 
          value={isLoadingEquity ? null : equity?.venues?.toString() || "—"} 
          icon={<Building2 className="h-5 w-5 text-primary" />}
        />
        <div className="p-5 border border-border bg-card flex flex-col stamp-border justify-center">
          <p className="text-xs text-muted-foreground font-mono mb-1">Last Updated</p>
          <p className="text-sm font-medium">
            {isLoadingEquity ? <Skeleton className="h-4 w-24" /> : formatRelativeTime(equity?.updatedAt)}
          </p>
        </div>
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border border-border bg-card p-6 stamp-border">
          <h2 className="text-xl font-serif font-bold mb-6">Secondary Market Share Price (90d)</h2>
          {isLoadingPrice ? (
            <Skeleton className="h-[300px] w-full" />
          ) : priceHistory?.points?.length ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceHistory.points} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="t" 
                    tickFormatter={(val) => format(new Date(val), 'MMM d')}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={30}
                  />
                  <YAxis 
                    domain={['dataMin - 5', 'dataMax + 5']}
                    tickFormatter={(val) => `$${val}`}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatUsd(value), "Share Price"]}
                    labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '4px' }}
                  />
                  <Line 
                    type="stepAfter" 
                    dataKey="v" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground italic font-serif">
              Chart data unavailable
            </div>
          )}
        </div>

        <div className="border border-border bg-card p-6 stamp-border">
          <h2 className="text-xl font-serif font-bold mb-6">IPO Probability (90d)</h2>
          {isLoadingOdds ? (
            <Skeleton className="h-[300px] w-full" />
          ) : oddsHistory?.points?.length ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={oddsHistory.points} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="t" 
                    tickFormatter={(val) => format(new Date(val), 'MMM d')}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={30}
                  />
                  <YAxis 
                    domain={[0, 1]}
                    tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, "Probability"]}
                    labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '4px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="v" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2} 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground italic font-serif">
              Chart data unavailable
            </div>
          )}
        </div>
      </section>

      {/* Notes */}
      {equity?.notes && (
        <section className="bg-card border border-border p-6 rounded-md relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
          <h3 className="font-serif font-bold text-lg mb-2">Market Notes</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{equity.notes}</p>
        </section>
      )}
    </div>
  );
}

function SnapshotCard({ title, value, icon }: { title: string; value: string | null; icon: React.ReactNode }) {
  return (
    <div className="p-5 border border-border bg-card flex flex-col justify-between stamp-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-sans font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
        {icon}
      </div>
      <div className="text-3xl font-serif font-bold text-foreground">
        {value === null ? <Skeleton className="h-9 w-24" /> : value}
      </div>
    </div>
  );
}
