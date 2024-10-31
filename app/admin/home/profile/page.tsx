"use client";
import { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import {
  getAuth,
  sendPasswordResetEmail,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

export default function AdminProfilePage() {
  const userDetails = useUserContext();
  const [isEditing, setIsEditing] = useState({
    username: false,
    email: false,
    password: false,
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
  });
  const [message, setMessage] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (userDetails) {
      setProfileData({
        username: userDetails.userName || "",
        email: userDetails.userEmail || "",
      });
    }
  }, [userDetails]);

  const toggleEdit = (field: keyof typeof isEditing) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleForgotPassword = async () => {
    const auth = getAuth();
    try {
      if (profileData.email) {
        await sendPasswordResetEmail(auth, profileData.email);
        setMessage(`Password reset email sent to ${profileData.email}!`);
      } else {
        setMessage("Enter a valid email.");
      }
    } catch (error) {
      setMessage("Error sending password reset email. Please try again.");
    }
  };

  const handleSave = async (field: keyof typeof isEditing) => {
    if (field === "email") {
      setShowLoginForm(true);
      return;
    } else {
      toggleEdit(field);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuth();
    const credential = EmailAuthProvider.credential(
      loginData.email,
      loginData.password
    );

    try {
      await reauthenticateWithCredential(auth.currentUser!, credential);
      await updateEmail(auth.currentUser!, profileData.email);
      setMessage("Email updated successfully!");
      toggleEdit("email");
      setShowLoginForm(false);
      setLoginData({ email: "", password: "" });
    } catch (error: any) {
      setMessage("Error during login or updating email: " + error.message);
    }
  };

  return (
    <div className="p-6 w-5/6 mx-auto bg-white shadow-md rounded-md space-y-6">
      <h2 className="text-2xl font-semibold text-primary mb-4">
        Teacher Profile
      </h2>

      {["username", "email"].map((field) => (
        <div key={field} className="space-y-1">
          <label className="block text-lg font-medium text-gray-700 capitalize">
            {field === "username"
              ? "User Name"
              : field.charAt(0).toUpperCase() + field.slice(1)}
          </label>

          <div className="flex items-center space-x-2 mt-1 rounded border border-gray-300 p-2">
            <div className="flex-grow">
              <div
                className={`transition-opacity duration-300 ${
                  isEditing[field as keyof typeof isEditing] ? "opacity-100" : "opacity-0"
                }`}
                style={{ height: "40px", transition: "opacity 0.3s ease-in-out" }}
              >
                {isEditing[field as keyof typeof isEditing] ? (
                  <input
                    type={field === "password" ? "password" : "text"}
                    name={field}
                    value={profileData[field as keyof typeof profileData]}
                    onChange={handleInputChange}
                    className="border-b-2 border-blue-500 p-2 w-full outline-none text-gray-700 rounded"
                    style={{ height: "40px" }}
                  />
                ) : (
                  <span
                    className="text-gray-700 flex items-center"
                    style={{ height: "40px" }}
                  >
                    {profileData[field as keyof typeof profileData]}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() =>
                isEditing[field as keyof typeof isEditing]
                  ? handleSave(field as keyof typeof isEditing)
                  : toggleEdit(field as keyof typeof isEditing)
              }
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              {isEditing[field as keyof typeof isEditing] ? "Save" : "Edit"}
            </button>
          </div>
        </div>
      ))}

      <div className="mt-4">
        <button
          onClick={() => setShowForgotPassword(!showForgotPassword)}
          className="text-blue-500 hover:text-blue-700 font-medium"
        >
          Forgot Password?
        </button>
      </div>

      {showForgotPassword && (
        <div className="mt-4">
          <div
            className={`p-4 border rounded bg-gray-100 transition-opacity duration-300 ${
              showForgotPassword ? "opacity-100" : "opacity-0"
            }`}
            style={{ transition: "opacity 0.3s ease-in-out" }}
          >
            <p>Enter your email to receive a password reset link:</p>
            <input
              type="email"
              value={profileData.email}
              onChange={handleInputChange}
              name="email"
              className="border-b-2 border-blue-500 p-2 w-full outline-none text-gray-700 mt-2"
            />
            <button
              onClick={handleForgotPassword}
              className="mt-2 text-blue-500 hover:text-blue-700 font-medium"
            >
              Send Reset Email
            </button>
          </div>
        </div>
      )}

      {showLoginForm && (
        <div className="mt-4">
          <div
            className={`p-4 border rounded bg-gray-100 transition-opacity duration-300 ${
              showLoginForm ? "opacity-100" : "opacity-0"
            }`}
            style={{ transition: "opacity 0.3s ease-in-out" }}
          >
            <p>Please log in again to update your email:</p>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                name="email"
                onChange={handleLoginInputChange}
                placeholder="Old email"
                className="border-b-2 border-blue-500 p-2 w-full outline-none text-gray-700 mt-2"
                required
              />
              <input
                type="password"
                name="password"
                onChange={handleLoginInputChange}
                placeholder="Password"
                className="border-b-2 border-blue-500 p-2 w-full outline-none text-gray-700 mt-2"
                required
              />
              <button
                type="submit"
                className="mt-2 text-blue-500 hover:text-blue-700 font-medium"
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      )}

      {message && <div className="mt-4 text-green-500">{message}</div>}
    </div>
  );
}
