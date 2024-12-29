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
			className="w-max h-max flex flex-col rounded-lg border-2 border-blue-500 m-5 shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:shadow-[0_10px_20px_rgba(240,_46,_170,_0.7)] hover:scale-105 ransition-transform duration-100 cursor-pointer"
			onClick={() => {router.push('/home/subjects/'+subjectName)}}
		>
			<div>
				<h1 className="text-xl p-2">{subjectName}</h1>
			</div>
			<div className="bg-blue-500 text-white p-5">
				<h1 className="font-bold ">
					Available Quizzes : {availableQuizzes}
				</h1>
			</div>
		</div>
	);
}
