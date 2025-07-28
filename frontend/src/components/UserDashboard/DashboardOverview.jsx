import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const DashboardOverview = ({ setActiveTab }) => {
  const navigate = useNavigate();
  const [postedItems] = useLocalStorage("postedItems", []);
  const [wishlistItems] = useLocalStorage("wishlistItems", []);
  const [userProfile] = useLocalStorage("userProfile", {});

  // Calculate stats
  const totalItemsPosted = postedItems.length;
  const itemsThisMonth = postedItems.filter((item) => {
    const itemDate = new Date(item.datePosted);
    const now = new Date();
    return (
      itemDate.getMonth() === now.getMonth() &&
      itemDate.getFullYear() === now.getFullYear()
    );
  }).length;
  const wishlistCount = wishlistItems.length;

  // Calculate estimated environmental impact
  const estimatedWeight = postedItems.reduce((total, item) => {
    const weight = parseFloat(item.quantity) || 0;
    return total + weight;
  }, 0);

  const recentItems = postedItems.slice(0, 3);

  // Handle quick action navigation
  const handleQuickAction = (action) => {
    switch (action) {
      case "post":
        navigate("/user/dashboard/post");
        if (setActiveTab) setActiveTab("post");
        break;
      case "wishlist":
        navigate("/user/dashboard/wishlist");
        if (setActiveTab) setActiveTab("wishlist");
        break;
      case "profile":
        navigate("/user/dashboard/profile");
        if (setActiveTab) setActiveTab("profile");
        break;
      default:
        break;
    }
  };

  const quickActions = [
    {
      title: "Post New Item",
      description: "Add recyclable items",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
      color: "bg-blue-500",
      action: "post",
    },
    {
      title: "View Wishlist",
      description: "Check saved items",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      color: "bg-pink-500",
      action: "wishlist",
    },
    {
      title: "Update Profile",
      description: "Manage your info",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      color: "bg-purple-500",
      action: "profile",
    },
  ];

  const ecoTips = [
    "💡 Clean containers before recycling to improve processing quality",
    "🌱 Separate materials properly to maximize recycling efficiency",
    "♻️ Check local recycling guidelines for specific requirements",
    "🌍 Reduce consumption to minimize waste generation",
  ];

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {getCurrentGreeting()}, {userProfile.fullName || "Eco Warrior"}!
              👋
            </h1>
            <p className="text-green-100 text-lg">
              Welcome to your EcoSajha dashboard. Ready to make a difference
              today?
            </p>
          </div>
          <div className="hidden md:block">
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Items Posted
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {totalItemsPosted}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-green-600 text-sm font-medium">
              +{itemsThisMonth} this month
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Wishlist Items
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {wishlistCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-pink-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-gray-500 text-sm">Items saved for later</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Est. Weight Recycled
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {estimatedWeight.toFixed(1)}{" "}
                <span className="text-lg text-gray-500">kg</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-green-600 text-sm font-medium">
              🌱 Environmental impact
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Eco Points</p>
              <p className="text-3xl font-bold text-gray-900">
                {totalItemsPosted * 10}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-gray-500 text-sm">Earned from recycling</span>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.action)}
                className="w-full flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-[1.02]"
              >
                <div
                  className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white mr-4`}
                >
                  {action.icon}
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 ml-auto transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          {recentItems.length > 0 ? (
            <div className="space-y-4">
              {recentItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {item.itemName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {item.category} • {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(item.datePosted).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <p className="text-gray-500">No items posted yet</p>
              <p className="text-sm text-gray-400">
                Start your recycling journey!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Eco Tips */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🌍</span>
          Eco Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ecoTips.map((tip, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-700">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
