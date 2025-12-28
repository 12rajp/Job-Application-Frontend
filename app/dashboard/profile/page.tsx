"use client";

import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Mail, Phone, MapPin, Calendar, Save } from "lucide-react";
import { useProfile } from "@/hooks/profile";
import SecurityTab from "@/components/profile/SecuritySection";

function ProfilePage() {
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
    handleDeleteAccount,
  } = useProfile();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const initials = user.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
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
                  <AvatarImage src={form.profile_photo || undefined} />
                  <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                {editing && (
                  <>
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () =>
                          handleChange({
                            target: {
                              name: "profile_photo",
                              value: reader.result,
                            },
                          } as any);
                        reader.readAsDataURL(file);
                      }}
                    />
                  </>
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
                    <span>
                      {[user.city, user.country].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
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
                      <Button
                        onClick={() => setEditing(true)}
                        size="sm"
                        className="cursor-pointer"
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleUpdate}
                          size="sm"
                          className="flex items-center gap-1 cursor-pointer"
                        >
                          <Save className="w-4 h-4" /> Save
                        </Button>
                        <Button
                          onClick={() => setEditing(false)}
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                        >
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
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        disabled={!editing}
                        className="mt-1"
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
                      className="mt-1"
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
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        disabled={!editing}
                        className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
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
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Country</Label>
                      <Input
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        disabled={!editing}
                        className="mt-1"
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
                      className="mt-1"
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
                        className="mt-1"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <SecurityTab
                passwordForm={passwordForm}
                handlePasswordChange={handlePasswordChange}
                handlePasswordUpdate={handlePasswordUpdate}
                handleDeleteAccount={handleDeleteAccount}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
