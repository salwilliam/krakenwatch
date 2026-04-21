import { 
  useGetMetricHistory, 
  useListInkProtocols, 
  useGetInkToken,
  getGetMetricHistoryQueryKey
} from "@workspace/api-client-react";
import { formatUsd, formatPercentString, formatRelativeTime } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format } from "date-fns";
import { ExternalLink, TrendingUp, Droplet } from "lucide-react";

export default function Ink() {
  const { data: tvlHistory, isLoading: isLoadingTvl } = useGetMetricHistory(
    { metric: 'ink_tvl', days: 30 },
    { query: { queryKey: getGetMetricHistoryQueryKey({ metric: 'ink_tvl', days: 30 }) } }
  );
  
  const { data: protocols, isLoading: isLoadingProtocols } = useListInkProtocols();
  const { data: inkToken, isLoading: isLoadingToken } = useGetInkToken();

  return (
    <div className="flex flex-col gap-12">
      {/* Header */}
      <section className="border-b border-border pb-6">
        <h1 className="text-4xl font-bold font-serif italic text-primary mb-2 flex items-center gap-3">
          <Droplet className="h-8 w-8" /> Ink Starboard
        </h1>
        <p className="text-muted-foreground">Tracking the lifeblood of Kraken's Layer 2 ecosystem.</p>
      </section>

      {/* TVL Chart & Token Info */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-border bg-card p-6 stamp-border">
          <h2 className="text-xl font-serif font-bold mb-6">Total Value Locked (30d)</h2>
          {isLoadingTvl ? (
            <Skeleton className="h-[300px] w-full" />
          ) : tvlHistory?.points?.length ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tvlHistory.points} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTvl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
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
                    tickFormatter={(val) => `$${(val / 1000000).toFixed(0)}M`}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={60}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatUsd(value), "TVL"]}
                    labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '4px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="v" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorTvl)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground italic font-serif">
              Chart data unavailable
            </div>
          )}
        </div>

        {/* Token Info */}
        <div className="border border-border bg-card p-6 stamp-border flex flex-col">
          <h2 className="text-xl font-serif font-bold mb-6">INK Token</h2>
          {isLoadingToken ? (
            <div className="space-y-4 flex-1">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-full mt-auto" />
            </div>
          ) : inkToken ? (
            <div className="flex flex-col h-full">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Current Price</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold font-serif">{formatUsd(inkToken.priceUsd)}</span>
                  <span className={`text-sm font-bold ${
                    (inkToken.change24h || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-destructive'
                  }`}>
                    {formatPercentString(inkToken.change24h)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Market Cap</span>
                  <span className="font-medium">{formatUsd(inkToken.marketCapUsd)}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Volume (24h)</span>
                  <span className="font-medium">{formatUsd(inkToken.volume24hUsd)}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 text-xs text-muted-foreground font-mono">
                Last updated {formatRelativeTime(inkToken.updatedAt)}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground italic font-serif">
              Token data unavailable
            </div>
          )}
        </div>
      </section>

      {/* Protocols Table */}
      <section>
        <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" /> Top Protocols
        </h2>
        <div className="border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-serif">Protocol</TableHead>
                <TableHead className="font-serif">Category</TableHead>
                <TableHead className="font-serif text-right">TVL</TableHead>
                <TableHead className="font-serif text-right">24h Change</TableHead>
                <TableHead className="font-serif text-right">7d Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingProtocols ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : protocols?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground italic font-serif">
                    No protocols found in the logbook.
                  </TableCell>
                </TableRow>
              ) : (
                protocols?.map((protocol) => (
                  <TableRow key={protocol.slug} className="hover:bg-accent/10 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {protocol.url ? (
                          <a href={protocol.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 group">
                            {protocol.name} <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        ) : (
                          protocol.name
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground capitalize text-xs tracking-wider">
                      {protocol.category || "Unknown"}
                    </TableCell>
                    <TableCell className="text-right font-mono">{formatUsd(protocol.tvlUsd)}</TableCell>
                    <TableCell className={`text-right font-mono text-sm ${(protocol.change1d || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                      {formatPercentString(protocol.change1d)}
                    </TableCell>
                    <TableCell className={`text-right font-mono text-sm ${(protocol.change7d || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                      {formatPercentString(protocol.change7d)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
