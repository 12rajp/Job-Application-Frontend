"use client";

import { LayoutDashboard, FileText, PlusCircle, User, Folder, LogOut, Bell, PieChart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-transparent bg-opacity-50 z-30 md:hidden transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      ></div>

      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-gray-50 border-r p-4 pt-20 z-40
          transform md:translate-x-0 transition-transform
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <nav className="space-y-5">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Overview" 
            href="/dashboard" 
            active={pathname === "/dashboard"} 
          />
          <SidebarItem 
            icon={FileText} 
            label="Applications" 
            href="/dashboard/applications" 
            active={pathname === "/dashboard/applications"} 
          />
          <SidebarItem 
            icon={PlusCircle} 
            label="Add Application" 
            href="/dashboard/add-application" 
            active={pathname === "/dashboard/add-application"} 
          />
          <SidebarItem 
            icon={Folder} 
            label="Documents" 
            href="/dashboard/documents" 
            active={pathname === "/dashboard/documents"} 
          />
          <SidebarItem 
            icon={Bell} 
            label="Reminders" 
            href="/dashboard/reminders" 
            active={pathname === "/dashboard/reminders"} 
          />
          <SidebarItem 
            icon={PieChart} 
            label="Analytics" 
            href="/dashboard/analytics" 
            active={pathname === "/dashboard/analytics"} 
          />
          <SidebarItem 
            icon={User} 
            label="Profile" 
            href="/dashboard/profile" 
            active={pathname === "/dashboard/profile"} 
          />
          
          <div onClick={handleLogout} className="cursor-pointer">
            <SidebarItem 
              icon={LogOut} 
              label={loading ? "Logging out..." : "Logout"} 
            />
          </div>
        </nav>
      </aside>
    </>
  );
}

function SidebarItem({ 
  icon: Icon, 
  label, 
  href, 
  active 
}: { 
  icon: any; 
  label: string; 
  href?: string; 
  active?: boolean;
}) {
  const baseStyle = "flex items-center gap-5 px-4 py-3.5 rounded-md text-[16px] font-semibold cursor-pointer transition-all duration-200";
  const activeStyle = "bg-gradient-to-r from-[#0B1220] to-[#16233A] text-white shadow-md";
  const hoverStyle = "hover:bg-gradient-to-r hover:from-[#0B1220] hover:to-[#16233A] hover:text-white";

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
