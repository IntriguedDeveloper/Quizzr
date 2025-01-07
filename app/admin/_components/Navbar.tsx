import { UserContextType } from "@/app/context/UserContext";
import { Poppins } from "next/font/google";
import { HiMenu } from "react-icons/hi";
import ProfileIcon from "@/public/account.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
const poppins = Poppins({
	subsets: ["latin"],
	variable: "--font-pop",
	weight: "500",
});

export default function Navbar({
	teacherDetails,
	profileVisibility = true,
}: {
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
				<Link className={`text-4xl ${poppins.variable} font-pop`} href = "/admin/home">
					Quizzr
				</Link>
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
