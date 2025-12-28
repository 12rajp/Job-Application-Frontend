"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import type { User, ProfileForm, PasswordForm } from "@/types/type";
import { API_URL } from '@/lib/constants';

export const useProfile = () => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState<ProfileForm>({
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

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

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

  useEffect(() => {
    fetchUserProfile();
  }, []);

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
      const response = await axios.get(
        `${API_URL}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
        date_of_birth: userData.date_of_birth
          ? userData.date_of_birth.split("T")[0]
          : "",
        gender: userData.gender || "",
      });
    } catch (error: any) {
      alert(error.response?.data?.message || "Error fetching profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    const token = getToken();
    if (!token || !user) return;

    try {
      await axios.put(
        `${API_URL}/users/update/${user.user_id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
        `${API_URL}/users/update-password`,
        {
          oldPassword: passwordForm.oldPassword,
          password: passwordForm.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Password updated successfully!");
      setPasswordForm({
        oldPassword: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      alert(error.response?.data?.message || "Error updating password");
    }
  };

  return {
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
  };
};
