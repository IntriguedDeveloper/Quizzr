"use client";
import { db } from "@/firebase/clientApp";
import addClassRoom from "@/public/addClassRoom.png";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Image from "next/image";
import { useState } from "react";

export default function ClassroomViewer() {
  const [isActive, setActive] = useState(false);
  const [formData, setFormData] = useState({
    classRoomName: "",
    classRoomCode: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClassCreation = async () => {
    const uploadObject = formData;
    const docSnap = await getDoc(doc(db, "classrooms", formData.classRoomCode));

    if (!docSnap.exists()) {
      setDoc(doc(db, "classrooms", formData.classRoomCode), uploadObject)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setErrorMessage("Class already exists.");
    }
  };

  return (
    <div className="p-6 space-y-6 flex-col flex justify-center items-center">
      <h2 className="text-color-primary text-3xl font-semibold">
        Manage Classrooms
      </h2>

      <div
        className={`relative w-full h-16 p-4 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 
          ${isActive ? "bg-blue-600 border-2 border-black" : "bg-blue-400"}`}
        onClick={() => setActive(!isActive)}
      >
        <Image
          src={addClassRoom}
          alt="class_img"
          className="h-10 w-10 object-cover"
        />
      </div>

      {isActive && (
        <div className="w-full p-4 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Add Classroom
          </h3>
          <form className="space-y-4 text-center">
            <div>
              <label className="block text-gray-600 font-medium">
                Classroom Name
              </label>
              <input
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter classroom name"
                name="classRoomName"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium">
                Classroom Code
              </label>
              <input
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter classroom code"
                name="classRoomCode"
                onChange={handleInputChange}
              />
            </div>

            <button
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              onClick={handleClassCreation}
              type="button"
            >
              Create Classroom
            </button>
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              type="button"
            >
              Join Classroom
            </button>
            <div className="relative h-6">
              {errorMessage && (
                <span className="absolute inset-0 text-red-600 font-semibold text-sm">
                  {errorMessage}
                </span>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
