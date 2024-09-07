import { Picker } from "@react-native-picker/picker";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { useFilePathStore } from "../stores/filePathStore";
import ExecuteBtn from "./ExecuteBtn";
import FileNameInput from "./FileNameInput";

function AudioCompressPicker() {
	const [audioCompressRate, setAudioCompressRate] = useState("");
	const [fileName, setFileName] = useState("");
	const { inputFile } = useFilePathStore();
	const { t } = useTranslation();
	const colors = useTheme().colors;
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
				{t("qualitySelect.selectLabel")}
			</Text>
			<View style={[styles.picker, { borderColor: colors.border }]}>
				<Picker
					style={{ color: colors.text }}
					dropdownIconColor={colors.text}
					selectedValue={audioCompressRate}
					onValueChange={(itemValue) => setAudioCompressRate(itemValue)}
				>
					<Picker.Item value="320k" label={t("qualitySelect.high")} />
					<Picker.Item value="128k" label={t("qualitySelect.medium")} />
					<Picker.Item value="64k" label={t("qualitySelect.low")} />
				</Picker>
			</View>
			<FileNameInput setFileName={setFileName} />
			<ExecuteBtn
				fileName={fileName}
				btnTitle={t("executeBtn.startBtn")}
				command={`-i ${inputFile?.uri} -b:a ${audioCompressRate}`}
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

export default AudioCompressPicker;
