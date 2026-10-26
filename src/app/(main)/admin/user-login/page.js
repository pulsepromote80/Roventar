"use client";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { adminuserLogin } from '@/app/redux/slices/adminMasterSlice';
import { encryptData, decryptData } from '@/app/constants/encryption';

export default function UserLoginPage() {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [authData, setAuthData] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!userId.trim()) {
      setError("Please enter a user ID");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await dispatch(adminuserLogin({ username: userId })).unwrap();

      if (response.statusCode === 200) {
        setResult(response.data);

        // Check if message is "Is Verify."
        if (response.message === "Is Verify." && response.data && response.data.length > 0) {
          setIsVerified(true);
          setAuthData(response.data[0]);

          // Auto-login when AuthLogin and AuthPass are available
          if (response.data[0].AuthLogin && response.data[0].AuthPass) {
            handleLogin(response.data[0]);
          }
        }
      } else {
        setError(response?.message || "Something went wrong");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError(err?.message || err?.response?.data?.message || "Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (data = authData) => {
    if (data && data.AuthLogin && data.AuthPass) {
      let usernameToEncrypt = data.AuthLogin;

      const encryptedUsername = encryptData(usernameToEncrypt);
      const encryptedPassword = encryptData(data.AuthPass);

      const baseUrl = `${window.location.origin}/user/login`;

      const params = new URLSearchParams({
        username: encryptedUsername,
        password: encryptedPassword,
      });

      const url = `${baseUrl}?${params.toString()}`;

      const newTab = window.open("about:blank", "_blank");

      if (!newTab) {
        console.error("❌ Popup blocked by browser");
        return;
      }
      newTab.location.href = url;
    }
  };
  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <h1 className="text-3xl font-bold text-black mb-6">User Login Search</h1>

          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Enter User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter user ID to search..."
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-black text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                autoComplete="off"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {!isVerified ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLogin}
                className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Login
              </button>
            )}
          </form>

          {result && !isVerified && (
            <div className="mt-6 p-4 rounded-lg bg-green-500/20 border border-green-500/30">
              <h3 className="text-lg font-semibold text-green-300 mb-3">Search Result:</h3>
              <pre className="text-white/90 text-sm overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          {isVerified && authData && (
            <div className="mt-6 p-4 rounded-lg bg-green-500/20 border border-green-500/30">
              <h3 className="text-lg font-semibold text-black mb-3">User Verified Successfully!</h3>
              <div className="space-y-2 text-white/90 text-sm">
                <p><span className="font-semibold text-black">Username:</span><span className="text-black"> {authData.AuthLogin}</span></p>
                <p><span className="font-semibold text-black">Password:</span><span className="text-black"> {authData.AuthPass}</span></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
