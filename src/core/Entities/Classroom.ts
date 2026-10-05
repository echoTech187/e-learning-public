// Classroom & Quiz Entities for Phase 5

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  is_completed: boolean;
  watch_time: number;
  completed_at: string | null;
}

export interface Lesson {
  id: string;
  section_id: string;
  title: string;
  type: 'video' | 'youtube' | 'pdf' | 'article' | 'quiz' | 'live';
  content: string | null;
  description: string | null;
  duration: number | null;
  is_free: boolean;
  is_published: boolean;
  order: number;
  progress: LessonProgress | null;
  is_completed: boolean;
}

export interface CourseSection {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: Lesson[];
}

export interface ClassroomProgressSummary {
  total_lessons: number;
  completed_lessons: number;
  percent: number;
}

export interface ClassroomData {
  enrollment: {
    id: string;
    user_id: string;
    course_id: string;
    progress: number;
    enrolled_at: string;
    completed_at: string | null;
  };
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string | null;
    description: string | null;
  };
  sections: CourseSection[];
  progress_summary: ClassroomProgressSummary;
}

// Quiz Entities
export interface QuestionOption {
  id: string;
  option_text: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'essay';
  image: string | null;
  points: number;
  explanation: string | null;
  order: number;
  options: QuestionOption[];
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  total_points: number;
  earned_points: number;
  is_passed: boolean;
  started_at: string;
  finished_at: string | null;
}

export interface QuizData {
  quiz: {
    id: string;
    course_id: string;
    lesson_id: string | null;
    title: string;
    description: string | null;
    duration: number;
    passing_score: number;
    max_attempts: number;
    shuffle: boolean;
    is_active: boolean;
  };
  questions: Question[];
  attempt_history: QuizAttempt[];
  attempts_used: number;
  can_attempt: boolean;
}

export interface QuizResult {
  quiz: QuizData['quiz'];
  attempt: QuizAttempt;
  review: Array<{
    question: Question & { explanation: string | null };
    options: Array<QuestionOption & { is_correct: boolean }>;
    user_answer: {
      id: string;
      attempt_id: string;
      question_id: string;
      answer: string;
      is_correct: boolean;
    } | null;
  }>;
}