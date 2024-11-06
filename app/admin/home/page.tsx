"use client";
import { db } from "@/firebase/clientApp";
import addClassRoom from "@/public/addClassRoom.png";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import findError from "@/public/findError.png";
import ClassCard from "@/app/admin/_components/ClassCard";
import { useUserContext } from "@/context/UserContext";
import Dropdown from "./_components/Dropdown";

type ClassDataObject = {
  classCode: string;
  className: string;
};

type ClassObject = {
  classDataObject: ClassDataObject;
  optedSubject: string;
};

export default function ClassroomViewer() {
  const teacherData = useUserContext();
  const [isActive, setActive] = useState(false);

  const [relevantClasses, setRelevantClasses] = useState<ClassObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshClasses, setRefreshClasses] = useState(false);

  useEffect(() => {
    async function fetchClasses(teacherName: string) {
      try {
        const classesSnapshot = await getDocs(collection(db, "classrooms"));
        if (classesSnapshot.empty) {
          setLoading(false);
          return;
        }
        let relevantClasses: ClassObject[] = [];
        for (const classDoc of classesSnapshot.docs) {
          const teacherDocRef = doc(
            db,
            `classrooms/${
              classDoc.data().classCode
            }/teachers/${teacherName}`
          );
          const relevantTeacherDocSnapShot = await getDoc(teacherDocRef);
          if (relevantTeacherDocSnapShot.exists()) {
            const obj: ClassObject = {
              classDataObject: classDoc.data() as ClassDataObject,
              optedSubject: relevantTeacherDocSnapShot.data().selectedSubject,
            };
            relevantClasses.push(obj);
          }
        }
        setRelevantClasses(relevantClasses);
      } catch (error) {
        console.error("Error fetching classrooms:", error);
      } finally {
        setLoading(false);
      }
    }

    if (teacherData.userName) {
      fetchClasses(teacherData.userName);
    }
  }, [teacherData.userName, refreshClasses]);
  const refreshClassesSetter = () => {
    setRefreshClasses(true);
  };
  return (
    <div className="p-6 space-y-6 flex-col flex justify-center items-center w-5/6 flex-shrink-0">
      <h2 className="text-color-primary text-2xl font-semibold lg:text-3xl">
        Manage Classrooms
      </h2>

      {loading ? (
        <ClassCard isLoading={true} />
      ) : (
        <div className="flex flex-wrap gap-6 w-full justify-center">
          {relevantClasses.length > 0 ? (
            relevantClasses.map((classObject: ClassObject) => (
              <ClassCard
                key={classObject.classDataObject.classCode}
                ClassName={classObject.classDataObject.className}
                ClassCode={classObject.classDataObject.classCode}
                SelectedSubject={classObject.optedSubject}
                isLoading={false}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-red-500 font-bold">
              <Image src={findError} alt="errorImage" className="h-40 w-40" />
              <span className="text-2xl">No existing classes found.</span>
            </div>
          )}
        </div>
      )}

      <div
        className={`relative w-full lg:w-2/5 h-16 p-4 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 ${
          isActive ? "bg-blue-600 border-2 border-black" : "bg-blue-400"
        }`}
        onClick={() => setActive(!isActive)}
      >
        <Image
          src={addClassRoom}
          alt="class_img"
          className="h-10 w-10 object-cover"
        />
      </div>

      {isActive && <Dropdown refreshClassesSetter={refreshClassesSetter} />}
    </div>
  );
}
