import { Picker } from "@react-native-picker/picker";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import ExecuteBtn from "../components/ExecuteBtn";
import FileNameInput from "../components/FileNameInput";
import { useFilePathStore } from "../stores/filePathStore";

function Quality() {
	const [fileName, setFileName] = useState("");
	const [quality, setQuality] = useState("1080");

	const colors = useTheme().colors;

	const { t } = useTranslation();

	const { inputFile } = useFilePathStore();

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
					selectedValue={quality}
					onValueChange={(itemValue) => setQuality(itemValue)}
				>
					<Picker.Item value="1080" label="1080p" />
					<Picker.Item value="720" label="720p" />
					<Picker.Item value="480" label="480p" />
					<Picker.Item value="360" label="360p" />
					<Picker.Item value="240" label="240p" />
					<Picker.Item value="144" label="144p" />
				</Picker>
			</View>
			<FileNameInput setFileName={setFileName} />
			<ExecuteBtn
				fileName={fileName}
				btnTitle={t("executeBtn.startBtn")}
				command={`-i ${inputFile?.uri} -vf scale=-1:${quality}`}
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

export default Quality;
