import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, Bell, ChevronRight, Info } from 'lucide-react';
import { cn } from '../lib/utils';

type Status = 'Pending' | 'Processing' | 'Shipped' | 'Delivered';

interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  note: string;
}

const SAMPLE_TRACKING_DATA = {
  'LMN-123456': {
    status: 'Shipped' as Status,
    estimatedDelivery: 'Oct 24, 2026',
    currentLocation: 'Chicago, IL Distribution Center',
    progress: 75,
    history: [
      { id: '1', status: 'In Transit', location: 'Chicago, IL', timestamp: 'Oct 22, 2026 - 10:30 AM', note: 'Package has left the distribution center.' },
      { id: '2', status: 'Processing', location: 'Memphis, TN', timestamp: 'Oct 21, 2026 - 02:15 PM', note: 'Arrived at sorting facility.' },
      { id: '3', status: 'Shipped', location: 'Austin, TX', timestamp: 'Oct 20, 2026 - 09:00 AM', note: 'Package picked up by carrier.' },
      { id: '4', status: 'Pending', location: 'Austin, TX', timestamp: 'Oct 19, 2026 - 04:45 PM', note: 'Order confirmed and being prepared.' },
    ]
  }
};

const Tracking = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [searchResult, setSearchResult] = useState<typeof SAMPLE_TRACKING_DATA['LMN-123456'] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsSearching(true);
    setError('');
    
    // Simulate API delay
    setTimeout(() => {
      const result = SAMPLE_TRACKING_DATA[trackingNumber as keyof typeof SAMPLE_TRACKING_DATA];
      if (result) {
        setSearchResult(result);
      } else {
        setError('Tracking number not found. Try LMN-123456 for a demo.');
        setSearchResult(null);
      }
      setIsSearching(false);
    }, 1000);
  };

  const statusSteps = [
    { label: 'Pending', icon: Clock },
    { label: 'Processing', icon: Package },
    { label: 'Shipped', icon: Truck },
    { label: 'Delivered', icon: CheckCircle2 },
  ];

  const currentStatusIndex = statusSteps.findIndex(s => s.label === searchResult?.status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black tracking-tight text-black mb-4">Track Your Delivery</h1>
          <p className="text-black/40 font-medium">Enter your tracking number to see real-time updates on your order.</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative mb-12 group">
          <input
            type="text"
            placeholder="Enter tracking number (e.g., LMN-123456)"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="w-full px-8 py-6 bg-white border-2 border-black/5 rounded-[32px] text-lg font-bold focus:outline-none focus:border-black transition-all shadow-xl shadow-black/5 group-hover:shadow-black/10"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-3 top-3 bottom-3 px-8 bg-black text-white rounded-[24px] font-bold flex items-center space-x-2 hover:bg-black/80 transition disabled:opacity-50"
          >
            {isSearching ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Track</span>
              </>
            )}
          </button>
        </form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold flex items-center mb-8"
            >
              <Info className="w-4 h-4 mr-2" />
              {error}
            </motion.div>
          )}

          {searchResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Status Overview Card */}
              <div className="bg-white rounded-[40px] p-8 border border-black/5 shadow-2xl shadow-black/5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-2 block">Current Status</span>
                    <div className="flex items-center space-x-3">
                      <div className="px-4 py-1.5 bg-black text-white text-xs font-black rounded-full uppercase tracking-tighter">
                        {searchResult.status}
                      </div>
                      <span className="text-black/20 font-bold">•</span>
                      <span className="text-sm font-bold text-black/60">Updated 5 mins ago</span>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-2 block">Estimated Delivery</span>
                    <p className="text-2xl font-black text-black">{searchResult.estimatedDelivery}</p>
                  </div>
                </div>

                {/* Progress Tracker */}
                <div className="relative mb-12">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-black/5 -translate-y-1/2 rounded-full" />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
                    className="absolute top-1/2 left-0 h-1 bg-black -translate-y-1/2 rounded-full z-10" 
                  />
                  
                  <div className="relative flex justify-between items-center z-20">
                    {statusSteps.map((step, idx) => {
                      const Icon = step.icon;
                      const isActive = idx <= currentStatusIndex;
                      const isCurrent = idx === currentStatusIndex;

                      return (
                        <div key={step.label} className="flex flex-col items-center">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                            isActive ? "bg-black text-white scale-110" : "bg-white border-2 border-black/5 text-black/20",
                            isCurrent && "ring-4 ring-black/10"
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className={cn(
                            "mt-4 text-[10px] font-black uppercase tracking-widest",
                            isActive ? "text-black" : "text-black/20"
                          )}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center p-6 bg-black/5 rounded-3xl">
                  <MapPin className="w-5 h-5 text-black mr-4" />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-black/40 block">Last Location</span>
                    <p className="text-sm font-bold text-black">{searchResult.currentLocation}</p>
                  </div>
                </div>
              </div>

              {/* History & Notifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-[40px] p-8 border border-black/5 shadow-xl shadow-black/5">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black tracking-tight">Tracking History</h3>
                    <Clock className="w-5 h-5 text-black/20" />
                  </div>
                  <div className="space-y-8">
                    {searchResult.history.map((event, idx) => (
                      <div key={event.id} className="relative flex space-x-4 group">
                        {idx !== searchResult.history.length - 1 && (
                          <div className="absolute left-2 top-6 bottom-[-32px] w-0.5 bg-black/5" />
                        )}
                        <div className={cn(
                          "w-4 h-4 rounded-full mt-1.5 z-10 border-2 border-white ring-2 ring-black/5",
                          idx === 0 ? "bg-black" : "bg-black/10"
                        )} />
                        <div>
                          <p className="text-xs font-black text-black/40 uppercase tracking-widest mb-1">{event.timestamp}</p>
                          <p className="text-sm font-bold text-black mb-1">{event.status} — {event.location}</p>
                          <p className="text-xs text-black/40 font-medium leading-relaxed">{event.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-[40px] p-8 border border-black/5 shadow-xl shadow-black/5">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black tracking-tight">Notifications</h3>
                    <Bell className="w-5 h-5 text-black/20" />
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-black/5 rounded-2xl flex items-start space-x-4">
                      <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                        <Bell className="w-4 h-4 text-black" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-black mb-1">SMS Alerts Active</p>
                        <p className="text-xs text-black/40">You will receive a text message when the package is out for delivery.</p>
                      </div>
                    </div>
                    <button className="w-full py-4 border-2 border-black/5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                      Manage Alerts
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tracking;
