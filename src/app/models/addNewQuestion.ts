export interface addNewQuestion {
    title: string;
    description: string;
    questionNumber: number;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    link: string;
}
