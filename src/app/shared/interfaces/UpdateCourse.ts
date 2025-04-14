export interface UpdateCourse {
  SubjectCode: string;  // Must match backend exactly (case sensitive)
  grade: string;        // Adjust case if needed
  hours: number;        // Adjust case if needed
}