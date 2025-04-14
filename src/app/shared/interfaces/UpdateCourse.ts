export interface UpdateCourse {
    SubjectCode: string;  // This might be what the backend expects
    code?: string;        // Your current field
    grade: string; 
    hours: number;
}