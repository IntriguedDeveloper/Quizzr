'use client'
import { createContext, useContext } from "react";
type ClassContextType = { classCode: string | null };

const ClassContext = createContext<ClassContextType>({
	classCode: null,
});
export function ClassContextProvider({
	children,
	classCode,
}: {
	children: React.ReactNode;
	classCode: string;
}) {
	return (
		<ClassContext.Provider value={{ classCode: classCode }}>
			{children}
		</ClassContext.Provider>
	);
}

export function useClassContext() {
	const context = useContext(ClassContext);
	if (context === undefined) {
		throw new Error(
			"useClassContext must be used within a ClassContextProvider"
		);
	}
	return context;
}
