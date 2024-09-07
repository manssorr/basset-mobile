import { useTheme } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as Haptics from "expo-haptics";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { FFmpegKit, ReturnCode } from "ffmpeg-kit-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	PermissionsAndroid,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	ToastAndroid,
	View,
	useWindowDimensions,
} from "react-native";
import { Bar } from "react-native-progress";
import { Circle, G, Line, Path, Polyline, Svg } from "react-native-svg";
import { useAVStore } from "../stores/AVStore";
import { useFilePathStore } from "../stores/filePathStore";
import extractProgress from "../utils/extractProgress";
import { getFileExt, getFileName } from "../utils/fileUtils";
import Seperator from "./Seperator";

interface IExecuteBtnProps {
	command: string;
	outputFormat?: string;
	disabled?: boolean;
	btnTitle: string;
	fileName: string;
}
function ExecuteBtn({
	command,
	outputFormat,
	disabled = false,
	btnTitle,
	fileName,
}: IExecuteBtnProps) {
	const { width } = useWindowDimensions();
	const [cmdStatus, setCmdStatus] = useState<"success" | "error">();
	const [errInfo, setErrInfo] = useState("");
	const [progress, setProgress] = useState(0);
	const [shareFilePath, setShareFilePath] = useState("");
	const [cmdRunning, setCmdRunning] = useState(false);

	const colors = useTheme().colors;
	const { inputFile } = useFilePathStore();
	const { AVDuration } = useAVStore();
	const { t, i18n } = useTranslation();

	async function executeCommand() {
		if (!inputFile) return;
		setCmdRunning(true);
		setCmdStatus(undefined);
		setProgress(0);
		setErrInfo("");

		if (Number(Platform.Version) <= 30) {
			const permission = await PermissionsAndroid.request(
				"android.permission.WRITE_EXTERNAL_STORAGE",
				{
					title: t("permission.title"),
					message: t("permission.message"),
					buttonPositive: t("permission.buttonPositive"),
					buttonNegative: t("permission.buttonNegative"),
				},
			);

			if (
				permission === PermissionsAndroid.RESULTS.DENIED ||
				permission === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
			) {
				ToastAndroid.show(t("permission.reject"), ToastAndroid.SHORT);
			}
		}

		const date = new Date();
		const outputFileDate = `${date.getFullYear()}_${Math.random().toString().slice(2, 5)}`;

		const outputFileFormat =
			outputFormat === undefined ? getFileExt(inputFile.uri) : outputFormat;

		const outputFileName = fileName
			? fileName.trim().replace(" ", "-")
			: `${getFileName(inputFile.uri)}_${outputFileDate}`;

		const outputFilePath = `${FileSystem.cacheDirectory}output/${outputFileName}.${outputFileFormat}`;

		await FFmpegKit.executeAsync(
			`-y ${command} ${outputFilePath}`,
			async (session) => {
				const returnCode = await session.getReturnCode();
				if (ReturnCode.isSuccess(returnCode)) {
					setShareFilePath(outputFilePath);
					setCmdRunning(false);
					setCmdStatus("success");
					await MediaLibrary.saveToLibraryAsync(encodeURI(outputFilePath));
					await Haptics.notificationAsync();
				} else {
					setCmdStatus("error");
					setCmdRunning(false);
					setProgress(0);
					await Haptics.notificationAsync(
						Haptics.NotificationFeedbackType.Error,
					);
				}
			},
			async (log) => {
				const commandProgress = extractProgress(
					log.getMessage().toString(),
					AVDuration,
				);
				if (commandProgress !== undefined) {
					setProgress(commandProgress);
				}
				console.log(log.getMessage());
				const inputErrRegex = /No such file or directory/;
				const somethingWentWrongRegex =
					/Conversion failed|Unable to find a suitable output format/;
				const streamErrRegex = /Output file does not contain any stream/;
				const invalidImageFile = /Invalid/;

				if (log.getMessage().toString().match(inputErrRegex))
					setErrInfo(t("inputErr"));

				if (log.getMessage().toString().match(somethingWentWrongRegex))
					setErrInfo(t("somethingWentWrongErr"));

				if (log.getMessage().toString().match(invalidImageFile)) {
					setErrInfo(t("somethingWentWrongErr"));
					await FFmpegKit.cancel();
				}

				if (log.getMessage().toString().match(streamErrRegex))
					setErrInfo(t("streamErr"));
			},
		);
	}

	async function onShareBtnPress() {
		await Sharing.shareAsync(shareFilePath);
	}

	return (
		<View style={styles.executeBtnContainer}>
			<View
				style={[
					styles.cmdStatusContainer,
					{
						borderColor: colors.border,
						flexDirection: i18n.dir() === "rtl" ? "row-reverse" : "row",
						display:
							(cmdStatus === "error" && errInfo) || cmdStatus === "success"
								? "flex"
								: "none",
					},
				]}
			>
				{cmdStatus === "success" && (
					<>
						<CheckCircleIcon />
						<Text style={{ color: colors.text }}>{t("successMsg")}</Text>
						<Seperator
							strokeWidth={1.4}
							color={colors.text}
							orientation="vertical"
						/>
						<Pressable
							onPress={onShareBtnPress}
							android_ripple={{ borderless: true, color: colors.text }}
						>
							<ShareIcon />
						</Pressable>
					</>
				)}
				{cmdStatus === "error" && errInfo && (
					<>
						<TriangleAlertIcon />
						<Text style={{ color: colors.text }}>{errInfo}</Text>
					</>
				)}
			</View>

			{cmdRunning && (
				<View style={styles.progressContainer}>
					<Text style={{ color: colors.text }}>{Math.trunc(progress)}%</Text>
					<Bar
						progress={progress / 100}
						useNativeDriver
						borderRadius={3}
						height={20}
						width={width - 80}
						borderColor={colors.border}
						color={colors.text}
					/>
					<Pressable
						onPress={async () => {
							setCmdRunning(false);
							setCmdStatus(undefined);
							setProgress(0);
							setErrInfo("");
							await FFmpegKit.cancel();
						}}
						android_ripple={{ color: colors.background }}
						style={{
							backgroundColor: colors.border,
							borderRadius: 4,
							height: 22,
						}}
					>
						<CancelIcon />
					</Pressable>
				</View>
			)}

			{!cmdRunning && (
				<Pressable
					disabled={disabled}
					android_ripple={{ color: colors.background }}
					style={[
						styles.executeBtn,
						{ backgroundColor: disabled ? colors.border : colors.text },
					]}
					onPress={executeCommand}
				>
					<Text
						style={{
							color: disabled ? colors.text : colors.background,
							fontWeight: "bold",
							opacity: disabled ? 0.4 : 1,
						}}
					>
						{btnTitle}
					</Text>
				</Pressable>
			)}
		</View>
	);
}

