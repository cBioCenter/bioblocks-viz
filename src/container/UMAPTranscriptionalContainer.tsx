import { Set } from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { createContainerActions } from '~bioblocks-viz~/action';
import { ICategoricalAnnotation, IUMAPVisualizationProps, UMAPVisualization } from '~bioblocks-viz~/component';
import { BioblocksVisualization } from '~bioblocks-viz~/container';
import { ILabel, Marker } from '~bioblocks-viz~/data';
import { EMPTY_FUNCTION, subsample } from '~bioblocks-viz~/helper';
import { BioblocksMiddlewareTransformer, IBioblocksStateTransform } from '~bioblocks-viz~/reducer';
import { getSpring, selectCurrentItems } from '~bioblocks-viz~/selector';

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

    currentCells: Set<number>;
    currentLabels: Set<string>;

    /** Callback for a label being added. */
    onLabelAdd(label: string): void;
    /** Callback for a label being removed. */
    onLabelRemove(label: string): void;
    setCurrentCells(cells: number[]): void;
  };

export interface IUMAPTranscriptionalContainerState {
  // completeSampleAnnotations: ILabelCategory2;
  completeSampleAnnotations: Record<string, Array<ILabel | undefined>>;
  errorMessages: string[];
}

export class UMAPTranscriptionalContainerClass extends BioblocksVisualization<
  IUMAPTranscriptionalContainerProps,
  IUMAPTranscriptionalContainerState
> {
  public static defaultProps = {
    currentCells: Set<number>(),
    currentLabels: Set<string>(),
    numIterationsBeforeReRender: 1,
    numSamplesToShow: 4000,
    onLabelAdd: EMPTY_FUNCTION,
    onLabelRemove: EMPTY_FUNCTION,
    setCurrentCells: EMPTY_FUNCTION,
  };

  private subsampledIndices = new Array<number>();

  constructor(props: IUMAPTranscriptionalContainerProps) {
    super(props);
    this.state = {
      completeSampleAnnotations: {},
      errorMessages: [],
    };
  }

  public setupDataServices() {
    this.registerDataset('cells', []);
    this.registerDataset('labels', []);
    BioblocksMiddlewareTransformer.addTransform(this.getLabelToCellTransform());
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

    const dataLabels = new Array<ILabel | undefined>();
    const subsampledSampleNames = new Array<string>();
    const subsampledData = new Array<number[]>();

    for (const idx of this.subsampledIndices) {
      if (dataMatrix[idx]) {
        subsampledData.push(dataMatrix[idx]);
      }

      if (labelCategory && completeSampleAnnotations && completeSampleAnnotations[labelCategory]) {
        const labelAnnotations = completeSampleAnnotations[labelCategory];
        const sampleLabel = labelAnnotations[idx];
        dataLabels.push(sampleLabel);
        subsampledSampleNames.push(sampleLabel ? sampleLabel.name : 'unannotated');
      }
    }

    return (
      <UMAPVisualization
        dataLabels={dataLabels}
        dataMatrix={subsampledData}
        errorMessages={errorMessages}
        numIterationsBeforeReRender={numIterationsBeforeReRender}
        onLabelChange={this.onLabelChange}
        tooltipNames={subsampledSampleNames}
        {...rest}
      />
    );
  }

  protected getLabelToCellTransform(): IBioblocksStateTransform {
    return {
      fn: state => {
        const { currentLabels } = this.props;
        const { graphData } = getSpring(state);

        let cellIndices = Set<number>();
        graphData.nodes.forEach(node => {
          const labelsForNode = Object.values(node.labelForCategory);
          currentLabels.forEach(label => {
            if (label && labelsForNode.includes(label)) {
              cellIndices = cellIndices.add(node.number);

              return;
            }
          });
        });

        return cellIndices;
      },
      fromState: 'bioblocks/labels',
      toState: 'bioblocks/cells',
    };
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

  protected onLabelChange = (label: string) => {
    const { currentLabels, onLabelAdd, onLabelRemove } = this.props;
    if (currentLabels.contains(label)) {
      onLabelRemove(label);
    } else {
      onLabelAdd(label);
    }
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

const mapStateToProps = (state: { [key: string]: any }) => ({
  currentCells: selectCurrentItems<number>(state, 'cells'),
  currentLabels: selectCurrentItems<string>(state, 'labels'),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      onLabelAdd: createContainerActions<string>('labels').add,
      onLabelRemove: createContainerActions<string>('labels').remove,
      setCurrentCells: createContainerActions<number>('cells').set,
    },
    dispatch,
  );

export const UMAPTranscriptionalContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UMAPTranscriptionalContainerClass);
