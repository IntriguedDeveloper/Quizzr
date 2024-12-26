import { QuestionConstructType } from "../_types/quizTypes";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { QuizDetails, QuizDetailsType } from "../_types/quizDetails";

export const fetchActiveQuizzes = async (
  classCode: string,
  selectedSubject: string
): Promise<QuizDetailsType[]> => {
  if (!classCode || !selectedSubject) {
    throw new Error(
      "Invalid arguments: classCode and selectedSubject are required."
    );
  }

  try {
    const quizObjectList: QuizDetailsType[] = [];
    const q = query(
      collection(
        db,
        `/classrooms/${classCode}/subjects/${selectedSubject}/quizzes`
      )
    );

    const quizSnap = await getDocs(q);
    if (!quizSnap.empty) {
      quizSnap.forEach((doc) => {
        const data = doc.data() as QuizDetailsType;
        quizObjectList.push(data);
      });
    } else {
      throw new Error("No quizzes created.");
    }

    return quizObjectList;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw new Error("Failed to fetch quizzes. Please try again later.");
  }
};