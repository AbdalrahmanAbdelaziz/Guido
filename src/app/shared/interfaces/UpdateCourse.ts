export interface UpdateCourse {
    SubjectCode: string;  // Primary key (required)
    grade: string;
    hours: number;
    // Remove 'code' if not needed by backend
  }