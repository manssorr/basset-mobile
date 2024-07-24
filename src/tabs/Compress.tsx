import AudioCompressPicker from "../components/AudioCompressPicker";
import CompressSlider from "../components/CompressSlider";
import { useFilePathStore } from "../stores/filePathStore";
import { getIsAudio } from "../utils/getIsAudio";

function Compress() {
	const { inputFile } = useFilePathStore();

	const isAudio = getIsAudio(inputFile);

	return (
		<>
			{!isAudio && <CompressSlider />}
			{isAudio && <AudioCompressPicker />}
		</>
	);
}

export default Compress;
