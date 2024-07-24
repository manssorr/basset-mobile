import { Picker } from "@react-native-picker/picker";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

interface IFormatSelectProps {
	format: string;
	setFormat: React.Dispatch<React.SetStateAction<string>>;
	isAudio: boolean | undefined;
}
function FormatSelect({ format, setFormat, isAudio }: IFormatSelectProps) {
	const colors = useTheme().colors;
	const { t } = useTranslation();

	if (isAudio)
		return (
			<Picker
				style={{ color: colors.text }}
				dropdownIconColor={colors.text}
				selectedValue={format}
				onValueChange={(itemValue) => setFormat(itemValue)}
			>
				<Picker.Item
					value="mp3"
					label={`mp3 ${t("formatSelect.recommended")}`}
				/>
				<Picker.Item value="aac" label="aac" />
				<Picker.Item value="ogg" label="ogg" />
			</Picker>
		);

	return (
		<Picker
			style={{ color: colors.text }}
			dropdownIconColor={colors.text}
			selectedValue={format}
			onValueChange={(itemValue) => setFormat(itemValue)}
		>
			<Picker.Item value="mp4" label="mp4" />
			<Picker.Item value="webm" label="webm" />
			<Picker.Item value="avi" label="avi" />
			<Picker.Item value="mov" label="mov" />
			<Picker.Item value="mkv" label="mkv" />
			<Picker.Item value="wmv" label="wmv" />
			<Picker.Item value="flv" label="flv" />
		</Picker>
	);
}

export default FormatSelect;
