export type QuestionConstructType = {
	QuestionTitle: string;
	AnswerChoices: AnswerChoice[];
	CorrectOptionIndex: number; //starts with 1
	QuestionIndex: number;
	SelectedIndex?: number; //starts with 1
};
export type AnswerChoice = {
	choiceIndex: number;
	choiceContent: string;
};
