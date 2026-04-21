import { Link } from "wouter";
import { useGetMetricsSummary, useListBriefs } from "@workspace/api-client-react";
import { formatUsd, formatPercentString, formatRelativeTime } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Compass, Anchor, FileText } from "lucide-react";

export default function Home() {
  const { data: summary, isLoading: isLoadingSummary } = useGetMetricsSummary();
  const { data: briefs, isLoading: isLoadingBriefs } = useListBriefs({ limit: 3 });

  return (
    <div className="flex flex-col gap-12">
      {/* Hero */}
      <section className="text-center max-w-2xl mx-auto py-8">
        <h1 className="text-4xl md:text-5xl font-bold font-serif italic text-primary mb-4">
          The Tide is Turning
        </h1>
        <p className="text-lg text-muted-foreground font-sans">
          Your daily dispatch on the Kraken ecosystem. Tracking the Ink chain's ascent and Payward's private market currents.
        </p>
      </section>

      {/* Metrics Summary */}
      <section>
        <h2 className="text-2xl font-serif font-semibold border-b border-border/50 pb-2 mb-6 flex items-center gap-2">
          <Compass className="h-6 w-6 text-primary" />
          Captain's Overview
        </h2>

        {isLoadingSummary ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              label="Ink TVL" 
              value={formatUsd(summary?.inkTvl)} 
              trend={null}
              updatedAt={summary?.updatedAt}
              testId="metric-ink-tvl"
            />
            <MetricCard 
              label="Ink Protocols" 
              value={summary?.inkProtocols?.toString() || "—"} 
              trend={null}
              updatedAt={summary?.updatedAt}
              testId="metric-ink-protocols"
            />
            <MetricCard 
              label="Kraken Share Price" 
              value={formatUsd(summary?.krakenSharePrice)} 
              trend={null}
              updatedAt={summary?.updatedAt}
              testId="metric-kraken-price"
            />
            <MetricCard 
              label="IPO Odds" 
              value={summary?.krakenIpoOdds != null ? `${(summary.krakenIpoOdds * 100).toFixed(0)}%` : "—"} 
              trend={null}
              updatedAt={summary?.updatedAt}
              testId="metric-ipo-odds"
            />
          </div>
        )}
      </section>

      {/* Navigation Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/ink" className="group block">
          <div className="h-full p-6 border border-border bg-card hover:bg-card/80 transition-colors stamp-border">
            <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2 mb-2">
              Ink Starboard <ArrowRight className="h-5 w-5" />
            </h3>
            <p className="text-muted-foreground font-sans">
              Dive deep into the Ink chain. Track total value locked, top protocols, and the native token's pulse.
            </p>
          </div>
        </Link>
        <Link href="/kraken" className="group block">
          <div className="h-full p-6 border border-border bg-card hover:bg-card/80 transition-colors stamp-border">
            <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2 mb-2">
              Kraken Map <ArrowRight className="h-5 w-5" />
            </h3>
            <p className="text-muted-foreground font-sans">
              Chart the course of Payward Inc. Private market share prices, IPO probabilities, and venue snapshots.
            </p>
          </div>
        </Link>
      </section>

      {/* Recent Briefs */}
      <section>
        <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-6">
          <h2 className="text-2xl font-serif font-semibold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Latest Dispatches
          </h2>
          <Link href="/briefs" className="text-primary hover:underline font-serif italic">
            Read all briefs →
          </Link>
        </div>

        {isLoadingBriefs ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-md" />
            ))}
          </div>
        ) : briefs?.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border/50 bg-card/50 rounded-md">
            <p className="text-muted-foreground font-serif italic">No briefs in the logbook yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {briefs?.map((brief) => (
              <Link key={brief.slug} href={`/briefs/${brief.slug}`} className="block group">
                <div className="p-5 border border-border bg-card hover:bg-accent/20 transition-colors relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Anchor className="w-12 h-12" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold font-serif group-hover:text-primary transition-colors">
                      {brief.title}
                    </h3>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      {formatRelativeTime(brief.publishedAt)}
                    </span>
                  </div>
                  <p className="text-muted-foreground line-clamp-2">
                    {brief.summary || "No summary available."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function MetricCard({ 
  label, 
  value, 
  trend, 
  updatedAt,
  testId 
}: { 
  label: string; 
  value: string; 
  trend: string | null; 
  updatedAt?: string;
  testId: string;
}) {
  return (
    <div data-testid={testId} className="p-5 border border-border bg-card flex flex-col justify-between stamp-border">
      <h3 className="text-sm font-sans font-medium text-muted-foreground uppercase tracking-wider mb-2">
        {label}
      </h3>
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-3xl font-serif font-bold text-foreground">{value}</span>
        {trend && (
          <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
            {trend}
          </span>
        )}
      </div>
      {updatedAt && (
        <span className="text-xs text-muted-foreground/70 font-mono">
          Updated {formatRelativeTime(updatedAt)}
        </span>
      )}
    </div>
  );
}
