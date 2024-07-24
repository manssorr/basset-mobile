import { getPercentage } from "./getPercentage";
import unformatTimestamp from "./timestampUnformatter";

export default function extractProgress(data: string, AVDuration: number) {
	const timeRegex = /time=(\d+:\d+:\d+\.\d+)/;
	const match = data.match(timeRegex);

	if (!match) return;

	const currentEncodingProgress = unformatTimestamp(match[1]) as number;
	const progressPercentage = getPercentage(currentEncodingProgress, AVDuration);

	return progressPercentage;
}
