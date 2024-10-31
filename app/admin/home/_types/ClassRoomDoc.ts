export type ClassRoomDoc = {
  classRoomName: string;
  classRoomCode: string;
};
export type TeacherInClassDoc = {
  selectedSubject: string;
  teacherEmail: string|null;
  teacherName: string | null;
  isCreator: boolean;
}