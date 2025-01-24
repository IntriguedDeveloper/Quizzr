import { Suspense } from "react";
import Home from "./HomePage";
import Loading from "../loading";

export default function Page() {
	return (
		<Suspense fallback={<Loading></Loading>}>
			<Home></Home>
		</Suspense>
	);
}
