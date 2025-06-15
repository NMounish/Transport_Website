import React, { useState, useEffect } from "react";
import { 
  Lock, 
  Settings as Gear, 
  HelpCircle, 
  ChevronDown, 
  ChevronRight, 
  Save, 
  X, 
  Eye, 
  EyeOff, 
  Menu,
  Sun,
  Moon,
  Monitor
} from "lucide-react";

const Tree = ({ children }) => <div className="space-y-1">{children}</div>;

const Folder = ({ children, element, isOpen, onClick }) => (
  <div className="rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
    <div 
      className="flex items-center justify-between p-3 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {element.icon}
        <span className="font-medium text-gray-800 dark:text-gray-200">{element.name}</span>
      </div>
      {isOpen ? (
        <ChevronDown size={18} className="text-gray-500 dark:text-gray-400" />
      ) : (
        <ChevronRight size={18} className="text-gray-500 dark:text-gray-400" />
      )}
    </div>
    {isOpen && <div className="pl-8 space-y-1">{children}</div>}
  </div>
);

const File = ({ element, isActive, onClick }) => (
  <div
    className={`p-3 rounded-lg cursor-pointer transition-colors ${
      isActive 
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
    }`}
    onClick={onClick}
  >
    {element.name}
  </div>
);

const ELEMENTS = [
  {
    id: "5",
    name: "Security",
    icon: <Lock size={18} className="text-gray-600 dark:text-gray-400" />,
    children: [
      { id: "6", name: "Change Password", details: "Update your password regularly to keep your account secure." },
      { id: "7", name: "Two-Factor Auth", details: "Add an extra layer of security to your account with two-factor authentication." },
    ],
  },
  {
    id: "8",
    name: "Preferences",
    icon: <Gear size={18} className="text-gray-600 dark:text-gray-400" />,
    children: [
      { id: "9", name: "Theme", details: "Choose between light, dark, or system preference for your interface." },
      { id: "10", name: "Language", details: "Select your preferred language for the application interface." },
    ],
  },
  {
    id: "11",
    name: "Support",
    icon: <HelpCircle size={18} className="text-gray-600 dark:text-gray-400" />,
    children: [
      { id: "12", name: "FAQs"},
      { id: "13", name: "Contact Us" },
    ],
  },
];

