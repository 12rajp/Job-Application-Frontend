"use client";

import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  User,
  Folder,
  LogOut,
} from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-50 border-r min-h-[calc(100vh-64px)] p-4">
      <nav className="space-y-2">
        <SidebarItem
          icon={LayoutDashboard}
          label="Overview"
          href="/dashboard"
          active
        />

        <SidebarItem
          icon={FileText}
          label="Applications"
          href="/applications"
        />

        <SidebarItem
          icon={PlusCircle}
          label="Add Application"
          href="/add-application"
        />

        <SidebarItem
          icon={Folder}
          label="Documents"
          href="/documents"
        />

        <SidebarItem
          icon={User}
          label="Profile"
          href="/profile"
        />

        <div className="pt-4 mt-4 border-t">
          <SidebarItem
            icon={LogOut}
            label="Logout"
            href="/logout"
          />
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
  href: string;
  active?: boolean;
}) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer
        ${active ? "bg-[#6C7CF2] text-white" : "hover:bg-gray-200"}`}
      >
        <Icon className="h-4 w-4" />
        {label}
      </div>
    </Link>
  );
}
