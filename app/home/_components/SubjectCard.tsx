import { useRouter } from "next/navigation";

export default function SubjectCard({
	subjectName,
	availableQuizzes,
}: {
	subjectName: string;
	availableQuizzes: number;
}) {
	const router = useRouter();
	return (
		<div
			className="flex flex-col items-center justify-between rounded-xl border border-gray-300 m-5 shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-200 cursor-pointer overflow-hidden"
			onClick={() => {
				router.push('/home/subjects/' + subjectName);
			}}
		>
			<div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 w-full h-2"></div>
			<div className="p-6 flex-1 flex flex-col items-center justify-center">
				<h1 className="text-2xl font-bold text-gray-800 text-center">{subjectName}</h1>
			</div>
			<div className="bg-gray-200 w-full py-4 flex justify-center items-center">
				<h1 className="text-lg font-semibold text-gray-700">Available Quizzes: {availableQuizzes}</h1>
			</div>
		</div>
	);
}
