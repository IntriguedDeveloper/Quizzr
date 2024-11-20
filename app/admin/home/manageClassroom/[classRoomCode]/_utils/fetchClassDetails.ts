import { UserContextType, useUserContext } from "@/app/context/UserContext";
import { db } from "@/firebase/clientApp";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { cache } from "react";

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

    try {
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

      // Ensure selectedSubject is fetched before returning
      if (teacherDetails.userName && teacherDetails.isAdmin) {
        const subjectDoc = await getDoc(
          doc(
            db,
            `classrooms/${classRoomCode}/teachers/${teacherDetails.userName}`
          )
        );

        if (subjectDoc.exists()) {
          console.log(subjectDoc.data());
          classRoomDetails = {
            ...classRoomDetails,
            selectedSubject: subjectDoc.data().selectedSubject,
          };
        }
      }

      return classRoomDetails;
    } catch (error) {
      console.error("Error fetching class details or subject:", error);
      return classRoomDetails;
    }
  }
);
