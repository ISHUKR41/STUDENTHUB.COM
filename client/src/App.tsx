import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { Suspense, lazy } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Tools = lazy(() => import("./pages/Tools"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Switch>
            <Route path="/" component={Index} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/tools" component={Tools} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
