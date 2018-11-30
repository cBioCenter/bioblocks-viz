import * as React from 'react';

import { ISpringGraphData } from '~chell-viz~/data';
import { fetchSpringData } from '~chell-viz~/helper';

export interface ISpringContext {
  graphData: ISpringGraphData;
  selectedCategories: string[];
  addCategories(categories: string[]): void;
  addCategory(category: string): void;
  handleCategory(category: string, nodes: number[]): void;
  removeCategory(category: string): void;
  setCategories(categories: string[]): void;
  toggleCategory(category: string): void;
}

export const initialSpringContext: ISpringContext = {
  addCategories: categories => {
    return;
  },
  addCategory: category => {
    return;
  },
  graphData: { links: [], nodes: [] },
  handleCategory: (category: string, cells: number[]) => {
    return;
  },
  removeCategory: category => {
    return;
  },
  selectedCategories: [],
  setCategories: categories => {
    return;
  },
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
      addCategories: this.onAddCategories(),
      addCategory: this.onAddCategory(),
      handleCategory: this.onHandleCategory(),
      removeCategory: this.onRemoveCategory(),
      setCategories: this.onSetCategories(),
      toggleCategory: this.onToggleCategory(),
    };
  }

  public async componentDidMount() {
    const graphData = await fetchSpringData('datasets/hpc/full');
    this.setState({
      graphData,
      selectedCategories: [],
    });
  }

  public render() {
    return <SpringContext.Provider value={this.state}>{this.props.children}</SpringContext.Provider>;
  }

  protected onAddCategories = () => (categories: string[]) => {
    const { selectedCategories } = this.state;
    this.setState({
      selectedCategories: [
        ...selectedCategories,
        ...categories.filter(category => !selectedCategories.includes(category)),
      ],
    });
  };

  protected onAddCategory = () => (category: string) => {
    const { selectedCategories } = this.state;
    if (!selectedCategories.includes(category)) {
      this.setState({
        selectedCategories: [...selectedCategories, category],
      });
    }
  };

  protected onHandleCategory = () => (category: string, nodes: number[]) => {
    if (nodes.length === 0) {
      this.onRemoveCategory()(category);
    } else {
      this.onAddCategory()(category);
    }
  };

  protected onRemoveCategory = () => (category: string) => {
    const { selectedCategories } = this.state;
    const categoryIndex = selectedCategories.indexOf(category);

    if (categoryIndex >= 0) {
      this.setState({
        selectedCategories: [
          ...selectedCategories.slice(0, categoryIndex),
          ...selectedCategories.slice(categoryIndex + 1),
        ],
      });
    }
  };

  protected onSetCategories = () => (selectedCategories: string[]) => {
    this.setState({
      selectedCategories,
    });
  };

  protected onToggleCategory = () => (category: string) => {
    const { selectedCategories } = this.state;
    const categoryIndex = selectedCategories.indexOf(category);

    if (categoryIndex >= 0) {
      this.setState({
        selectedCategories: [
          ...selectedCategories.slice(0, categoryIndex),
          ...selectedCategories.slice(categoryIndex + 1),
        ],
      });
    } else {
      this.setState({
        selectedCategories: [...selectedCategories, category],
      });
    }
  };
}
