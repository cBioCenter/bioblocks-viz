export const fetchCSVFile = async (filename: string) => {
  const response = await fetch(filename);
  if (response.ok) {
    return await response.text();
  } else {
    throw new Error(genErrorMsg('CSV', response));
  }
};

export const fetchJSONFile = async (filename: string) => {
  const response = await fetch(filename);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(genErrorMsg('JSON', response));
  }
};

const genErrorMsg = (fileType: string, response: Response) =>
  `Chell-viz error fetching ${fileType} File!\nStatus: ${response.status}\nMessage: ${response.statusText}\n`;

// https://blog.shovonhasan.com/using-promises-with-filereader/
export const readUploadedFileAsText = (inputFile: File): Promise<string> => {
  const temporaryFileReader = new FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException('Problem parsing input file.'));
    };

    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result as any);
    };
    temporaryFileReader.readAsText(inputFile);
  });
};
