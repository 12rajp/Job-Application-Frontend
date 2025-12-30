import { Calendar, Clock, Briefcase, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ReminderCardProps } from "@/types/type";

export function ReminderCard({
  reminder,
  onEdit,
  onDelete,
}: ReminderCardProps) {
  const reminderDate = new Date(reminder.reminder_at);
  const now = new Date();
  const isPast = reminderDate < now;
  const companyName = reminder.application?.company?.company_name;
  const positionTitle = reminder.application?.position_title;

  const getStatus = () => {
    if (reminder.is_sent) {
      return { label: "Sent", color: "bg-green-100 text-green-700" };
    }
    if (isPast) {
      return { label: "Pending", color: "bg-yellow-100 text-yellow-700" };
    }
    return { label: "Scheduled", color: "bg-blue-100 text-blue-700" };
  };

  const status = getStatus();

  return (
    <div
      className={`bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-all ${
        reminder.is_sent ? "border-green-200" : "border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
            {positionTitle}
          </h3>
          <div className="flex items-center gap-1.5 text-gray-600 text-sm mt-1">
            <Briefcase className="h-4 w-4" />
            <span className="line-clamp-1">{companyName}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 ml-3">
          <button
            onClick={onEdit}
            className="p-1.5 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors cursor-pointer"
            title="Edit"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {reminder.message && (
          <p className="text-gray-700 text-sm line-clamp-2">
            {reminder.message}
          </p>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{format(reminderDate, "MMM dd, yyyy")}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{format(reminderDate, "hh:mm a")}</span>
        </div>

        <div className="pt-2">
          <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>
    </div>
  );
}
