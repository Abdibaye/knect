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
    <div className="w-full lg:mr-90 mt-2 mx-auto p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        User Settings
      </h1>

      {/* Personal Info */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Personal Information
        </h2>

        <div className="mb-4">
          <Label
            htmlFor="name"
            className="mb-1 block text-gray-700 dark:text-gray-300"
          >
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
          <Label
            htmlFor="email"
            className="mb-1 block text-gray-700 dark:text-gray-300"
          >
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
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Change Password
        </h2>

        <div className="mb-4">
          <Label
            htmlFor="currentPassword"
            className="mb-1 block text-gray-700 dark:text-gray-300"
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
          <Label
            htmlFor="newPassword"
            className="mb-1 block text-gray-700 dark:text-gray-300"
          >
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
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Privacy
        </h2>
        <div className="flex items-center space-x-3 mb-3">
          <input
            id="privacyPublicProfile"
            type="checkbox"
            checked={privacyPublicProfile}
            onChange={() => setPrivacyPublicProfile(!privacyPublicProfile)}
            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
          />
          <Label
            htmlFor="privacyPublicProfile"
            className="text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            Public Profile (anyone can see your profile)
          </Label>
        </div>
      </section>

      {/* Two-Factor Authentication */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Security
        </h2>
        <div className="flex items-center space-x-3 mb-3">
          <input
            id="twoFactorAuth"
            type="checkbox"
            checked={twoFactorAuth}
            onChange={() => setTwoFactorAuth(!twoFactorAuth)}
            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
          />
          <Label
            htmlFor="twoFactorAuth"
            className="text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            Enable Two-Factor Authentication (2FA)
          </Label>
        </div>
      </section>

      {/* Notifications */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Notifications
        </h2>
        <div className="flex items-center space-x-3 mb-3">
          <input
            id="notificationsGeneral"
            type="checkbox"
            checked={notificationsEnabled}
            onChange={() => setNotificationsEnabled(!notificationsEnabled)}
            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
          />
          <Label
            htmlFor="notificationsGeneral"
            className="text-gray-700 dark:text-gray-300 cursor-pointer"
          >
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
            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
          />
          <Label
            htmlFor="notifyMessages"
            className="text-gray-600 dark:text-gray-400 cursor-pointer"
          >
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
            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
          />
          <Label
            htmlFor="notifyFollows"
            className="text-gray-600 dark:text-gray-400 cursor-pointer"
          >
            New Followers
          </Label>
        </div>
      </section>

      {/* Language and Theme */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Preferences
        </h2>

        <div className="mb-4">
          <Label
            htmlFor="language"
            className="mb-1 block text-gray-700 dark:text-gray-300"
          >
            Language
          </Label>
          <select
            id="language"
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
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
          <Label
            htmlFor="theme"
            className="mb-1 block text-gray-700 dark:text-gray-300"
          >
            Theme
          </Label>
          <select
            id="theme"
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
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
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Account
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
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
      <div className="pt-6 border-t border-gray-300 dark:border-gray-700">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
