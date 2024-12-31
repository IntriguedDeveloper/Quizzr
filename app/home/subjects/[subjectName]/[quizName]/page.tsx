"use client"
import { QuestionConstructType } from "@/app/admin/home/manageClassroom/[classRoomCode]/_types/quizTypes";
import { UserContextType, useUserContext } from "@/app/context/UserContext";
import { db } from "@/firebase/clientApp";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import QuizDetails from "./_components/QuizDetails";
export type QuizDetailsType = {
	title: string;
	timeDuration: string;
	fullMarks: number;
	noOfQuestions: number;
};
type QuizDocType = {
	quizQuestions: QuestionConstructType[];
	quizDetails: QuizDetailsType;
};
async function QuizQuestionsFetcher(
	quizTitle: string,
	subjectName: string,
	userID: string
): Promise<QuizDocType> {
	try {
		const classCodeDoc = await getDoc(doc(db, "students", userID));
		if (!classCodeDoc.exists()) {
			throw new Error("No class code found");
		}
		const classCode = classCodeDoc.data().joinedClassroom;
        console.log(classCode);
        console.log(subjectName);
        console.log(quizTitle);
		const quizQuestions = await getDocs(
			collection(
				db,
				"classrooms",
				classCode,
				"subjects",
				subjectName,
				"quizzes",
				quizTitle,
				"questions"
			)
		);
        console.log(quizQuestions.docs)
		const quizDetails = await getDoc(
			doc(
				db,
				"classrooms",
				classCode,
				"subjects",
				subjectName,
				"quizzes",
				quizTitle
			)
		);
        console.log(quizDetails.data())
       
		return {
			quizQuestions: quizQuestions.docs.map(
				(doc) => doc.data() as QuestionConstructType
			),
			quizDetails: quizDetails.data() as QuizDetailsType,
		};
	} catch (error) {
		throw error;
	}
}
export default function QuizComponent() {
    const [quizAttemptMode, setQuizAttemptMode] = useState<boolean>(false);
	const userDetails = useUserContext();
	let params = useParams<{ subjectName: string; quizName: string }>();
    params.quizName = decodeURIComponent(params.quizName);  //quizName has a whitespace in it, so decode it
    console.log(params);
	const { data, error } = useSWR<QuizDocType>(
		userDetails.userID
			? [params.quizName, params.subjectName, userDetails.userID]
			: null,
		() =>
			QuizQuestionsFetcher(
				params.quizName,
				params.subjectName,
				userDetails.userID!
			)
	);

	return (<>
        {
            quizAttemptMode ? <div>Attempt Quiz</div> : (data?.quizDetails && data.quizQuestions) && <QuizDetails quizDetails = {data?.quizDetails} quizQuestions = {data?.quizQuestions}></QuizDetails>
        }
       
        
    </>);
}
