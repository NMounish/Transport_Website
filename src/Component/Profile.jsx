import React, { useState, useEffect,useRef} from "react";
import axios from "axios";
import {
  FaBars,
  FaClipboardList,
  FaCog,
  FaChartBar,
  FaListAlt,
  FaUndoAlt,
  FaTimesCircle,
  FaUser,
  FaEdit,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaSignOutAlt,
  FaCreditCard,
  FaBell,
  FaMoon,
  FaTimes
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fname: "Guest",
    email: "guest@example.com",
    password: "password123",
    memberSince: "2023-01-15",
    loyaltyPoints: 0,
    id: 1,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    total: 0,
    byStatus: [],
    monthly: [],
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "visa", last4: "4242", expires: "05/2025" },
    { id: 2, type: "mastercard", last4: "5555", expires: "11/2024" },
  ]);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        // Check if the click is not on the hamburger button
        if (!event.target.closest('.sidebar-toggle')) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        ...parsedUser,
        loyaltyPoints: parsedUser.loyaltyPoints || 0,
      });
      setEditedUser({
        ...parsedUser,
        loyaltyPoints: parsedUser.loyaltyPoints || 0,
      });
      if (parsedUser.id) {
        fetchBookings(parsedUser.id);
      }
    }
  }, []);

  const fetchBookings = (userId) => {
    setLoadingBookings(true);
    axios
      .get(`http://localhost:8081/user-bookings/${userId}`)
      .then((res) => {
        console.log("Bookings API response:", res.data);
        setBookings(res.data.bookings || []);
        setLoadingBookings(false);
      })
      .catch((err) => {
        console.error(
          "Error fetching bookings:",
          err.response?.data || err.message
        );
        setLoadingBookings(false);
      });
  };

  const fetchAnalytics = (userId) => {
    setLoadingAnalytics(true);
    axios
      .get(`http://localhost:8081/booking-analytics/${userId}`)
      .then((res) => {
        setAnalyticsData(res.data);
        setLoadingAnalytics(false);
      })
      .catch((err) => {
        console.error("Error fetching analytics:", err);
        setLoadingAnalytics(false);
      });
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const handleSaveChanges = () => {
    if (!editedUser.fname || !editedUser.email || !editedUser.password) {
      alert("Fields cannot be empty!");
      return;
    }
    localStorage.setItem("user", JSON.stringify(editedUser));
    setUser(editedUser);
    setIsEditing(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "bookings" && user.id) {
      fetchBookings(user.id);
    }
    if (tab === "analytics" && user.id) {
      fetchAnalytics(user.id);
    }
  };

  const handlePreferenceChange = (preference) => {
    setPreferences({
      ...preferences,
      [preference]: !preferences[preference],
    });
  };

  const removePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Hamburger Button for Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 text-2xl z-50 bg-white p-2 rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <aside
        className={`w-64 bg-gray-800 text-white transition-all duration-300 fixed md:relative h-full z-40 ${
          isOpen ? "left-0" : "-left-64"
        } md:left-0`}
      >
        <div className="md:hidden absolute top-2 right-2">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-300 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>
        <div className="flex items-center justify-center p-6">
          <h1 className="text-2xl font-bold">REGAL ROAMERS</h1>
        </div>
        <ul className="space-y-2 font-medium p-4">
          <li
            className={`p-4 hover:bg-blue-500 cursor-pointer flex items-center rounded-lg ${
              activeTab === "bookings" ? "bg-blue-600" : ""
            }`}
            onClick={() => {
              handleTabChange("bookings");
              setIsOpen(false);
            }}
          >
            <FaClipboardList className="w-6 h-6" />
            <span className="ml-3">Total Bookings</span>
          </li>
          <li
            className={`p-4 hover:bg-blue-500 cursor-pointer flex items-center rounded-lg ${
              activeTab === "analytics" ? "bg-blue-600" : ""
            }`}
            onClick={() => {
              handleTabChange("analytics");
              setIsOpen(false);
            }}
          >
            <FaChartBar className="w-6 h-6" />
            <span className="ml-3">Analytics</span>
          </li>
          <li
            className={`p-4 hover:bg-blue-500 cursor-pointer flex items-center rounded-lg ${
              activeTab === "details" ? "bg-blue-600" : ""
            }`}
            onClick={() => {
              handleTabChange("details");
              setIsOpen(false);
            }}
          >
            <FaListAlt className="w-6 h-6" />
            <span className="ml-3">Details</span>
          </li>
          <li
            className={`p-4 hover:bg-blue-500 cursor-pointer flex items-center rounded-lg ${
              activeTab === "refunds" ? "bg-blue-600" : ""
            }`}
            onClick={() => {
              handleTabChange("refunds");
              setIsOpen(false);
            }}
          >
            <FaUndoAlt className="w-6 h-6" />
            <span className="ml-3">Refunds</span>
          </li>
          <li
            className={`p-4 hover:bg-blue-500 cursor-pointer flex items-center rounded-lg ${
              activeTab === "profile" ? "bg-blue-600" : ""
            }`}
            onClick={() => {
              handleTabChange("profile");
              setIsOpen(false);
            }}
          >
            <FaCog className="w-6 h-6" />
            <span className="ml-3">Profile Settings</span>
          </li>
          {/* Logout Button */}
          <li
            className="p-4 hover:bg-red-500 cursor-pointer flex items-center rounded-lg"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="w-6 h-6" />
            <span className="ml-3">Logout</span>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {activeTab === "profile" && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center">
                <FaUser className="w-10 h-10 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold">{user.fname}</h2>
                <p className="text-gray-600">Travel Enthusiast</p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold flex justify-between items-center">
                Personal Information
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {isEditing ? (
                    <FaSave className="mr-1" />
                  ) : (
                    <FaEdit className="mr-1" />
                  )}
                </button>
              </h3>

              {/* Name */}
              <div className="mt-4">
                <label className="block text-gray-700 font-semibold">
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.fname}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, fname: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                    autoFocus
                  />
                ) : (
                  <p className="mt-1">{user.fname}</p>
                )}
              </div>

              {/* Email */}
              <div className="mt-4">
                <label className="block text-gray-700 font-semibold">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, email: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                  />
                ) : (
                  <p className="mt-1">{user.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="mt-4">
                <label className="block text-gray-700 font-semibold">
                  Password
                </label>
                {isEditing ? (
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={editedUser.password}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          password: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                ) : (
                  <p className="mt-1">********</p>
                )}
              </div>

              {isEditing && (
                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={handleSaveChanges}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedUser({ ...user });
                    }}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Your Bookings</h2>

            {loadingBookings ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div>
                {bookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b text-left">Booking ID</th>
                          <th className="py-2 px-4 border-b text-left">Date</th>
                          <th className="py-2 px-4 border-b text-left">Price</th>
                          <th className="py-2 px-4 border-b text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking.id}>
                            <td className="py-2 px-4 border-b">{booking.id}</td>
                            <td className="py-2 px-4 border-b">
                              {new Date(
                                booking.created_at
                              ).toLocaleDateString()}
                            </td>
                            <td className="py-2 px-4 border-b">
                              ${booking.price}
                            </td>
                            <td className="py-2 px-4 border-b">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  booking.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No bookings found.</p>
                )}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="font-semibold text-center sm:text-left">
                    Total Bookings: {bookings.length}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Booking Insights
              </h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg">
                  This Month
                </button>
                <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 rounded-lg">
                  Last Quarter
                </button>
                <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 rounded-lg">
                  Yearly
                </button>
              </div>
            </div>

            {loadingAnalytics ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Total Bookings */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-100">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">
                          Total Bookings
                        </p>
                        <p className="text-3xl font-bold mt-1 text-gray-800">
                          {analyticsData.total}
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-blue-200 flex items-center justify-center">
                        <FaClipboardList className="text-blue-600 text-xl" />
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-xs text-blue-600 flex items-center">
                        <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
                        {(
                          ((analyticsData.byStatus.find(
                            (s) => s.status === "completed"
                          )?.count || 0) /
                            analyticsData.total) *
                          100
                        ).toFixed(1)}
                        % completed
                      </p>
                    </div>
                  </div>

                  {/* Average Value */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-100">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">
                          Avg. Booking Value
                        </p>
                        <p className="text-3xl font-bold mt-1 text-gray-800">
                          $
                          {bookings.length > 0
                            ? (
                                bookings.reduce(
                                  (sum, b) => sum + (parseFloat(b.price) || 0),
                                  0
                                ) / bookings.length
                              ).toFixed(2)
                            : "0.00"}
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-purple-200 flex items-center justify-center">
                        <FaChartBar className="text-purple-600 text-xl" />
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-purple-200">
                      <p className="text-xs text-purple-600">Last 6 months</p>
                    </div>
                  </div>

                  {/* Status Overview */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-100">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">
                          Active Bookings
                        </p>
                        <p className="text-3xl font-bold mt-1 text-gray-800">
                          {analyticsData.byStatus.find(
                            (s) => s.status === "pending"
                          )?.count || 0}
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-green-200 flex items-center justify-center">
                        <FaListAlt className="text-green-600 text-xl" />
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <p className="text-xs text-green-600">
                        {(
                          ((analyticsData.byStatus.find(
                            (s) => s.status === "pending"
                          )?.count || 0) /
                            analyticsData.total) *
                          100
                        ).toFixed(1)}
                        % of total
                      </p>
                    </div>
                  </div>
                </div>

                {/* Main Chart Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Line Chart (Monthly Trends) */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 lg:col-span-2">
                    <h3 className="font-semibold text-gray-700 mb-4">
                      Monthly Booking Trends
                    </h3>
                    <div className="h-64">
                      {analyticsData.monthly.length > 0 ? (
                        <div className="relative h-full">
                          {/* Y-axis */}
                          <div className="absolute left-0 top-0 bottom-0 w-8 border-r border-gray-200">
                            {[0, 2, 4, 6, 8].map((num) => (
                              <div
                                key={num}
                                className="absolute right-1 text-xs text-gray-400"
                                style={{ bottom: `${(num / 8) * 100}%` }}
                              >
                                {num}
                              </div>
                            ))}
                          </div>

                          {/* Chart content */}
                          <div className="absolute left-8 right-0 top-0 bottom-0 pl-4">
                            <div className="relative h-full w-full">
                              {/* Grid lines */}
                              {[0, 2, 4, 6, 8].map((num) => (
                                <div
                                  key={num}
                                  className="absolute left-0 right-0 border-t border-gray-100"
                                  style={{ bottom: `${(num / 8) * 100}%` }}
                                ></div>
                              ))}

                              {/* Data points and line */}
                              {analyticsData.monthly.map((month, i) => {
                                const xPos =
                                  (i / (analyticsData.monthly.length - 1)) *
                                  100;
                                const yPos =
                                  (month.count /
                                    Math.max(
                                      ...analyticsData.monthly.map(
                                        (m) => m.count
                                      )
                                    )) *
                                  100;

                                return (
                                  <React.Fragment key={i}>
                                    <div
                                      className="absolute w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                                      style={{
                                        left: `${xPos}%`,
                                        bottom: `${yPos}%`,
                                      }}
                                    ></div>
                                    {i > 0 && (
                                      <div
                                        className="absolute h-1 bg-blue-300 transform -translate-y-1/2"
                                        style={{
                                          left: `${
                                            ((i - 1) /
                                              (analyticsData.monthly.length -
                                                1)) *
                                            100
                                          }%`,
                                          right: `${
                                            100 -
                                            (i /
                                              (analyticsData.monthly.length -
                                                1)) *
                                              100
                                          }%`,
                                          bottom: `${yPos}%`,
                                        }}
                                      ></div>
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </div>
                          </div>

                          {/* X-axis labels */}
                          <div className="absolute left-8 right-0 bottom-0 h-8 pl-4 flex justify-between">
                            {analyticsData.monthly.map((month, i) => (
                              <div
                                key={i}
                                className="text-xs text-gray-500 text-center"
                                style={{
                                  width: `${
                                    100 / analyticsData.monthly.length
                                  }%`,
                                }}
                              >
                                {month.month.split("-")[1]}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                          No monthly data available
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Distribution */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-700 mb-4">
                      Status Distribution
                    </h3>
                    <div className="h-64 flex flex-col">
                      {analyticsData.byStatus.length > 0 ? (
                        <>
                          <div className="flex-grow relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="relative w-40 h-40">
                                <svg
                                  viewBox="0 0 100 100"
                                  className="w-full h-full"
                                >
                                  {(() => {
                                    let cumulativePercent = 0;
                                    const total = analyticsData.byStatus.reduce(
                                      (sum, item) => sum + item.count,
                                      0
                                    );
                                    return analyticsData.byStatus.map(
                                      (status, i) => {
                                        const percent =
                                          (status.count / total) * 100;
                                        const startX =
                                          50 +
                                          40 *
                                            Math.cos(
                                              (2 *
                                                Math.PI *
                                                cumulativePercent) /
                                                100
                                            );
                                        const startY =
                                          50 +
                                          40 *
                                            Math.sin(
                                              (2 *
                                                Math.PI *
                                                cumulativePercent) /
                                                100
                                            );
                                        cumulativePercent += percent;
                                        const endX =
                                          50 +
                                          40 *
                                            Math.cos(
                                              (2 *
                                                Math.PI *
                                                cumulativePercent) /
                                                100
                                            );
                                        const endY =
                                          50 +
                                          40 *
                                            Math.sin(
                                              (2 *
                                                Math.PI *
                                                cumulativePercent) /
                                                100
                                            );

                                        const largeArcFlag =
                                          percent > 50 ? 1 : 0;
                                        const colors = [
                                          "#3B82F6",
                                          "#10B981",
                                          "#F59E0B",
                                          "#EF4444",
                                        ];

                                        return (
                                          <path
                                            key={i}
                                            d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                                            fill={colors[i % colors.length]}
                                            className="opacity-90 hover:opacity-100 transition-opacity"
                                          />
                                        );
                                      }
                                    );
                                  })()}
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 space-y-2">
                            {analyticsData.byStatus.map((status, i) => {
                              const colors = [
                                "bg-blue-500",
                                "bg-green-500",
                                "bg-yellow-500",
                                "bg-red-500",
                              ];
                              return (
                                <div
                                  key={i}
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex items-center">
                                    <div
                                      className={`w-3 h-3 rounded-full ${
                                        colors[i % colors.length]
                                      } mr-2`}
                                    ></div>
                                    <span className="text-sm text-gray-600 capitalize">
                                      {status.status}
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium text-gray-700">
                                    {status.count}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                          No status data available
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-5 rounded-xl border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-4">
                    Recent Bookings
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.slice(0, 5).map((booking) => (
                          <tr key={booking.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{booking.id}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {new Date(
                                booking.created_at
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              ${booking.price}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  booking.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "details" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800">
                Account Details
              </h1>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Export Data
              </button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Card */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Personal Information
                  </h2>
                  <button
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    onClick={() => setIsEditing(true)}
                  >
                    <FaEdit className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Full Name
                    </p>
                    <p className="text-gray-800 font-medium">{user.fname}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </p>
                    <p className="text-gray-800 font-medium">{user.email}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member Since
                    </p>
                    <p className="text-gray-800 font-medium">
                      {formatDate(user.memberSince)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Statistics Card */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Account Statistics
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FaClipboardList className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Total Bookings
                        </p>
                        <p className="text-lg font-semibold text-gray-800">
                          {bookings.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FaListAlt className="text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Active Trips
                        </p>
                        <p className="text-lg font-semibold text-gray-800">
                          {bookings.filter((b) => b.status === "active").length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FaChartBar className="text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Loyalty Points
                        </p>
                        <p className="text-lg font-semibold text-gray-800">
                          {(user.loyaltyPoints || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods Card */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 md:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Payment Methods
                  </h2>
                  <button className="text-blue-500 hover:text-blue-700 font-medium flex items-center">
                    <span className="mr-1">+ Add New</span>
                    <FaCreditCard />
                  </button>
                </div>

                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            method.type === "visa"
                              ? "bg-blue-100"
                              : "bg-orange-100"
                          }`}
                        >
                          <FaCreditCard
                            className={
                              method.type === "visa"
                                ? "text-blue-500"
                                : "text-orange-500"
                            }
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {method.type === "visa" ? "Visa" : "Mastercard"}{" "}
                            •••• {method.last4}
                          </p>
                          <p className="text-xs text-gray-500">
                            Expires {method.expires}
                          </p>
                        </div>
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        onClick={() => removePaymentMethod(method.id)}
                      >
                        <FaTimesCircle />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferences Card */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Preferences
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FaBell className="text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Email Notifications
                        </p>
                        <p className="text-sm text-gray-500">
                          Receive updates about your trips
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={preferences.emailNotifications}
                        onChange={() =>
                          handlePreferenceChange("emailNotifications")
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FaBell className="text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          SMS Notifications
                        </p>
                        <p className="text-sm text-gray-500">
                          Get text alerts for bookings
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={preferences.smsNotifications}
                        onChange={() =>
                          handlePreferenceChange("smsNotifications")
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FaMoon className="text-purple-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Dark Mode</p>
                        <p className="text-sm text-gray-500">
                          Switch to dark theme
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={preferences.darkMode}
                        onChange={() => handlePreferenceChange("darkMode")}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "refunds" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Refund Requests
                </h1>
                <p className="text-gray-600">
                  Manage your booking refunds and status
                </p>
              </div>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                onClick={() => navigate("/new-refund")}
              >
                <FaUndoAlt />
                <span>Request Refund</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Total Refunds */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Refunds
                    </p>
                    <p className="text-2xl font-bold text-gray-800">12</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FaUndoAlt className="text-blue-500 text-xl" />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-blue-600 flex items-center">
                    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
                    3 pending approval
                  </p>
                </div>
              </div>

              {/* Approved Refunds */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Approved
                    </p>
                    <p className="text-2xl font-bold text-gray-800">7</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FaClipboardList className="text-green-500 text-xl" />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-green-600 flex items-center">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                    ₹12,450 processed
                  </p>
                </div>
              </div>

              {/* Rejected Refunds */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Rejected
                    </p>
                    <p className="text-2xl font-bold text-gray-800">2</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <FaTimesCircle className="text-red-500 text-xl" />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-red-600 flex items-center">
                    <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-1"></span>
                    1 appeal pending
                  </p>
                </div>
              </div>
            </div>

            {/* Refund Requests Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  Recent Refund Requests
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Refund ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booking
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Requested
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      {
                        id: "RF-2023-001",
                        bookingId: "BK-2023-105",
                        amount: "₹2,450",
                        requested: "2023-05-15",
                        status: "approved",
                        bookingDate: "2023-05-10",
                      },
                      {
                        id: "RF-2023-002",
                        bookingId: "BK-2023-108",
                        amount: "₹3,200",
                        requested: "2023-05-18",
                        status: "pending",
                        bookingDate: "2023-05-12",
                      },
                      {
                        id: "RF-2023-003",
                        bookingId: "BK-2023-112",
                        amount: "₹1,850",
                        requested: "2023-05-20",
                        status: "rejected",
                        bookingDate: "2023-05-15",
                      },
                      {
                        id: "RF-2023-004",
                        bookingId: "BK-2023-115",
                        amount: "₹4,950",
                        requested: "2023-05-22",
                        status: "processing",
                        bookingDate: "2023-05-18",
                      },
                    ].map((refund, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {refund.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <p className="font-medium">{refund.bookingId}</p>
                            <p className="text-xs text-gray-400">
                              {formatDate(refund.bookingDate)}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {refund.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(refund.requested)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${
                              refund.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : refund.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : refund.status === "processing"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {refund.status.charAt(0).toUpperCase() +
                              refund.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            onClick={() => navigate(`/refunds/${refund.id}`)}
                          >
                            View
                          </button>
                          {refund.status === "rejected" && (
                            <button
                              className="text-purple-600 hover:text-purple-900"
                              onClick={() =>
                                console.log("Appeal refund", refund.id)
                              }
                            >
                              Appeal
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to{" "}
                      <span className="font-medium">4</span> of{" "}
                      <span className="font-medium">12</span> refunds
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Previous</span>
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <button
                        aria-current="page"
                        className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                      >
                        1
                      </button>
                      <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        2
                      </button>
                      <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        3
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Next</span>
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Need help with a refund?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Refund Policy
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Learn about our refund policies, timelines, and any
                    applicable fees.
                  </p>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View refund policy →
                  </button>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    Contact Support
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Our customer support team is available 24/7 to assist with
                    your refund queries.
                  </p>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Contact support →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;