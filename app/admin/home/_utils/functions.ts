import { db } from "@/firebase/clientApp";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ClassRoomDoc, TeacherInClassDoc } from "../_types/ClassRoomDoc";
import { UserContextType } from "@/context/UserContext";

export const handleClassCreation = async (
  formData: ClassRoomDoc,
  subjectList: string[],
  selectedSubject: string,
  refreshClasses: () => void,
  errorMessageSetter: (errorMessage: string) => void,
  teacherData: UserContextType
) => {
  try {
    const docSnap = await getDoc(doc(db, "classrooms", formData.classRoomCode));
    const teacherDetailsDoc: TeacherInClassDoc = {
      teacherName: teacherData.userName,
      teacherEmail: teacherData.userEmail,
      isCreator: true,
      selectedSubject: selectedSubject,
    };
    if (!docSnap.exists()) {
      try {
        await setDoc(doc(db, "classrooms", formData.classRoomCode), formData); //add class document
        await setDoc(
          doc(
            db,
            `classrooms/${formData.classRoomCode}/teachers/${teacherData.userName}`
          ),
          teacherDetailsDoc
        ); //add teacher
        subjectList.forEach(async (subjectName) => {
          await setDoc(
            doc(
              db,
              `classrooms/${formData.classRoomCode}/subjects/${subjectName}`
            ),
            {
              subjectName: subjectName,
              relatedTeacherName: "",
            }
          );
        }); //add all subjects
        await updateDoc(
          doc(
            db,
            `classrooms/${formData.classRoomCode}/subjects/${selectedSubject}`
          ),
          {
            relatedTeacherName: teacherData.userName,
          }
        ); //update teacher name
        refreshClasses();
      } catch (error: any) {
        let errorMessage = error.message;
        errorMessageSetter(errorMessage);
      }
    } else {
      let errorMessage = "Classroom already exists.";
      errorMessageSetter(errorMessage);
    }
  } catch (error: any) {
    errorMessageSetter(error.message);
  }
};

export const handleClassJoin = async (
  formData: ClassRoomDoc,
  selectedSubject: string,
  refreshClasses: () => void,
  errorMessageSetter: (errorMessage: string) => void,
  teacherData: UserContextType
) => {
  const classSnap = await getDoc(doc(db, "classrooms", formData.classRoomCode));
  if (classSnap.exists()) {
    if (teacherData && formData) {
      const teacherSnap = await getDoc(
        doc(
          db,
          `classrooms/${formData.classRoomCode}/teachers/${teacherData.userName}`
        )
      );
      if (!teacherSnap.exists()) {
        try {
          const teacherDetailsDoc: TeacherInClassDoc = {
            teacherName: teacherData.userName,
            teacherEmail: teacherData.userEmail,
            isCreator: false,
            selectedSubject: selectedSubject,
          };
          await setDoc(
            doc(
              db,
              `classrooms/${formData.classRoomCode}/teachers/${teacherData.userName}`
            ),
            teacherDetailsDoc
          );
          const teacherNameSnap = await getDoc(
            doc(
              db,
              `classrooms/${formData.classRoomCode}/subjects/${selectedSubject}`
            )
          );
          if(teacherNameSnap.exists() && teacherNameSnap.data().relatedTeacherName == ""){
            await updateDoc(
              doc(
                db,
                `classrooms/${formData.classRoomCode}/subjects/${selectedSubject}`
              ),
              { relatedTeacherName: teacherData.userName }
            );
          }
          else{
            errorMessageSetter("Teacher already exists in selected subject.")
          }
          
        } catch (error: any) {
          errorMessageSetter(error.message);
        }
      } else {
        errorMessageSetter("You are already in class.");
      }
    }
  } else {
    errorMessageSetter("Classroom not created.");
  }
};
