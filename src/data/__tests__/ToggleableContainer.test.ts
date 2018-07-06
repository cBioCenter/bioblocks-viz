import { ToggleableContainer } from '../ToggleableContainer';

describe('ToggleableArray', () => {
  it('Should allow elements to be added with .add().', () => {
    const result = new ToggleableContainer<number>();
    result.add(4);
    result.add(5, 6);
    expect(Array.from(result)).toEqual([4, 5, 6]);
  });

  it('Should allow elements to be removed with .remove().', () => {
    const result = new ToggleableContainer<number>();
    result.add(4);
    expect(Array.from(result)).toEqual([4]);
    result.remove(4);
    expect(Array.from(result)).toEqual([]);
  });

  it('Should allow all elements to be removed with .clear().', () => {
    const result = new ToggleableContainer<number>();
    result.add(45, 6);
    result.clear();
    expect(Array.from(result)).toEqual([]);
  });

  it('Should allow elements to be added and removed via toggle.', () => {
    const result = new ToggleableContainer<number>();
    result.toggle(4);
    expect(Array.from(result)).toEqual([4]);
    result.toggle(4);
    expect(Array.from(result)).toEqual([]);
  });
});
