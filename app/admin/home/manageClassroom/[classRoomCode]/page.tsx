import { ClassRoomContextProvider } from "@/app/admin/context/ClassRoomContext";
import ClassDetails from "@/app/admin/home/manageClassroom/_components/ClassDetails";
import Layout from "./layout";

export default function ManageClassRoom({
	params,
}: {
	params: { classRoomCode: string };
}) {
	return (
		<>
			<ClassRoomContextProvider classRoomCode={params.classRoomCode}>
				<ClassDetails/>
			</ClassRoomContextProvider>
		</>
	);
}
