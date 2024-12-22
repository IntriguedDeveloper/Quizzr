// app/class/[classRoomCode]/layout.tsx

import { ClassContextProvider } from "./context/ClassContext";

export default function ClassLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { classRoomCode: string };
}) {
	const classCode = params.classRoomCode;

	return (
		<ClassContextProvider classCode={classCode}>{children}</ClassContextProvider>
	);
}
