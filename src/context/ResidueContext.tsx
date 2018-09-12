import * as React from 'react';
import { RESIDUE_TYPE } from '../data/chell-data';

export type ResidueSelection = Map<string, RESIDUE_TYPE[]>;

export const initialResidueContext = {
  addCandidateResidues: (residues: RESIDUE_TYPE[]) => {
    return;
  },
  addHoveredResidues: (residues: RESIDUE_TYPE[]) => {
    return;
  },
  addLockedResiduePair: (residues: RESIDUE_TYPE[]) => {
    return;
  },
  candidateResidues: new Array<RESIDUE_TYPE>(),
  clearAllResidues: () => {
    return;
  },
  hoveredResidues: new Array<RESIDUE_TYPE>(),
  lockedResiduePairs: new Map() as ResidueSelection,
  removeAllLockedResiduePairs: () => {
    return;
  },
  removeCandidateResidues: () => {
    return;
  },
  removeHoveredResidues: () => {
    return;
  },
  removeLockedResiduePair: (residues: RESIDUE_TYPE[]) => {
    return;
  },
  removeNonLockedResidues: () => {
    return;
  },
  toggleLockedResiduePair: (residues: RESIDUE_TYPE[]) => {
    return;
  },
};

export type IResidueContext = typeof initialResidueContext;

export class ResidueContextHandler extends React.Component<any, IResidueContext> {
  constructor(props: any) {
    super(props);
    this.state = {
      ...initialResidueContext,
      addCandidateResidues: this.onAddCandidateResidues,
      addHoveredResidues: this.onAddHoveredResidues,
      addLockedResiduePair: this.onAddLockedResiduePair,
      clearAllResidues: this.onClearAllResidues,
      removeAllLockedResiduePairs: this.onRemoveAllLockedResiduePairs,
      removeCandidateResidues: this.onRemoveCandidateResidue,
      removeHoveredResidues: this.onRemoveHoveredResidues,
      removeLockedResiduePair: this.onRemoveLockedResiduePair,
      removeNonLockedResidues: this.onRemoveNonLockedResidues,
      toggleLockedResiduePair: this.onToggleLockedResiduePair,
    };
  }

  public render() {
    return <ResidueContext.Provider value={this.state}>{this.props.children}</ResidueContext.Provider>;
  }

  protected onAddCandidateResidues = (candidateResidues: RESIDUE_TYPE[]) => {
    this.setState({
      candidateResidues: candidateResidues.sort(),
    });
  };

  protected onAddHoveredResidues = (hoveredResidues: RESIDUE_TYPE[]) => {
    this.setState({
      hoveredResidues: hoveredResidues.sort(),
    });
  };

  protected onAddLockedResiduePair = (residues: RESIDUE_TYPE[]) => {
    const { lockedResiduePairs } = this.state;
    const sortedResidues = residues.sort();
    const residuePairKey = sortedResidues.toString();
    if (!lockedResiduePairs.has(residuePairKey)) {
      const result = new Map(lockedResiduePairs);
      result.set(residuePairKey, sortedResidues);
      this.setState({
        lockedResiduePairs: result,
      });
    }
  };

  protected onClearAllResidues = () => {
    this.setState({
      candidateResidues: [],
      hoveredResidues: [],
      lockedResiduePairs: new Map(),
    });
  };

  protected onRemoveAllLockedResiduePairs = () => {
    this.setState({
      lockedResiduePairs: new Map(),
    });
  };

  protected onRemoveCandidateResidue = () => {
    this.setState({
      candidateResidues: [],
    });
  };

  protected onRemoveHoveredResidues = () => {
    this.setState({
      hoveredResidues: [],
    });
  };

  protected onRemoveLockedResiduePair = (residues: RESIDUE_TYPE[]) => {
    const residuePairKey = residues.sort().join(',');
    const { lockedResiduePairs } = this.state;
    if (lockedResiduePairs.has(residuePairKey)) {
      const result = new Map(lockedResiduePairs);
      result.delete(residuePairKey);
      this.setState({
        lockedResiduePairs: result,
      });
    }
  };

  protected onRemoveNonLockedResidues = () => {
    this.setState({
      candidateResidues: [],
      hoveredResidues: [],
    });
  };

  protected onToggleLockedResiduePair = (residues: RESIDUE_TYPE[]) => {
    const { lockedResiduePairs } = this.state;
    const sortedResidues = residues.sort();
    const residuePairKey = sortedResidues.toString();
    const result = new Map(lockedResiduePairs);
    if (!lockedResiduePairs.has(residuePairKey)) {
      result.set(residuePairKey, sortedResidues);
    } else {
      result.delete(residuePairKey);
    }
    this.setState({
      lockedResiduePairs: result,
    });
  };
}

const ResidueContext = React.createContext({
  ...initialResidueContext,
});

export default ResidueContext;
export { ResidueContext };
