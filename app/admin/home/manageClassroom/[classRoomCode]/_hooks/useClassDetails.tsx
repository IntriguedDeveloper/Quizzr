import { useState, useEffect } from "react";
import { UserContextType } from "@/app/context/UserContext";
import { db } from "@/firebase/clientApp";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export type ClassRoomContextType = {
  classCreator: string | null;
  classCode: string | null;
  className: string | null;
  selectedSubject: string | null;
};

export const useClassDetails = (
  classRoomCode: string | null,
  teacherDetails: UserContextType,
): { classRoomDetails: ClassRoomContextType; loading: boolean; error: string | null } => {
  const [classRoomDetails, setClassRoomDetails] = useState<ClassRoomContextType>({
    classCreator: "",
    classCode: "",
    className: "",
    selectedSubject: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        let fetchedDetails: ClassRoomContextType = {
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
          fetchedDetails = {
            ...fetchedDetails,
            classCreator: classData.classCreator,
            classCode: classData.classCode,
            className: classData.className,
          };
        });

        if (teacherDetails.userName && teacherDetails.isAdmin) {
          const subjectDoc = await getDoc(
            doc(
              db,
              `classrooms/${classRoomCode}/teachers/${teacherDetails.userName}`
            )
          );

          if (subjectDoc.exists()) {
            fetchedDetails = {
              ...fetchedDetails,
              selectedSubject: subjectDoc.data().selectedSubject,
            };
          }
        }

        setClassRoomDetails(fetchedDetails);
      } catch (err) {
        setError("Failed to fetch class details");
        console.error("Error fetching class details or subject:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [classRoomCode, teacherDetails]);

  return { classRoomDetails, loading, error };
};
