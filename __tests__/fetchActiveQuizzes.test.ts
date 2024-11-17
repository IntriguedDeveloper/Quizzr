import { fetchActiveQuizzes } from "@/app/admin/home/manageClassroom/[classRoomCode]/_utils/fetchActiveQuizzes";
import { db } from "@/firebase/clientApp";

describe("fetchActiveQuizzes (real data)", () => {
	const mockClassCode = "11_A4_2026";
	const mockSubject = "Chemistry";

	it("fetches quizzes correctly for a given class code and subject", async () => {
		const result = await fetchActiveQuizzes(mockClassCode, mockSubject);
		console.log(result);
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(result[0]).toHaveProperty("title");
	});

	it("returns an empty list if no quizzes are found", async () => {
		const emptyClassCode = "nonExistentClass";
		const result = await fetchActiveQuizzes(emptyClassCode, mockSubject);

		expect(result).toEqual([]);
	});
});
