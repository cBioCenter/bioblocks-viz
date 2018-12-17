import { Set } from 'immutable';
import * as React from 'react';

import { CELL_TYPE, ISpringNode } from '~chell-viz~/data';
import { fetchSpringData } from '~chell-viz~/helper';

export const initialSpringContext = {
  addLabel: (label: string) => {
    return;
  },
  addLabels: (labels: string[]) => {
    return;
  },
  categories: Set<string>(),
  changeCategory: (selectedCategory: string) => {
    return;
  },
  currentCells: Set<CELL_TYPE>(),
  graphData: { nodes: new Array<ISpringNode>() },
  labelsByCategory: new Map<string, Set<string>>(),
  removeAllCells: () => {
    return;
  },
  removeCells: (cells: CELL_TYPE[]) => {
    return;
  },
  removeLabel: (label: string) => {
    return;
  },
  removeLabels: (labels: string[]) => {
    return;
  },
  selectedCategory: '',
  selectedLabels: Set<string>(),
  setCells: (cells: CELL_TYPE[]) => {
    return;
  },
  toggleLabels: (labels: string[]) => {
    return;
  },
  update: (cells: CELL_TYPE[], selectedCategory?: string, label?: string) => {
    return;
  },
};

export type ISpringContext = typeof initialSpringContext;

export type SpringContextState = Readonly<typeof initialSpringContext>;

export const SpringContext = React.createContext(initialSpringContext);

export interface ISpringContextProps {
  datasetLocation?: string;
}

export class SpringContextProvider extends React.Component<ISpringContextProps, SpringContextState> {
  public constructor(props: ISpringContextProps) {
    super(props);
    this.state = {
      ...initialSpringContext,
      addLabel: this.onAddLabel,
      addLabels: this.onAddLabels,
      changeCategory: this.onChangeCategory,
      removeAllCells: this.onRemoveAllCells,
      removeCells: this.onRemoveCells,
      removeLabel: this.onRemoveLabel,
      removeLabels: this.onRemoveLabels,
      setCells: this.onSetCells,
      toggleLabels: this.onToggleLabels,
      update: this.onUpdate,
    };
  }

  public async componentDidMount() {
    await this.setupData();
  }

  public async componentDidUpdate(prevProps: ISpringContextProps) {
    if (this.props.datasetLocation !== prevProps.datasetLocation) {
      await this.setupData();
    }
  }

  public render() {
    return <SpringContext.Provider value={this.state}>{this.props.children}</SpringContext.Provider>;
  }

  protected async setupData() {
    try {
      const graphData = await fetchSpringData(`assets/datasets/${this.props.datasetLocation}`);
      const categories = Set<string>(
        graphData.nodes.length >= 1 ? Object.keys(graphData.nodes[0].labelForCategory) : [],
      );
      const labelsByCategory = new Map<string, Set<string>>();

      categories.forEach(category => {
        if (category) {
          const labels = Set<string>(Array.from(graphData.nodes.map(node => node.labelForCategory[category])));
          labelsByCategory.set(category, labels);
        }
      });

      this.setState({
        categories,
        graphData,
        labelsByCategory,
      });
    } catch (e) {
      console.log(e);
    }
  }

  protected deriveCurrentCellsFromLabels = (selectedLabels: Set<string>) => {
    const { categories, graphData, labelsByCategory } = this.state;
    let validCategories = Set<string>();
    selectedLabels.forEach(label => {
      if (label) {
        categories.forEach(category => {
          if (category) {
            const labels = labelsByCategory.get(category);
            if (labels && labels.includes(label)) {
              validCategories = validCategories.add(category);
            }
          }
        });
      }
    });

    let cellIndices = Set<number>();
    for (const node of graphData.nodes) {
      validCategories.forEach(category => {
        if (category && selectedLabels.includes(node.labelForCategory[category])) {
          cellIndices = cellIndices.add(node.number);

          return;
        }
      });
    }

    return cellIndices;
  };

  protected deriveValidLabelsFromCells = (currentCells: CELL_TYPE[]) => {
    const { categories, graphData } = this.state;
    let result = Set<string>();

    for (const cellIndex of currentCells) {
      for (const category of categories.toArray()) {
        result = result.add(graphData.nodes[cellIndex].labelForCategory[category]);
      }
    }

    return result;
  };

  protected onAddLabel = (label: string) => {
    const { selectedLabels } = this.state;
    if (!selectedLabels.includes(label)) {
      this.setState({
        selectedLabels: selectedLabels.add(label),
      });
    }
  };

  protected onAddLabels = (labels: string[]) => {
    let { selectedLabels } = this.state;
    for (const label of labels) {
      if (!selectedLabels.includes(label)) {
        selectedLabels = selectedLabels.add(label);
      }
    }
    this.setState({ selectedLabels });
  };

  protected onChangeCategory = (selectedCategory: string) => {
    this.setState({
      selectedCategory,
    });
  };

  protected onRemoveAllCells = () => {
    this.setState({
      currentCells: Set(),
    });
  };

  protected onRemoveCells = (cellsToRemove: CELL_TYPE[]) => {
    const { currentCells } = this.state;
    this.setState({
      currentCells: Set(currentCells.filter(cell => cell !== undefined && !cellsToRemove.includes(cell))),
    });
  };

  protected onRemoveLabel = (label: string) => {
    const { selectedLabels } = this.state;
    this.setState({
      selectedLabels: selectedLabels.remove(label),
    });
  };

  protected onRemoveLabels = (labels: string[]) => {
    let { selectedLabels } = this.state;
    for (const label of labels) {
      selectedLabels = selectedLabels.remove(label);
    }
    this.setState({
      selectedLabels,
    });
  };

  protected onSetCells = (cells: CELL_TYPE[]) => {
    this.setState({
      currentCells: Set(cells),
    });
  };

  protected onToggleLabels = (labels: string[]) => {
    let { selectedLabels } = this.state;
    for (const label of labels) {
      selectedLabels = selectedLabels.includes(label) ? selectedLabels.remove(label) : selectedLabels.add(label);
    }

    this.setState({
      currentCells: this.deriveCurrentCellsFromLabels(selectedLabels),
      selectedLabels,
    });
  };

  protected onUpdate = (currentCells: CELL_TYPE[], selectedCategory?: string) => {
    this.setState({
      currentCells: Set(currentCells),
      selectedCategory: selectedCategory ? selectedCategory : this.state.selectedCategory,
      selectedLabels: this.deriveValidLabelsFromCells(currentCells),
    });
  };
}
