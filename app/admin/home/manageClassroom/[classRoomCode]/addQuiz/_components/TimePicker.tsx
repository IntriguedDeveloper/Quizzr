import { useState } from "react";

const TimePicker = ({
	timeSetter,
}: {
	timeSetter: (timeDurationString: string) => void;
}) => {
	const [hours, setHours] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [seconds, setSeconds] = useState(0);

	const handleInputChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
		type: "hours" | "minutes" | "seconds"
	) => {
		const value = Number(e.target.value);
		if (type === "hours") {
			await setHours(Math.min(Math.max(value, 0), 23)); // Hours should be between 0 and 23
		} else if (type === "minutes" || type === "seconds") {
			if (value >= 0 && value < 60) {
				type === "minutes" ? await setMinutes(value) : await setSeconds(value);
			}
		}
		const timeDurationString = `${hours}:${minutes}:${seconds}`;
		timeSetter(timeDurationString);
	};

	return (
		<div className="flex items-center space-x-2">
			<div className="flex items-center">
				<input
					placeholder="H"
					value={hours}
					onChange={(e) => handleInputChange(e, "hours")}
					className="w-16 p-2 border border-gray-300 rounded-md text-center overflow-hidden appearance-none"
					min={0}
					max={23}
				/>
				<span className="ml-1">H</span>
			</div>
			<span className="text-xl">:</span>
			<div className="flex items-center">
				<input
					placeholder="M"
					value={minutes}
					onChange={(e) => handleInputChange(e, "minutes")}
					className="w-16 p-2 border border-gray-300 rounded-md text-center overflow-hidden appearance-none"
					min={0}
					max={59}
				/>
				<span className="ml-1">M</span>
			</div>
			<span className="text-xl">:</span>
			<div className="flex items-center">
				<input
					placeholder="S"
					value={seconds}
					onChange={(e) => handleInputChange(e, "seconds")}
					className="w-16 p-2 border border-gray-300 rounded-md text-center overflow-hidden appearance-none"
					min={0}
					max={59}
				/>
				<span className="ml-1">S</span>
			</div>
		</div>
	);
};

export default TimePicker;
