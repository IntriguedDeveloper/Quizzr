"use client";
import SubjectCard from "../_components/SubjectCard";
import { useAvailableSubjects } from "../hooks/useAvailableSubjects";

export default function AvailableQuizzes() {
	const { subjects, isLoading, isError } = useAvailableSubjects();
	return (
		<>
			<div className="lg:w-[60%] w-full p-4 border rounded-lg shadow-md bg-white h-full">
				<h2 className="text-lg font-semibold mb-4 mt-2">
					Available Subjects
				</h2>
				<div className="flex flex-col flex-auto">
					{isLoading && <div>Loading....</div>}
					{subjects &&
						subjects.map((subjectObject) => (
							<SubjectCard
								key={subjectObject.subjectName}
								subjectName={subjectObject.subjectName}
								availableQuizzes={
									subjectObject.availableQuizzes
								}
							/>
						))}
				</div>
			</div>
		</>
	);
}
