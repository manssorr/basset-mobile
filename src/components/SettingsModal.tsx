import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "@react-navigation/native";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
	Modal,
	Pressable,
	StyleSheet,
	Text,
	ToastAndroid,
	TouchableOpacity,
	View,
} from "react-native";
import { Path, Svg } from "react-native-svg";
import { useSettingsModalStore } from "../stores/settingsModalStore";
import Seperator from "./Seperator";

function SettingsModal() {
	const { isVisible, setIsVisible, theme, setTheme } = useSettingsModalStore();
	const colors = useTheme().colors;
	const { t, i18n } = useTranslation();

	useEffect(() => {
		async function setLanguageOnMount() {
			const language = await AsyncStorage.getItem("i18nextLng");
			i18n.changeLanguage(language || "en");
		}
		setLanguageOnMount();
	}, [i18n.changeLanguage]);

	useEffect(() => {
		async function setThemeOnMount() {
			const theme = await AsyncStorage.getItem("theme");
			setTheme(theme || "system");
		}
		setThemeOnMount();
	}, [setTheme]);

	return (
		<Modal
			onRequestClose={() => setIsVisible(false)}
			visible={isVisible}
			animationType="slide"
			transparent={true}
		>
			<TouchableOpacity activeOpacity={1} style={styles.backdrop}>
				<View
					style={[
						styles.modalContainer,
						{ borderColor: colors.border, backgroundColor: colors.background },
					]}
				>
					<Pressable
						android_ripple={{ color: colors.text, borderless: true }}
						style={{ alignSelf: "flex-end", marginHorizontal: 5, marginTop: 5 }}
						onPress={() => setIsVisible(false)}
					>
						<CloseIcon />
					</Pressable>
					<View style={{ width: "100%" }}>
						<Text style={{ marginTop: 10, marginHorizontal: 10, fontSize: 16 }}>
							{t("header.themeLabel")}
						</Text>
						<View style={[styles.picker, { borderColor: colors.border }]}>
							<Picker
								style={{ color: colors.text }}
								dropdownIconColor={colors.text}
								selectedValue={theme}
								onValueChange={async (value) => {
									await AsyncStorage.setItem("theme", value);
									setTheme(value);
								}}
							>
								<Picker.Item value="light" label={t("header.lightMode")} />
								<Picker.Item value="dark" label={t("header.darkMode")} />
								<Picker.Item value="system" label={t("header.system")} />
							</Picker>
						</View>
					</View>
					<Seperator color={colors.border} strokeWidth={0.5} />
					<View style={{ width: "100%" }}>
						<Text style={{ marginTop: 5, marginHorizontal: 10, fontSize: 16 }}>
							{t("header.languageLabel")}
						</Text>
						<View style={[styles.picker, { borderColor: colors.border }]}>
							<Picker
								style={{ color: colors.text }}
								dropdownIconColor={colors.text}
								selectedValue={i18n.language.split("-")[0].toString()}
								onValueChange={async (value) => {
									await AsyncStorage.setItem("i18nextLng", value);
									i18n.changeLanguage(value);

									ToastAndroid.show(
										t("header.reloadToast"),
										ToastAndroid.SHORT,
									);
								}}
							>
								<Picker.Item value="ar" label="العربية" />
								<Picker.Item value="en" label="English" />
							</Picker>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		</Modal>
	);
}

function CloseIcon() {
	const colors = useTheme().colors;

	return (
		<Svg
			width="22"
			height="22"
			viewBox="0 0 24 24"
			fill="none"
			stroke={colors.text}
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<Path d="M18 6 6 18" />
			<Path d="m6 6 12 12" />
		</Svg>
	);
}

const styles = StyleSheet.create({
	modalContainer: {
		borderRadius: 10,
		alignItems: "center",
		borderWidth: 1,
		width: "90%",
	},
	backdrop: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	picker: {
		borderWidth: 2,
		margin: 10,
		borderRadius: 10,
	},
});
export default SettingsModal;
