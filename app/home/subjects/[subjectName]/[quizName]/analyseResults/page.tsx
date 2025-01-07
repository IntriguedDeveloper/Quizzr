'use client'
import { useParams } from "next/navigation";

export default function AnalyseResults(){
    const params = useParams<{quizName: string, subjectName: string}>();
    
    return (
        <>
            <div>
                     
            </div>
        </>
    )
}