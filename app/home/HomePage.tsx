"use client";
import { useRouter } from "nextjs-toploader/app";
import { useUserContext } from "../context/UserContext";
import {
	FaBook,
	FaClock,
	FaExternalLinkAlt,
	FaTimesCircle,
	FaUser,
} from "react-icons/fa";
import { useJoinedClassroomDetails } from "./hooks/useJoinedClassroomDetails";
import InComponentLoadingSpinner from "./_components/InComponentLoadingSpinner";
import { useClassCode } from "./hooks/useClassCode";
import { useEffect } from "react";

const Home = () => {
	const router = useRouter();
	const userData = useUserContext();
	const { joinedClassroomDetails, error, isLoading } =
		useJoinedClassroomDetails();
	if (isLoading) {
		return <InComponentLoadingSpinner />;
	}

	if (error) {
		return (
			<div className="text-red-600 font-semibold">
				<a>{error.message}</a>
			</div>
		);
	}
	console.log(joinedClassroomDetails)
	return (
		<div className="flex flex-col items-center p-4 space-y-10 w-full">
			{joinedClassroomDetails && (joinedClassroomDetails.hasJoined ? (
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
							className="mt-4 px-4 py-2 text-slate-600 font-semibold bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
							onClick={() => router.push("/home/join-classroom")}
						>
							Join Other Classroom
						</button>
					</div>
					<div className="flex flex-col lg:w-[60%] w-full lg:justify-between space-y-10">
						<div
							className="w-full flex flex-row bg-gray-200 p-4 rounded-lg justify-center items-center lg:text-lg font-semibold shadow-[0_8px_40px_rgb(0,0,0,0.12)] hover:shadow-blue-200 shadow-blue-300 cursor-pointer h-18 transition-all duration-200"
							onClick={() =>
								router.push("./home/availableQuizzes")
							}
						>
							Attempt Available Quizzes
							<FaExternalLinkAlt className="m-2" />
						</div>
						<div
							className="w-full flex flex-row bg-gray-200 p-4 rounded-lg justify-center items-center lg:text-lg font-semibold shadow-[0_8px_40px_rgb(0,0,0,0.12)] hover:shadow-blue-200 shadow-blue-300 cursor-pointer h-18 transition-all duration-200"
							onClick={() => router.push("./home/profileDetails")}
						>
							View Profile Details
							<FaUser className="m-2" />
						</div>
						<div
							className="w-full flex flex-row bg-gray-200 p-4 rounded-lg justify-center items-center lg:text-lg font-semibold shadow-[0_8px_40px_rgb(0,0,0,0.12)] hover:shadow-blue-200 shadow-blue-300 cursor-pointer h-18 transition-all duration-200"
							onClick={() =>
								router.push("./home/attemptedQuizzes")
							}
						>
							View Attempted Quiz Results
							<FaClock className="m-2" />
						</div>
					</div>
				</>
			) : (
				<div
					className="bg-gray-200 text-black w-56 p-4 flex flex-row items-center justify-center space-x-4 font-semibold text-xl rounded-lg cursor-pointer hover:bg-gray-300 transition-colors duration-200"
					onClick={() => router.push("/home/join-classroom")}
				>
					<h1>Join a Classroom</h1>
					<FaExternalLinkAlt />
				</div>
			))}
		</div>
	);
};

export default Home;
