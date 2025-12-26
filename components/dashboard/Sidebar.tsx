"use client";
import {LayoutDashboard,FileText,PlusCircle,User,Folder,LogOut,Bell,} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = () => {
    router.push("/");
  };
  return (
    <aside className="w-64 bg-gray-50 border-r h-screen overflow-y-auto p-4 fixed top-0 left-0 pt-20 z-40">
      <nav className="space-y-5">
        <SidebarItem
          icon={LayoutDashboard}
          label="Overview"
          href="/dashboard"
          active={pathname === "/dashboard"} />
        <SidebarItem
          icon={FileText}
          label="Applications"
          href="/dashboard/applications"
          active={pathname === "/dashboard/applications"} />
        <SidebarItem
          icon={PlusCircle}
          label="Add Application"
          href="/dashboard/add-application"
          active={pathname === "/dashboard/add-application"}/>
        <SidebarItem
          icon={Folder}
          label="Documents"
          href="/dashboard/documents"
          active={pathname === "/dashboard/documents"}/>
        <SidebarItem
          icon={User}
          label="Profile"
          href="/dashboard/profile"
          active={pathname === "/dashboard/profile"}/>
        <SidebarItem
          icon={Bell}
          label="Reminders"
          href="/dashboard/reminders"
          active={pathname === "/dashboard/reminders"}/>
        <SidebarItem
          icon={Bell}
          label="Analytics"
          href="/dashboard/analytics"
          active={pathname === "/dashboard/analytics"} />
        <div onClick={handleLogout}>
          <SidebarItem icon={LogOut} label="Logout" />
        </div>
      </nav>
    </aside>
  );
}
function SidebarItem({
  icon: Icon,
  label,
  href,
  active,
}: {
  icon: any;
  label: string;
  href?: string;
  active?: boolean;
}) {
  const baseStyle =
    "flex items-center gap-5 px-4 py-3.5 rounded-md text-[16px] font-semibold cursor-pointer transition-all duration-200";
  const activeStyle =
    "bg-gradient-to-r from-[#0B1220] to-[#16233A] text-white shadow-md";
  const hoverStyle =
    "hover:bg-gradient-to-r hover:from-[#0B1220] hover:to-[#16233A] hover:text-white";
  return href ? (
    <Link href={href}>
      <div className={`${baseStyle} ${active ? activeStyle : hoverStyle}`}>
        <Icon className="h-6 w-6" />
        {label}
      </div>
    </Link>
  ) : (
    <div className={`${baseStyle} ${hoverStyle}`}>
      <Icon className="h-6 w-6" />
      {label}
    </div>
  );
}
