import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { G, Path, Svg } from "react-native-svg";
import type { VideoRef } from "react-native-video";
import { useAVStore } from "../stores/AVStore";
import { getPercentage } from "../utils/getPercentage";
import formatTimestamp from "../utils/timestampFormatter";

interface IAVControlsProps {
	isPaused: boolean;
	setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
	videoRef: React.RefObject<VideoRef>;
	AVCurrPosition: number;
}
export default function AVControls({
	isPaused,
	setIsPaused,
	videoRef,
	AVCurrPosition,
}: IAVControlsProps) {
	const colors = useTheme().colors;
	const { AVDuration } = useAVStore();

	function onPlayBtnPress() {
		setIsPaused((paused) => !paused);
	}

	return (
		<View style={styles.controlsContainer}>
			<View style={styles.upperControlsContainer}>
				<MultiSlider
					values={[getPercentage(AVCurrPosition, AVDuration) || 0]}
					max={100}
					min={0}
					step={0.01}
					selectedStyle={{
						backgroundColor: colors.text,
						borderTopLeftRadius: 50,
						borderBottomLeftRadius: 50,
					}}
					unselectedStyle={{
						borderTopRightRadius: 50,
						borderBottomRightRadius: 50,
						backgroundColor: colors.border,
					}}
					markerStyle={{
						borderColor: colors.text,
						borderWidth: 3,
						backgroundColor: colors.background,
						padding: 8,
						top: 5,
					}}
					trackStyle={{ paddingVertical: 5 }}
					onValuesChange={(values) => {
						const percentageToSeconds = (values[0] / 100) * AVDuration;

						if (videoRef) {
							videoRef.current?.seek(percentageToSeconds);
						}
					}}
				/>
				<Text style={{ color: colors.text }}>
					{formatTimestamp(AVCurrPosition)}
				</Text>
			</View>
			<Pressable
				onPress={onPlayBtnPress}
				android_ripple={{ color: colors.text, borderless: true }}
			>
				{!isPaused && <PauseBtn />}
				{isPaused && <PlayBtn />}
			</Pressable>
		</View>
	);
}

function PauseBtn() {
	const { t } = useTranslation();
	const colors = useTheme().colors;
	return (
		<Svg
			viewBox="0 0 30 30"
			width="30px"
			height="30px"
			aria-label={t("tabs.playBtn")}
			fill={colors.text}
		>
			<G>
				<Path
					d="M7,5.8c-0.7,0-1.2,0.5-1.2,1v19.5c0,0.6,0.5,1,1.2,1h3.8c0.7,0,1.2-0.5,1.2-1V6.8c0-0.6-0.5-1-1.2-1C10.9,5.8,7,5.8,7,5.8z
M19.1,5.8c-0.7,0-1.2,0.5-1.2,1v19.5c0,0.6,0.5,1,1.2,1H23c0.7,0,1.2-0.5,1.2-1V6.8c0-0.6-0.5-1-1.2-1H19.1z"
				/>
			</G>
		</Svg>
	);
}

function PlayBtn() {
	const { t } = useTranslation();
	const colors = useTheme().colors;
	return (
		<Svg
			fill={colors.text}
			aria-label={t("tabs.playBtn")}
			width="30px"
			height="30px"
			viewBox="-7 0 32 32"
		>
			<G strokeWidth="0" />
			<G strokeLinecap="round" strokeLinejoin="round" />
			<G>
				<Path d="M0 6.688v18.906c0 0.344 0.156 0.625 0.469 0.813 0.125 0.094 0.344 0.125 0.5 0.125s0.281-0.031 0.438-0.125l16.375-9.438c0.313-0.219 0.5-0.5 0.5-0.844 0-0.313-0.188-0.594-0.5-0.813l-16.375-9.438c-0.563-0.406-1.406 0.094-1.406 0.813z" />
			</G>
		</Svg>
	);
}

const styles = StyleSheet.create({
	controlsContainer: {
		display: "flex",
		alignItems: "center",
	},
	upperControlsContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: 3,
	},
});
