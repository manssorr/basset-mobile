import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { useFilePathStore } from "../stores/filePathStore";
import { getPercentage } from "../utils/getPercentage";
import ExecuteBtn from "./ExecuteBtn";

function CompressSlider() {
	const [compressRate, setCompressRate] = useState(4);
	const { colors } = useTheme();
	const { inputFile } = useFilePathStore();
	const { t } = useTranslation();

	const compressPercentage = Math.trunc(getPercentage(compressRate, 25));

	return (
		<View style={styles.container}>
			<Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>
				{t("tabs.compressLabel")}
			</Text>
			<MultiSlider
				onValuesChange={(values) =>
					setCompressRate(Number(values[0].toFixed(0)))
				}
				values={[compressRate]}
				min={0}
				step={0.2}
				max={25}
				selectedStyle={{
					backgroundColor: colors.text,
					borderTopLeftRadius: 50,
					borderBottomLeftRadius: 50,
				}}
				unselectedStyle={{
					borderTopRightRadius: 50,
					borderBottomRightRadius: 50,
					backgroundColor: colors.border,
				}}
				markerStyle={{
					borderColor: colors.text,
					borderWidth: 3,
					backgroundColor: colors.background,
					padding: 8,
					top: 5,
				}}
				trackStyle={{ paddingVertical: 5 }}
			/>
			<Text
				style={[
					styles.text,
					{ borderColor: colors.border, color: colors.text },
				]}
			>
				{compressPercentage}%
			</Text>
			<ExecuteBtn
				btnTitle={t("executeBtn.startBtn")}
				command={`-i ${inputFile?.uri} -pix_fmt yuv420p -crf ${compressRate + 25}`}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 10,
	},
	text: {
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		paddingVertical: 3,
	},
});

export default CompressSlider;
