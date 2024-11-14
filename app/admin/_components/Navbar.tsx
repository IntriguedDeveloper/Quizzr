import { UserContextType } from "@/app/context/UserContext";
import { Poppins } from "next/font/google";
import { HiMenu } from "react-icons/hi";
import ProfileIcon from "@/public/account.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-pop",
  weight: "500",
});

export default function Navbar({
  toggleSidebar,
  teacherDetails,
  profileVisibility = true,
}: {
  toggleSidebar?: () => void;
  teacherDetails?: UserContextType;
  profileVisibility?: boolean;
}) {
  const router = useRouter();
  return (
    <>
      <nav
        className={
          "bg-[#0066b2] p-4 text-white justify-start items-center flex flex-row max-h-20"
        }
      >
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="text-white text-3xl focus:outline-none mr-4"
          >
            <HiMenu />
          </button>
        )}
        <h1 className={`text-4xl ${poppins.variable} font-pop`}>Quizzr</h1>
        {profileVisibility && (
          <div className="w-full flex justify-end items-center">
            <Image
              src={ProfileIcon} 
              alt="Profile Icon"
              className="h-10 w-10 hover:cursor-pointer"
              onClick={() => router.push("/admin/home/profile")}
            ></Image>
          </div>
        )}
      </nav>
    </>
  );
}
