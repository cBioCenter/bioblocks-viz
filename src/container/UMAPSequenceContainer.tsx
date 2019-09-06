import * as Papa from 'papaparse';
import * as React from 'react';
import { Button, DropdownProps, Grid, Label, Popup } from 'semantic-ui-react';

import { IUMAPVisualizationProps, UMAPVisualization } from '~bioblocks-viz~/component';
import { ILabel, Marker, SeqRecord } from '~bioblocks-viz~/data';
import { readFileAsText, subsample } from '~bioblocks-viz~/helper';

export interface IUMAPSequenceContainerProps extends Partial<IUMAPVisualizationProps> {
  // if the number of data points are too large, the container will randomly subsample points
  numSequencesToShow: number;
  numIterationsBeforeReRender: number;

  // Text from taxonomy file - only valid when umap is showing sequences:
  //   1. tab delimited with each row being a sequence
  //   2. first row is a header with column names
  //   3. must contain columns 'seq_name': values matched to fasta sequence names
  //                           'phylum': the phylum of the organism the sequence originated from
  //                           'class': the class of the organism the sequence originated from
  taxonomyText?: string;

  labelCategory: string;

  // the sequences to display (will be subsampled)
  allSequences: SeqRecord[];
  showUploadButton: boolean;
}

export interface IUMAPSequenceContainerState {
  labelCategory: string;
  labels: string[];
  randomSequencesDataMatrix: number[][];
  seqNameToTaxonomyMetadata: {
    [seqName: string]: {
      [taxonomyCategory: string]: string;
    };
  };
  subsampledSequences: SeqRecord[];
  tooltipNames: string[];
}

export class UMAPSequenceContainer extends React.Component<IUMAPSequenceContainerProps, IUMAPSequenceContainerState> {
  public static defaultProps = {
    labelCategory: 'class',
    numIterationsBeforeReRender: 1,
    numSequencesToShow: 4000,
    showUploadButton: false,
  };

  constructor(props: IUMAPSequenceContainerProps) {
    super(props);
    this.state = {
      labelCategory: '',
      labels: new Array(),
      randomSequencesDataMatrix: new Array(new Array<number>()),
      seqNameToTaxonomyMetadata: {},
      subsampledSequences: new Array(),
      tooltipNames: new Array(),
    };
  }

  public componentDidMount() {
    this.prepareData();
  }

  public componentDidUpdate(prevProps: IUMAPSequenceContainerProps, prevState: IUMAPSequenceContainerState) {
    const { allSequences, labelCategory, numSequencesToShow, taxonomyText } = this.props;

    if (
      prevProps.allSequences !== allSequences ||
      prevProps.numSequencesToShow !== numSequencesToShow ||
      prevProps.labelCategory !== labelCategory ||
      prevProps.taxonomyText !== taxonomyText
    ) {
      let onlyAnnotationChanged = prevProps.allSequences.length === allSequences.length;
      prevProps.allSequences.forEach((seq, index) => {
        if (!allSequences[index] || seq.sequence.localeCompare(allSequences[index].sequence) !== 0) {
          onlyAnnotationChanged = false;

          return;
        }
      });
      if (onlyAnnotationChanged) {
        if (taxonomyText) {
          this.parseTaxonomy(taxonomyText);
        } else {
          // If sequence metadata only was updated, don't re-sample data.
          this.setupSequenceAnnotation(allSequences, labelCategory);
        }
      } else {
        this.prepareData();
      }
    }
  }

  public render() {
    const { allSequences, numIterationsBeforeReRender, showUploadButton, ...rest } = this.props;
    const { labelCategory, labels, randomSequencesDataMatrix, tooltipNames } = this.state;

    const dataLabels = this.getDataLabels();

    return (
      <Grid centered={true} padded={true}>
        <Grid.Row>
          <UMAPVisualization
            currentLabel={labelCategory}
            dataLabels={dataLabels}
            dataMatrix={randomSequencesDataMatrix}
            // tslint:disable-next-line: jsx-no-lambda
            distanceFn={(seq1, seq2) => this.equalityHammingDistance(seq1, seq2)}
            errorMessages={[]}
            labels={labels}
            numIterationsBeforeReRender={numIterationsBeforeReRender}
            onLabelChange={this.onLabelChange}
            tooltipNames={tooltipNames}
            {...rest}
          />
        </Grid.Row>
        {showUploadButton && <Grid.Row>{this.renderTaxonomyUpload()}</Grid.Row>}
      </Grid>
    );
  }

  protected getDataLabels = () => {
    const { labelCategory, seqNameToTaxonomyMetadata, subsampledSequences } = this.state;
    let dataLabels = new Array<ILabel | undefined>();
    if (seqNameToTaxonomyMetadata) {
      const seqStates = subsampledSequences.map((seq: SeqRecord) => {
        if (seq.annotations.name && seqNameToTaxonomyMetadata[seq.annotations.name]) {
          return seqNameToTaxonomyMetadata[seq.annotations.name][labelCategory];
        }

        return undefined;
      });

      dataLabels = Marker.colors.autoColorFromStates(seqStates);
    }

    return dataLabels;
  };

