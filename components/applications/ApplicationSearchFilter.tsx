"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import {Popover,PopoverContent,PopoverTrigger,} from "@/components/ui/popover";
import { Search, Filter, X, Calendar } from "lucide-react";
import { FilterState, ApplicationSearchFilterProps } from "@/types/type";

export default function ApplicationSearchFilter({
  applications,
  companies,
  statuses,
  onFilteredResults,
}: ApplicationSearchFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    keyword: "",
    company: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
    jobType: "all",
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const getCompanyName = (companyId: number) =>
    companies.find((c) => c.company_id === companyId)?.company_name || "";

  const getStatusName = (statusId: number) =>
    statuses.find((s) => s.status_id === statusId)?.status_name || "";

  const applyFilters = () => {
    let filtered = [...applications];

    if (filters.keyword.trim()) {
      const keyword = filters.keyword.toLowerCase();
      filtered = filtered.filter((app) => {
        const company = getCompanyName(app.company_id).toLowerCase();
        const position = app.position_title.toLowerCase();
        const location = (app.location || "").toLowerCase();
        const description = (app.job_description || "").toLowerCase();
        return (
          company.includes(keyword) ||
          position.includes(keyword) ||
          location.includes(keyword) ||
          description.includes(keyword)
        );
      });
    }

    if (filters.company !== "all") {
      filtered = filtered.filter(
        (app) => app.company_id === Number(filters.company)
      );
    }

    if (filters.status !== "all") {
      filtered = filtered.filter(
        (app) => app.status_id === Number(filters.status)
      );
    }

    if (filters.jobType !== "all") {
      filtered = filtered.filter((app) => app.job_type === filters.jobType);
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter((app) => new Date(app.date_applied) >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      filtered = filtered.filter((app) => new Date(app.date_applied) <= toDate);
    }

    const count = [
      filters.company !== "all" ? 1 : 0,
      filters.status !== "all" ? 1 : 0,
      filters.jobType !== "all" ? 1 : 0,
      filters.dateFrom ? 1 : 0,
      filters.dateTo ? 1 : 0,
    ].reduce((a, b) => a + b, 0);
    setActiveFiltersCount(count);

    onFilteredResults(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const resetFilters = () => {
    setFilters({
      keyword: "",
      company: "all",
      status: "all",
      dateFrom: "",
      dateTo: "",
      jobType: "all",
    });
    setActiveFiltersCount(0);
    onFilteredResults(applications);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search by company, position, location, or description..."
            value={filters.keyword}
            onChange={(e) => handleFilterChange("keyword", e.target.value)}
            className="pl-10 pr-10"
          />
          {filters.keyword && (
            <button
              onClick={() => handleFilterChange("keyword", "")}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative min-w-30 gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Advanced Filters</h3>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-red-600 hover:text-red-700 h-auto p-1"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label>Company</Label>
                <Select
                  value={filters.company}
                  onValueChange={(value) => handleFilterChange("company", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Companies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company.company_id} value={String(company.company_id)}>
                        {company.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status.status_id} value={String(status.status_id)}>
                        {status.status_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select
                  value={filters.jobType}
                  onValueChange={(value) => handleFilterChange("jobType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Onsite">Onsite</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Date Applied (From)
                </Label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Date Applied (To)
                </Label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
