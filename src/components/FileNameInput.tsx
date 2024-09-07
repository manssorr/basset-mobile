import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Seperator from "./Seperator";

interface IFileNameInputProps {
	setFileName: React.Dispatch<React.SetStateAction<string>>;
}

function FileNameInput({ setFileName }: IFileNameInputProps) {
	const { colors } = useTheme();
	const { t, i18n } = useTranslation();
	return (
		<View style={styles.fileNameWrapper}>
			<Seperator
				orientation="horizontal"
				color={colors.border}
				strokeWidth={0.5}
			/>
			<View
				style={{
					width: "100%",
					marginVertical: 10,
				}}
			>
				<Text style={{ marginStart: 16, marginEnd: 16, color: colors.text }}>
					{t("fileInputLabel")}
				</Text>
				<TextInput
					onChangeText={(text) => setFileName(text)}
					cursorColor={colors.text}
					textAlign="center"
					placeholderTextColor={colors.text}
					placeholder={t("fileInputPlaceholder")}
					style={[
						styles.fileNameInput,
						{
							borderColor: colors.border,
							color: colors.text,
							textAlign: i18n.dir() === "rtl" ? "right" : "left",
						},
					]}
				/>
			</View>
			<Seperator
				orientation="horizontal"
				color={colors.border}
				strokeWidth={0.5}
			/>
		</View>
	);
}

export default FileNameInput;

const styles = StyleSheet.create({
	fileNameWrapper: {
		alignItems: "center",
		marginTop: 20,
		width: "100%",
	},
	fileNameInput: {
		borderWidth: 1,
		borderRadius: 10,
		padding: 3,
		paddingStart: 10,
		paddingEnd: 10,
		marginVertical: 8,
		alignSelf: "center",
		width: "90%",
	},
});
