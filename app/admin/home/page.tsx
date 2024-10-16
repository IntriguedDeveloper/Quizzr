"use client";
import { useEffect, useState } from "react";
import styles from "./home.module.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/clientApp";
import { getDocs, where, query, collection } from "firebase/firestore";
import Card from "./_components/Card";
import Navbar from "./_components/Navbar";
import plusIcon from "@/public/plusIcon.png";
import pieChart from "@/public/pieChart.png";
import classRoomIcon from "@/public/classRoom.png";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();
  const handleClick = (pathName: string) => {
    router.push(pathName);
  };
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2>Welcome {userName}</h2>
        <div className={styles.cardContainer}>
          <Card
            cardHeading="Add a Quiz"
            icon={plusIcon}
            onClick={() => handleClick("./home/addQuiz")}
          />
          <Card cardHeading="Analyze Quiz Results" icon={pieChart} />
          <Card
            cardHeading="View Classroom"
            icon={classRoomIcon}
            onClick={() => {
              handleClick("./home/viewClassRoom");
            }}
          />
        </div>
      </div>
    </>
  );
}
