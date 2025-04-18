export interface UpdateCourse {
  code: string;        // Must match exactly (case-sensitive)
  grade: string;       // Must be one of the allowed grades
  hours: number;       // Must be a valid number
  // Any other required fields?
}