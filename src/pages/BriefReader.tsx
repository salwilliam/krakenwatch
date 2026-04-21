import { Link, useRoute } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  useGetBrief,
  getGetBriefQueryKey,
} from "@workspace/api-client-react";
import { formatRelativeTime } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Anchor, ArrowLeft, ExternalLink, Compass } from "lucide-react";

export default function BriefReader() {
  const [, params] = useRoute("/briefs/:slug");
  const slug = params?.slug ?? "";

  const { data: brief, isLoading, isError } = useGetBrief(slug, {
    query: { enabled: !!slug, queryKey: getGetBriefQueryKey(slug) },
  });

  return (
    <div className="flex flex-col gap-8" data-testid="page-brief-reader">
      <Link
        href="/briefs"
        className="inline-flex items-center gap-2 text-sm font-serif italic text-muted-foreground hover:text-primary transition-colors w-fit"
        data-testid="link-back-briefs"
      >
        <ArrowLeft className="h-4 w-4" /> Back to the manifest
      </Link>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {isError && (
        <div className="text-center py-20 border border-dashed border-border/50 bg-card/50 rounded-md">
          <Anchor className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-serif text-muted-foreground">Brief not found in the logbook.</h3>
          <p className="text-sm text-muted-foreground/70 mt-2">
            The page you sought has drifted out of port.
          </p>
        </div>
      )}

      {brief && (
        <article className="flex flex-col gap-6">
          <header className="border-b border-border/60 pb-6 flex flex-col gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge
                variant="outline"
                className="uppercase tracking-wider text-xs rounded-none border-primary/40 bg-primary/10 text-primary font-mono"
                data-testid={`badge-kind-${brief.kind}`}
              >
                {brief.kind}
              </Badge>
              <time className="text-xs font-mono text-muted-foreground" data-testid="text-published-at">
                Logged {formatRelativeTime(brief.publishedAt)}
              </time>
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold font-serif italic text-primary leading-tight"
              data-testid="text-brief-title"
            >
              {brief.title}
            </h1>
            {brief.summary && (
              <p
                className="text-lg font-serif italic text-muted-foreground"
                data-testid="text-brief-summary"
              >
                {brief.summary}
              </p>
            )}
          </header>

          <div
            className="prose prose-stone dark:prose-invert max-w-none font-serif prose-headings:font-serif prose-headings:italic prose-headings:text-primary prose-a:text-primary prose-a:underline prose-a:decoration-dotted hover:prose-a:decoration-solid"
            data-testid="text-brief-body"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{brief.bodyMd}</ReactMarkdown>
          </div>

          {brief.sources && brief.sources.length > 0 && (
            <section className="mt-8 border-t border-border/60 pt-6">
              <h2 className="text-xl font-serif italic text-primary mb-4 flex items-center gap-2">
                <Compass className="h-5 w-5" /> Charts &amp; Soundings
              </h2>
              <ol className="space-y-2 list-decimal list-inside marker:font-mono marker:text-muted-foreground">
                {brief.sources.map((s, i) => (
                  <li key={`${s.url}-${i}`} className="text-sm" data-testid={`source-${i}`}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-foreground hover:text-primary underline decoration-dotted hover:decoration-solid"
                    >
                      {s.title}
                      <ExternalLink className="h-3 w-3 inline" />
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </article>
      )}
    </div>
  );
}
