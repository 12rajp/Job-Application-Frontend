import DashboardNavbar from '@/components/dashboard/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900">
      <DashboardNavbar />
      <main>{children}</main>
    </div>
  );
}
