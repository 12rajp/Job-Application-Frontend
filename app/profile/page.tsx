"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { Camera, Mail, Phone, MapPin, Calendar, Lock, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
  user_id: number;
  user_name: string;
  email: string;
  full_name?: string;
  phone?: string;
  profile_photo?: string;
  city?: string;
  country?: string;
  date_of_birth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    user_name: "",
    email: "",
    full_name: "",
    phone: "",
    profile_photo: "",
    city: "",
    country: "",
    date_of_birth: "",
    gender: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const getToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  };

  const getUserIdFromToken = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.user_id;
    } catch {
      return null;
    }
  };

  const fetchUserProfile = async () => {
    const token = getToken();
    if (!token) {
      alert("Please login first!");
      router.push("/login");
      return;
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      alert("Invalid token!");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:4000/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const userData = response.data.user;
      setUser(userData);
      setForm({
        user_name: userData.user_name || "",
        email: userData.email || "",
        full_name: userData.full_name || "",
        phone: userData.phone || "",
        profile_photo: userData.profile_photo || "",
        city: userData.city || "",
        country: userData.country || "",
        date_of_birth: userData.date_of_birth ? userData.date_of_birth.split("T")[0] : "",
        gender: userData.gender || "",
      });
      setLoading(false);
    } catch (error: any) {
      alert(error.response?.data?.message || "Error fetching profile");
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const token = getToken();
    if (!token || !user) return;

    try {
      await axios.put(
        `http://localhost:4000/users/update/${user.user_id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("Profile updated successfully!");
      setEditing(false);
      fetchUserProfile();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error updating profile");
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordForm.password !== passwordForm.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const token = getToken();
    if (!token) return;

    try {
      await axios.post(
        "http://localhost:4000/users/update-password",
        {
          oldPassword: passwordForm.oldPassword,
          password: passwordForm.password,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("Password updated successfully!");
      setPasswordForm({ oldPassword: "", password: "", confirmPassword: "" });
    } catch (error: any) {
      alert(error.response?.data?.message || "Error updating password");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const initials = user.full_name
    ? user.full_name.split(" ").map(n => n[0]).join("").toUpperCase()
    : user.user_name.substring(0, 2).toUpperCase();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={form.profile_photo} />
                  <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {editing && (
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              <h2 className="mt-4 text-xl font-semibold text-gray-800">
                {user.full_name || user.user_name}
              </h2>
              <p className="text-sm text-gray-500">@{user.user_name}</p>

              <div className="mt-6 w-full space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {(user.city || user.country) && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{[user.city, user.country].filter(Boolean).join(", ")}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Personal Information</CardTitle>
                    {!editing ? (
                      <Button onClick={() => setEditing(true)} size="sm">
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={handleUpdate} size="sm" className="flex items-center gap-1">
                          <Save className="w-4 h-4" /> Save
                        </Button>
                        <Button onClick={() => setEditing(false)} variant="outline" size="sm">
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Username</Label>
                      <Input
                        name="user_name"
                        value={form.user_name}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        disabled={!editing}
                        type="email"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Full Name</Label>
                    <Input
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Phone</Label>
                      <Input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        disabled={!editing}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
                      >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>City</Label>
                      <Input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                    <div>
                      <Label>Country</Label>
                      <Input
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      name="date_of_birth"
                      type="date"
                      value={form.date_of_birth}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>

                  {editing && (
                    <div>
                      <Label>Profile Photo URL</Label>
                      <Input
                        name="profile_photo"
                        value={form.profile_photo}
                        onChange={handleChange}
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Current Password</Label>
                    <Input
                      name="oldPassword"
                      type="password"
                      value={passwordForm.oldPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div>
                    <Label>New Password</Label>
                    <Input
                      name="password"
                      type="password"
                      value={passwordForm.password}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div>
                    <Label>Confirm New Password</Label>
                    <Input
                      name="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <Button onClick={handlePasswordUpdate} className="w-full">
                    Update Password
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
