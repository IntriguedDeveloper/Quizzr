import { useUserContext } from "@/app/context/UserContext";
import { useClassCode } from "./useClassCode";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import useSWR from "swr";
type JoinedClassroomDetailsType = {
	classCode: "";
	className: "";
	classCreator: "";
};
export function useJoinedClassroomDetails() {
	const userDetails = useUserContext();
	const { data: classCode } = useClassCode(userDetails.userID);
	async function getJoinedClassroomDetails(
		classCode: string
	): Promise<JoinedClassroomDetailsType | null> {
		if (classCode && userDetails.userID) {
			const docSnapshot = await getDoc(doc(db, "classrooms", classCode));
			if (docSnapshot.exists()) {
				const data = docSnapshot.data() as JoinedClassroomDetailsType;
				return data;
			}
		}
		return null;
	}
	const { data, error, isLoading } = useSWR(classCode, () =>
		getJoinedClassroomDetails(classCode)
	);
	return {
		joinedClassroomDetails: data,
		error: error,
		isLoading: isLoading,
	};
}
