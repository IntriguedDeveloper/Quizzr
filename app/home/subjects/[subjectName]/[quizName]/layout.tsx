import QuizBackdrop from "@/public/quizBackdrop.png";
export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="w-full h-full bg-gradient-to-t from-blue-600 to-white flex justify-center lg:items-start">
			<div className="lg:w-[90%] lg:h-[90%] w-full h-full bg-white lg:rounded-lg shadow-lg lg:border-2 border-gray-400 flex justify-center items-center">
				{children}
			</div>
		</div>
	);
}
