
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WatchlistProvider } from "./context/WatchlistContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import Watchlist from "./pages/Watchlist";
import MovieDetails from "./pages/MovieDetails";
import TVDetails from "./pages/TVDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WatchlistProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv" element={<TVShows />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/tv/:id" element={<TVDetails />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WatchlistProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
