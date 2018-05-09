// https://facebook.github.io/jest/docs/en/manual-mocks.html
import * as NGL from 'ngl';

const ngl = jest.genMockFromModule<typeof NGL>('ngl');

(ngl.Stage as any).mockImplementation((canvas: HTMLCanvasElement) => {
  return {
    addComponentFromObject: jest.fn(() => ({
      addRepresentation: jest.fn(),
      removeRepresentation: jest.fn(),
      reprList: [],
      stage: {
        mouseControls: {
          add: jest.fn(),
        },
      },
    })),
    defaultFileRepresentation: jest.fn(),
    dispose: jest.fn(),
    removeAllComponents: jest.fn(),
    signals: {
      clicked: {
        add: jest.fn(),
      },
    },
  };
});

module.exports = ngl;
