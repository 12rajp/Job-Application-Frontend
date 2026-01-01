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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"> 
      <div className="bg-[#1A2539] rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-[#1A2539] border-b border-white/10 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Add Reminder</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-6 w-6 cursor-pointer" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Application *
            </label>
            {applications.length === 0 ? (
              <div className="w-full px-3 py-2 border border-yellow-400/30 bg-yellow-500/10 rounded-lg text-sm text-yellow-300">
                No applications found. Please add an application first.
              </div>
            ) : (
              <select
                required
                value={formData.app_id}
                onChange={(e) => setFormData({ ...formData, app_id: e.target.value })}
                className="w-full px-3 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 cursor-pointer transition-all hover:bg-white/15"
                style={{
                  colorScheme: 'dark'
                }}
              >
                <option value="" className="bg-[#1A2539] text-white">Select an application</option>
                {applications.map((app) => (
                  <option key={app.app_id} value={app.app_id} className="bg-[#1A2539] text-white">
                    {app.position_title} - {app.company.company_name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Date & Time *
            </label>
            <input
              type="datetime-local"
              required
              min={getCurrentDateTime()} 
              value={formData.reminder_at}
              onChange={(e) => setFormData({ ...formData, reminder_at: e.target.value })}
              className="w-full px-3 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 cursor-pointer transition-all hover:bg-white/15"
              style={{
                colorScheme: 'dark'
              }}
            />
            <p className="text-xs text-white/60 mt-1.5">
              Minimum 5 minutes from now
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Message (Optional)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
              placeholder="Add a note for this reminder..."
              className="w-full px-3 py-2.5 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 resize-none cursor-text transition-all hover:bg-white/15"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-white text-[#1A2539] rounded-lg hover:bg-white/90 transition-all font-medium cursor-pointer shadow-lg"
            >
              Add Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
