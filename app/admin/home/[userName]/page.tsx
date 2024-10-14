"use client";
import styles from "../home.module.css";
import Card from "../_components/Card";
import Navbar from "../_components/Navbar";
import plusIcon from "@/public/plusIcon.png";
import pieChart from "@/public/pieChart.png";
import classRoomIcon from "@/public/classRoom.png";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
export default function HomePage() {
  const router = useRouter();
  const params = useParams<{ userName: string }>();
  const userName = params.userName;
  const decodedUserName = decodeURIComponent(userName);
  const handleClick = (pathName: string) => {
    router.push(pathName);
  };
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2>Welcome {decodedUserName}</h2>
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
