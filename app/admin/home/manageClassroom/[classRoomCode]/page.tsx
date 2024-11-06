import ClassDetails from "@/app/admin/_components/ClassDetails";

export default function ManageClassRoom({
  params,
}: {
  params: { classRoomCode: string };
}) {
  return (
    <>
      <ClassDetails ClassCode={params.classRoomCode}></ClassDetails>
    </>
  );
}
