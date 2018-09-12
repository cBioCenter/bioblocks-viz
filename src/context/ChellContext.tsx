import * as React from 'react';

import { RESIDUE_TYPE } from '../data/chell-data';
import { CellContextHandler } from './CellContext';
import ResidueContext, { initialResidueContext } from './ResidueContext';
import { initialSecondaryStructureContext, SecondaryStructureContextHandler } from './SecondaryStructureContext';
import { initialSpringContext, SpringContextHandler } from './SpringContext';

export const initialState = {
  residueContext: {
    ...initialResidueContext,
  },
  secondaryStructureContext: {
    ...initialSecondaryStructureContext,
  },
  springContext: {
    ...initialSpringContext,
  },
};

export type ChellContextState = Readonly<typeof initialState>;

export default class ChellContext extends React.Component<any, ChellContextState> {
  public readonly state: ChellContextState = initialState;

  constructor(props: any) {
    super(props);
    this.state = {
      ...this.state,
      residueContext: {
        ...this.state.residueContext,
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
      },
      secondaryStructureContext: {
        ...this.state.secondaryStructureContext,
      },
      springContext: {
        ...this.state.springContext,
      },
    };
  }

  public render() {
    return (
      <SecondaryStructureContextHandler>
        <SpringContextHandler>
          <CellContextHandler>
            <ResidueContext.Provider value={this.state.residueContext}>{this.props.children}</ResidueContext.Provider>
          </CellContextHandler>
        </SpringContextHandler>
      </SecondaryStructureContextHandler>
    );
  }

  public onAddCandidateResidues = (candidateResidues: RESIDUE_TYPE[]) => {
    this.setState({
      residueContext: {
        ...this.state.residueContext,
        candidateResidues: candidateResidues.sort(),
      },
    });
  };

  public onAddHoveredResidues = (hoveredResidues: RESIDUE_TYPE[]) => {
    this.setState({
      residueContext: {
        ...this.state.residueContext,
        hoveredResidues: hoveredResidues.sort(),
      },
    });
  };

  public onAddLockedResiduePair = (residues: RESIDUE_TYPE[]) => {
    const { lockedResiduePairs } = this.state.residueContext;
    const sortedResidues = residues.sort();
    const residuePairKey = sortedResidues.toString();
    if (!lockedResiduePairs.has(residuePairKey)) {
      const result = new Map(lockedResiduePairs);
      result.set(residuePairKey, sortedResidues);
      this.setState({
        residueContext: {
          ...this.state.residueContext,
          lockedResiduePairs: result,
        },
      });
    }
  };

  public onClearAllResidues = () => {
    this.setState({
      residueContext: {
        ...this.state.residueContext,
        candidateResidues: [],
        hoveredResidues: [],
        lockedResiduePairs: new Map(),
      },
    });
  };

  public onRemoveAllLockedResiduePairs = () => {
    this.setState({
      residueContext: {
        ...this.state.residueContext,
        lockedResiduePairs: new Map(),
      },
    });
  };

  public onRemoveCandidateResidue = () => {
    this.setState({
      residueContext: {
        ...this.state.residueContext,
        candidateResidues: [],
      },
    });
  };

  public onRemoveHoveredResidues = () => {
    this.setState({
      residueContext: {
        ...this.state.residueContext,
        hoveredResidues: [],
      },
    });
  };

  public onRemoveLockedResiduePair = (residues: RESIDUE_TYPE[]) => {
    const residuePairKey = residues.sort().join(',');
    const { lockedResiduePairs } = this.state.residueContext;
    if (lockedResiduePairs.has(residuePairKey)) {
      const result = new Map(lockedResiduePairs);
      result.delete(residuePairKey);
      this.setState({
        residueContext: {
          ...this.state.residueContext,
          lockedResiduePairs: result,
        },
      });
    }
  };

  public onRemoveNonLockedResidues = () => {
    this.setState({
      residueContext: {
        ...this.state.residueContext,
        candidateResidues: [],
        hoveredResidues: [],
      },
    });
  };

  public onToggleLockedResiduePair = (residues: RESIDUE_TYPE[]) => {
    const { lockedResiduePairs } = this.state.residueContext;
    const sortedResidues = residues.sort();
    const residuePairKey = sortedResidues.toString();
    const result = new Map(lockedResiduePairs);
    if (!lockedResiduePairs.has(residuePairKey)) {
      result.set(residuePairKey, sortedResidues);
    } else {
      result.delete(residuePairKey);
    }
    this.setState({
      residueContext: {
        ...this.state.residueContext,
        lockedResiduePairs: result,
      },
    });
  };
}

export { ChellContext };
