import { Calendar, Clock, Briefcase, Edit, Trash2, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { ReminderCardProps } from "@/types/type";
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";

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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors cursor-pointer">
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onDelete} 
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
