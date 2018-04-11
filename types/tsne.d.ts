// Type definitions for [tSNEJS] [https://github.com/karpathy/tsnejs]
// Project: [Chell-Viz]
// Definitions by: [BCB @ DF-CI, Drew Diamantoukos] <[http://bcb.dfci.harvard.edu/]>

declare module 'tsnejs' {
  /**
   * Options to configure t-SNE calculation.
   *
   * @export
   * @interface I_T_SNE_Opts
   */
  // tslint:disable-next-line:class-name
  export interface I_T_SNE_Opts {
    /**
     * Dimensions of data - by default 2D.
     *
     * @type {number}
     * @memberof I_T_SNE_Opts
     */
    dim: number;
    /**
     * Learning rate for algorithm.
     *
     * @type {number}
     * @memberof I_T_SNE_Opts
     */
    epsilon: number;
    /**
     * Effective number of nearest neighbors.
     *
     * @type {number}
     * @memberof I_T_SNE_Opts
     */
    perplexity: number;
  }

  /**
   * TO-DO: What is Cost/Gradient?
   *
   * @export
   * @interface ICostGradResult
   */
  export interface ICostGradResult {
    /**
     * TO-DO: What is cost in this context?
     *
     * @type {number}
     * @memberof ICostGradResult
     */
    cost: number;
    /**
     * TO-DO: What is grad in this context?
     *
     * @type {number}
     * @memberof ICostGradResult
     */
    grad: number;
  }

  // tslint:disable-next-line:class-name
  export class tSNE {
    constructor(opt?: I_T_SNE_Opts);

    /**
     * This function creates matrix P from set of points using gaussian kernel.
     *
     * @param {any[][]} x Set of high-dimensional points.
     * @memberof tSNE
     */
    public initDataRaw(x: any[][]): void;

    /**
     * This function takes a given distance matrix and creates matrix P from them.
     *
     * @param {number[][]} D Assumed to be provided as a list of lists, and should be symmetric
     * @memberof tSNE
     */
    public initDataDist(D: number[][]): void;

    /**
     * (re)initializes the solution to random.
     *
     * @memberof tSNE
     */
    public initSolution(): void;

    /**
     * Get current solution data points.
     *
     * @returns {number[][]} Pointer to current solution.
     * @memberof tSNE
     */
    public getSolution(): number[][];

    /**
     * Perform a single step of optimization to improve the embedding.
     *
     * @returns {number} Current cost.
     * @memberof tSNE
     */
    public step(): number;

    /**
     * A gradient check for debugging.
     *
     * @memberof tSNE
     */
    public debugGrad(): void;

    /**
     * Derive both cost and gradient given an arrangement.
     *
     * @param {object} Y Arrangement to compute cost/gradient.
     * @returns {ICostGradResult}
     * @memberof tSNE
     */
    public costGrad(Y: object): ICostGradResult;
  }
}
