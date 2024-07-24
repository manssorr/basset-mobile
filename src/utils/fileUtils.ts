export function getFileExt(file: string) {
	return file.slice(
		(Math.max(0, file.lastIndexOf(".")) || Number.POSITIVE_INFINITY) + 1,
	);
}

export function getFileName(file: string) {
	return file
		?.slice(
			(Math.max(0, file.lastIndexOf("/")) || Number.POSITIVE_INFINITY) + 1,
		)
		.split(".")[0];
}
