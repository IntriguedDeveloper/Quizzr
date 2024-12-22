import useSWR from "swr";
import { ClassRoomContextType } from "./useClassDetails";
import { fetchActiveQuizzes } from "../_utils/fetchActiveQuizzes";

export function useQuizDetails(
	classCode: string | null,
	classDetails: ClassRoomContextType | null
) {
	const { data: quizObjectList, error } = useSWR(
		classDetails?.selectedSubject
			? [classCode, classDetails.selectedSubject]
			: null,
		([classCode, selectedSubject]) =>
			classCode ? fetchActiveQuizzes(classCode, selectedSubject) : null
	);
	return quizObjectList;
}
