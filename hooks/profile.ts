"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import type { User, ProfileForm, PasswordForm, Skill } from "@/types/type";
import { API_URL } from '@/lib/constants';

export const useProfile = () => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(false);

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
    fetchAllSkills();
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

      await fetchUserSkills(userId);
    } catch (error: any) {
      alert(error.response?.data?.message || "Error fetching profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSkills = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await axios.get(`${API_URL}/skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const skillNames = response.data.skills.map((s: any) => s.skill_name);
      setAllSkills(skillNames);
    } catch (error) {
      console.error("Error fetching all skills:", error);
    }
  };

  const fetchUserSkills = async (userId: number) => {
    const token = getToken();
    if (!token) return;

    setLoadingSkills(true);
    try {
      const response = await axios.get(
        `${API_URL}/skills/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSkills(response.data.skills || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoadingSkills(false);
    }
  };

  const addSkill = async (skillName: string, yearsOfExp: number, category: string) => {
    const token = getToken();
    if (!token || !user) return;

    try {
      await axios.post(
        `${API_URL}/skills`,
        {
          skill_name: skillName,
          number_of_year: yearsOfExp,
          category,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Skill added successfully!");
      await fetchUserSkills(user.user_id);
    } catch (error: any) {
      alert(error.response?.data?.message || "Error adding skill");
    }
  };

  const updateSkill = async (
    userSkillId: number,
    yearsOfExp: number,
    category: string
  ) => {
    const token = getToken();
    if (!token) return;

    try {
      await axios.put(
        `${API_URL}/skills/${userSkillId}`,
        {
          number_of_year: yearsOfExp,
          category,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Skill updated successfully!");
      if (user) await fetchUserSkills(user.user_id);
    } catch (error: any) {
      alert(error.response?.data?.message || "Error updating skill");
    }
  };

  const deleteSkill = async (userSkillId: number) => {
    const token = getToken();
    if (!token) return;

    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      await axios.delete(`${API_URL}/skills/${userSkillId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Skill deleted successfully!");
      if (user) await fetchUserSkills(user.user_id);
    } catch (error: any) {
      alert(error.response?.data?.message || "Error deleting skill");
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

  const handleDeleteAccount = async () => {
    const token = getToken();
    if (!token || !user) return;

    const finalConfirm = window.confirm(
      "Are you absolutely sure? This action cannot be undone and all your data will be permanently deleted from the database."
    );

    if (!finalConfirm) return;

    try {
      await axios.delete(
        `${API_URL}/users/delete/${user.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      alert("Account deleted successfully!");
      router.push("/login");
    } catch (error: any) {
      alert(error.response?.data?.message || "Error deleting account");
    }
  };

  return {
    user,
    loading,
    editing,
    setEditing,
    form,
    passwordForm,
    skills,
    allSkills,
    loadingSkills,
    handleChange,
    handlePasswordChange,
    handleUpdate,
    handlePasswordUpdate,
    handleDeleteAccount,
    addSkill,
    updateSkill,
    deleteSkill,
  };
};
