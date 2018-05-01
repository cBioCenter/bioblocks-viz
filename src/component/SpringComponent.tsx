import { SPRING_DATA_TYPE } from 'chell';
import * as d3 from 'd3';
import * as PIXI from 'pixi.js';
import * as React from 'react';
import { ISpringGraphData, ISpringLink, ISpringNode } from 'spring';

import { CellContext, initialCellContext } from '../context/CellContext';
import { withDefaultProps } from '../helper/ReactHelper';

const defaultProps = {
  canvasBackgroundColor: 0xcccccc,
  data: {
    links: [],
    nodes: [],
  } as SPRING_DATA_TYPE,
  height: 450,
  ...initialCellContext,
  selectedCategory: '',
  width: 450,
};

const initialState = {
  canvasHeight: 0,
  canvasWidth: 0,
};
type Props = {} & typeof defaultProps;
type State = typeof initialState;

export const SpringComponentWithDefaultProps = withDefaultProps(
  defaultProps,
  class SpringComponentClass extends React.Component<Props, State> {
    protected pixiApp: PIXI.Application = new PIXI.Application();

    protected canvasElement?: HTMLCanvasElement;

    protected nodeSprites: PIXI.Container = new PIXI.Container();
    protected edgeSprites: PIXI.Container = new PIXI.Container();

    constructor(props: Props) {
      super(props);
      this.state = {
        ...this.state,
        canvasHeight: Math.floor(0.9 * this.props.height),
        canvasWidth: Math.floor(0.9 * this.props.width),
      };
    }

    public componentDidMount() {
      const { canvasHeight, canvasWidth } = this.state;
      this.pixiApp = new PIXI.Application(canvasHeight, canvasWidth, {
        backgroundColor: this.props.canvasBackgroundColor,
        view: this.canvasElement,
      });

      const { pixiApp } = this;
      const { data, selectedCategory } = this.props;
      if (data) {
        pixiApp.stage.removeChildren();

        this.nodeSprites = new PIXI.Container();
        this.edgeSprites = new PIXI.Container();

        this.generateNodeSprites(data.nodes, this.nodeSprites, selectedCategory);
        this.generateLinesSprite(data.links, this.edgeSprites, selectedCategory);

        this.centerCanvas(data);

        pixiApp.stage.addChild(this.edgeSprites);
        pixiApp.stage.addChild(this.nodeSprites);
      }
    }

    public componentDidUpdate(prevProps: Props, prevState: State) {
      const { data, selectedCategory } = this.props;
      const isNewData = data && data !== prevProps.data;
      if (isNewData) {
        const { pixiApp } = this;
        pixiApp.stage.removeChildren();

        this.nodeSprites = new PIXI.Container();
        this.edgeSprites = new PIXI.Container();

        this.generateNodeSprites(data.nodes, this.nodeSprites, selectedCategory);
        this.generateLinesSprite(data.links, this.edgeSprites, selectedCategory);

        this.centerCanvas(data);

        pixiApp.stage.addChild(this.edgeSprites);
        pixiApp.stage.addChild(this.nodeSprites);
      } else if (selectedCategory !== prevProps.selectedCategory) {
        this.updateNodeSprites(data.nodes, this.nodeSprites, (node: ISpringNode) => node.category === selectedCategory);
        this.edgeSprites.removeChildren();
        this.generateLinesSprite(data.links, this.edgeSprites, selectedCategory);
        this.centerCanvas(data);
      } else if (this.props.currentCells !== prevProps.currentCells) {
        this.updateNodeSprites(
          data.nodes,
          this.nodeSprites,
          (node: ISpringNode) => this.props.currentCells.indexOf(node.number) !== -1,
        );
        this.edgeSprites.removeChildren();
        this.generateLinesSprite(data.links, this.edgeSprites, selectedCategory);
        this.centerCanvas(data);
      }
    }

    public render() {
      const canvasStyle = { width: this.state.canvasWidth, height: this.state.canvasHeight };
      return (
        <div id="SpringComponent" style={{ height: this.props.height, padding: 15, width: this.props.width }}>
          <div id="PixiCanvasHolder">
            {<canvas ref={el => (this.canvasElement = el ? el : undefined)} style={canvasStyle} />}
          </div>
        </div>
      );
    }

    protected generateLinesSprite(links: ISpringLink[] = [], container: PIXI.Container, category?: string) {
      const lines = new PIXI.Graphics();
      const { canvasHeight, canvasWidth } = this.state;
      for (const link of links) {
        const source = link.source as ISpringNode;
        const target = link.target as ISpringNode;

        if (category && source.category !== category && target.category !== category) {
          continue;
        }
        lines.lineStyle(5, 0xff0000, 1);
        lines.moveTo(source.x, source.y);
        lines.lineTo(target.x, target.y);
      }
      const linesBounds = lines.getBounds();
      const textureRect = new PIXI.Rectangle(
        linesBounds.x,
        linesBounds.y,
        Math.max(canvasWidth, linesBounds.width),
        Math.max(canvasHeight, linesBounds.height),
      );
      const linesTexture = this.pixiApp.renderer.generateTexture(
        lines,
        PIXI.SCALE_MODES.LINEAR,
        canvasWidth / canvasHeight,
        textureRect,
      );
      const linesSprite = new PIXI.Sprite(linesTexture);
      linesSprite.x = textureRect.x;
      linesSprite.y = textureRect.y;
      container.addChild(linesSprite);
    }

    protected generateNodeSprites(nodes: ISpringNode[] = [], container: PIXI.Container, category?: string) {
      const SPRITE_IMG_SIZE = 32;
      const scaleFactor = 0.5 * 32 / SPRITE_IMG_SIZE;

      // TODO: Evaluate ParticleContainer is PIXI v5. The v4 version doesn't play nice with sprites rendered via PIXI.Graphics.
      // this.sprites = new PIXI.particles.ParticleContainer(data.nodes.length);

      for (const node of nodes) {
        const nodeTexture = new PIXI.Graphics();
        nodeTexture.beginFill(node.colorHex);
        nodeTexture.drawCircle(0, 0, SPRITE_IMG_SIZE / 2);
        nodeTexture.endFill();
        const sprite = new PIXI.Sprite(this.pixiApp.renderer.generateTexture(nodeTexture));
        sprite.x = node.x;
        sprite.y = node.y;
        if (category && node.category !== category) {
          sprite.alpha = 0.1;
        }
        sprite.anchor.set(0.5, 0.5);
        sprite.interactive = true;
        sprite.scale.set(scaleFactor);
        container.addChild(sprite);
      }
    }

    protected updateNodeSprites(
      nodes: ISpringNode[] = [],
      container: PIXI.Container,
      conditionFn: (node: ISpringNode) => boolean,
    ) {
      for (let i = 0; i < container.children.length; ++i) {
        const node = nodes[i];
        const sprite = container.children[i];
        if (conditionFn(node)) {
          sprite.alpha = 1;
        } else {
          sprite.alpha = 0.1;
        }
      }
    }

    protected centerCanvas(data: ISpringGraphData) {
      const { edgeSprites, nodeSprites } = this;
      const { canvasHeight, canvasWidth } = this.state;
      const allXs = data.nodes.map(node => node.x);
      const allYs = data.nodes.map(node => node.y);

      const max = {
        x: d3.max(allXs) as number,
        y: d3.max(allYs) as number,
      };
      const min = {
        x: d3.min(allXs) as number,
        y: d3.min(allYs) as number,
      };

      const dx = max.x - min.x + 50;
      const dy = max.y - min.y + 50;

      const scale = 0.85 / Math.max(dx / canvasWidth, dy / canvasHeight);

      const delta = {
        scale: scale - this.nodeSprites.scale.x,
        x: canvasWidth / 2 - (max.x + min.x) / 2 * scale - nodeSprites.position.x,
        y: canvasHeight / 2 + 30 - (max.y + min.y) / 2 * scale - nodeSprites.position.y,
      };

      nodeSprites.position.x += delta.x;
      nodeSprites.position.y += delta.y;
      nodeSprites.scale.x += delta.scale;
      nodeSprites.scale.y += delta.scale;
      edgeSprites.position = nodeSprites.position;
      edgeSprites.scale = nodeSprites.scale;
    }
  },
);

// TODO The required props should be discernable from `withDefaultProps` without needing to duplicate.
// However the Context consumer syntax is still new to me and I can't find the right combination :(
type requiredProps = Partial<typeof defaultProps> & Required<Omit<Props, keyof typeof defaultProps>>;

export const SpringComponent = (props: requiredProps) => (
  <CellContext.Consumer>
    {({ currentCells }) => <SpringComponentWithDefaultProps {...props} currentCells={currentCells} />}
  </CellContext.Consumer>
);
