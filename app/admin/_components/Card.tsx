"use client";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export default function Card({
  cardHeading,
  icon,
  onClick,
}: {
  cardHeading: string;
  icon: StaticImport;
  onClick?: () => void;
}) {
  return (
    <div
      className="h-[250px] w-[300px] mb-5 mt-5 bg-secondary flex items-center justify-center rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer border-2 border-blue-600 hover:border-blue-800"
      onClick={onClick}
    >
      <Image src={icon} alt="cardIcon" className="h-16 w-16" />
      <a className="ml-5 text-xl font-medium text-blue-600">{cardHeading}</a>
    </div>
  );
}
