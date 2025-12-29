"use client";

import { Plus, AlertCircle } from "lucide-react";
import { ReminderCard } from "@/components/reminder/ReminderCard";
import { AddReminderModal } from "@/components/reminder/AddReminderModal";
import { EditReminderModal } from "@/components/reminder/EditReminderModal";
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
  } = useReminder();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reminders</h1>
          <p className="text-gray-600 mt-1">Manage your application reminders</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="h-5 w-5" />
          Add Reminder
        </button>
      </div>

      {reminders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No reminders yet</h3>
          <p className="text-gray-500 mb-6">Create your first reminder to stay on top of your applications</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reminders.map((reminder) => (
            <ReminderCard
              key={reminder.rem_id}
              reminder={reminder}
              onEdit={() => openEditModal(reminder)}
              onDelete={() => handleDeleteReminder(reminder.rem_id)}
            />
          ))}
        </div>
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
