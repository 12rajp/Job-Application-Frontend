import { Sidebar } from "@/components/dashboard/Sidebar";
import { Navbar } from "@/components/dashboard/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* NAVBAR — FULL WIDTH TOP */}
      <Navbar />

      {/* BELOW AREA */}
      <div className="flex flex-1">

        {/* SIDEBAR */}
        <aside className="w-64 shrink-0">
          <Sidebar />
        </aside>

        {/* CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}


