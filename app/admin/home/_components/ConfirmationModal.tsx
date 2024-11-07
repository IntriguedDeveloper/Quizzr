import React, { useState } from "react";

type ConfirmationModalType = {
  handleAccountDeletionConfirmation: (password: string) => void;
  toggleModalDisplay: () => void;
};

export default function ConfirmationModal({
  handleAccountDeletionConfirmation,
  toggleModalDisplay,
}: ConfirmationModalType) {
  const [password, setPassword] = useState("");

  const handleDeleteClick = () => {
    handleAccountDeletionConfirmation(password);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <strong className="block text-xl mb-4">
          Are you sure you want to delete your account?
        </strong>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <div className="flex justify-evenly w-full">
          <button
            onClick={toggleModalDisplay}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
          >
            No, keep my account
          </button>
          <button
            onClick={handleDeleteClick}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Yes, delete my account
          </button>
        </div>
      </div>
    </div>
  );
}
