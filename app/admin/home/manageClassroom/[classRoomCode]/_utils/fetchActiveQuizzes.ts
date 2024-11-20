import { QuestionConstructType } from "../_types/quizTypes";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/firebase/clientApp";

export const fetchActiveQuizzes = async (
  classCode: string,
  selectedSubject: string
): Promise<QuestionConstructType[]> => {
  if (!classCode || !selectedSubject) {
    throw new Error("Invalid arguments: classCode and selectedSubject are required.");
  }

  try {
    const quizObjectList: QuestionConstructType[] = [];
    const q = query(
      collection(
        db,
        `/classrooms/${classCode}/subjects/${selectedSubject}/quizzes`
      )
    );

    const quizSnap = await getDocs(q);

    quizSnap.forEach((doc) => {
      const data = doc.data() as QuestionConstructType;
      quizObjectList.push(data);
    });

    return quizObjectList;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw new Error("Failed to fetch quizzes. Please try again later.");
  }
};
  