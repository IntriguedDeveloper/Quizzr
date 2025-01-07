import QuizBackdrop from "@/public/quizBackdrop.png";
export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="w-full h-full bg-gradient-to-t from-blue-600 to-white flex justify-center lg:items-start">
			<div className="lg:w-[90%] lg:h-full w-full h-full bg-white flex justify-center items-center">
				{children}
			</div>
		</div>
	);
}
