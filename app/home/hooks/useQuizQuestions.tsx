import useSWR from 'swr';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/clientApp'; // Adjust the import path for your Firebase config
import { QuizDetailsType } from '../subjects/[subjectName]/[quizName]/page';
import { QuestionConstructType } from '@/app/admin/home/manageClassroom/[classRoomCode]/_types/quizTypes';

type QuizDocType = {
  quizQuestions: QuestionConstructType[];
  quizDetails: QuizDetailsType;
  classCode: string;
};

const fetchQuizQuestions = async (
  quizTitle: string,
  subjectName: string,
  userID: string
): Promise<QuizDocType> => {
  try {
    const classCodeDoc = await getDoc(doc(db, 'students', userID));
    if (!classCodeDoc.exists()) {
      throw new Error('No class code found');
    }
    const classCode = classCodeDoc.data().joinedClassroom;
    console.log(classCode);
    console.log(subjectName);
    console.log(quizTitle);

    const quizQuestionsSnapshot = await getDocs(
      collection(
        db,
        'classrooms',
        classCode,
        'subjects',
        subjectName,
        'quizzes',
        quizTitle,
        'questions'
      )
    );

    const quizDetailsDoc = await getDoc(
      doc(
        db,
        'classrooms',
        classCode,
        'subjects',
        subjectName,
        'quizzes',
        quizTitle
      )
    );

    console.log(quizQuestionsSnapshot.docs);
    console.log(quizDetailsDoc.data());

    return {
      quizQuestions: quizQuestionsSnapshot.docs.map(
        (doc) => doc.data() as QuestionConstructType
      ),
      quizDetails: quizDetailsDoc.data() as QuizDetailsType,
      classCode,
    };
  } catch (error) {
    throw error;
  }
};

export const useQuizQuestions = (
  quizTitle: string | null,
  subjectName: string | null,
  userID: string | null
) => {
  const { data, error } = useSWR<QuizDocType>(
    quizTitle && subjectName && userID
      ? [quizTitle, subjectName, userID]
      : null,
    () => fetchQuizQuestions(quizTitle!, subjectName!, userID!)
  );

  return {
    data,
    error,
    isLoading: !data && !error,
  };
};
