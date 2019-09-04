import * as React from 'react';
import { ICategoricalAnnotation, IUMAPVisualizationProps, UMAPVisualization } from '~bioblocks-viz~/component';
import { ILabel, Marker } from '~bioblocks-viz~/data';
import { subsample } from '~bioblocks-viz~/helper';

export type IUMAPTranscriptionalContainerProps = Required<
  Pick<IUMAPVisualizationProps, 'dataMatrix' | 'numIterationsBeforeReRender'>
> &
  Partial<IUMAPVisualizationProps> & {
    // if the number of data points are too large, the container will randomly subsample points
    numSamplesToShow: number;
    categoricalAnnotations?: ICategoricalAnnotation;
    labelCategory?: string;

    // names of the samples (will be displayed in tooltip)
    sampleNames?: string[];
  };

export interface IUMAPTranscriptionalContainerState {
  // completeSampleAnnotations: ILabelCategory2;
  completeSampleAnnotations: Record<string, Array<ILabel | undefined>>;
  errorMessages: string[];
}

export class UMAPTranscriptionalContainer extends React.Component<
  IUMAPTranscriptionalContainerProps,
  IUMAPTranscriptionalContainerState
> {
  public static defaultProps = {
    numIterationsBeforeReRender: 1,
    numSamplesToShow: 4000,
  };

  private subsampledIndices = new Array<number>();

  constructor(props: IUMAPTranscriptionalContainerProps) {
    super(props);
    this.state = {
      completeSampleAnnotations: {},
      errorMessages: [],
    };
  }

  public componentDidMount() {
    this.prepareData();
  }

  public componentDidUpdate(
    prevProps: IUMAPTranscriptionalContainerProps,
    prevState: IUMAPTranscriptionalContainerState,
  ) {
    if (
      prevProps.dataMatrix !== this.props.dataMatrix ||
      prevProps.numSamplesToShow !== this.props.numSamplesToShow ||
      prevProps.sampleNames !== this.props.sampleNames ||
      prevProps.categoricalAnnotations !== this.props.categoricalAnnotations ||
      prevProps.labelCategory !== this.props.labelCategory
    ) {
      this.prepareData(prevProps.categoricalAnnotations === this.props.categoricalAnnotations);
    }
  }

  public render() {
    const { dataMatrix, labelCategory, numIterationsBeforeReRender, numSamplesToShow, ...rest } = this.props;
    const { completeSampleAnnotations, errorMessages } = this.state;

    let dataLabels = new Array<ILabel | undefined>();
    let subsampledSampleNames = new Array<string>();
    let subsampledData = new Array(new Array<number>());

    if (this.subsampledIndices.length > 0) {
      subsampledData = this.subsampledIndices.map(idx => dataMatrix[idx]);

      if (labelCategory && completeSampleAnnotations && completeSampleAnnotations[labelCategory]) {
        const labelAnnotations = completeSampleAnnotations[labelCategory];
        dataLabels = this.subsampledIndices.map(idx => {
          return labelAnnotations[idx];
        });
        subsampledSampleNames = this.subsampledIndices.map(idx => {
          const sampleLabel = labelAnnotations[idx];

          return sampleLabel ? sampleLabel.name : 'unannotated';
        });
      }
    }

    return (
      <UMAPVisualization
        dataLabels={dataLabels}
        dataMatrix={subsampledData}
        errorMessages={errorMessages}
        tooltipNames={subsampledSampleNames}
        numIterationsBeforeReRender={numIterationsBeforeReRender}
        {...rest}
      />
    );
  }

  protected getAnnotations = () => {
    const { categoricalAnnotations } = this.props;
    const annotations: Record<string, Array<ILabel | undefined>> = {};
    if (categoricalAnnotations) {
      Object.keys(categoricalAnnotations).forEach((catName: string) => {
        // build the annotations state object from the prop
        const propLabelList = categoricalAnnotations[catName].label_list;
        const propLabelColors = categoricalAnnotations[catName].label_colors;

        let stateLabelStyles;
        if (!propLabelColors || Object.keys(propLabelColors).length === 0) {
          // auto generate styles for the labels
          stateLabelStyles = Marker.colors.autoColorFromStates(propLabelList);
        } else {
          stateLabelStyles = propLabelList.map(labelName => {
            if (propLabelColors[labelName]) {
              return {
                color: propLabelColors[labelName],
                name: labelName,
              };
            }

            return undefined;
          });
        }

        annotations[catName] = stateLabelStyles;
      });
    }

    return annotations;
  };

  protected getErrorMessages = (annotationsUnchanged: boolean) => {
    const { categoricalAnnotations, dataMatrix, sampleNames } = this.props;
    // rudimentary error checking
    const errorMessages = new Array<string>();
    if (sampleNames && dataMatrix.length !== sampleNames.length) {
      errorMessages.push(
        `The ${sampleNames.length} sample names provided do not account for all ${dataMatrix.length} data matrix rows.`,
      );
    }
    if (annotationsUnchanged === false && categoricalAnnotations) {
      Object.keys(categoricalAnnotations).forEach(labelCategory => {
        const category = categoricalAnnotations[labelCategory];
        if (category.label_list.length !== dataMatrix.length) {
          errorMessages.push(
            `Label category ${labelCategory} does not provide labels for all ${dataMatrix.length} samples in the data matrix.`,
          );
        }
      });
    }

    return errorMessages;
  };

  protected prepareData(annotationsUnchanged: boolean = false) {
    const { numSamplesToShow } = this.props;

    const errorMessages = this.getErrorMessages(annotationsUnchanged);

    // auto generate marker properties if they are not explicitly set
    let annotations = this.state.completeSampleAnnotations;
    if (annotationsUnchanged === false) {
      annotations = this.getAnnotations();
    }

    // subsample data if needed
    if (!this.subsampledIndices || this.subsampledIndices.length !== numSamplesToShow) {
      this.subsampledIndices = subsample(this.props.dataMatrix, numSamplesToShow, true) as number[];
    }
    this.setState({
      completeSampleAnnotations: annotations,
      errorMessages,
    });
  }
}
