import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import ExecuteBtn from "../components/ExecuteBtn";
import FormatSelect from "../components/FormatSelect";
import { useFilePathStore } from "../stores/filePathStore";

function VideoToAudio() {
	const [format, setFormat] = useState("mp3");
	const colors = useTheme().colors;
	const { inputFile } = useFilePathStore();
	const { t } = useTranslation();
	return (
		<View>
			<Text
				style={{
					marginTop: 10,
					marginHorizontal: 10,
					fontSize: 16,
					color: colors.text,
				}}
			>
				{t("formatSelect.label")}
			</Text>
			<View style={[styles.picker, { borderColor: colors.border }]}>
				<FormatSelect format={format} setFormat={setFormat} isAudio={true} />
			</View>
			<ExecuteBtn
				btnTitle={t("executeBtn.convertBtn")}
				outputFormat={format}
				command={`-i ${inputFile?.uri}`}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	picker: {
		borderWidth: 2,
		margin: 10,
		borderRadius: 10,
	},
});

export default VideoToAudio;
