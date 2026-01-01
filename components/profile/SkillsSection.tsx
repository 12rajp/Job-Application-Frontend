"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import type { Skill } from "@/types/type";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { API_URL } from "@/lib/constants";

interface SkillsSectionProps {
  skills: Skill[];
  allSkills: string[];
  loadingSkills: boolean;
  onAdd: (skillName: string, years: number, category: string) => void;
  onUpdate: (id: number, years: number, category: string) => void;
  onDelete: (id: number) => void;
}

export default function SkillsSection({
  skills,
  allSkills,
  loadingSkills,
  onAdd,
  onUpdate,
  onDelete,
}: SkillsSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);

  const [newSkill, setNewSkill] = useState({
    skill_name: "",
    number_of_year: 0,
    category: "",
  });

  const [editForm, setEditForm] = useState({
    number_of_year: 0,
    category: "",
  });

  const getToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  };

  useEffect(() => {
    setSearchResults(allSkills);
  }, [allSkills]);

  const handleSearchSkills = async (searchTerm: string) => {
    setNewSkill({ ...newSkill, skill_name: searchTerm });

    if (!searchTerm.trim()) {
      setSearchResults(allSkills);
      return;
    }

    setSearching(true);
    const token = getToken();

    try {
      const response = await axios.get(
        `${API_URL}/skills?page=1&limit=10&search=${encodeURIComponent(
          searchTerm
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Search response:", response.data);

      const skillsData = response.data.data || response.data.skills || [];
      console.log("Skills data:", skillsData);

      const skillNames = skillsData.map((s: any) => s.skill_name);
      console.log("Skill names:", skillNames);

      if (skillNames.length > 0) {
        setSearchResults(skillNames);
      } else {
        const filtered = allSkills.filter((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filtered);
      }
    } catch (error) {
      console.error("Error searching skills:", error);
      const filtered = allSkills.filter((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    } finally {
      setSearching(false);
    }
  };

  const handleAdd = () => {
    if (!newSkill.skill_name || newSkill.number_of_year <= 0) {
      alert("Please fill all fields");
      return;
    }

    onAdd(newSkill.skill_name, newSkill.number_of_year, newSkill.category);
    setNewSkill({ skill_name: "", number_of_year: 0, category: "" });
    setShowAddForm(false);
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setEditForm({
      number_of_year: skill.number_of_year,
      category: skill.category,
    });
  };

  const handleUpdate = () => {
    if (editingId) {
      onUpdate(editingId, editForm.number_of_year, editForm.category);
      setEditingId(null);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Skills</CardTitle>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Skill
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {showAddForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-4">
            <div>
              <Label>Skill Name</Label>
              <Command className="rounded-lg border mt-1">
                <CommandInput
                  placeholder="Type or select skill..."
                  value={newSkill.skill_name}
                  onValueChange={handleSearchSkills}
                />
                <CommandList>
                  <CommandEmpty>
                    {searching
                      ? "Searching..."
                      : "No skills found. You can type and add a new skill!"}
                  </CommandEmpty>
                  <CommandGroup>
                    {searchResults.map((skill, idx) => (
                      <CommandItem
                        key={`${skill}-${idx}`}
                        value={skill}
                        onSelect={(value) => {
                          setNewSkill({ ...newSkill, skill_name: value });
                        }}
                      >
                        {skill}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Years of Experience</Label>
                <Input
                  type="number"
                  min="0"
                  value={newSkill.number_of_year}
                  onChange={(e) =>
                    setNewSkill({
                      ...newSkill,
                      number_of_year: Number(e.target.value),
                    })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Category</Label>
                <Input
                  value={newSkill.category}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, category: e.target.value })
                  }
                  placeholder="e.g. Frontend, Backend"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAdd} size="sm">
                Add
              </Button>
              <Button
                onClick={() => setShowAddForm(false)}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        {loadingSkills ? (
          <p className="text-gray-500">Loading skills...</p>
        ) : skills.length === 0 ? (
          <p className="text-gray-500">No skills added yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                {editingId === skill.id ? (
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={editForm.number_of_year}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          number_of_year: Number(e.target.value),
                        })
                      }
                    />
                    <Input
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm({ ...editForm, category: e.target.value })
                      }
                    />
                    <div className="flex gap-2 mt-2 col-span-2">
                      <Button size="sm" onClick={handleUpdate}>
                        Update
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <p className="font-semibold">{skill.skill.skill_name}</p>
                    <p className="text-sm text-gray-500">
                      {skill.number_of_year} years • {skill.category || "Null"}
                    </p>
                  </div>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded hover:bg-gray-80">
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem
                      onClick={() => handleEdit(skill)}
                      className="flex gap-2 cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => onDelete(skill.id)}
                      className="flex gap-2 text-red-600 cursor-pointer focus:text-red-600"
                    >
                      <Trash className="w-4 h-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
