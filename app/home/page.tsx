"use client";

import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { FaExternalLinkAlt, FaPersonBooth, FaUser } from "react-icons/fa";
import { useJoinedClassroomDetails } from "./hooks/useJoinedClassroomDetails";

const Home = () => {
	const router = useRouter();
	const userData = useUserContext();

	const [joinedClassroom, setJoinedClassroom] = useState(false);

	const { joinedClassroomDetails, error } = useJoinedClassroomDetails();
	return (
		<div className="flex flex-col items-center p-4 space-y-10 w-full">
			{/* Class Details Section */}
			{joinedClassroomDetails && joinedClassroomDetails.classCode ? (
				<>
					<div className="lg:w-[60%] w-full p-4 border rounded-lg shadow-md bg-white flex justify-center flex-col items-center">
						<h2 className="text-lg font-semibold mb-4">
							Classroom Details
						</h2>
						<p className="text-md text-blue-500 font-semibold">
							{joinedClassroomDetails.className} [
							{joinedClassroomDetails.classCode}]
						</p>
						<p className="text-md text-gray-500 font-medium">
							Class Teacher: {joinedClassroomDetails.classCreator}
						</p>
						<button
							className="mt-4 px-4 py-2 text-slate-600 font-semibold bg-gray-200 rounded-md"
							onClick={() => router.push("/home/join-classroom")}
						>
							Join Other Classroom
						</button>
					</div>
					<div className="flex lg:flex-row flex-col lg:w-[60%] w-full lg:justify-between lg:space-y-0 space-y-10 lg:space-x-3">
						<div
							className="w-full flex flex-row bg-gray-200 p-4 rounded-lg justify-center items-center lg:text-lg font-semibold shadow-[0_8px_40px_rgb(0,0,0,0.12)] hover:shadow-blue-200 shadow-blue-300 cursor-pointer h-18"
							onClick={() =>
								router.push("./home/availableQuizzes")
							}
						>
							Attempt Available Quizzes
							<FaExternalLinkAlt className="m-2" />
						</div>
						<div
							className="w-full flex flex-row bg-gray-200 p-4 rounded-lg justify-center items-center lg:text-lg font-semibold shadow-[0_8px_40px_rgb(0,0,0,0.12)] hover:shadow-blue-200 shadow-blue-300 cursor-pointer h-18"
							onClick={() =>
								router.push("./home/profileDetails")
							}
						>
							View Profile Details
							<FaUser className="m-2" />
						</div>
					</div>
				</>
			) : (
				<div
					className="bg-gray-200 text-black w-56 p-4 flex flex-row items-center justify-center space-x-4 font-semibold text-xl rounded-lg cursor-pointer"
					onClick={() => {
						router.push("/home/join-classroom");
					}}
				>
					<h1>Join a Classroom</h1>
					<FaExternalLinkAlt></FaExternalLinkAlt>
				</div>
			)}
		</div>
	);
};

export default Home;
