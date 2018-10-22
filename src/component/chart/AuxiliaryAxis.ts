import { Datum } from 'plotly.js-gl2d-dist';

import { Chell1DSection, IPlotlyData } from '~chell-viz~/data';

/**
 * Shorthand to refer to something with both an x and y axis.
 */
export interface IAxisMapping {
  /** The x axis. */
  x: Partial<IPlotlyData>;
  /** The y axis. */
  y: Partial<IPlotlyData>;
}

/**
 * Class to represent an extra x and/or y axis for a Plotly chart.
 */
export class AuxiliaryAxis<T extends string> {
  protected axes: Map<T, IAxisMapping> = new Map();
  protected highlightedAxes: Map<T, IAxisMapping> = new Map();

  /**
   * Get all the axis objects belonging to this Auxiliary Axis.
   */
  public get axis() {
    return this.axes;
  }

  /**
   * Get all the x-axis objects belonging to this Auxiliary Axis.
   */
  public get xAxes() {
    const result = new Array<Partial<IPlotlyData>>();
    this.axes.forEach(value => {
      result.push(value.x);
    });

    return result;
  }

  /**
   * Get all the highlighted x-axis objects belonging to this Auxiliary Axis.
   */
  public get highlightedXAxes() {
    const result = new Array<Partial<IPlotlyData>>();
    this.highlightedAxes.forEach(value => {
      result.push(value.x);
    });

    return result;
  }

  /**
   * Get all the y-axis objects belonging to this Auxiliary Axis.
   */
  public get yAxes() {
    const result = new Array<Partial<IPlotlyData>>();
    this.axes.forEach(value => {
      result.push(value.y);
    });

    return result;
  }

  /**
   * Get all the highlighted y-axis objects belonging to this Auxiliary Axis.
   */
  public get highlightedYAxes() {
    const result = new Array<Partial<IPlotlyData>>();
    this.highlightedAxes.forEach(value => {
      result.push(value.y);
    });

    return result;
  }

  /**
   * Creates an instance of AuxiliaryAxis.
   * @param sections The underlying data to be represented by these axes.
   * @param [axisIndex=2] The index of this axis, if there are multiple auxiliary axes.
   * @param [defaultColor='black'] What color should the axis be by default?
   * @param [colorMap] Allows specific data pieces to be colored.
   * @param [dataTransformFn] Determine how a section is to be transformed to the main and opposite axis.
   *  For example, for a sine wave, the main axis increments by 1 but the opposite needs to be increased by a Math.sin() call.
   * @param [filterFn=() => false] Function to allow certain elements to be filtered out and thus not show up on the axis.
   */
  constructor(
    readonly sections: Array<Chell1DSection<T>>,
    readonly axisIndex: number = 2,
    readonly defaultColor = 'black',
    readonly colorMap?: { [key: string]: string },
    readonly dataTransformFn?: {
      [key: string]: (section: Chell1DSection<T>, index: number) => { main: number; opposite: number };
    },
    readonly filterFn: (section: Chell1DSection<T>) => boolean = () => false,
  ) {
    this.setupAuxiliaryAxis();
  }

  public getAxisById(id: T) {
    return this.axes.get(id);
  }

  /**
   * Create the Auxiliary Axis.
   */
  protected setupAuxiliaryAxis() {
    for (const section of this.sections) {
      if (this.filterFn(section)) {
        continue;
      }

      const { label } = section;
      if (!this.axes.has(label)) {
        this.axes.set(label, {
          x: this.generateXAxisSegment(label),
          y: this.generateYAxisSegment(label),
        });
      }

      if (!this.highlightedAxes.has(label)) {
        this.highlightedAxes.set(label, {
          x: this.generateHighlightedXAxisSegment(label),
          y: this.generateHighlightedYAxisSegment(label),
        });
      }

      const labelAxis = this.axes.get(label);
      const highlightAxis = this.highlightedAxes.get(label);
      if (labelAxis && highlightAxis) {
        const points = this.derivePointsInAxis(section);
        (labelAxis.x.x as Datum[]).push(...points.main);
        (labelAxis.x.y as Datum[]).push(...points.opposite);
        (labelAxis.y.y as Datum[]).push(...points.main);
        (labelAxis.y.x as Datum[]).push(...points.opposite);

        const highlightedPoints = this.deriveHighlightedPointsInAxis(section);
        (highlightAxis.x.x as Datum[]).push(...highlightedPoints.main);
        (highlightAxis.x.y as Datum[]).push(...highlightedPoints.opposite);
        (highlightAxis.y.y as Datum[]).push(...highlightedPoints.main);
        (highlightAxis.y.x as Datum[]).push(...highlightedPoints.opposite);
      }
    }
  }

