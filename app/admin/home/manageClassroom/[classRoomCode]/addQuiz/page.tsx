"use client"
import { ClassRoomContextProvider, useClassRoomContext } from "@/app/admin/home/manageClassroom/[classRoomCode]/_utils/fetchClassDetails";
import ClassDetails from "@/app/admin/home/manageClassroom/[classRoomCode]/addQuiz/_components/ClassDetails";

export default function ManageClassRoom() {
	return (
		<>
			<ClassDetails />
		</>
	);
}
