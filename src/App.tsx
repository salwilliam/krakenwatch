import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Shell } from "@/components/layout/Shell";
import Home from "@/pages/Home";
import Ink from "@/pages/Ink";
import Kraken from "@/pages/Kraken";
import Briefs from "@/pages/Briefs";
import BriefReader from "@/pages/BriefReader";
import Admin from "@/pages/Admin";

const queryClient = new QueryClient();

function Router() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/ink" component={Ink} />
        <Route path="/kraken" component={Kraken} />
        <Route path="/briefs" component={Briefs} />
        <Route path="/briefs/:slug" component={BriefReader} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
