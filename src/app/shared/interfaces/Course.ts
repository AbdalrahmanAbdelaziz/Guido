// shared/interfaces/Course.ts
export interface Course {
    code: string;
    course_Name: string;
    hours: string;
    prerequest: string;
    grade?: string;
}

export interface CourseWithStatus extends Course {
    isAdded: boolean;
}