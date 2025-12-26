"use client";

import {LayoutDashboard,FileText,PlusCircle,User,Folder,LogOut,Bell,} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <aside className="w-64 bg-gray-50 border-r h-screen overflow-y-auto p-4 fixed top-0 left-0 pt-20 z-40">
      <nav className="space-y-2">
        <SidebarItem icon={LayoutDashboard} label="Overview" href="/dashboard" active />
        <SidebarItem icon={FileText} label="Applications" href="/dashboard/applications" />
        <SidebarItem icon={PlusCircle} label="Add Application" href="/dashboard/add-application" />
        <SidebarItem icon={Folder} label="Documents" href="/dashboard/documents" />
        <SidebarItem icon={User} label="Profile" href="/dashboard/profile" />
        <SidebarItem icon={Bell} label="Reminders" href="/dashboard/reminders" /> 
        <SidebarItem icon={Bell} label="Analytic" href="/dashboard/analytics" /> 
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
    "flex items-center gap-4 px-4 py-3 rounded-md text-lg font-medium cursor-pointer transition-all duration-200";
  const activeStyle = "bg-gradient-to-r from-purple-600 to-blue-600 text-white";
  const hoverStyle = "hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white";

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
