import { StyleSheet, View } from "react-native";
import AVPlayer from "../components/AVPlayer";

function Trim() {
	return (
		<View style={styles.container}>
			<AVPlayer />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		margin: 10,
	},
});

export default Trim;
