"use client";
import { useState } from "react";

export default function AddQuiz() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(e.target.value);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-blue-100">
      <div className="max-w-2xl w-full h-full bg-white border-2 border-blue-600 rounded-lg shadow-lg flex flex-col items-center justify-start pt-5 lg:h-4/5 lg:w-4/5">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">Create a Quiz</h2>
        
        <div className="w-4/5 bg-blue-50 rounded-lg flex items-center justify-center p-4 mb-5 shadow-sm">
          <label htmlFor="subject" className="text-lg font-semibold text-blue-800 mr-6">1. Choose a Subject:</label>
          <select
            id="subject"
            value={selectedSubject}
            onChange={handleSubjectChange}
            required
            className="h-12 w-40 border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-500 transition-all duration-300 ease-in-out"
          >
            <option value="" disabled>Select a subject</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Computer">Computer</option>
            <option value="English">English</option>
          </select>
        </div>
        
        <div className="w-4/5 bg-blue-50 rounded-lg flex items-center justify-center p-4 mb-5 shadow-sm">
          <label htmlFor="class" className="text-lg font-semibold text-blue-800 mr-6">2. Choose a Class for Quiz:</label>
          <select
            id="class"
            value={selectedClass}
            onChange={handleClassChange}
            required
            className="h-12 w-40 border-2 border-blue-400 rounded-md focus:outline-none focus:border-blue-500 transition-all duration-300 ease-in-out"
          >
            <option value="" disabled>Select a class</option>
            <option value="XI A3">XI A3</option>
            <option value="XII A1">XII A1</option>
            <option value="XII A2">XII A2</option>
            <option value="X A1">X A1</option>
            <option value="X A2">X A2</option>
          </select>
        </div>
        
        <button className="w-4/5 h-12 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-500 transition-all duration-300 ease-in-out">
          Create Quiz
        </button>
      </div>
    </div>
  );
}
