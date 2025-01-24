import { db } from "@/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import useSWR from "swr";

export function useClassCode(userID: string | null) {
	const fetcher = async (userID: string) => {
		const docSnap = await getDoc(doc(db, "students", userID));
		if (docSnap.exists()) {
			const classCode = await docSnap.data().joinedClassroom;
			return classCode;
		}

		return null;
	};
	const { data, error, isLoading } = useSWR(userID, fetcher);
	return { data, error, isClassCodeLoading: isLoading };
}
