"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogFooter,} from "@/components/ui/dialog";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { allApplications } from "@/hooks/allApplications";
import { Application } from "@/types/type";
import Link from "next/link";

export default function AllApplicationsPage() {
  const {
    applications,
    companies,
    statuses,
    userId,
    fetchApplications,
    deleteApplication,
    updateApplication,
  } = allApplications();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const getCompanyName = (companyId: number) =>
    companies.find((c) => c.company_id === companyId)?.company_name || "N/A";

  const getStatusName = (statusId: number) =>
    statuses.find((s) => s.status_id === statusId)?.status_name || "N/A";

  const getStatusColor = (statusName: string) => {
    const colors: any = {
      Interview: "bg-orange-100 text-orange-600",
      Screening: "bg-blue-100 text-blue-600",
      Offer: "bg-green-100 text-green-600",
      Rejected: "bg-red-100 text-red-600",
      Applied: "bg-gray-100 text-gray-600",
    };
    return colors[statusName] || "bg-gray-100 text-gray-600";
  };

  const handleView = (app: Application) => {
    setSelectedApp(app);
    setViewModal(true);
  };

  const handleEdit = (app: Application) => {
    setSelectedApp(app);
    setEditForm({
      company_id: app.company_id,
      status_id: app.status_id,
      position_title: app.position_title,
      job_description: app.job_description || "",
      job_link: app.job_link || "",
      location: app.location || "",
      job_type: app.job_type || "",
      date_applied: app.date_applied?.split("T")[0] || "",
      application_deadline: app.application_deadline?.split("T")[0] || "",
      salary_offered: app.salary_offered || "",
    });
    setEditModal(true);
  };

  const handleDelete = async (appId: number) => {
    await deleteApplication(appId);
    if (userId) fetchApplications(userId);
  };

  const handleUpdateSubmit = async () => {
    if (!selectedApp) return;

    const updateData = {
      company_id: Number(editForm.company_id),
      status_id: Number(editForm.status_id),
      position_title: editForm.position_title,
      job_description: editForm.job_description || null,
      job_link: editForm.job_link || null,
      location: editForm.location || null,
      job_type: editForm.job_type || null,
      date_applied: editForm.date_applied || null,
      application_deadline: editForm.application_deadline || null,
      salary_offered: editForm.salary_offered
        ? Number(editForm.salary_offered)
        : null,
    };

    await updateApplication(selectedApp.app_id, updateData);
    setEditModal(false);
    if (userId) fetchApplications(userId);
  };

  const filteredApplications = applications.filter((app) => {
    const company = getCompanyName(app.company_id).toLowerCase();
    const position = app.position_title.toLowerCase();
    const query = searchQuery.toLowerCase();
    return company.includes(query) || position.includes(query);
  });
  return (
    <div className="max-w-5xl mx-auto pt-15 px-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
          My Applications
        </h1>
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Link href="/dashboard/add-application" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 flex items-center gap-2 justify-center">
              <Plus className="w-4 h-4" /> Add New
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4 font-semibold">Company</th>
                <th className="text-left p-4 font-semibold">Position</th>
                <th className="text-left p-4 font-semibold">Date Applied</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-center p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-gray-500">
                    No applications found. Click "Add New" to create your first
                    application!
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.app_id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">
                      {getCompanyName(app.company_id)}
                    </td>
                    <td className="p-4">{app.position_title}</td>
                    <td className="p-4">
                      {new Date(app.date_applied).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          getStatusName(app.status_id)
                        )}`}
                      >
                        {getStatusName(app.status_id)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() => handleView(app)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => handleEdit(app)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-500 hover:bg-red-600"
                          onClick={() => handleDelete(app.app_id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog open={viewModal} onOpenChange={setViewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Company</Label>
                  <p className="text-gray-700">
                    {getCompanyName(selectedApp.company_id)}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Position</Label>
                  <p className="text-gray-700">{selectedApp.position_title}</p>
                </div>
                <div>
                  <Label className="font-semibold">Status</Label>
                  <p className="text-gray-700">
                    {getStatusName(selectedApp.status_id)}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Job Type</Label>
                  <p className="text-gray-700">
                    {selectedApp.job_type || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Location</Label>
                  <p className="text-gray-700">
                    {selectedApp.location || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Date Applied</Label>
                  <p className="text-gray-700">
                    {new Date(selectedApp.date_applied).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Deadline</Label>
                  <p className="text-gray-700">
                    {selectedApp.application_deadline
                      ? new Date(
                          selectedApp.application_deadline
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Salary</Label>
                  <p className="text-gray-700">
                    {selectedApp.salary_offered || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <Label className="font-semibold">Job Description</Label>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedApp.job_description || "No description available"}
                </p>
              </div>
              {selectedApp.job_link && (
                <div>
                  <Label className="font-semibold">Job Link</Label>
                  <a
                    href={selectedApp.job_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline block mt-1"
                  >
                    {selectedApp.job_link}
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={editModal} onOpenChange={setEditModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Company</Label>
              <select
                value={editForm.company_id}
                onChange={(e) =>
                  setEditForm({ ...editForm, company_id: e.target.value })
                }
                className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {companies.map((c) => (
                  <option key={c.company_id} value={c.company_id}>
                    {c.company_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Status</Label>
              <select
                value={editForm.status_id}
                onChange={(e) =>
                  setEditForm({ ...editForm, status_id: e.target.value })
                }
                className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {statuses.map((s) => (
                  <option key={s.status_id} value={s.status_id}>
                    {s.status_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <Label>Position Title</Label>
              <Input
                value={editForm.position_title}
                onChange={(e) =>
                  setEditForm({ ...editForm, position_title: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Job Type</Label>
              <select
                value={editForm.job_type}
                onChange={(e) =>
                  setEditForm({ ...editForm, job_type: e.target.value })
                }
                className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={editForm.location}
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Date Applied</Label>
              <Input
                type="date"
                value={editForm.date_applied}
                onChange={(e) =>
                  setEditForm({ ...editForm, date_applied: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Application Deadline</Label>
              <Input
                type="date"
                value={editForm.application_deadline}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    application_deadline: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Salary Offered</Label>
              <Input
                value={editForm.salary_offered}
                onChange={(e) =>
                  setEditForm({ ...editForm, salary_offered: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Job Link</Label>
              <Input
                value={editForm.job_link}
                onChange={(e) =>
                  setEditForm({ ...editForm, job_link: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <Label>Job Description</Label>
              <Textarea
                value={editForm.job_description}
                onChange={(e) =>
                  setEditForm({ ...editForm, job_description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSubmit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Update Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
