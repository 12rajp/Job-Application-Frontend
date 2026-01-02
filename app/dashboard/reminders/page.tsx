"use client";

import { Plus, AlertCircle } from "lucide-react";
import { ReminderCard } from "@/components/reminder/ReminderCard";
import { AddReminderModal } from "@/components/reminder/AddReminderModal";
import { EditReminderModal } from "@/components/reminder/EditReminderModal";
import { ReminderPagination } from "@/components/reminder/ReminderPagination";
import { ReminderSearchFilter } from "@/components/reminder/ReminderFilter";
import { useReminder } from "@/hooks/reminder";
export default function RemindersPage() {
  const {
    reminders,
    applications,
    loading,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    selectedReminder,
    setSelectedReminder,
    handleAddReminder,
    handleEditReminder,
    handleDeleteReminder,
    openEditModal,
    currentPage,
    totalPages,
    total,
    handlePageChange,
    currentFilter,
    handleFilterChange,
    searchQuery,
    handleSearchChange,
    counts,
  } = useReminder();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getFilterLabel = () => {
    switch (currentFilter) {
      case "sent": return "Sent";
      case "scheduled": return "Scheduled";
      case "pending": return "Pending";
      default: return "All";
    }
  };

  const filteredReminders = reminders.filter(reminder => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase().trim();
    const message = reminder.message?.toLowerCase() || '';
    const status = reminder.status?.toLowerCase() || '';
    
    return message.includes(query) || status.includes(query);
  });

  const getTotalCount = () => {
    if (searchQuery) {
      return filteredReminders.length;
    }
    if (currentFilter !== "all" && counts) {
      return counts[currentFilter as keyof typeof counts] || 0;
    }
    return counts?.all || total || reminders.length;
  };

  const displayCount = getTotalCount();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Reminder
        </h1>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <ReminderSearchFilter
          currentFilter={currentFilter}
          onFilterChange={handleFilterChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          counts={counts}
        />
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer shadow-sm"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Add Reminder</span>
        </button>
      </div>

      {!searchQuery && (
        <div className="mb-4 text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{getFilterLabel()}</span>
          {" "}({displayCount} {displayCount === 1 ? 'reminder' : 'reminders'})
        </div>
      )}

      {filteredReminders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No reminders yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-md">
            {searchQuery 
              ? `No reminders found matching "${searchQuery}"`
              : displayCount === 0
              ? `No ${getFilterLabel().toLowerCase()} reminders found`
              : 'Create your first reminder to stay on top of your applications'
            }
          </p>
        </div>
      ) : (
        <>
          {searchQuery && (
            <div className="mb-4 text-sm text-gray-600">
              Found <span className="font-semibold text-gray-900">{filteredReminders.length}</span>
              {" "}{filteredReminders.length === 1 ? 'reminder' : 'reminders'} matching "{searchQuery}"
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredReminders.map((reminder) => (
              <ReminderCard
                key={reminder.rem_id}
                reminder={reminder}
                onEdit={() => openEditModal(reminder)}
                onDelete={() => handleDeleteReminder(reminder.rem_id)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <ReminderPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      <AddReminderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddReminder}
        applications={applications}
      />

      <EditReminderModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedReminder(null);
        }}
        onSubmit={handleEditReminder}
        reminder={selectedReminder}
        applications={applications}
      />
    </div>
  );
}
