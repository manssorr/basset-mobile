import { useNavigation, useTheme } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useShareIntentContext } from "expo-share-intent";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { G, Path, Svg } from "react-native-svg";
import Seperator from "../components/Seperator";
import { useFilePathStore } from "../stores/filePathStore";

const logo = require("../assets/appIcon.png");

function FileUploadScreen() {
	const { t } = useTranslation();
	const colors = useTheme().colors;
	const navigation = useNavigation();
	const { setInputFile } = useFilePathStore();
	const { hasShareIntent, shareIntent } = useShareIntentContext();

	useEffect(() => {
		if (hasShareIntent && shareIntent.files) {
			setInputFile({
				uri: shareIntent?.files?.[0].path,
				mimeType: shareIntent?.files?.[0].mimeType,
			});

			// @ts-ignore
			navigation.navigate("Home");
		}
	}, [hasShareIntent, setInputFile, navigation.navigate, shareIntent?.files]);

	async function onFileUploadPress() {
		//Delete Document picker cache
		await FileSystem.deleteAsync(`${FileSystem.cacheDirectory}DocumentPicker`, {
			idempotent: true,
		});

		//Delete ffmpeg process outputs picker cache
		await FileSystem.deleteAsync(`${FileSystem.cacheDirectory}output`, {
			idempotent: true,
		});

		//Make output directory for ffmpeg process
		await FileSystem.makeDirectoryAsync(`${FileSystem.cacheDirectory}output`, {
			intermediates: true,
		});

		const file = await DocumentPicker.getDocumentAsync({
			type: [
				"video/mp4",
				"video/webp",
				"video/avi",
				"video/mov",
				"video/mkv",
				"video/flv",
				"audio/*",
			],
		});
		const selectedFile = file.assets?.[0];
		if (selectedFile) {
			setInputFile({
				uri: selectedFile.uri,
				mimeType: selectedFile.mimeType ?? "",
			});

			// @ts-ignore
			navigation.navigate("Home");
		}
	}

	return (
		<View style={styles.container}>
			<Image source={logo} />
			<Seperator strokeWidth={2.2} color={colors.border} />
			<Pressable
				onPress={onFileUploadPress}
				android_ripple={{ borderless: false }}
				style={[
					styles.uploadBtn,
					{ borderColor: colors.background, backgroundColor: colors.border },
				]}
			>
				<OpenFileIcon />
				<Text style={{ color: colors.text, fontWeight: "600" }}>
					{t("uploadPage.uploadFileLabel")}
				</Text>
			</Pressable>
		</View>
	);
}

function OpenFileIcon() {
	const colors = useTheme().colors;
	return (
		<Svg viewBox="0 0 24 24" width="25px" height="25px" fill="none">
			<G strokeWidth="0" />
			<G strokeLinecap="round" strokeLinejoin="round" />
			<G>
				<Path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M17.5754 23.2323C17.2093 23.6996 16.6397 24 16 24H2C0.89543 24 0 23.1046 0 22V6H5C5.55228 6 6 5.55228 6 5V0H16C17.1046 0 18 0.89543 18 2V6.75463C16.6304 5.65672 14.8919 5 13 5C8.58172 5 5 8.58172 5 13C5 17.4183 8.58172 21 13 21C13.7166 21 14.4113 20.9058 15.0722 20.729L17.5754 23.2323ZM0.341411 4C0.943981 2.29517 2.29517 0.943981 4 0.341411V4H0.341411ZM17.8603 16.5189C17.9545 16.5659 18.0428 16.6286 18.1213 16.7071L23.1213 21.7071C23.5118 22.0976 23.5118 22.7308 23.1213 23.1213C22.7308 23.5118 22.0976 23.5118 21.7071 23.1213L16.7071 18.1213C16.6286 18.0428 16.5659 17.9545 16.5189 17.8603C15.5304 18.5773 14.3146 19 13 19C9.68629 19 7 16.3137 7 13C7 9.68629 9.68629 7 13 7C16.3137 7 19 9.68629 19 13C19 14.3146 18.5773 15.5304 17.8603 16.5189ZM13 17C15.2091 17 17 15.2091 17 13C17 10.7909 15.2091 9 13 9C10.7909 9 9 10.7909 9 13C9 15.2091 10.7909 17 13 17Z"
					fill={colors.text}
				/>
			</G>
		</Svg>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		marginTop: 140,
	},
	uploadBtn: {
		borderStyle: "dashed",
		borderWidth: 1,
		alignItems: "center",
		gap: 10,
		width: "85%",
		padding: 40,
	},
});

export default FileUploadScreen;
