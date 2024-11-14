"use client";

import { useUserContext } from "@/app/context/UserContext";
import { db } from "@/firebase/clientApp";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export type ClassRoomContextType = {
	classCreator: string | null;
	classCode: string | null;
	className: string | null;
	selectedSubject: string | null;
};

const ClassRoomContext = createContext<ClassRoomContextType>({
	classCreator: null,
	classCode: null,
	className: null,
	selectedSubject: null,
});

export function ClassRoomContextProvider({
	children,
	classRoomCode,
}: {
	children: React.ReactNode;
	classRoomCode: string;
}) {
	
	const [classRoomDetails, setClassRoomDetails] =
		useState<ClassRoomContextType>({
			classCreator: null,
			classCode: null,
			className: null,
			selectedSubject: null,
		});

	const teacherDetails = useUserContext();

	useEffect(() => {
		const fetchData = async () => {
			const classesSnapshot = await getDocs(
				query(
					collection(db, "classrooms"),
					where("classCode", "==", classRoomCode)
				)
			);

			classesSnapshot.forEach((doc) => {
				const classData = doc.data() as ClassRoomContextType;
				setClassRoomDetails((prev) => ({
					...prev,
					classCreator: classData.classCreator,
					classCode: classData.classCode,
					className: classData.className,
				}));
			});

			if (teacherDetails.userName && teacherDetails.isAdmin) {
				const fetchSelectedSubject = async () => {
					try {
						const subjectDoc = await getDocs(
							query(
								collection(db, `classrooms/${classRoomCode}/subjects`),
								where("relatedTeacherName", "==", teacherDetails.userName)
							)
						);
						if (!subjectDoc.empty) {
							setClassRoomDetails((prev) => ({
								...prev,
								selectedSubject: subjectDoc.docs[0].data().subjectName,
							}));
						}
					} catch (error) {
						console.error("Error fetching subject:", error);
					}
				};

				fetchSelectedSubject();
			}
		};

		if (classRoomCode) {
			fetchData();
		}
	}, [teacherDetails, classRoomCode]);

	return (
		<ClassRoomContext.Provider value={classRoomDetails}>
			{children}
		</ClassRoomContext.Provider>
	);
}

export const useClassRoomContext = () => {
	return useContext(ClassRoomContext);
};
