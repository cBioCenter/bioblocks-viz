// tslint:disable-next-line:import-name
import Anatomogram from 'anatomogram';
import { Set } from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { LabeledCellsActions } from '~chell-viz~/action';
import { ComponentCard } from '~chell-viz~/component';
import { AnatomogramMapping, CHELL_CSS_STYLE, SPECIES_TYPE } from '~chell-viz~/data';
import { RootState } from '~chell-viz~/reducer';

interface IAnatomogramContainerProps {
  height: number | string;
  selectIds: Set<string>;
  species: SPECIES_TYPE;
  style: CHELL_CSS_STYLE;
  width: number | string;
  addLabel(label: string): void;
}

interface IAnatomogramContainerState {
  ids: string[];
}

class AnatomogramContainerClass extends React.Component<IAnatomogramContainerProps, IAnatomogramContainerState> {
  public static defaultProps = {
    height: '300px',
    style: {},
    width: '400px',
  };

  public static displayName = 'Anatomogram';

  protected divRef: HTMLDivElement | null = null;

  constructor(props: IAnatomogramContainerProps) {
    super(props);
    this.state = {
      ids: Object.keys(AnatomogramMapping[props.species]),
    };
  }

  public componentDidMount() {
    const timeoutHandler = () => {
      if (this.divRef) {
        const svgElements = this.divRef.getElementsByTagName('svg');
        if (svgElements.length >= 1) {
          this.resizeSVGElement(svgElements[0]);
        } else {
          setTimeout(timeoutHandler, 100);
        }
      }
    };
    timeoutHandler();
  }

  public render() {
    const { species, selectIds } = this.props;
    const { ids } = this.state;

    return (
      <div
        className={'anatomogram-container'}
        ref={node => {
          if (node) {
            this.divRef = node.getElementsByTagName('div')[0];
          }
        }}
      >
        <ComponentCard componentName={'Anatomogram'}>
          <Anatomogram
            atlasUrl={``}
            highlightColour={'yellow'}
            onClick={this.onClick}
            onMouseOut={this.onMouseOut}
            onMouseOver={this.onMouseOver}
            selectColour={'ffaa00'}
            selectIds={selectIds.toArray()}
            showIds={ids}
            species={species}
            selectedView={species === 'mus_musculus' ? 'female' : 'male'}
          />
        </ComponentCard>
      </div>
    );
  }

  protected onClick = (ids: string[]) => {
    const { addLabel } = this.props;

    addLabel(ids[0]);
  };

  protected onMouseOut = (id: string) => {
    return;
  };

  protected onMouseOver = (id: string) => {
    return;
  };

  protected parseCategory = (category: string) => {
    const splitCategories = category.split(/-|_/);

    return splitCategories[0];
  };

  protected resizeSVGElement(svgElement: SVGElement) {
    // The Anatomogram Component internally sets the svg height to 'auto'.
    // So, to allow more flexibility in sizing it, we have to manually override it here. Sorry.
    svgElement.style.height = this.divRef ? `calc(${this.divRef.style.height} - 50px)` : '100%';
    svgElement.style.width = this.divRef ? this.divRef.style.width : '100%';
  }
}

const mapStateToProps = (state: RootState) => ({
  selectIds: state.labeledCells.selectedLabels,
});

type requiredProps = Omit<IAnatomogramContainerProps, keyof typeof AnatomogramContainerClass.defaultProps> &
  Partial<IAnatomogramContainerProps>;

const UnconnectedAnatomogramContainer = (props: requiredProps) => <AnatomogramContainerClass {...props} />;

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      addLabel: LabeledCellsActions.addLabel,
    },
    dispatch,
  );

// tslint:disable-next-line:max-classes-per-file
export class AnatomogramContainer extends connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnconnectedAnatomogramContainer) {}
