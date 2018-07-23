import { Datum } from 'plotly.js';
import Chell1DSection from '../../data/Chell1DSection';
import { IPlotlyData } from './PlotlyChart';

export interface IAxisMapping {
  x: Partial<IPlotlyData>;
  y: Partial<IPlotlyData>;
}

export default class AuxiliaryAxis<T extends string> {
  protected axes: Map<T, IAxisMapping> = new Map();

  public get axis() {
    return this.axes;
  }

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

      const points = this.derivePointsInAxis(section);
      (this.axes.get(label)!.x.x! as Datum[]).push(...points.main);
      (this.axes.get(label)!.x.y! as Datum[]).push(...points.opposite);
      (this.axes.get(label)!.y.y! as Datum[]).push(...points.main);
      (this.axes.get(label)!.y.x! as Datum[]).push(...points.opposite);
    }
  }

  protected generateXAxisSegment = (key: T): Partial<IPlotlyData> => ({
    ...this.auxiliaryAxisDefaults(key),
    orientation: 'h',
    xaxis: 'x',
    yaxis: `y${this.axisIndex}`,
  });

  protected generateYAxisSegment = (key: T): Partial<IPlotlyData> => ({
    ...this.auxiliaryAxisDefaults(key),
    orientation: 'v',
    xaxis: `x${this.axisIndex}`,
    yaxis: 'y',
  });

  protected auxiliaryAxisDefaults = (key: T): Partial<IPlotlyData> => ({
    connectgaps: false,
    hoverinfo: 'name',
    line: {
      color: this.colorMap && this.colorMap[key] ? this.colorMap[key] : this.defaultColor,
      shape: 'spline',
      smoothing: 1.3,
      width: 2,
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
}

export { AuxiliaryAxis };
