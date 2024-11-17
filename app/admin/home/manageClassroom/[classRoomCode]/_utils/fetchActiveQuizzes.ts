import { QuestionConstructType } from "../_types/quizTypes";
import {
  collection,
  getDocs,
  query,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase/clientApp";

export const fetchActiveQuizzes = async (
  classCode: string,
  selectedSubject: string
): Promise<QuestionConstructType[]> => {
  const quizObjectList: QuestionConstructType[] = []; 
  const q = query(
    collection(
      db,
      `/classrooms/${classCode}/subjects/${selectedSubject}/quizzes`
    )
  );
  const quizSnap = await getDocs(q);

  quizSnap.forEach((doc: QueryDocumentSnapshot) => {
    quizObjectList.push(doc.data() as QuestionConstructType); 
  });

  return quizObjectList;
};
