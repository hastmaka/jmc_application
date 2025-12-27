import PropTypes from "prop-types";

export const getUniqueFiles = (filesToAdd, localFiles, iterator) => {
	const uniqueItems = [];
	const alreadyExist = [];
	
	// Iterate through each file in filesToAdd
	filesToAdd.forEach(fileToAdd => {
		const name = fileToAdd[iterator].split('.').slice(0, -1).join('.');
		// Check if the name of the file being added matches the name of any file in localFiles
		if (localFiles.some(localFile => localFile[iterator] === name || localFile.file_name === name)) {
			alreadyExist.push(name); // File already exists, add to alreadyExist array
		} else {
			uniqueItems.push(fileToAdd); // File does not exist, add to uniqueItems array
		}
	});
	
	return { uniqueItems, alreadyExist };
}

getUniqueFiles.propTypes = {
	filesToAdd: PropTypes.array.isRequired,
	localFiles: PropTypes.array.isRequired,
	iterator: PropTypes.string.isRequired
}