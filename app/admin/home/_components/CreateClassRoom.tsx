import React, { useState } from "react";
import { HiPlusCircle } from "react-icons/hi";
import { FaTrash } from "react-icons/fa";
import { handleClassCreation } from "../_utils/functions";
import { ClassRoomDoc } from "../_types/ClassRoomDoc";
import { useUserContext } from "@/context/UserContext";

const CreateClassRoom: React.FC<{ refreshClassesSetter: () => void }> = ({
  refreshClassesSetter,
}) => {
  const teacherData = useUserContext();
  const [subjectList, setSubjectList] = useState<string[]>([]);
  const [currentSubject, setCurrentSubject] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [formData, setFormData] = useState<ClassRoomDoc>({
    className: "",
    classCode: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectAddition = () => {
    if (currentSubject && !subjectList.includes(currentSubject)) {
      setSubjectList((prevSubjectList) => [...prevSubjectList, currentSubject]);
      setCurrentSubject("");
    }
  };
  const errorMessageSetter = (errorMessage: string) => {
    setErrorMessage(errorMessage);
  };
  return (
    <div className="w-full p-4 bg-gray-100 rounded-lg shadow-md">
      <form
        className="space-y-4 text-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <label className="block text-gray-600 font-medium">
            Classroom Name
          </label>
          <input
            type="text"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter classroom name"
            name="className"
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
            placeholder="Enter class code (Eg : 11_A1_2026)"
            name="classCode"
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium">
            Add Subjects
          </label>
          <div>
            <div className="flex flex-row justify-center items-center h-max w-full mt-1">
              <input
                type="text"
                placeholder="Enter Subject name : "
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                onChange={(e) => setCurrentSubject(e.target.value)}
                value={currentSubject}
              />
              <HiPlusCircle
                className="w-12 h-full cursor-pointer ml-2"
                onClick={handleSubjectAddition}
              />
            </div>
            <div className="mt-3 bg-white border-2 rounded-lg">
              {subjectList.map((subject, index) => (
                <div
                  key={index}
                  className="h-10 w-full border-b-2 flex items-center justify-between px-2"
                >
                  <div className="flex-grow text-center">{subject}</div>
                  <FaTrash
                    className="w-6 h-6 cursor-pointer flex items-center justify-center"
                    onClick={() => {
                      setSubjectList((prevList) => {
                        const newList = [...prevList];
                        newList.splice(index, 1);
                        return newList;
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {subjectList.length > 0 && (
          <div className="mt-4">
            <label className="block text-gray-600 font-medium">
              Select a Subject
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none mt-1"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="" disabled>
                Choose a subject
              </option>
              {subjectList.map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          onClick={() =>
            handleClassCreation(
              formData,
              subjectList,
              selectedSubject,
              refreshClassesSetter,
              errorMessageSetter,
              teacherData
            )
          }
        >
          Create Classroom
        </button>

        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
      </form>
    </div>
  );
};

export default CreateClassRoom;
