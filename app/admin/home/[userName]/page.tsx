"use client";
import Card from "../../../../_components/Card";
import Navbar from "../../../../_components/Navbar";
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
      <div className="flex flex-col items-center justify-center">
        <h2 className="ml-2 font-sans text-3xl m-5">Welcome {decodedUserName}</h2>
        <div className="flex w-4/5 flex-row items-center justify-evenly flex-wrap lg:space-x-4">
          <Card
            cardHeading="Add a Quiz"
            icon={plusIcon}
            onClick={() => handleClick("/admin/home/addQuiz")} // Corrected path
          />
          <Card cardHeading="Analyze Quiz Results" icon={pieChart} />
          <Card
            cardHeading="View Classroom"
            icon={classRoomIcon}
            onClick={() => handleClick("/admin/home/viewClassRoom")} // Corrected path
          />
        </div>
      </div>
    </>
  );
}
