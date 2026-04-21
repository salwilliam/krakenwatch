import { useState } from "react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useRunIngestion,
  useGenerateBrief,
  getGetMetricsSummaryQueryKey,
  getListInkProtocolsQueryKey,
  getGetInkTokenQueryKey,
  getListBriefsQueryKey,
  type Brief,
  type IngestionResult,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Anchor, RefreshCw, FileText, ExternalLink, Loader2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/format";

type Kind = "ink" | "kraken" | "general";

export default function Admin() {
  const qc = useQueryClient();
  const [kind, setKind] = useState<Kind>("general");
  const [lastIngest, setLastIngest] = useState<IngestionResult | null>(null);
  const [lastBrief, setLastBrief] = useState<Brief | null>(null);
  const [briefError, setBriefError] = useState<string | null>(null);

  const ingest = useRunIngestion({
    mutation: {
      onSuccess: (result) => {
        setLastIngest(result);
        qc.invalidateQueries({ queryKey: getGetMetricsSummaryQueryKey() });
        qc.invalidateQueries({ queryKey: getListInkProtocolsQueryKey() });
        qc.invalidateQueries({ queryKey: getGetInkTokenQueryKey() });
      },
    },
  });

  const generate = useGenerateBrief({
    mutation: {
      onSuccess: (brief) => {
        setLastBrief(brief);
        setBriefError(null);
        qc.invalidateQueries({ queryKey: getListBriefsQueryKey() });
      },
      onError: (err: unknown) => {
        setBriefError(err instanceof Error ? err.message : "Generation failed");
      },
    },
  });

  return (
    <div className="flex flex-col gap-8" data-testid="page-admin">
      <header className="border-b border-border pb-6">
        <h1 className="text-4xl font-bold font-serif italic text-primary mb-2 flex items-center gap-3">
          <Anchor className="h-8 w-8" /> Quartermaster
        </h1>
        <p className="text-muted-foreground font-serif italic">
          Pull fresh stores from the docks. Pen a new dispatch.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingestion */}
        <Card className="rounded-none border-border bg-card">
          <CardHeader>
            <CardTitle className="font-serif italic text-2xl flex items-center gap-2">
              <RefreshCw className="h-5 w-5" /> Run Ingestion
            </CardTitle>
            <CardDescription className="font-serif">
              Pulls Ink chain TVL, protocols, and INK token price from the docks.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button
              onClick={() => ingest.mutate()}
              disabled={ingest.isPending}
              className="rounded-none w-fit"
              data-testid="button-run-ingest"
            >
              {ingest.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Hauling stores…
                </>
              ) : (
                <>Hoist anchor &amp; ingest</>
              )}
            </Button>

            {lastIngest && (
              <div
                className="border border-border/60 bg-background/50 p-4 font-mono text-sm space-y-1"
                data-testid="result-ingest"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="outline"
                    className={`rounded-none uppercase tracking-wider text-xs ${
                      lastIngest.ok
                        ? "border-primary/50 text-primary bg-primary/5"
                        : "border-destructive/50 text-destructive bg-destructive/5"
                    }`}
                  >
                    {lastIngest.ok ? "all clear" : "with errors"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(lastIngest.ranAt)}
                  </span>
                </div>
                <div>snapshots: {lastIngest.snapshots ?? 0}</div>
                <div>protocols: {lastIngest.protocols ?? 0}</div>
                {lastIngest.errors && lastIngest.errors.length > 0 && (
                  <ul className="text-destructive mt-2 list-disc list-inside space-y-0.5">
                    {lastIngest.errors.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {ingest.isError && !lastIngest && (
              <p className="text-sm text-destructive font-mono">
                {(ingest.error as Error)?.message ?? "Ingestion failed."}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Brief generation */}
        <Card className="rounded-none border-border bg-card">
          <CardHeader>
            <CardTitle className="font-serif italic text-2xl flex items-center gap-2">
              <FileText className="h-5 w-5" /> Generate Brief
            </CardTitle>
            <CardDescription className="font-serif">
              Tavily searches the seas; Venice writes the dispatch.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={kind} onValueChange={(v) => setKind(v as Kind)}>
                <SelectTrigger className="rounded-none w-full sm:w-48" data-testid="select-brief-kind">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="ink">Ink</SelectItem>
                  <SelectItem value="kraken">Kraken</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => generate.mutate({ data: { kind } })}
                disabled={generate.isPending}
                className="rounded-none w-fit"
                data-testid="button-generate-brief"
              >
                {generate.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Penning dispatch…
                  </>
                ) : (
                  <>Pen the dispatch</>
                )}
              </Button>
            </div>

            {lastBrief && (
              <div
                className="border border-border/60 bg-background/50 p-4 space-y-2"
                data-testid="result-brief"
              >
                <Badge
                  variant="outline"
                  className="rounded-none uppercase tracking-wider text-xs border-primary/50 text-primary bg-primary/5"
                >
                  {lastBrief.kind}
                </Badge>
                <h3 className="font-serif italic text-xl text-primary">
                  {lastBrief.title}
                </h3>
                {lastBrief.summary && (
                  <p className="text-sm text-muted-foreground font-serif italic">
                    {lastBrief.summary}
                  </p>
                )}
                <Link
                  href={`/briefs/${lastBrief.slug}`}
                  className="inline-flex items-center gap-1 text-sm text-primary underline decoration-dotted hover:decoration-solid"
                  data-testid="link-view-brief"
                >
                  Read it <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            )}

            {briefError && (
              <p className="text-sm text-destructive font-mono" data-testid="text-brief-error">
                {briefError}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
