export type ClassRoomDoc = {
  className?: string;
  classCode: string;
  classCreator?: string;
};
export type TeacherInClassDoc = {
  selectedSubject: string;
  teacherEmail: string | null;
  teacherName: string | null;
  isCreator: boolean;
};

