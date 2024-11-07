"use client";
import { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import {
  getAuth,
  sendPasswordResetEmail,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  AuthCredential,
  EmailAuthCredential,
} from "firebase/auth";
import { auth } from "@/firebase/clientApp";
import ConfirmationModal from "../_components/ConfirmationModal";
import { useRouter } from "next/navigation";

export default function AdminProfilePage() {
  const router = useRouter();
  const userDetails = useUserContext();
  const [editingData, setEditingData] = useState({
    username: false,
    email: false,
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
  const [displayModal, setDisplayModal] = useState(false);
  useEffect(() => {
    if (userDetails) {
      setProfileData({
        username: userDetails.userName || "",
        email: userDetails.userEmail || "",
      });
    }
  }, [userDetails]);

  const toggleEdit = (field: keyof typeof editingData) => {
    setEditingData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
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

  const handleSave = async (field: keyof typeof editingData) => {
    if (field === "email") {
      setShowLoginForm(true);
    } else {
      toggleEdit(field);
      setMessage("Username updated successfully!");
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

  const handleAccountDeletionInitialisation = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const user = await auth.currentUser;
    if (user) {
      setDisplayModal(true);
    }
  };

  const toggleConfirmationModal = () => {
    setDisplayModal(false);
  };

  const handleAccountDeletionConfirmation = async (password: string) => {
    const user = await auth.currentUser;
    if (user && userDetails?.userEmail) {
      try {
        await reauthenticateWithCredential(
          user,
          EmailAuthProvider.credential(userDetails.userEmail, password)
        );
        await deleteUser(user);
        router.push('/admin/auth/signup')
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="h-screen w-screen">
      {displayModal && (
        <ConfirmationModal
          handleAccountDeletionConfirmation={handleAccountDeletionConfirmation}
          toggleModalDisplay={toggleConfirmationModal}
        ></ConfirmationModal>
      )}
      <div
        className={`p-6 w-5/6 mx-auto bg-white shadow-md rounded-md space-y-6 relative ${
          displayModal && "opacity-40"
        }`}
      >
        <h2 className="text-2xl font-semibold text-primary mb-4">
          Teacher Profile
        </h2>

        {["username", "email"].map((field) => (
          <div key={field} className="space-y-1">
            <label className="block text-lg font-medium text-gray-700 capitalize">
              {field === "username" ? "User Name" : "Email"}
            </label>

            <div className="flex items-center space-x-2 mt-1 rounded border border-gray-300 p-2">
              <div className="flex-grow">
                {editingData[field as keyof typeof editingData] ? (
                  <input
                    type="text"
                    name={field}
                    value={profileData[field as keyof typeof profileData]}
                    onChange={handleInputChange}
                    className="border-b-2 border-blue-500 p-2 w-full outline-none text-gray-700 rounded"
                  />
                ) : (
                  <span className="text-gray-700 flex items-center">
                    {profileData[field as keyof typeof profileData]}
                  </span>
                )}
              </div>

              <button
                onClick={() =>
                  editingData[field as keyof typeof editingData]
                    ? handleSave(field as keyof typeof editingData)
                    : toggleEdit(field as keyof typeof editingData)
                }
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                {editingData[field as keyof typeof editingData]
                  ? "Save"
                  : "Edit"}
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
        <div>
          <button
            className="text-white bg-red-500 p-2 rounded-lg shadow-md h-10 w-40 hover:shadow-xl hover:font-semibold"
            onClick={handleAccountDeletionInitialisation}
          >
            Delete Account
          </button>
        </div>

        {showForgotPassword && (
          <div className="mt-4 p-4 border rounded bg-gray-100">
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
        )}

        {showLoginForm && (
          <div className="mt-4 p-4 border rounded bg-gray-100">
            <p>Please log in again to update your email:</p>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                name="email"
                onChange={(e) =>
                  setLoginData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Old email"
                className="border-b-2 border-blue-500 p-2 w-full outline-none text-gray-700 mt-2"
                required
              />
              <input
                type="password"
                name="password"
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
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
        )}

        {message && <div className="mt-4 text-green-500">{message}</div>}
      </div>
    </div>
  );
}
