import { create } from "zustand";

export interface IInputFile {
	mimeType: string;
	uri: string;
}

type State = {
	inputFile: IInputFile | null;
};

type Action = {
	setInputFile: (inputFile: State["inputFile"]) => void;
};

export const useFilePathStore = create<State & Action>((set) => ({
	inputFile: null,
	setInputFile: (inputFile) => set(() => ({ inputFile: inputFile })),
}));
