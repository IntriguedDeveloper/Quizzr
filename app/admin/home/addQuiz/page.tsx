"use client";
import styles from "./addQuiz.module.css";
import { useState } from "react";
export default function AddQuiz() {
  const [selectedSubject, setSelectedSubject] = useState("");

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
  };
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.selectionContainer}>
            <label htmlFor="subject">1. Choose a Subject:</label>
            <select
              id="subject"
              value={selectedSubject}
              onChange={handleSubjectChange}
              required
            >
              <option value="" disabled>
                Select a subject
              </option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Computer">Computer</option>
              <option value="English">English</option>
            </select>
          </div>
          <div className={styles.selectionContainer}>
            <label htmlFor="class">2. Choose a Class for Quiz:</label>
            <select
              id="class"
              value={selectedSubject}
              onChange={handleSubjectChange}
              required
            >
              <option value="" disabled>
                Select a class
              </option>
              <option value="XI A3">Physics</option>
              <option value="XI A3">Chemistry</option>
              <option value="XI A3">Mathematics</option>
              <option value="XI A3">Computer</option>
              <option value="XI A3">English</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
