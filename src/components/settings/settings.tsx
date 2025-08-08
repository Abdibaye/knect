"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function UserSettings() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifyFollows, setNotifyFollows] = useState(false);
  const [privacyPublicProfile, setPrivacyPublicProfile] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("system");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    // Replace with API call
    setTimeout(() => {
      alert("Settings saved!");
      setSaving(false);
      setCurrentPassword("");
      setNewPassword("");
    }, 1000);
  };

  return (
    <div className="w-full lg:mr-90 mt-2 mx-auto p-6 bg-card text-card-foreground rounded-lg shadow-md space-y-8 relative">
      <h1 className="text-3xl font-bold text-foreground">User Settings</h1>

      {/* Personal Info */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Personal Information
        </h2>

        <div className="mb-4">
          <Label htmlFor="name" className="mb-1 block text-muted-foreground">
            Full Name
          </Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="email" className="mb-1 block text-muted-foreground">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
          />
        </div>
      </section>

      {/* Password Change */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Change Password
        </h2>

        <div className="mb-4">
          <Label
            htmlFor="currentPassword"
            className="mb-1 block text-muted-foreground"
          >
            Current Password
          </Label>
          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="newPassword" className="mb-1 block text-muted-foreground">
            New Password
          </Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>
      </section>

      {/* Privacy Settings */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Privacy</h2>
        <div className="flex items-center space-x-3 mb-3">
          <input
            id="privacyPublicProfile"
            type="checkbox"
            checked={privacyPublicProfile}
            onChange={() => setPrivacyPublicProfile(!privacyPublicProfile)}
            className="w-5 h-5 rounded border-border bg-background focus:ring-2 focus:ring-ring"
          />
          <Label htmlFor="privacyPublicProfile" className="text-muted-foreground cursor-pointer">
            Public Profile (anyone can see your profile)
          </Label>
        </div>
      </section>

      {/* Two-Factor Authentication */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Security</h2>
        <div className="flex items-center space-x-3 mb-3">
          <input
            id="twoFactorAuth"
            type="checkbox"
            checked={twoFactorAuth}
            onChange={() => setTwoFactorAuth(!twoFactorAuth)}
            className="w-5 h-5 rounded border-border bg-background focus:ring-2 focus:ring-ring"
          />
          <Label htmlFor="twoFactorAuth" className="text-muted-foreground cursor-pointer">
            Enable Two-Factor Authentication (2FA)
          </Label>
        </div>
      </section>

      {/* Notifications */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Notifications</h2>
        <div className="flex items-center space-x-3 mb-3">
          <input
            id="notificationsGeneral"
            type="checkbox"
            checked={notificationsEnabled}
            onChange={() => setNotificationsEnabled(!notificationsEnabled)}
            className="w-5 h-5 rounded border-border bg-background focus:ring-2 focus:ring-ring"
          />
          <Label htmlFor="notificationsGeneral" className="text-muted-foreground cursor-pointer">
            Enable all email notifications
          </Label>
        </div>
        <div className="flex items-center space-x-3 mb-3 ml-6">
          <input
            id="notifyMessages"
            type="checkbox"
            checked={notifyMessages}
            onChange={() => setNotifyMessages(!notifyMessages)}
            disabled={!notificationsEnabled}
            className="w-4 h-4 rounded border-border bg-background focus:ring-2 focus:ring-ring"
          />
          <Label htmlFor="notifyMessages" className="text-muted-foreground cursor-pointer">
            Messages
          </Label>
        </div>
        <div className="flex items-center space-x-3 mb-3 ml-6">
          <input
            id="notifyFollows"
            type="checkbox"
            checked={notifyFollows}
            onChange={() => setNotifyFollows(!notifyFollows)}
            disabled={!notificationsEnabled}
            className="w-4 h-4 rounded border-border bg-background focus:ring-2 focus:ring-ring"
          />
          <Label htmlFor="notifyFollows" className="text-muted-foreground cursor-pointer">
            New Followers
          </Label>
        </div>
      </section>

      {/* Language and Theme */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Preferences</h2>

        <div className="mb-4">
          <Label htmlFor="language" className="mb-1 block text-muted-foreground">
            Language
          </Label>
          <select
            id="language"
            className="w-full p-2 rounded border border-border bg-background text-foreground"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="am">Amharic</option>
            <option value="es">Oromic</option>

            {/* Add more languages as needed */}
          </select>
        </div>

        <div className="mb-4">
          <Label htmlFor="theme" className="mb-1 block text-muted-foreground">
            Theme
          </Label>
          <select
            id="theme"
            className="w-full p-2 rounded border border-border bg-background text-foreground"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </section>

      {/* Account Deactivation */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Account</h2>
        <p className="mb-4 text-muted-foreground">
          If you want to deactivate your account, you can do so here. This
          action is irreversible.
        </p>
        <Button
          variant="destructive"
          onClick={() => alert("Account deactivated (placeholder action)")}
        >
          Deactivate Account
        </Button>
      </section>

      {/* Save Button */}
      <div className="pt-6 border-t border-border">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
