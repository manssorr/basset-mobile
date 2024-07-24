import LanguageDetector from "@os-team/i18next-react-native-language-detector";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationAr from "./src/locales/ar.json";
import translationEn from "./src/locales/en.json";
import "intl-pluralrules";

i18n
	.use(initReactI18next)
	.use(LanguageDetector)
	.init({
		resources: {
			en: {
				translation: translationEn,
			},
			ar: {
				translation: translationAr,
			},
		},
		fallbackLng: "en",
		supportedLngs: ["en", "ar"],
		react: {
			useSuspense: false,
		},
	});

export default i18n;