  protected onLabelChange = (event: React.SyntheticEvent, data: DropdownProps) => {
    this.setState({
      labelCategory: data.value as string,
    });
  };

  protected onTaxonomyUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    const files = (e.target as HTMLInputElement).files;
    if (!files) {
      return;
    }
    const file = files.item(0) as File;
    this.parseTaxonomy(await readFileAsText(file));
  };

  protected renderTaxonomyUpload = () => {
    return (
      <Popup
        trigger={this.renderTaxonomyTrigger()}
        content={
          <>
            <span>A tab delimited file with 2 columns and optional headers:</span>
            <br />
            <span>- First column is sequence name.</span>
            <br />
            <span>- Second column is how to group sequences.</span>
          </>
        }
      />
    );
  };

  protected renderTaxonomyTrigger = () => {
    return (
      <Label as={'label'} basic={true} htmlFor={'upload-taxonomy'}>
        <Button
          icon={'upload'}
          label={{
            basic: true,
            content: 'Upload Taxonomy File',
          }}
          labelPosition={'right'}
        />
        <input
          hidden={true}
          id={'upload-taxonomy'}
          multiple={false}
          onChange={this.onTaxonomyUpload}
          required={true}
          type={'file'}
        />
      </Label>
    );
  };
  /* testing
  public flipAnnotation() {
    const thisObj = this;
    const selectedCat = this.state.selectedLabelCategory;
    setTimeout(() => {
      if (selectedCat === 'class') {
        thisObj.setState({
          selectedLabelCategory: 'phylum',
        });
      } else if (selectedCat === 'phylum') {
        thisObj.setState({
          selectedLabelCategory: 'class',
        });
      }

      thisObj.flipAnnotation();
    }, 5000);
  }*/

  private prepareData() {
    const { allSequences, labelCategory, numSequencesToShow, taxonomyText } = this.props;

    // load taxonomy
    if (taxonomyText) {
      this.parseTaxonomy(taxonomyText); // await taxonomyFile.text());
    } else {
      this.setupSequenceAnnotation(allSequences, labelCategory);
    }

    // load sequences
    // console.log(`all ${allSequences.length} fasta sequences:`, allSequences);

    // slice reasonable number of sequences if needed
    let subsampledSequences = this.state.subsampledSequences;
    if (!subsampledSequences || subsampledSequences.length !== numSequencesToShow) {
      subsampledSequences = subsample(this.props.allSequences, numSequencesToShow) as SeqRecord[];
    }

    this.setState({
      labelCategory,
      randomSequencesDataMatrix: subsampledSequences.map(seq => {
        return seq.integerRepresentation(['-']);
      }),
      subsampledSequences,
      tooltipNames: subsampledSequences.map(seq => (seq.annotations.name ? seq.annotations.name : '')),
    });

    // temporary for testing - flip the color annotation
    // this.flipAnnotation();
  }

  private parseTaxonomy(taxonomyText: string) {
    if (taxonomyText) {
      const isHeaderPresent = taxonomyText.split('\n')[0].includes('seq_name');
      Papa.parse(taxonomyText, {
        complete: results => {
          // simple stats
          // const labelProperties = this.getClassPhylumLabelDescription(); // todo: auto compute
          this.setState({
            labels: isHeaderPresent
              ? results.meta.fields.filter((field: string) => field.toLocaleLowerCase() !== 'sequence')
              : [],
            seqNameToTaxonomyMetadata: results.data.reduce<{
              [seqName: string]: {};
            }>((acc, seqMetadata: { seq_name: string } | string[]) => {
              if (isHeaderPresent) {
                acc[(seqMetadata as { seq_name: string }).seq_name] = seqMetadata;
              } else {
                const seqRow = seqMetadata as string[];
                acc[seqRow[0]] = {
                  seq_name: seqRow[0],
                  [this.props.labelCategory]: seqRow[1],
                };
              }

              return acc;
            }, {}),
          });
        },
        header: isHeaderPresent,
      });
    }
  }

  /**
   * A special hamming distance function that is speed optimized for sequence comparisons.
   * Assumes that sequences are passed with a single integer for each position. If
   * the position is the same in each position then the distance is zero, otherwise
   * the distance is one. The total distance is then the sum of each positional distance.
   * @returns the total distance between a pair of sequences.
   */
  private equalityHammingDistance(seq1: number[], seq2: number[]) {
    let result = 0;
    for (let i = 0; i < seq1.length; i++) {
      if (seq1[i] !== seq2[i]) {
        result += 1;
      }
    }

    return result;
  }

  private setupSequenceAnnotation = (allSequences: SeqRecord[], labelCategory: string) => {
    this.setState({
      seqNameToTaxonomyMetadata: allSequences.reduce<{
        [seqName: string]: {};
      }>((acc, seq) => {
        if (seq.annotations.name && seq.annotations.metadata) {
          acc[seq.annotations.name] = {
            [labelCategory]: seq.annotations.metadata[labelCategory],
          };
        }

        return acc;
      }, {}),
    });
  };
}
