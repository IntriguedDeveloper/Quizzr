import { useState, useEffect } from "react";
import { useUserContext } from "@/app/context/UserContext";
import { useClassCode } from "./useClassCode";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/clientApp";

type JoinedClassroomDetailsType = {
	classCode: string;
	className: string;
	classCreator: string;
	hasJoined: boolean;
};

export function useJoinedClassroomDetails() {
	const userDetails = useUserContext();
	const { data: classCode, isClassCodeLoading } = useClassCode(
		userDetails.userID
	);

	const [joinedClassroomDetails, setJoinedClassroomDetails] =
		useState<JoinedClassroomDetailsType | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchJoinedClassroomDetails = async () => {
			setIsLoading(true);
			if (!classCode && typeof classCode !== "undefined") {
				setJoinedClassroomDetails({
					classCode: "",
					className: "",
					classCreator: "",
					hasJoined: false,
				});
				setIsLoading(false);
				return;
			}

			try {
				const docSnapshot = await getDoc(
					doc(db, "classrooms", classCode)
				);
				if (docSnapshot.exists()) {
					const data = (await docSnapshot.data()) as Omit<
						JoinedClassroomDetailsType,
						"hasJoined"
					>;
					setJoinedClassroomDetails({ ...data, hasJoined: true });
				}
			} catch (err) {
				setJoinedClassroomDetails(null);
			} finally {
				setIsLoading(false);
			}
		};

		fetchJoinedClassroomDetails();
	}, [classCode]);

	return { joinedClassroomDetails, isLoading, error };
}
