export type QuestionConstructType = {
	QuestionTitle: string;
	AnswerChoices: AnswerChoice[];
	CorrectOptionIndex: number;
	QuestionIndex: number;
};
export type AnswerChoice = {
	choiceIndex: number;
	choiceContent: string;
};
