import { QuestionConstructType } from "../_types/quizTypes";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { QuizDetailsType } from "../_types/quizDetails";

export type FetchActiveQuizzesResult = {
  success: boolean;
  data?: QuizDetailsType[];
  error?: string;
};

export const fetchActiveQuizzes = async (
  classCode: string,
  selectedSubject: string
): Promise<FetchActiveQuizzesResult> => {
  if (!classCode || !selectedSubject) {
    return {
      success: false,
      error: "Invalid arguments: classCode and selectedSubject are required.",
    };
  }

  const quizObjectList: QuizDetailsType[] = [];

  try {
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

      return {
        success: true,
        data: quizObjectList,
      };
    } else {
      return {
        success: false,
        error: "No quizzes created.",
      };
    }
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return {
      success: false,
      error: "Failed to fetch quizzes. Please try again later.",
    };
  }
};
