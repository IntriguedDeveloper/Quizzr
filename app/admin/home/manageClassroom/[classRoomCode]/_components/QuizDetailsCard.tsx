export default function QuizDetailsCard({questionNumberCount }: {questionNumberCount: number}) {
	return (
		<div className="w-full border border-slate-300 shadow-lg rounded-md bg-gradient-to-b from-blue-500 to-blue-600 text-white flex flex-col justify-between col-span-1 overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
			<div className="p-4">
				<h1 className="font-bold text-2xl mb-2">Quiz Title</h1>
				<p className="text-sm text-slate-200 font-semibold">
					No. of Questions : {questionNumberCount}
				</p>
			</div>
			<div className="bg-white h-12 flex items-center justify-center rounded-b-md">
				
			</div>
		</div>
	);
}
