/// <reference types="react" />
import * as NGL from 'ngl';
import { StructureRepresentationType } from 'ngl';
import * as React from 'react';
import { IResidueSelection } from '../context/ResidueContext';
export declare type NGL_HOVER_CB_RESULT_TYPE = number;
export interface IRepresentationDict {
  [key: string]: NGL.RepresentationElement[];
}
export declare const SUPPORTED_REPS: StructureRepresentationType[];
export declare const NGLComponentWithDefaultProps: React.ComponentType<
  Partial<{
    padding: number;
    width: number;
    addCandidateResidues: (residues: number[]) => void;
    addHoveredResidues: (residues: number[]) => void;
    addLockedResiduePair: (residues: number[]) => void;
    candidateResidues: number[];
    hoveredResidues: number[];
    lockedResiduePairs: IResidueSelection;
    removeAllLockedResiduePairs: () => void;
    removeCandidateResidues: () => void;
    removeHoveredResidues: () => void;
    removeLockedResiduePair: (residues: number[]) => void;
    data: NGL.Structure | undefined;
    height: number;
  }> &
    Required<
      Pick<
        {
          padding: number;
          width: number;
          addCandidateResidues: (residues: number[]) => void;
          addHoveredResidues: (residues: number[]) => void;
          addLockedResiduePair: (residues: number[]) => void;
          candidateResidues: number[];
          hoveredResidues: number[];
          lockedResiduePairs: IResidueSelection;
          removeAllLockedResiduePairs: () => void;
          removeCandidateResidues: () => void;
          removeHoveredResidues: () => void;
          removeLockedResiduePair: (residues: number[]) => void;
          data: NGL.Structure | undefined;
          height: number;
        },
        never
      >
    >
>;
export declare const NGLComponent: (
  props: Partial<{
    padding: number;
    width: number;
    addCandidateResidues: (residues: number[]) => void;
    addHoveredResidues: (residues: number[]) => void;
    addLockedResiduePair: (residues: number[]) => void;
    candidateResidues: number[];
    hoveredResidues: number[];
    lockedResiduePairs: IResidueSelection;
    removeAllLockedResiduePairs: () => void;
    removeCandidateResidues: () => void;
    removeHoveredResidues: () => void;
    removeLockedResiduePair: (residues: number[]) => void;
    data: NGL.Structure | undefined;
    height: number;
  }> &
    Required<
      Pick<
        {
          padding: number;
          width: number;
          addCandidateResidues: (residues: number[]) => void;
          addHoveredResidues: (residues: number[]) => void;
          addLockedResiduePair: (residues: number[]) => void;
          candidateResidues: number[];
          hoveredResidues: number[];
          lockedResiduePairs: IResidueSelection;
          removeAllLockedResiduePairs: () => void;
          removeCandidateResidues: () => void;
          removeHoveredResidues: () => void;
          removeLockedResiduePair: (residues: number[]) => void;
          data: NGL.Structure | undefined;
          height: number;
        },
        never
      >
    >,
) => JSX.Element;
