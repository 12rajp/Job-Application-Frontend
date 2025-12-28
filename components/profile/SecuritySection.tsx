"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { SecurityTabProps } from "@/types/type";

export default function SecurityTab({
  passwordForm,
  handlePasswordChange,
  handlePasswordUpdate,
}: SecurityTabProps) {
  return (
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
  );
}
