import React from 'react';

interface NumberIconProps {
  number: number;
  fill?: string;
  stroke?: string;
  width?: number;
  height?: number;
  progress?: number; // Represent progress as a percentage (0–100)
}

const NumberIcon: React.FC<NumberIconProps> = ({
  number,
  fill = "#1E88E5",
  stroke = "#1E88E5",
  width = 231,
  height = 231,
  progress = 100, // Default to 100% progress
}) => {
  const radius = 48; // Circle radius
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const progressStroke = (progress / 100) * circumference;

  return (
    <svg
      width={`${width}px`}
      height={`${height}px`}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="#E0E0E0"
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progressStroke}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      {/* Timer number */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        alignmentBaseline="central"
        fontSize="40"
        fill={fill}
        fontWeight="bold"
      >
        {number}
      </text>
    </svg>
  );
};

export default NumberIcon;