  /**
   * Plotly data specific for the x axis.
   *
   * @param key The label for this piece of data.
   */
  protected generateXAxisSegment = (key: T): Partial<IPlotlyData> => ({
    ...this.auxiliaryAxisDefaults(key),
    orientation: 'h',
    xaxis: 'x',
    yaxis: `y${this.axisIndex}`,
  });

  /**
   * Plotly data specific for the highlighted x axis.
   *
   * @param key The label for this piece of data.
   */
  protected generateHighlightedXAxisSegment = (key: T): Partial<IPlotlyData> => ({
    ...this.highlightedAuxiliaryAxisDefaults(key),
    orientation: 'h',
    xaxis: 'x',
    yaxis: `y${this.axisIndex}`,
  });

  /**
   * Plotly data specific for the y axis.
   *
   * @param key The label for this piece of data.
   */
  protected generateYAxisSegment = (key: T): Partial<IPlotlyData> => ({
    ...this.auxiliaryAxisDefaults(key),
    orientation: 'v',
    xaxis: `x${this.axisIndex}`,
    yaxis: 'y',
  });

  /**
   * Plotly data specific for the highlighted y axis.
   *
   * @param key The label for this piece of data.
   */
  protected generateHighlightedYAxisSegment = (key: T): Partial<IPlotlyData> => ({
    ...this.highlightedAuxiliaryAxisDefaults(key),
    orientation: 'v',
    xaxis: `x${this.axisIndex}`,
    yaxis: 'y',
  });

  /**
   * Default plotly data for an axis.
   *
   * @param key The label for this piece of data.
   */
  protected auxiliaryAxisDefaults = (key: T): Partial<IPlotlyData> => ({
    connectgaps: false,
    hoverinfo: 'none',
    line: {
      color: this.colorMap && this.colorMap[key] ? this.colorMap[key] : this.defaultColor,
      shape: 'spline',
      smoothing: 1.3,
      width: 1.5,
    },
    marker: {
      symbol: [],
    },
    mode: 'lines',
    name: key,
    showlegend: false,
    type: 'scatter',
    x: [],
    y: [],
  });

  /**
   * Default plotly data for a highlighted axis.
   *
   * @param key The label for this piece of data.
   */
  protected highlightedAuxiliaryAxisDefaults = (key: T): Partial<IPlotlyData> => ({
    ...this.auxiliaryAxisDefaults(key),
    fill: 'toself',
    line: {
      color: this.colorMap && this.colorMap[key] ? this.colorMap[key] : this.defaultColor,
      width: 0,
    },
  });

  /**
   * Determines the points that make up the axis for both the main and opposite axis side.
   * @param section The section of data to derive points for.
   */
  protected derivePointsInAxis = (section: Chell1DSection<T>) => {
    const result = {
      main: [section.start],
      opposite: [null] as Array<number | null>,
    };

    for (let i = section.start; i <= section.end; ++i) {
      const transformResult =
        this.dataTransformFn && this.dataTransformFn[section.label]
          ? this.dataTransformFn[section.label](section, i)
          : { main: i, opposite: -1 };
      result.main.push(transformResult.main);
      result.opposite.push(transformResult.opposite);
    }

    result.main.push(section.end);
    result.opposite.push(null);

    return result;
  };

  protected deriveHighlightedPointsInAxis = (section: Chell1DSection<T>) => {
    const result = {
      main: [section.start],
      opposite: [null] as Array<number | null>,
    };

    result.main.push(section.start);
    result.opposite.push(-1);

    result.main.push(section.start);
    result.opposite.push(1);

    result.main.push(section.end);
    result.opposite.push(1);

    result.main.push(section.end);
    result.opposite.push(-1);

    result.main.push(section.end);
    result.opposite.push(null);

    return result;
  };
}
