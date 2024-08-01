import { NavigationContainer, useTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { I18nManager, useColorScheme } from "react-native";
import SettingBtn from "./src/components/SettingBtn";
import SettingsModal from "./src/components/SettingsModal";
import FileUploadScreen from "./src/screens/FileUploadScreen";
import HomeScreen from "./src/screens/HomeScreen";
import { useSettingsModalStore } from "./src/stores/settingsModalStore";
import DarkTheme from "./src/themes/DarkTheme";
import LightTheme from "./src/themes/LightTheme";
import "./i18n";
import OnBoardDialog from "./src/components/OnBoardModal";

const Stack = createNativeStackNavigator();

function App() {
	const { colors } = useTheme();
	const { isVisible, theme } = useSettingsModalStore();
	const defaultColorScheme = useColorScheme();
	I18nManager.allowRTL(false);
	I18nManager.forceRTL(false);

	const systemColorSheme =
		defaultColorScheme === "dark" ? DarkTheme : LightTheme;

	const customTheme =
		theme === "dark" ? DarkTheme : theme === "light" ? LightTheme : DarkTheme;

	const appTheme = theme === "system" ? systemColorSheme : customTheme;
	return (
		<>
			<StatusBar
				style={appTheme.dark ? "light" : "dark"}
				backgroundColor={isVisible ? "rgba(0, 0, 0, 0.5)" : ""}
				animated
			/>
			<NavigationContainer theme={appTheme}>
				<SettingsModal />
				<OnBoardDialog />
				<Stack.Navigator
					screenOptions={{
						title: "",
						headerRight: () => <SettingBtn />,
						headerShadowVisible: false,
					}}
					initialRouteName="Upload file"
				>
					<Stack.Screen name="Home" component={HomeScreen} />
					<Stack.Screen
						options={{
							contentStyle: {
								borderTopColor: colors.border,
								borderTopWidth: 0.2,
							},
						}}
						name="Upload file"
						component={FileUploadScreen}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</>
	);
}

export default App;
