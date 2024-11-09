import { useState } from "react";

export function QuestionCard({ currentIndex }: { currentIndex?: number }) {
	const [optionsList, setOptionsList] = useState([
		"Lorem",
		"Ipsum",
		"Dior",
		"Solus",
	]);
	//TODO : map the options
	return (
		<div className="flex flex-col p-5 lg:w-3/5 w-full h-full mt-2 justify-center items-center bg-indigo-200 rounded-lg">
			<div className="w-full">
				<textarea
					className="resize-none w-full p-2 h-12 rounded-md"
					placeholder="Type question here ..."
				></textarea>
			</div>
			<div className="bg-white rounded-lg p-2 w-full flex-col flex items-center justify-center mt-2">
				<div className="w-full border-2 rounded-sm flex flex-row">
					<div className="h-full p-2">1.</div>
					<input className="w-full p-1" placeholder="Enter Option"></input>
				</div>
				<div className="w-full border-2 rounded-sm flex flex-row">
					<div className="h-full p-2">2.</div>
					<input className="w-full p-1" placeholder="Enter Option"></input>
				</div>
				<div className="w-full border-2 rounded-sm flex flex-row">
					<div className="h-full p-2">3.</div>
					<input className="w-full p-1" placeholder="Enter Option"></input>
				</div>
				<div className="w-full border-2 rounded-sm flex flex-row">
					<div className="h-full p-2">4.</div>
					<input className="w-full p-1" placeholder="Enter Option"></input>
				</div>
				
			</div>
			<div className="flex flex-row mt-5">
				<button className="mr-2 ml-2 bg-slate-500 text-white p-2 rounded-lg hover:bg-slate-400 hover:text-black">Previous Question</button>
				<button className="mr-2 ml-2 bg-slate-500 text-white p-2 rounded-lg hover:bg-slate-400 hover:text-black">Next Question</button>
				
			</div>
		</div>
	);
}
