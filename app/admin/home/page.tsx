"use client";
import { db } from "@/firebase/clientApp";
import addClassRoom from "@/public/addClassRoom.png";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  QuerySnapshot,
  setDoc,
  where,
} from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";

import ClassCard from "@/app/admin/_components/ClassCard";
import { useUserContext } from "@/context/UserContext";

type ClassDataObject = {
  classRoomCode: string;
  classRoomName: string;
};

type ClassObject = {
  classDataObject: ClassDataObject;
  optedSubject: string;
};

export default function ClassroomViewer() {
  const teacherData = useUserContext();
  const [isActive, setActive] = useState(false);
  const [formData, setFormData] = useState({
    classRoomName: "",
    classRoomCode: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [relevantClasses, setRelevantClasses] = useState<ClassObject[]>();
  const [loading, setLoading] = useState(true);
  const [refreshClasses, setRefreshClasses] = useState(false); 

  useEffect(() => {
    async function fetchClasses(teacherID: string) {
      try {
        const classesSnapshot = await getDocs(collection(db, "classrooms"));
        if (classesSnapshot.empty) {
          console.log("No classrooms found.");
          setLoading(false);
          return;
        }
        let relevantClasses: ClassObject[] = [];
        for (let i = 0; i < classesSnapshot.docs.length; i++) {
          const classDoc = classesSnapshot.docs[i];
          const teacherDocRef = doc(
            db,
            `classrooms/${classDoc.id}/teachers/${teacherID}`
          );

          const relevantTeacherDocSnapShot = await getDoc(teacherDocRef);

          if (relevantTeacherDocSnapShot.exists()) {
            const obj: ClassObject = {
              classDataObject: classDoc.data() as ClassDataObject,
              optedSubject: relevantTeacherDocSnapShot.data().subject,
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

    if (teacherData.userID) {
      fetchClasses(teacherData.userID);
    }
  }, [teacherData.userID, refreshClasses]); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const uploadObject = formData;
    const docSnap = await getDoc(doc(db, "classrooms", formData.classRoomCode));

    if (!docSnap.exists()) {
      setDoc(doc(db, "classrooms", formData.classRoomCode), uploadObject)
        .then((response) => {
          console.log(response);
          setRefreshClasses((prev) => !prev); 
        })
        .catch((error: any) => {
          setErrorMessage(error.message);
        });
    }
    if (teacherData.userID && formData.classRoomCode) {
      await setDoc(
        doc(
          db,
          `classrooms/${formData.classRoomCode}/teachers`,
          teacherData.userID
        ),
        {
          teacherName: teacherData.userName,
          teacherEmail: teacherData.userEmail,
          teacherUID: teacherData.userID,
        }
      );

      setRefreshClasses((prev) => !prev); 
    }
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
          {relevantClasses?.map((classObject: ClassObject) => (
            <ClassCard
              key={classObject.classDataObject.classRoomCode}
              ClassName={classObject.classDataObject.classRoomName}
              ClassCode={classObject.classDataObject.classRoomCode}
              SelectedSubject={classObject.optedSubject}
              isLoading={false}
            />
          ))}
        </div>
      )}

      <div
        className={`relative w-full lg:w-2/5 h-16 p-4 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 
          ${isActive ? "bg-blue-600 border-2 border-black" : "bg-blue-400"}`}
        onClick={() => setActive(!isActive)}
      >
        <Image
          src={addClassRoom}
          alt="class_img"
          className="h-10 w-10 object-cover"
        />
      </div>

      {isActive && (
        <div className="w-full lg:w-2/5 p-4 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Add Classroom
          </h3>
          <form className="space-y-4 text-center">
            <div>
              <label className="block text-gray-600 font-medium">
                Classroom Name
              </label>
              <input
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter classroom name"
                name="classRoomName"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium">
                Classroom Code
              </label>
              <input
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter classroom code (Eg : 11_A1_2026)"
                name="classRoomCode"
                onChange={handleInputChange}
              />
            </div>

            <button
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              onClick={handleSubmit}
              type="button"
            >
              Create/Join Classroom
            </button>

            <div className="relative h-6">
              {errorMessage && (
                <span className="absolute inset-0 text-red-600 font-semibold text-sm">
                  {errorMessage}
                </span>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
