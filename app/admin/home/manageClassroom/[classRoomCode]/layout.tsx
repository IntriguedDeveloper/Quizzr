import { ClassRoomContextProvider } from "@/app/admin/context/ClassRoomContext";

export default function Layout({
	children,
	classRoomCode,
}: {
	children: React.ReactNode;
	classRoomCode: string;
}) {
	return (
		<>
			<ClassRoomContextProvider>
				{children}
			</ClassRoomContextProvider>
		</>
	);
}
