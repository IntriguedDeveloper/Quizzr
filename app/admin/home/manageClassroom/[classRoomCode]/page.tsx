import ClassContent from "./ClassContent";

export default async function ClassPage({
	params,
}: {
	params: Promise<{ classRoomCode: string }>;
}) {
	const classCode = (await params).classRoomCode;

	return <ClassContent classCode={classCode}></ClassContent>;
}

export const getClassCode = async (params: { classRoomCode: string }) => {
	const classRoomCode = await params.classRoomCode;
	return classRoomCode;
};
