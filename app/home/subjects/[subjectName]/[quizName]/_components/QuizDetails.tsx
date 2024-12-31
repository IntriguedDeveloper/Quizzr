import { QuestionConstructType } from "@/app/admin/home/manageClassroom/[classRoomCode]/_types/quizTypes";
import { QuizDetailsType } from "../page";

export default function QuizDetails({
	quizDetails,
	quizQuestions,
}: {
	quizDetails: QuizDetailsType;
	quizQuestions: QuestionConstructType[];
}) {
	const randIndex = randomIntFromInterval(0, quizQuestions.length - 1);

	return (
		<div className="flex flex-col justify-normal h-full w-full bg-white lg:rounded-lg p-4">
			<h1 className="text-center text-3xl font-semibold text-blue-600 mb-4">
				{quizDetails.title}
			</h1>

			<div className="border border-blue-400 rounded-md pr-4 pl-4 pt-2 pb-2 relative">
				<div className="absolute top-2 left-2 text-md font-bold text-gray-500">
					{randIndex + 1}/{quizQuestions.length}
				</div>
				<div className="absolute top-2 right-2 text-md font-bold text-orange-500">
					FM = {quizDetails.fullMarks}
				</div>
				<div className="flex justify-center items-center h-max flex-col">
					<h1 className="font-bold text-2xl mb-5">
						Question Preview
					</h1>
					<div className="w-full bg-gray-200 rounded-lg p-5 text-lg flex justify-center ">
						{quizQuestions[randIndex].QuestionTitle}
					</div>
					<div className="flex flex-col justify-around items-center bg-slate-300 mt-2 rounded-lg p-2 w-full h-max">
						{quizQuestions[randIndex].AnswerChoices.map(
							(option) => (
								<div className="bg-white rounded-md w-full p-2 text-lg m-1">
									{option.choiceContent}
								</div>
							)
						)}
					</div>
				</div>
			</div>
			<div className="w-full h-max flex justify-end items-center">
				<div className="text-md font-medium text-black">
					Creator Name
				</div>
			</div>
			<div className="flex justify-between mt-6">
				<button className="px-4 py-2 border border-red-400 text-red-500 rounded-md hover:bg-red-100">
					Close Preview
				</button>
				<button className="px-4 py-2 border-red-600 border-2 text-red-600 rounded-md font-bold hover:text-white hover:bg-red-600">
					Attempt Quiz 🚀
				</button>
			</div>
		</div>
	);
}

type TimeStringParserReturnObject = {
	hours: number;
	minutes: number;
	seconds: number;
};
export function TimeStringParser(TimeString: string) {
	let newStringList = TimeString.split(":");
	let hours = parseInt(newStringList[0]);
	let minutes = parseInt(newStringList[1]);
	let seconds = parseInt(newStringList[2]);
	return { hours, minutes, seconds } as TimeStringParserReturnObject;
}
function randomIntFromInterval(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
