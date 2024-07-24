import { View } from "react-native";

interface ISeperatorProps {
	orientation?: "horizontal" | "vertical";
	color: string;
	strokeWidth: number;
}
function Seperator({
	orientation = "horizontal",
	color,
	strokeWidth,
}: ISeperatorProps) {
	return (
		<View
			style={{
				borderBottomColor: color,
				borderBottomWidth: strokeWidth,
				width: orientation === "horizontal" ? "80%" : "8%",
				transform: [
					{ rotate: orientation === "horizontal" ? "0deg" : "90deg" },
				],
				marginTop: 5,
				marginBottom: 5,
			}}
		/>
	);
}

export default Seperator;
