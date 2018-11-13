import * as React from 'react';

import { fetchSpringCoordinateData } from '~chell-viz~/helper';

export interface ISpringContext {
  coordinates: number[][];
  selectedCategories: string[];
  addCategory(category: string): void;
  toggleCategory(category: string): void;
}

export const initialSpringContext: ISpringContext = {
  addCategory: category => {
    return;
  },
  coordinates: [],
  selectedCategories: [],
  toggleCategory: category => {
    return;
  },
};

export type SpringContextState = Readonly<typeof initialSpringContext>;

export const SpringContext = React.createContext(initialSpringContext);

export class SpringContextProvider extends React.Component<any, SpringContextState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      ...initialSpringContext,
      addCategory: this.onAddCategory(),
      toggleCategory: this.onToggleCategory(),
    };
  }

  public async componentDidMount() {
    const coords = await fetchSpringCoordinateData('assets/datasets/hpc/full/coordinates.txt');
    this.setState({
      coordinates: coords,
    });
  }

  public render() {
    return <SpringContext.Provider value={this.state}>{this.props.children}</SpringContext.Provider>;
  }

  protected onAddCategory = () => (category: string) => {
    const { selectedCategories } = this.state;
    if (!selectedCategories.includes(category)) {
      this.setState({
        selectedCategories: [...selectedCategories, category],
      });
    }
  };

  protected onRemoveCategory = () => (category: string) => {
    const { selectedCategories } = this.state;
    const categoryIndex = selectedCategories.indexOf(category);

    if (categoryIndex >= 0) {
      this.setState({
        selectedCategories: [
          ...selectedCategories.splice(0, categoryIndex),
          ...selectedCategories.splice(categoryIndex + 1),
        ],
      });
    }
  };

  protected onToggleCategory = () => (category: string) => {
    const { selectedCategories } = this.state;
    const categoryIndex = selectedCategories.indexOf(category);

    if (categoryIndex >= 0) {
      this.setState({
        selectedCategories: [
          ...selectedCategories.splice(0, categoryIndex),
          ...selectedCategories.splice(categoryIndex + 1),
        ],
      });
    } else {
      this.setState({
        selectedCategories: [...selectedCategories, category],
      });
    }
  };
}
