// app/class/[classRoomCode]/layout.tsx

import { ClassContextProvider } from "./context/ClassContext";

export default async function ClassLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { classRoomCode: string };
}) {
	const {classRoomCode} = await params;

	return (
		<ClassContextProvider classCode={classRoomCode}>{children}</ClassContextProvider>
	);
}
