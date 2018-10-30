const igvMock = {
  ...jest.mock('igv'),
  createBrowser: jest.fn(async () => Promise.resolve()),
};

// tslint:disable-next-line:export-name
export = igvMock;
