'use client';

import { useEffect, useState } from 'react';
import { Briefcase, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface UserInfo {
  name: string;
  email: string;
}

export default function DashboardNavbar() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    // Token se user info fetch karna
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      try {
        // Yahan aap apne backend se user info fetch kar sakte hain
        // Temporary example:
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser({
            name: data.user_name || 'User',
            email: data.email || '',
          });
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        // Fallback data agar API call fail ho jaye
        setUser({
          name: 'User',
          email: 'user@example.com',
        });
      }
    };

    fetchUserInfo();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side - Title */}
        <div className="flex items-center gap-3">
          <Briefcase className="h-6 w-6 text-blue-400" />
          <h1 className="text-xl font-semibold text-white">
            Job Application Tracker
          </h1>
        </div>

        {/* Right Side - User Info */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
                <Avatar className="h-10 w-10 bg-blue-600 hover:bg-blue-700 transition-colors">
                  <AvatarFallback className="bg-blue-600 text-white font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-800 text-white border-slate-700">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer focus:bg-slate-700 focus:text-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}
