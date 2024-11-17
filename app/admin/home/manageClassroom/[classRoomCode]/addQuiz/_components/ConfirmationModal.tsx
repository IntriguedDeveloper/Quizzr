import { HiX } from "react-icons/hi";
import React, { useState } from "react";
import { collection, doc, setDoc, writeBatch } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { useClassRoomContext } from "@/app/admin/home/manageClassroom/[classRoomCode]/_utils/fetchClassDetails";
import { QuestionConstructType } from "../../_types/quizTypes";
import { useRouter } from "next/navigation";

export default function ConfirmationModal({
  onClose,
  noOfQuestions,
  questionsArray,
}: {
  onClose: () => void;
  noOfQuestions: number;
  questionsArray: QuestionConstructType[];
}) {
  const router = useRouter();
  const classDetails = useClassRoomContext();
  const [quizDetails, setQuizDetails] = useState({
    title: "",
    timeDuration: "",
    fullMarks: 0,
  });
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [showCheckMark, setShowCheckMark] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "hours" | "minutes" | "seconds"
  ) => {
    const value = Number(e.target.value);
    if (type === "hours") {
      setHours(Math.min(Math.max(value, 0), 23));
    } else if (type === "minutes" || type === "seconds") {
      if (value >= 0 && value < 60) {
        type === "minutes" ? setMinutes(value) : setSeconds(value);
      }
    }
    const timeDurationString = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    setQuizDetails((prev) => ({ ...prev, timeDuration: timeDurationString }));
  };

  const handleQuizCreation = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      if (!classDetails.selectedSubject || !quizDetails.title) {
        throw new Error("Subject or Quiz Title is missing.");
      }

      const batch = writeBatch(db);

      const detailsRef = doc(
        db,
        `classrooms/${classDetails.classCode}/subjects/${classDetails.selectedSubject}/quizzes/${quizDetails.title}`
      );
      batch.set(detailsRef, quizDetails);

      for (let i = 0; i < questionsArray.length; i++) {
        const questionDoc = questionsArray[i];
        console.log(questionsArray[i]);
        if (!questionDoc.QuestionTitle) {
          throw new Error(`Question ${i + 1} is missing a title.`);
        }

        const questionsRef = doc(
          collection(
            db,
            `classrooms/${classDetails.classCode}/subjects/${classDetails.selectedSubject}/quizzes/${quizDetails.title}/questions/`
          )
        );
        batch.set(questionsRef, questionDoc);
      }

      await batch.commit();
      setShowCheckMark(true);
    } catch (error: any) {
      console.error("Error creating quiz:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg lg:w-3/4 w-full h-auto p-8 relative shadow-lg transition-all ease-in-out transform sm:w-2/3">
        <HiX
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 cursor-pointer w-6 h-6"
        />

        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Provide Quiz Details
        </h1>

        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="quizTitle"
              className="text-lg font-medium text-gray-700"
            >
              Quiz Title:
            </label>
            <input
              id="quizTitle"
              type="text"
              placeholder="Enter the Quiz Title"
              className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) =>
                setQuizDetails((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div className="flex flex-col space-y-2">
            <h2 className="text-lg font-medium text-gray-700">
              Select Time Duration:
            </h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <input
                  placeholder="H"
                  value={hours}
                  onChange={(e) => handleInputChange(e, "hours")}
                  className="w-16 p-2 border border-gray-300 rounded-md text-center"
                  type="number"
                  min={0}
                  max={23}
                />
                <span className="ml-1">H</span>
              </div>
              <span className="text-xl">:</span>
              <div className="flex items-center">
                <input
                  placeholder="M"
                  value={minutes}
                  onChange={(e) => handleInputChange(e, "minutes")}
                  className="w-16 p-2 border border-gray-300 rounded-md text-center"
                  type="number"
                  min={0}
                  max={59}
                />
                <span className="ml-1">M</span>
              </div>
              <span className="text-xl">:</span>
              <div className="flex items-center">
                <input
                  placeholder="S"
                  value={seconds}
                  onChange={(e) => handleInputChange(e, "seconds")}
                  className="w-16 p-2 border border-gray-300 rounded-md text-center"
                  type="number"
                  min={0}
                  max={59}
                />
                <span className="ml-1">S</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="fullMarks"
              className="text-lg font-medium text-gray-700"
            >
              Full Marks
            </label>
            <input
              id="fullMarks"
              type="number"
              placeholder="Enter the Full Marks"
              className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) =>
                setQuizDetails((prev) => ({
                  ...prev,
                  fullMarks: Number(e.target.value),
                }))
              }
            />
          </div>
          <h1 className="text-lg font-medium text-gray-700">
            Total Number of Questions : {noOfQuestions}
          </h1>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-800 hover:bg-gray-400 px-4 py-2 rounded-md transition duration-200 ease-in-out"
            >
              Cancel
            </button>
            <button
              className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-md transition duration-200 ease-in-out"
              onClick={handleQuizCreation}
            >
              Confirm
            </button>
          </div>
          {showCheckMark && (
            <div className="flex flex-col items-center mt-6 space-y-4">
              <div className="checkmark-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                  className="w-16 h-16 text-green-600 stroke-current"
                >
                  <circle
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                    className="stroke-current text-green-300 animate-checkmark-circle"
                    strokeWidth="2"
                  />
                  <path
                    d="M14 27l10 10 14-20"
                    fill="none"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="stroke-current animate-checkmark"
                  />
                </svg>
              </div>
              <p className="text-lg font-semibold text-gray-700">
                Quiz Created Successfully!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
