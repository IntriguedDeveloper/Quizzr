"use client";
import { QuestionConstructType } from "@/app/admin/home/manageClassroom/[classRoomCode]/_types/quizTypes";
import { QuizDetailsType } from "../page";
import useSWR from "swr";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { useRouter } from "next/navigation";

export default function QuizDetails({
	quizDetails,
	quizQuestions,
	classCode,
	previewToggler,
}: {
	quizDetails: QuizDetailsType;
	quizQuestions: QuestionConstructType[];
	classCode: string;
	previewToggler: () => void;
}) {
	const router = useRouter();
	type dataType = {
		creatorName: string | undefined;
	};
	const { data, error } = useSWR<dataType>(
		classCode ? classCode : null,
		async (): Promise<dataType> => {
			const docSnap = await getDoc(doc(db, "classrooms", classCode));
			if (docSnap.exists()) {
				const creatorName = docSnap.data().classCreator;
				return { creatorName };
			}
			return { creatorName: undefined };
		}
	);

	const randIndex = randomIntFromInterval(0, quizQuestions.length - 1);
	const parsedTimeObject = TimeStringParser(quizDetails.timeDuration);
	const timeDurationString = TimeObjectSlicer(parsedTimeObject);

	return (
		<div className="flex flex-col justify-normal h-full w-full bg-white lg:rounded-lg lg:p-4 p-2 relative">
			<h1 className="text-center text-3xl font-semibold text-blue-600 mb-4">
				{quizDetails.title}
			</h1>
			<div className="border border-blue-400 rounded-md pr-4 pl-4 pt-2 pb-2 relative">
				<div className="absolute top-2 left-2 text-md font-bold text-gray-500">
					{randIndex + 1}/{quizQuestions.length}
				</div>
				<div className="absolute top-2 right-2 flex items-center justify-center bg-gray-100 rounded-lg p-2 text-sm lg:text-lg md:text-lg">
					<span className="hidden md:inline">Duration: </span>
					{timeDurationString}
				</div>
				<div className="flex justify-center items-center h-max flex-col">
					<h1 className="font-bold  text-xl lg:text-2xl mb-5">
						Question Preview
					</h1>
					<div className="w-full bg-gray-200 rounded-lg p-5 text-lg flex justify-center">
						{quizQuestions[randIndex].QuestionTitle}
					</div>
					<div className="flex flex-col justify-around items-center bg-slate-300 mt-2 rounded-lg p-2 w-full h-max">
						{quizQuestions[randIndex].AnswerChoices.map(
							(option, index) => (
								<div
									className="bg-white rounded-md w-full p-2 text-lg m-1"
									key={index}
								>
									{option.choiceContent}
								</div>
							)
						)}
					</div>
				</div>
				<div className="flex mt-2 items-center justify-end space-x-2 w-full">
					<div className=" text-md font-bold text-orange-500">
						FM = {quizDetails.fullMarks}
					</div>
					{/* Duration moved below FM */}
				</div>
			</div>
			<div className="w-full h-max flex justify-end items-center mt-2">
				<div className="text-md font-medium text-black">
					Made by : {data?.creatorName}
				</div>
			</div>

			<div className="flex justify-between mt-6">
				<button
					className="px-4 py-2 border border-red-400 text-red-500 rounded-md hover:bg-red-100"
					onClick={() => {
						router.back();
					}}
				>
					Close Preview
				</button>
				<button
					className="px-4 py-2 border-red-600 border-2 text-red-600 rounded-md font-bold hover:text-white hover:bg-red-600"
					onClick={() => {
						previewToggler();
					}}
				>
					Attempt Quiz 🚀
				</button>
			</div>
		</div>
	);
}

export type TimeStringParserReturnObjectType = {
	hours: number;
	minutes: number;
	seconds: number;
};

export function TimeObjectSlicer(
	TimeStringParserObject: TimeStringParserReturnObjectType
) {
	let str = "";
	for (let key in TimeStringParserObject) {
		if (
			TimeStringParserObject[
				key as keyof TimeStringParserReturnObjectType
			] != 0
		) {
			str =
				str +
				` ${
					TimeStringParserObject[
						key as keyof TimeStringParserReturnObjectType
					]
				} ${key}`;
		}
	}
	str.trim();
	return str;
}

export function TimeStringParser(TimeString: string) {
	let newStringList = TimeString.split(":");
	let hours = parseInt(newStringList[0]);
	let minutes = parseInt(newStringList[1]);
	let seconds = parseInt(newStringList[2]);
	return { hours, minutes, seconds } as TimeStringParserReturnObjectType;
}

function randomIntFromInterval(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
