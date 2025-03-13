
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Film, Tv2, Home, Heart, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="w-4 h-4 mr-2" /> },
    { name: 'Movies', path: '/movies', icon: <Film className="w-4 h-4 mr-2" /> },
    { name: 'TV Shows', path: '/tv', icon: <Tv2 className="w-4 h-4 mr-2" /> },
    { name: 'Watchlist', path: '/watchlist', icon: <Heart className="w-4 h-4 mr-2" /> },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#0A0A0B] text-foreground dark">
      {/* Header */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "bg-background/80 dark:bg-black/80 backdrop-blur-lg shadow-md" : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">HubStream</span>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "nav-item flex items-center",
                    isActive(item.path) && "text-primary after:scale-x-100"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/search" 
                className="p-2 rounded-full hover:bg-secondary/80 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </Link>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-full hover:bg-secondary/80 transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 dark:bg-black/95 backdrop-blur-sm md:hidden animate-fade-in">
          <div className="pt-20 p-4">
            <nav className="flex flex-col items-center space-y-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center text-lg font-medium py-2 px-4 rounded-md transition-colors",
                    isActive(item.path) 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-secondary/80"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              <Link
                to="/search"
                className="flex items-center text-lg font-medium py-2 px-4 rounded-md transition-colors hover:bg-secondary/80"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Link>
            </nav>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <main className="pt-16 min-h-screen">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-secondary/50 dark:bg-black/40 backdrop-blur-sm py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">HubStream</span>
              <p className="text-sm text-muted-foreground mt-1">
                A modern streaming experience
              </p>
            </div>
            <div className="flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
            <p className="mt-1">© 2023 HubStream. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
