const tensorFlowMock = Promise.resolve({
  tensor: (data: any[]) => data,
});

// tslint:disable-next-line:export-name
export = tensorFlowMock;