const Settings = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(ELEMENTS[0].children[0]);
  const [openFolders, setOpenFolders] = useState({
    "5": true,
    "8": false,
    "11": false
  });
  const [formData, setFormData] = useState({
    currentPassword: "••••••••",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editingCurrentPassword, setEditingCurrentPassword] = useState(false);
  
  // Theme state
  const [theme, setTheme] = useState(() => {
    // Initialize theme from localStorage or system preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return systemPrefersDark ? 'dark' : 'light';
    }
    return 'light';
  });

  // Apply theme on initial render and when theme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileSidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.sidebar-toggle')) {
        setMobileSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileSidebarOpen]);

  const toggleFolder = (folderId) => {
    setOpenFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setMobileSidebarOpen(false);
    setMessage({ text: "", type: "" });
    setFormData({
      currentPassword: "••••••••",
      newPassword: "",
      confirmPassword: ""
    });
    setEditingCurrentPassword(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCurrentPasswordFocus = () => {
    setEditingCurrentPassword(true);
    setFormData(prev => ({
      ...prev,
      currentPassword: ""
    }));
  };

  const handleCurrentPasswordBlur = () => {
    if (!formData.currentPassword) {
      setEditingCurrentPassword(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: "••••••••"
      }));
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
  
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?.id;
      
      if (!userId) throw new Error("Please log in to change your password");
      if (formData.newPassword !== formData.confirmPassword) throw new Error("New passwords don't match");
  
      const response = await fetch(`http://localhost:8081/change-password/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: editingCurrentPassword ? formData.currentPassword : "",
          newPassword: formData.newPassword
        }),
        credentials: "include"
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to change password");
  
      setMessage({ text: "Password changed successfully", type: "success" });
      setFormData({ currentPassword: "••••••••", newPassword: "", confirmPassword: "" });
      setEditingCurrentPassword(false);
    } catch (error) {
      console.error("Password change error:", error);
      setMessage({ text: error.message || "An error occurred while changing password", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white sm:hidden sidebar-toggle dark:bg-gray-700"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed sm:relative z-40 w-64 h-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out sidebar ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold px-2 text-gray-800 dark:text-gray-200">Settings</h2>
            <button 
              onClick={() => setMobileSidebarOpen(false)}
              className="sm:hidden p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <Tree>
              {ELEMENTS.map((folder) => (
                <Folder
                  key={folder.id}
                  element={folder}
                  isOpen={openFolders[folder.id]}
                  onClick={() => toggleFolder(folder.id)}
                >
                  {folder.children.map((file) => (
                    <File
                      key={file.id}
                      element={file}
                      isActive={selectedFile?.id === file.id}
                      onClick={() => handleFileClick(file)}
                    />
                  ))}
                </Folder>
              ))}
            </Tree>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        {selectedFile ? (
          <div className="max-w-3xl mx-auto">
            <div>  
              {message.text && (
                <div className={`mt-4 p-3 rounded-lg ${
                  message.type === "success" 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" 
                    : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                }`}>
                  {message.text}
                </div>
              )}

              {selectedFile.id === "6" && (
                <form onSubmit={handlePasswordChange} className="mt-8 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Current Password
                      </label>
                      <div className="relative">
                        <input 
                          type={editingCurrentPassword ? (showNewPassword ? "text" : "password") : "password"}
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          onFocus={handleCurrentPasswordFocus}
                          onBlur={handleCurrentPasswordBlur}
                          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                          placeholder="Enter current password"
                          required
                          readOnly={!editingCurrentPassword}
                        />
                        {editingCurrentPassword && (
                          <button 
                            type="button" 
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 focus:outline-none"
                          >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        New Password
                      </label>
                      <div className="relative">
                        <input 
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                          placeholder="Enter new password"
                          required
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 focus:outline-none"
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input 
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                          placeholder="Confirm new password"
                          required
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 focus:outline-none"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button 
                      type="submit"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800"
                      disabled={loading}
                    >
                      <Save size={16} />
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          currentPassword: "••••••••",
                          newPassword: "",
                          confirmPassword: ""
                        });
                        setEditingCurrentPassword(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {selectedFile.id === "9" && (
                <div className="mt-8 space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`p-4 rounded-lg border transition-colors ${
                        theme === 'light'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Sun size={24} className="text-yellow-500" />
                        <span className="font-medium text-gray-800 dark:text-gray-200">Light</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`p-4 rounded-lg border transition-colors ${
                        theme === 'dark'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Moon size={24} className="text-indigo-400" />
                        <span className="font-medium text-gray-800 dark:text-gray-200">Dark</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleThemeChange('system')}
                      className={`p-4 rounded-lg border transition-colors ${
                        theme === 'system'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Monitor size={24} className="text-gray-600 dark:text-gray-300" />
                        <span className="font-medium text-gray-800 dark:text-gray-200">System</span>
                      </div>
                    </button>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {theme === 'system' 
                        ? 'Using your system preference: ' + 
                          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light')
                        : `Currently using ${theme} theme`}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">Select a setting to view details</p>
          </div>
        )}

{selectedFile.id === "12" && ( // FAQs Section
  <div className="mt-8 space-y-6">
    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h3>
    
    <div className="space-y-4">
      {/* FAQ Item 1 */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <span className="font-medium text-gray-800 dark:text-gray-200">How do I reset my password?</span>
          <ChevronDown size={18} className="text-gray-500 dark:text-gray-400 transform transition-transform" />
        </button>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <p className="text-gray-600 dark:text-gray-300">
            You can reset your password by going to the Security section and selecting "Change Password". 
            You'll need to enter your current password and then your new password twice to confirm.
          </p>
        </div>
      </div>

      {/* FAQ Item 2 */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <span className="font-medium text-gray-800 dark:text-gray-200">Is two-factor authentication mandatory?</span>
          <ChevronDown size={18} className="text-gray-500 dark:text-gray-400 transform transition-transform" />
        </button>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <p className="text-gray-600 dark:text-gray-300">
            While not mandatory, we strongly recommend enabling two-factor authentication for enhanced security. 
            It adds an extra layer of protection to your account by requiring a second verification step during login.
          </p>
        </div>
      </div>

      {/* FAQ Item 3 */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <span className="font-medium text-gray-800 dark:text-gray-200">How can I change my account email?</span>
          <ChevronDown size={18} className="text-gray-500 dark:text-gray-400 transform transition-transform" />
        </button>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <p className="text-gray-600 dark:text-gray-300">
            Currently, email changes must be processed by our support team. Please contact us using the form below 
            and provide both your old and new email addresses for verification.
          </p>
        </div>
      </div>
    </div>

    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
      <div className="flex items-start gap-3">
        <HelpCircle size={20} className="text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-blue-800 dark:text-blue-200">Need more help?</h4>
          <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
            Browse our complete documentation or contact our support team for personalized assistance.
          </p>
        </div>
      </div>
    </div>
  </div>
)}

{selectedFile.id === "13" && ( // Contact Us Section
  <div>
    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Contact Our Support Team</h3>
    <p className="text-gray-600 dark:text-gray-300">
      Have questions or need assistance? Fill out the form below and our team will get back to you within 24 hours.
    </p>

    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your name"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Subject
        </label>
        <select
          id="subject"
          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a subject</option>
          <option value="account">Account Issues</option>
          <option value="billing">Billing Questions</option>
          <option value="technical">Technical Support</option>
          <option value="feedback">Feedback</option>
          <option value="transcation">Transcation Issues</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe your issue or question in detail"
        ></textarea>
      </div>

      <div className="flex items-center">
        <input
          id="urgent"
          type="checkbox"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
        />
        <label htmlFor="urgent" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          This is an urgent request
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors "
        >
          Send Message
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 "
        >
          Cancel
        </button>
      </div>
    </form>

    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Other Ways to Reach Us</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <svg className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300">Email Support</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">regalroamers@example.com</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <svg className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300">Phone Support</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">+1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      </main>
    </div>
  );
};

export default Settings;