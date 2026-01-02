import { useState, useRef, useEffect } from "react";
import { Search, Filter, List, CheckCircle, Clock, AlertCircle, X, ChevronDown } from "lucide-react";

interface ReminderSearchFilterProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts?: {
    all: number;
    sent: number;
    scheduled: number;
    pending: number;
  };
}

export const ReminderSearchFilter = ({ 
  currentFilter, 
  onFilterChange,
  searchQuery,
  onSearchChange,
  counts 
}: ReminderSearchFilterProps) => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filterOptions = [
    { 
      value: "all", 
      label: "All Reminders", 
      icon: List,
      color: "text-gray-600",
    },
    { 
      value: "sent", 
      label: "Sent", 
      icon: CheckCircle,
      color: "text-green-600",
    },
    { 
      value: "scheduled", 
      label: "Scheduled", 
      icon: Clock,
      color: "text-blue-600",
    },
    { 
      value: "pending", 
      label: "Pending", 
      icon: AlertCircle,
      color: "text-orange-600",
    },
  ];

  const handleFilterSelect = (value: string) => {
    onFilterChange(value);
    setShowFilterDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    };

    if (showFilterDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterDropdown]);

  return (
    <div className="flex-1 flex gap-3">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by message or status (e.g., sent, pending)"
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div> 

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-300"
        >
          <Filter className="h-5 w-5" />
          <span className="hidden sm:inline font-medium">Filters</span>
          {currentFilter !== "all" && (
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
        </button>

        {showFilterDropdown && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Filter by Status</h3>
            </div>

            <div className="p-3">
              <div className="space-y-1">
                {filterOptions.map((option) => {
                  const Icon = option.icon;
                  const count = counts ? counts[option.value as keyof typeof counts] : 0;
                  const isSelected = currentFilter === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleFilterSelect(option.value)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all
                        ${isSelected 
                          ? 'bg-blue-50 text-blue-900' 
                          : 'hover:bg-gray-50 text-gray-700'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${isSelected ? 'text-blue-600' : option.color}`} />
                        <span className="font-medium text-sm">
                          {option.label}
                        </span>
                      </div>
                      <span className={`
                        px-2 py-0.5 rounded-full text-xs font-semibold
                        ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}
                      `}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="flex gap-2 p-3 border-t border-gray-200">
              <button
                onClick={() => {
                  onFilterChange("all");
                  setShowFilterDropdown(false);
                }}
                className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilterDropdown(false)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
