import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { AddReminderModalProps } from "@/types/type";

export function AddReminderModal({ isOpen, onClose, onSubmit, applications }: AddReminderModalProps) {
  const [formData, setFormData] = useState({
    app_id: "",
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
    if (!isOpen) {
      setFormData({
        app_id: "",
        reminder_at: "",
        message: "",
      });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedTime = new Date(formData.reminder_at);
    const now = new Date();
    
    if (selectedTime <= now) {
      alert("Please select a future date and time for the reminder.");
      return;
    }
    
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent z-50 flex items-center justify-center p-4"> 
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Add Reminder</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application *
            </label>
            {applications.length === 0 ? (
              <div className="w-full px-3 py-2 border border-yellow-300 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                No applications found. Please add an application first.
              </div>
            ) : (
              <select
                required
                value={formData.app_id}
                onChange={(e) => setFormData({ ...formData, app_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="">Select an application</option>
                {applications.map((app) => (
                  <option key={app.app_id} value={app.app_id}>
                    {app.position_title} - {app.company.company_name}
                  </option>
                ))}
              </select>
            )}
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
              Minimum 5 minutes from now
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
              Add Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
