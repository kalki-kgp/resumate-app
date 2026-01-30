'use client';

import { useState } from 'react';
import {
  X,
  Bell,
  Shield,
  Palette,
  Download,
  Trash2,
  ChevronRight,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
}

const ToggleSwitch = ({ enabled, onToggle }: ToggleSwitchProps) => (
  <button
    onClick={onToggle}
    className={`relative w-11 h-6 rounded-full transition-colors ${
      enabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
    }`}
  >
    <div
      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
        enabled ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<
    'notifications' | 'privacy' | 'preferences' | 'danger'
  >('notifications');

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    jobAlerts: true,
    profileVisible: true,
    showEmail: false,
    autoSave: true,
    language: 'English',
  });

  if (!isOpen) return null;

  const tabs = [
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'privacy' as const, label: 'Privacy', icon: Shield },
    { id: 'preferences' as const, label: 'Preferences', icon: Palette },
    { id: 'danger' as const, label: 'Danger Zone', icon: Trash2 },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-lg"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-white/60 dark:border-slate-700/60 shadow-2xl backdrop-blur-xl animate-fade-in-up">
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Account Settings
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-48 border-r border-slate-200/60 dark:border-slate-700/60 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    } ${tab.id === 'danger' ? 'text-red-600 dark:text-red-400' : ''}`}
                  >
                    <Icon
                      size={18}
                      className={
                        tab.id === 'danger' && !isActive
                          ? 'text-red-500'
                          : undefined
                      }
                    />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 max-h-[60vh] overflow-y-auto">
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                    Email Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Email notifications
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Receive emails about your account activity
                        </p>
                      </div>
                      <ToggleSwitch
                        enabled={settings.emailNotifications}
                        onToggle={() =>
                          setSettings({
                            ...settings,
                            emailNotifications: !settings.emailNotifications,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Weekly digest
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Get a weekly summary of your activity
                        </p>
                      </div>
                      <ToggleSwitch
                        enabled={settings.weeklyDigest}
                        onToggle={() =>
                          setSettings({
                            ...settings,
                            weeklyDigest: !settings.weeklyDigest,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Job alerts
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Receive alerts for matching job opportunities
                        </p>
                      </div>
                      <ToggleSwitch
                        enabled={settings.jobAlerts}
                        onToggle={() =>
                          setSettings({
                            ...settings,
                            jobAlerts: !settings.jobAlerts,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                    Push Notifications
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Browser notifications
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Get instant updates in your browser
                      </p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.pushNotifications}
                      onToggle={() =>
                        setSettings({
                          ...settings,
                          pushNotifications: !settings.pushNotifications,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                    Profile Visibility
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Public profile
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Allow recruiters to find your profile
                        </p>
                      </div>
                      <ToggleSwitch
                        enabled={settings.profileVisible}
                        onToggle={() =>
                          setSettings({
                            ...settings,
                            profileVisible: !settings.profileVisible,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Show email address
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Display your email on your public profile
                        </p>
                      </div>
                      <ToggleSwitch
                        enabled={settings.showEmail}
                        onToggle={() =>
                          setSettings({
                            ...settings,
                            showEmail: !settings.showEmail,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                    Data & Security
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                      <div className="flex items-center gap-3">
                        <Download
                          size={18}
                          className="text-slate-400 group-hover:text-blue-600"
                        />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Download your data
                        </span>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-slate-400"
                      />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                      <div className="flex items-center gap-3">
                        <Shield
                          size={18}
                          className="text-slate-400 group-hover:text-blue-600"
                        />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Change password
                        </span>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-slate-400"
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                    Editor Settings
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Auto-save
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Automatically save changes while editing
                      </p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.autoSave}
                      onToggle={() =>
                        setSettings({
                          ...settings,
                          autoSave: !settings.autoSave,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                    Language
                  </h3>
                  <select
                    value={settings.language}
                    onChange={(e) =>
                      setSettings({ ...settings, language: e.target.value })
                    }
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'danger' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <h3 className="text-sm font-bold text-red-700 dark:text-red-400 mb-2">
                    Delete Account
                  </h3>
                  <p className="text-xs text-red-600 dark:text-red-400 mb-4">
                    Once you delete your account, there is no going back. All
                    your data, resumes, and settings will be permanently
                    deleted.
                  </p>
                  <button className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">
                    Delete my account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
