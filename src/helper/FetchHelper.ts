export const fetchCSVFile = async (filename: string) => {
  const response = await fetch(filename);
  if (response.ok) {
    return response.text();
  } else {
    throw new Error(genErrorMsg('CSV', response));
  }
};

export const fetchJSONFile = async (filename: string) => {
  const response = await fetch(filename);
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(genErrorMsg('JSON', response));
  }
};

const genErrorMsg = (fileType: string, response: Response) =>
  `Bioblocks-viz error fetching ${fileType} File!\nStatus: ${response.status}\nMessage: ${response.statusText}\n`;

// https://blog.shovonhasan.com/using-promises-with-filereader/
export const readFileAsText = async (inputFile: File) => {
  const temporaryFileReader = new FileReader();

  return new Promise<string>((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject('Problem parsing input file.');
    };

    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result as string);
    };
    temporaryFileReader.readAsText(inputFile);
  });
};
