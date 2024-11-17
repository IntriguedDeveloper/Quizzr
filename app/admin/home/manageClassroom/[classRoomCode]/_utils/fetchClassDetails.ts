
import { UserContextType, useUserContext } from "@/app/context/UserContext";
import { db } from "@/firebase/clientApp";
import { collection, getDocs, query, where } from "firebase/firestore";
import { cache, createContext, useContext, useEffect, useState } from "react";

export type ClassRoomContextType = {
	classCreator: string | null;
	classCode: string | null;
	className: string | null;
	selectedSubject: string | null;
};

export const fetchClassDetails = cache(
	async (classRoomCode: string, teacherDetails: UserContextType) => {
		let classRoomDetails: ClassRoomContextType = {
			classCreator: "",
			classCode: "",
			className: "",
			selectedSubject: "",
		};
		const classesSnapshot = await getDocs(
			query(
				collection(db, "classrooms"),
				where("classCode", "==", classRoomCode)
			)
		);

		classesSnapshot.forEach((doc) => {
			const classData = doc.data() as ClassRoomContextType;
			classRoomDetails = {
				...classRoomDetails,
				classCreator: classData.classCreator,
				classCode: classData.classCode,
				className: classData.className,
			};
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
						classRoomDetails = {
							...classRoomDetails,
							selectedSubject: subjectDoc.docs[0].data().subjectName,
						};
					}
				} catch (error) {
					console.error("Error fetching subject:", error);
				}
			};

			fetchSelectedSubject();
		}
		return classRoomDetails;
	}
);
