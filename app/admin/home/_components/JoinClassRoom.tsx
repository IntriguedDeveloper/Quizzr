import React, { useState } from "react";
import { ClassRoomDoc } from "../_types/ClassRoomDoc";
import { useUserContext } from "@/context/UserContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { handleClassJoin } from "../_utils/functions";
const JoinClassRoom: React.FC<{ refreshClassesSetter: () => void }> = ({
  refreshClassesSetter,
}) => {
  const teacherData = useUserContext();
  const [subjectList, setSubjectList] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [formData, setFormData] = useState<ClassRoomDoc>({
    className: "",
    classCode: "",
    
  });
  const [errorMessage, setErrorMessage] = useState("");

  const fetchSubjects = async (ClassCode: string) => {
    const subjectDocSnap = await getDocs(
      collection(db, `classrooms/${ClassCode}/subject`)
    );
    subjectDocSnap.forEach((doc) => {
      setSubjectList((prevSubjectList) => [
        ...prevSubjectList,
        doc.data().subjectName,
      ]);
    });
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubjectList([]);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const codeFormatRegex = /^\d{2}_A\d_\d{4}$/;
    if (codeFormatRegex.test(e.target.value)) {
      //Query Firestore
      const subjectSnap = await getDocs(
        collection(db, `classrooms/${e.target.value}/subjects`)
      );
      subjectSnap.forEach((doc) => {
        setSubjectList((prevSubjects) => [
          ...prevSubjects,
          doc.data().subjectName,
        ]);
      });
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
            handleClassJoin(
              formData,
              selectedSubject,
              refreshClassesSetter,
              errorMessageSetter,
              teacherData
            )
          }
        >
          Join Classroom
        </button>

        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
      </form>
    </div>
  );
};

export default JoinClassRoom;
