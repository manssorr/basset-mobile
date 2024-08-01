import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import * as Application from "expo-application";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Image,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Path, Svg } from "react-native-svg";
import Seperator from "./Seperator";

const logo = require("../assets/typography.png");

function OnBoardDialog() {
	const version = Application.nativeApplicationVersion;

	const { colors } = useTheme();
	const [isVisible, setIsVisible] = useState(false);

	const { t } = useTranslation();

	useEffect(() => {
		async function showModal() {
			const showModal = await AsyncStorage.getItem("hideModal");

			setIsVisible(showModal === null);
		}
		showModal();
	}, []);

	async function hideModal() {
		await AsyncStorage.setItem("hideModal", "hide");
		setIsVisible(false);
	}

	return (
		<>
			<StatusBar
				backgroundColor={isVisible ? "rgba(0, 0, 0, 0.5)" : ""}
				animated
			/>
			<Modal
				onRequestClose={hideModal}
				visible={isVisible}
				animationType="slide"
				transparent={true}
			>
				<TouchableOpacity activeOpacity={1} style={styles.backdrop}>
					<View
						style={[
							styles.modalContainer,
							{
								borderColor: colors.border,
								backgroundColor: colors.background,
							},
						]}
					>
						<Pressable
							android_ripple={{ color: colors.text, borderless: true }}
							style={{
								alignSelf: "flex-end",
								marginHorizontal: 5,
								marginTop: 5,
							}}
							onPress={hideModal}
						>
							<CloseIcon />
						</Pressable>
						<Image source={logo} alt="Basset logo" />
						<Text style={{ color: colors.text }}>v{version}</Text>
						<Seperator color={colors.border} strokeWidth={2} />
						<Text style={{ fontSize: 15, color: colors.text }}>
							{t("onboard.header")}
							{"\n\n"}
							{t("onboard.features")}
							{"\n\n"}
							{t("onboard.steps")}
						</Text>
					</View>
				</TouchableOpacity>
			</Modal>
		</>
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
		padding: 10,
	},
	backdrop: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
});
export default OnBoardDialog;
