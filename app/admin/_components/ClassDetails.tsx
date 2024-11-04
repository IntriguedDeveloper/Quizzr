"use client";
import { useUserContext } from "@/context/UserContext";
import { db } from "@/firebase/clientApp";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect } from "react";

export default function ClassDetails({
  ClassName,
  ClassCode,
  SelectedSubject,
}: {
  ClassName?: string;
  ClassCode?: string;
  SelectedSubject?: string | null;
}) {
  const userData = useUserContext();
  useEffect(() => {
    const fetchData = async () => {
      const classesSnapshot = await getDocs(
        query(collection(db, "classrooms"), where("className", "==", ClassName))
      );
      classesSnapshot.forEach((doc) => {
        console.log(doc.data());
      });
    };
    fetchData();
  }, []);
  return <h1>Class Details</h1>;
}
