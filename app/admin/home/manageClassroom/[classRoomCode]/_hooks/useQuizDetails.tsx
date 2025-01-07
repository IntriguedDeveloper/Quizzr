import useSWR, { SWRConfiguration } from "swr";
import { ClassRoomContextType } from "./useClassDetails";
import {
	fetchActiveQuizzes,
	FetchActiveQuizzesResult,
} from "../_utils/fetchActiveQuizzes";

export function useQuizDetails(
	classCode: string | null,
	classDetails: ClassRoomContextType | null,
	config?: SWRConfiguration<FetchActiveQuizzesResult>
) {
	const fetcher = async ([classCode, selectedSubject]: [string, string]) => {
		if (!classCode || !selectedSubject) {
			throw new Error(
				"Invalid arguments: classCode and selectedSubject are required."
			);
		}
		const result = await fetchActiveQuizzes(classCode, selectedSubject);
		if (!result.success) {
			throw new Error(result.error || "Failed to fetch quizzes.");
		}
		return result;
	};

	const { data, error } = useSWR<FetchActiveQuizzesResult>(
		classDetails?.selectedSubject && classCode
			? [classCode, classDetails.selectedSubject]
			: null,
		fetcher,
		config
	);

	const isLoading = !data && !error;
	const isError = !!error;

	return {
		success: data?.success ?? false,
		quizzes: data?.data,
		error: error?.message ?? null,
		isLoading,
		isError,
	};
}
