import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const { token } = req.body;

	if (!token) {
		return res.status(400).send("Token is required");
	}

	const serialized = serialize("__Session", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
	});

	res.setHeader("Set-Cookie", serialized);
	res.status(200).send("Cookie set");
}
