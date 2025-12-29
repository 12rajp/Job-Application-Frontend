import { Calendar, Clock, Briefcase, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface ReminderCardProps {
  reminder: {
    rem_id: number;
    reminder_at: string;
    message: string;
    method: string;
    is_sent: boolean;
    application: {
      position_title: string;
      company: {
        company_name: string;
      };
    };
  };
  onEdit: () => void;
  onDelete: () => void;
}

export function ReminderCard({ reminder, onEdit, onDelete }: ReminderCardProps) {
  const reminderDate = new Date(reminder.reminder_at);
  const isPast = reminderDate < new Date();
  const companyName = reminder.application?.company?.company_name;
  const positionTitle = reminder.application?.position_title;

  return (
    <div className={`bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-all ${
      isPast ? "border-gray-300 opacity-75" : "border-gray-200"
    }`}>
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
            className="p-1.5 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            title="Edit"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {reminder.message && (
          <p className="text-gray-700 text-sm line-clamp-2">{reminder.message}</p>
        )}
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{format(reminderDate, "MMM dd, yyyy")}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{format(reminderDate, "hh:mm a")}</span>
        </div>

        {reminder.is_sent && (
          <div className="pt-2">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Sent
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
