import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { EditReminderModalProps } from "@/types/type";

export function EditReminderModal({ isOpen, onClose, onSubmit, reminder, applications }: EditReminderModalProps) {
  const [formData, setFormData] = useState({
    reminder_at: "",
    message: "",
  });

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (reminder && isOpen) {
      const date = new Date(reminder.reminder_at);
      const localDateTime = format(date, "yyyy-MM-dd'T'HH:mm");
      
      setFormData({
        reminder_at: localDateTime,
        message: reminder.message || "",
      });

      if (reminder.is_sent) {
        toast.warning("Reminder Already Sent", {
          description: "Editing will reschedule this reminder.",
          duration: 4000,
        });
      }
    }
  }, [reminder, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedTime = new Date(formData.reminder_at);
    const now = new Date();
    
    if (selectedTime <= now) {
      toast.error("Please select a future date and time");
      return;
    }
    
    if (reminder) {
      onSubmit(reminder.rem_id, {
        ...formData,
        is_sent: false, 
      });
    }
  };

  if (!isOpen || !reminder) return null;

  return (
    <div className="fixed inset-0 bg-transparent z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Edit Reminder</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Application</p>
            <p className="font-semibold text-gray-900">{reminder.application.position_title}</p>
            <p className="text-sm text-gray-600">{reminder.application.company.company_name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date & Time *
            </label>
            <input
              type="datetime-local"
              required
              min={getCurrentDateTime()} 
              value={formData.reminder_at}
              onChange={(e) => setFormData({ ...formData, reminder_at: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">
              Select a future time (minimum 5 minutes from now)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
              placeholder="Add a note for this reminder..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none cursor-text"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
            >
              Update Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
