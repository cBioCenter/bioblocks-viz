// tslint:disable:max-classes-per-file
declare module 'ngl' {
  import { Signal } from 'signals';

  export type SelectionOperator = 'AND' | 'OR';
  export type SelectionTest = false | (() => void);

  export interface ISelectionRule {
    keyword?: any;
    atomname?: string;
    element?: string;
    atomindex?: number[];
    altloc?: string;
    inscode?: string;
    resname?: string | string[];
    sstruc?: string;
    resno?: number | [number, number];
    chainname?: string;
    model?: number;

    error?: string;
    rules?: ISelectionRule[];
    negate?: boolean;
    operator?: SelectionOperator;
  }

  export interface ISelectionSignals {
    stringChanged: Signal;
  }

  export class Selection {
    // Properties
    public atomOnlyTest: SelectionTest;
    public chainOnlyTest: SelectionTest;
    public chainTest: SelectionTest;
    public modelOnlyTest: SelectionTest;
    public modelTest: SelectionTest;
    public residueOnlyTest: SelectionTest;
    public residueTest: SelectionTest;
    public selection: ISelectionRule;
    public signals: ISelectionSignals;
    public string: string;
    public test: SelectionTest;

    // Accessors
    public type: string;

    /**
     * Creates an instance of Selection.
     * @param {string} str Selection string, see selection-language.md doc in ngl library.
     * @memberof Selection
     */
    constructor(str: string);

    // Methods
    public isAllSelection(): boolean;
    public isNoneSelection(): boolean;
    public setString(str: string, silent?: undefined | true | false): void;
  }
}
