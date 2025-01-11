"use client";
import { useUserContext } from "@/app/context/UserContext";
import { useClassCode } from "@/app/home/hooks/useClassCode";
import { db } from "@/firebase/clientApp";
import { collection, getDocs } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import useSWR from "swr";
import { ResultCalculatorReturnType } from "./utils";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AnalyseResults() {
	const router = useRouter();
	const params = useParams<{ quizName: string; subjectName: string }>();
	const userDetails = useUserContext();
	const classCode = useClassCode(userDetails.userID).data;

	const { data, error } = useSWR<ResultCalculatorReturnType | null>(
		params.quizName && userDetails.userID && classCode
			? params.quizName
			: null,
		async (): Promise<ResultCalculatorReturnType | null> => {
			const docSnap = await getDocs(
				collection(
					db,
					`classrooms/${classCode}/students/${
						userDetails.userID
					}/attempted-quizzes/${decodeURIComponent(
						params.quizName
					)}/quiz-result`
				)
			);
			if (!docSnap.empty) {
				return docSnap.docs[0].data() as ResultCalculatorReturnType;
			}
			return null;
		}
	);

	const [chartData, setChartData] = useState<any | null>(null);

	useEffect(() => {
		if (data) {
			setChartData({
				labels: ["Correct", "Incorrect", "Unattempted"],
				datasets: [
					{
						label: "Quiz Performance",
						data: [
							data.noOfQuestionsCorrect,
							data.noOfQuestionsIncorrect,
							data.totalNoOfQuestions -
								data.noOfQuestionsAttempted,
						],
						backgroundColor: ["#4CAF50", "#F44336", "#FFC107"],
						borderWidth: 1,
						hoverOffset: 10,
					},
				],
			});
		}
	}, [data]);

	if (error) {
		return <div className="text-red-500">Failed to load results.</div>;
	}

	if (!data) {
		return <div className="text-gray-500">Loading results...</div>;
	}

	return (
		<div className="flex flex-col items-center justify-start w-full h-full relative">
			<h1 className="text-3xl font-bold text-center text-indigo-600 mt-6">
				"{decodeURIComponent(params.quizName)}" Quiz Results
			</h1>

			{chartData && (
				<div className="mt-8">
					<Pie
						data={chartData}
						options={
							{
								responsive: true,
								plugins: {
									legend: {
										position: "bottom",
										labels: {
											font: {
												size: 14,
												family: "Arial",
											},
											color: "#4B5563",
										},
									},
									animations: {
										animateScale: true,
										duration: 1500,
										easing: "easeOutBounce",
									},
									tooltip: {
										backgroundColor: "#1F2937",
										bodyFont: {
											family: "Arial",
											size: 14,
										},
										callbacks: {
											label: function (tooltipItem: any) {
												const value = tooltipItem.raw;
												return `${tooltipItem.label}: ${value}`;
											},
										},
									},
								},
							} as any
						}
					/>
				</div>
			)}
			<div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8 flex flex-col items-center">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
					<div className="bg-indigo-50 p-4 rounded-md shadow-md">
						<p className="text-sm text-gray-600">Marks Received</p>
						<p className="text-2xl font-semibold text-indigo-700">
							{data.marksReceived}
						</p>
					</div>

					<div className="bg-indigo-50 p-4 rounded-md shadow-md">
						<p className="text-sm text-gray-600">Full Marks</p>
						<p className="text-2xl font-semibold text-indigo-700">
							{data.fullMarks}
						</p>
					</div>

					<div className="bg-indigo-50 p-4 rounded-md shadow-md">
						<p className="text-sm text-gray-600">
							Questions Attempted
						</p>
						<p className="text-2xl font-semibold text-indigo-700">
							{data.noOfQuestionsAttempted}
						</p>
					</div>

					<div className="bg-indigo-50 p-4 rounded-md shadow-md">
						<p className="text-sm text-gray-600">
							Questions Correct
						</p>
						<p className="text-2xl font-semibold text-green-600">
							{data.noOfQuestionsCorrect}
						</p>
					</div>

					<div className="bg-indigo-50 p-4 rounded-md shadow-md">
						<p className="text-sm text-gray-600">
							Questions Incorrect
						</p>
						<p className="text-2xl font-semibold text-red-600">
							{data.noOfQuestionsIncorrect}
						</p>
					</div>

					<div className="bg-indigo-50 p-4 rounded-md shadow-md">
						<p className="text-sm text-gray-600">Total Questions</p>
						<p className="text-2xl font-semibold text-indigo-700">
							{data.totalNoOfQuestions}
						</p>
					</div>
				</div>

				<div className="bg-indigo-100 p-4 rounded-md shadow-md mt-6 w-full">
					<p className="text-sm text-gray-600">Time Taken</p>
					<p className="text-xl font-semibold text-indigo-700">
						{data.displayTimeTaken}
					</p>
				</div>
				<button
					className="bg-blue-600 text-white font-semibold rounded-lg p-4 mt-4 mb-4 w-full"
					onClick={() => {
						router.push("/home/availableQuizzes");
					}}
				>
					Attempt Another Quiz
				</button>
			</div>
		</div>
	);
}
