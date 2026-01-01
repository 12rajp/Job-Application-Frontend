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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1A2539] rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-[#1A2539] border-b border-white/10 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Edit Reminder</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-white/10 border border-white/20 p-4 rounded-lg">
            <p className="text-sm text-white/70 mb-1">Application</p>
            <p className="font-semibold text-white text-lg">{reminder.application.position_title}</p>
            <p className="text-sm text-white/80 mt-1">{reminder.application.company.company_name}</p>
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
              Select a future time (minimum 5 minutes from now)
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
              Update Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
