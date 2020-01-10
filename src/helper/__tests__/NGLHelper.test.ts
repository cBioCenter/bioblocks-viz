import { NGLInstanceManager } from '~bioblocks-viz~/helper';

describe('NGLInstanceManager', () => {
  it('Should provide a default NGL implementation.', () => {
    const instance = NGLInstanceManager.instance;
    expect(instance).not.toBeUndefined();
    expect(instance.Version).toEqual('2.0.0-dev.37');
  });

  it('Should allow a different NGL implementation to be provided.', () => {
    const mockInstance: typeof NGLInstanceManager.instance = {
      ...jest.genMockFromModule('ngl'),
      Version: 'test-version',
    };
    NGLInstanceManager.setNGLInstance(mockInstance);
    expect(NGLInstanceManager.instance.Version).toEqual('test-version');
    expect(NGLInstanceManager.instance.autoLoad).not.toBeUndefined();
  });
});
