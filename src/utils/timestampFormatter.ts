const arabicNums2EnglishNums = (string: string) =>
	string.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));

export default function formatTimestamp(time: number) {
	const zeroFormatter = new Intl.NumberFormat(undefined, {
		minimumIntegerDigits: 2,
	});
	const seconds = Math.floor(time % 60);
	const minutes = Math.floor(time / 60) % 60;
	const hours = Math.floor(time / 3600);

	if (hours === 0) {
		return arabicNums2EnglishNums(
			`${minutes}:${zeroFormatter.format(seconds)}`,
		);
	}
	return arabicNums2EnglishNums(
		`${hours}:${zeroFormatter.format(minutes)}:${zeroFormatter.format(
			seconds,
		)}`,
	);
}
