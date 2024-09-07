import Slider from "@react-native-community/slider";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { useFilePathStore } from "../stores/filePathStore";
import { getPercentage } from "../utils/getPercentage";
import ExecuteBtn from "./ExecuteBtn";
import FileNameInput from "./FileNameInput";

function CompressSlider() {
	const [compressRate, setCompressRate] = useState(4);
	const [fileName, setFileName] = useState("");
	const { colors } = useTheme();
	const { inputFile } = useFilePathStore();
	const { t } = useTranslation();

	const compressPercentage = Math.trunc(getPercentage(compressRate, 25));

	return (
		<View style={styles.container}>
			<Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>
				{t("tabs.compressLabel")}
			</Text>
			<Slider
				style={{ width: "90%", height: 50 }}
				minimumValue={0}
				step={0.2}
				maximumValue={25}
				onValueChange={(value) => setCompressRate(Number(value.toFixed(0)))}
				value={compressRate}
				minimumTrackTintColor={colors.text}
				maximumTrackTintColor={colors.border}
				thumbTintColor={colors.text}
			/>
			<Text
				style={[
					styles.text,
					{ borderColor: colors.border, color: colors.text },
				]}
			>
				{compressPercentage}%
			</Text>
			<FileNameInput setFileName={setFileName} />
			<ExecuteBtn
				fileName={fileName}
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
