"use client";
import { useEffect } from "react";
import plusIcon from "@/public/plusIcon.png";
import pieChart from "@/public/pieChart.png";
import classRoomIcon from "@/public/classRoom.png";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import Card from "@/app/admin/_components/Card";

export default function HomePage() {
  const router = useRouter();
  const userData = useUserContext();
  const userName = userData.userName;
  useEffect(() => {
    router.prefetch(`/admin/${userName}/manageClassRoom`);
    router.prefetch(`/admin/${userName}/addQuiz`);
    router.prefetch(`/admin/${userName}/analyzeResults`);
  }, [router]);

  const handleClick = (pathName: string) => {
    router.push(pathName);
  };

  return (
    <>
      <div
        className={`flex flex-col items-center justify-center transition-all duration-300 p-5`}
      >
        <h2 className="ml-2 font-sans text-3xl lg:ml-5">Welcome {userName}</h2>
        <div className="flex w-4/5 flex-row items-center justify-evenly flex-wrap lg:space-x-4">
          <Card
            cardHeading="Add a Quiz"
            icon={plusIcon}
            onClick={() => handleClick(`./${userName}/addQuiz`)}
          />
          <Card
            cardHeading="Analyze Quiz Results"
            icon={pieChart}
            onClick={() => handleClick(`./${userName}/analyzeResults`)} // Added path for analyzing results
          />
          <Card
            cardHeading="View Classroom"
            icon={classRoomIcon}
            onClick={() => handleClick(`./${userName}/manageClassRoom`)}
          />
          
        </div>
      </div>
    </>
  );
}
