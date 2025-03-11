import React from "react";
import Image from "next/image";

interface QuestionImageCardProps {
  questionImageUrl: string | null;
}

const QuestionImageCard: React.FC<QuestionImageCardProps> = ({ questionImageUrl }) => {
  return (
    <div className="mt-2">
      {questionImageUrl && (
        <Image
          src={questionImageUrl}
          alt="Question Image"
          width={500} // Set appropriate width
          height={300} // Set appropriate height
          className="max-w-full h-auto rounded-lg"
        />
      )}
    </div>
  );
};

export default QuestionImageCard;