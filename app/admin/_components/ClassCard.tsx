import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClassCard({
  ClassName,
  ClassCode,
  SelectedSubject,
  isLoading,
}: {
  ClassName?: string;
  ClassCode?: string;
  SelectedSubject?: string | null;
  isLoading: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div
      className={`w-full h-32 lg:h-40 lg:w-64 bg-white rounded-lg shadow-lg border border-gray-300 flex flex-col items-center justify-center p-6 space-y-3 transition-transform duration-300 hover:cursor-pointer ${
        isLoading
          ? "opacity-100 scale-100"
          : isVisible
          ? "opacity-100 scale-105"
          : "opacity-0 scale-95"
      } ${
        isLoading
          ? "animate-pulse"
          : "hover:scale-105 hover:border-2 hover:border-blue-400"
      }`}
      onClick={() => {
        router.push("./home/manageClassroom");
      }}
    >
      {isLoading ? (
        <div className="border-gray-300 h-12 w-12 animate-spin rounded-full border-8 border-t-blue-600"></div>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-gray-800">{ClassName}</h3>
          <p className="text-gray-600">
            <span className="font-medium">Code:</span> {ClassCode}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Subject:</span> {SelectedSubject}
          </p>
        </>
      )}
    </div>
  );
}
