import type { IInputFile } from "../stores/filePathStore";

export const getIsAudio = (inputFile: IInputFile | null) => {
	if (!inputFile) return;

	if (inputFile?.mimeType !== undefined) {
		return inputFile?.mimeType.includes("audio");
	}

	const inputFilePath = inputFile?.uri.toLowerCase();
	return (
		inputFilePath?.includes("mp3") ||
		inputFilePath?.includes("aac") ||
		inputFilePath?.includes("ogg")
	);
};
