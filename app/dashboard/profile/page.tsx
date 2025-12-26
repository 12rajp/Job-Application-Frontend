"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Mail, Phone, MapPin, Calendar, Lock, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/profile";

export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    loading,
    editing,
    setEditing,
    form,
    passwordForm,
    handleChange,
    handlePasswordChange,
    handleUpdate,
    handlePasswordUpdate,
  } = useProfile();

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={form.profile_photo} />
                  <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">{initials}</AvatarFallback>
                </Avatar>
                {editing && (
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-800">{user.full_name || user.user_name}</h2>
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
