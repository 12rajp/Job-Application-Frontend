"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Trash2, AlertTriangle } from "lucide-react";
import { SecurityTabProps } from "@/types/type";

export default function SecurityTab({
  passwordForm,
  handlePasswordChange,
  handlePasswordUpdate,
  handleDeleteAccount,
}: SecurityTabProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleDeleteClick = () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    if (deleteConfirmText.toLowerCase() === "delete my account") {
      handleDeleteAccount();
    } else {
      alert("Please type 'DELETE MY ACCOUNT' to confirm");
    }
  };

  return (
    <div className="space-y-6">
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
              className="mt-1"
            />
          </div>

          <div>
            <Label>New Password</Label>
            <Input
              name="password"
              type="password"
              value={passwordForm.password}
              onChange={handlePasswordChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Confirm New Password</Label>
            <Input
              name="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="mt-1"
            />
          </div>

          <Button onClick={handlePasswordUpdate} className="w-full cursor-pointer">
            Update Password
          </Button>
        </CardContent>
      </Card>
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-red-200">
            <p className="text-sm text-gray-700 mb-2">
              Once you delete your account, there is no going back. All your data will be permanently lost.
            </p>
            
            {!showDeleteConfirm ? (
              <Button
                onClick={handleDeleteClick}
                variant="destructive"
                className="w-full sm:w-auto cursor-pointer flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete My Account
              </Button>
            ) : (
              <div className="space-y-3">
                <div>
                  <Label className="text-red-600">
                    Type "DELETE MY ACCOUNT" to confirm
                  </Label>
                  <Input
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="DELETE MY ACCOUNT"
                    className="mt-1 border-red-300 focus:ring-red-500"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={handleDeleteClick}
                    variant="destructive"
                    className="flex-1 cursor-pointer"
                    disabled={deleteConfirmText.toLowerCase() !== "delete my account"}
                  >
                    Confirm Delete
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText("");
                    }}
                    variant="outline"
                    className="flex-1 cursor-pointer"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
