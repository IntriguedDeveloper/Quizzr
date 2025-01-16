"use client";
import { useUserContext } from "@/app/context/UserContext";
import { db } from "@/firebase/clientApp";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import useSWR from "swr";
import useAttemptedQuizzes, {
	AttemptedQuizzesType,
} from "../../hooks/useAttemptedQuizzes";
import InComponentLoadingSpinner from "../../_components/InComponentLoadingSpinner";

type QuizObject = {
	title: string;
	timeDuration: string;
	fullMarks: number;
	noOfQuestions: number;
};

const fetchQuizData = async (userID: string, subjectName: string) => {
	try {
		if (!userID || !subjectName) {
			throw new Error("Missing required parameters.");
		}

		const classCodeDoc = await getDoc(doc(db, "students", userID));
		if (!classCodeDoc.exists()) {
			throw new Error("No class code found.");
		}

		const classCode = classCodeDoc.data().joinedClassroom;
		const quizCollectionRef = collection(
			db,
			"classrooms",
			classCode,
			"subjects",
			subjectName,
			"quizzes"
		);

		const quizQuery = query(quizCollectionRef);
		const quizSnap = await getDocs(quizQuery);
		console.log(quizSnap.docs);
		const docSnapshot = await getDocs(
			collection(
				db,
				"classrooms",
				classCode,
				"students",
				userID,
				"attempted-quizzes"
			)
		);

		if (!docSnapshot.empty) {
			const attemptedQuizzes = docSnapshot.docs.map(
				(doc) => doc.data() as AttemptedQuizzesType
			);
			const attemptedQuizTitles = attemptedQuizzes.map(
				(quiz) => quiz.title
			);
			const filteredDocs = quizSnap.docs
				.map((doc) => doc.data() as QuizObject)
				.filter((quiz) => !attemptedQuizTitles.includes(quiz.title));
			return filteredDocs;
		}
		return quizSnap.docs.map((doc) => doc.data() as QuizObject);
	} catch (error) {
		console.error("Error fetching quiz data:", error);
		throw error;
	}
};
export default function SubjectDetails() {
	const params = useParams<{ subjectName: string }>();
	const { userID } = useUserContext();
	const router = useRouter();

	const {
		data: quizzes,
		error,
		isLoading,
	} = useSWR(
		userID && params.subjectName
			? `quizzes-${userID}-${params.subjectName}`
			: null,
		() => fetchQuizData(userID!, params.subjectName),
		{
			revalidateOnFocus: false,
			dedupingInterval: 5000,
			shouldRetryOnError: false,
		}
	);

	if (isLoading || (!quizzes && !error)) {
		return (
			<InComponentLoadingSpinner></InComponentLoadingSpinner>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 p-6">
				<div className="text-center text-red-600">
					Error loading quizzes. Please try again later.
				</div>
			</div>
		);
	}

	function handleQuizClick(
		event: React.MouseEvent<HTMLDivElement, MouseEvent>,
		quizTitle: string
	): void {
		router.push(`/home/subjects/${params.subjectName}/${quizTitle}`);
	}

	return (
		<div className="min-h-screen bg-gray-50 p-6 w-full">
			<h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
				{params.subjectName}
			</h1>

			{quizzes && quizzes.length > 0 ? (
				<div className="flex flex-wrap gap-6 justify-center">
					{quizzes.map((quiz) => (
						<div
							key={quiz.title}
							className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] p-4 bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300"
							onClick={(event) =>
								handleQuizClick(event, quiz.title)
							}
						>
							<h2 className="text-xl font-semibold text-gray-700 mb-2">
								{quiz.title}
							</h2>
							<p className="text-sm text-gray-500">
								<span className="font-medium">
									Time Duration:
								</span>{" "}
								{quiz.timeDuration}
							</p>
							<p className="text-sm text-gray-500">
								<span className="font-medium">Full Marks:</span>{" "}
								{quiz.fullMarks}
							</p>
							<p className="text-sm text-gray-500">
								<span className="font-medium">
									No of Questions:
								</span>{" "}
								{quiz.noOfQuestions}
							</p>
						</div>
					))}
				</div>
			) : (
				<div className="text-center text-gray-500">
					No quizzes available.
				</div>
			)}
		</div>
	);
}