function CancelIcon() {
	const colors = useTheme().colors;
	const { t } = useTranslation();
	return (
		<Svg
			aria-label={t("executeBtn.cancelBtn")}
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

function CheckCircleIcon() {
	return (
		<Svg width="25" height="25" viewBox="0 0 24 24">
			<G
				fill="none"
				stroke="green"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			>
				<Circle cx="12" cy="12" r="10" />
				<Path d="m9 12l2 2l4-4" />
			</G>
		</Svg>
	);
}

function ShareIcon() {
	const colors = useTheme().colors;
	const { t } = useTranslation();
	return (
		<Svg
			aria-label={t("executeBtn.shareBtn")}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke={colors.text}
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<Path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
			<Polyline points="16 6 12 2 8 6" />
			<Line x1="12" x2="12" y1="2" y2="15" />
		</Svg>
	);
}

function TriangleAlertIcon() {
	return (
		<Svg
			width="25"
			height="25"
			viewBox="0 0 24 24"
			fill="none"
			stroke="red"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<Path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
			<Path d="M12 9v4" />
			<Path d="M12 17h.01" />
		</Svg>
	);
}

const styles = StyleSheet.create({
	executeBtnContainer: {
		alignItems: "center",
		justifyContent: "center",
		marginTop: 10,
		width: "100%",
	},
	progressContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 3,
	},
	executeBtn: {
		alignItems: "center",
		justifyContent: "center",
		width: 200,
		paddingVertical: 6,
		borderRadius: 6,
	},
	cmdStatusContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 3,
		marginBottom: 6,
		borderWidth: 1,
		padding: 6,
		borderRadius: 10,
	},
});

export default ExecuteBtn;
