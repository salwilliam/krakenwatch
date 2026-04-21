import { useState } from "react";
import { Link } from "wouter";
import { useListBriefs, getListBriefsQueryKey, ListBriefsKind } from "@workspace/api-client-react";
import { formatRelativeTime } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Anchor } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Briefs() {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const kindParam = activeTab === "all" ? undefined : (activeTab as ListBriefsKind);
  
  const { data: briefs, isLoading } = useListBriefs(
    { kind: kindParam },
    { query: { queryKey: getListBriefsQueryKey({ kind: kindParam }) } }
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <section className="border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold font-serif italic text-primary mb-2 flex items-center gap-3">
            <FileText className="h-8 w-8" /> The Manifest
          </h1>
          <p className="text-muted-foreground">Intelligence briefs and market observations.</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="all" className="font-serif">All</TabsTrigger>
            <TabsTrigger value="ink" className="font-serif">Ink</TabsTrigger>
            <TabsTrigger value="kraken" className="font-serif">Kraken</TabsTrigger>
            <TabsTrigger value="general" className="font-serif">General</TabsTrigger>
          </TabsList>
        </Tabs>
      </section>

      {/* Briefs List */}
      <section>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-md" />
            ))}
          </div>
        ) : briefs?.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border/50 bg-card/50 rounded-md stamp-border">
            <Anchor className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-muted-foreground">The manifest is empty.</h3>
            <p className="text-sm text-muted-foreground/70">No briefs match this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {briefs?.map((brief) => (
              <Link key={brief.slug} href={`/briefs/${brief.slug}`} className="block group">
                <article className="p-6 border border-border bg-card hover:bg-accent/10 transition-colors relative overflow-hidden group-hover:border-primary/50">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`uppercase tracking-wider text-xs rounded-none border-primary/30 font-mono ${
                        brief.kind === 'ink' ? 'bg-primary/10 text-primary' :
                        brief.kind === 'kraken' ? 'bg-secondary/10 text-secondary-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {brief.kind}
                      </Badge>
                      <time className="text-xs text-muted-foreground font-mono">
                        {formatRelativeTime(brief.publishedAt)}
                      </time>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold font-serif mb-2 group-hover:text-primary transition-colors">
                    {brief.title}
                  </h2>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {brief.summary || "No summary available."}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
