import * as d3 from 'd3';
import * as PIXI from 'pixi.js';
import * as React from 'react';
import { ISpringGraphData, ISpringNode } from 'spring';

// import { LineSprite } from './LineSprite';

export interface ISpring2ComponentProps {
  data: ISpringGraphData;
}

export class Spring2Component extends React.Component<ISpring2ComponentProps, any> {
  public static defaultProps: Partial<ISpring2ComponentProps> = {
    data: {
      links: [],
      nodes: [],
    },
  };

  private canvasElement: HTMLCanvasElement | undefined = undefined;
  private app: PIXI.Application = new PIXI.Application();
  private width = 800;
  private height = 800;

  private sprites: PIXI.Container = new PIXI.Container();
  private edges: PIXI.Container = new PIXI.Container();

  constructor(props: any) {
    super(props);
  }

  public componentDidMount() {
    this.app = new PIXI.Application(this.width, this.height, {
      backgroundColor: 0x000000,
      view: this.canvasElement,
    });
  }

  public componentWillReceiveProps(nextProps: ISpring2ComponentProps) {
    const isNewData = nextProps && nextProps.data !== this.props.data;
    if (isNewData) {
      const { data } = nextProps;
      const { app, edges, sprites } = this;

      this.sprites = new PIXI.Container();
      for (const node of data.nodes) {
        const sprite = PIXI.Sprite.fromImage('assets/spring2/disc.png');
        const SPRITE_IMG_WIDTH = 32;

        sprite.anchor.set(0.5);
        sprite.scale.set(0.5 * 32 / SPRITE_IMG_WIDTH);
        sprite.x = node.x;
        sprite.y = node.y;
        sprite.alpha = 0.5;
        sprite.interactive = true;
        this.sprites.addChild(sprite);
      }

      // this.edges = new PIXI.particles.ParticleContainer();

      // const lineColor = 6579301;
      for (const link of data.links) {
        const source = link.source as ISpringNode;
        const target = link.target as ISpringNode;

        const line = new PIXI.Graphics();
        line.lineStyle(2, 0xff0000, 1);
        line.x = source.x;
        line.y = source.y;
        line.moveTo(0, 0);
        line.lineTo(target.x - source.x, target.y - source.y);

        edges.addChild(line);
      }

      this.centerCanvas(data);
      app.stage.addChild(this.edges);
      app.stage.addChild(this.sprites);
    }
  }

  public render() {
    const style = { width: this.width, height: this.height };
    return (
      <div id="SpringComponent" style={style}>
        <div id="PixiCanvasHolder">
          {<canvas ref={el => (this.canvasElement = el ? el : undefined)} style={style} />}
        </div>
      </div>
    );
  }

  private centerCanvas(data: ISpringGraphData) {
    const { edges, height, sprites, width } = this;

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

    const scale = 0.85 / Math.max(dx / width, dy / height);

    const delta = {
      scale: scale - this.sprites.scale.x,
      x: width / 2 - (max.x + min.x) / 2 * scale - sprites.position.x,
      y: height / 2 + 30 - (max.y + min.y) / 2 * scale - sprites.position.y,
    };

    sprites.position.x += delta.x;
    sprites.position.y += delta.y;
    sprites.scale.x += delta.scale;
    sprites.scale.y += delta.scale;
    edges.position = sprites.position;
    edges.scale = sprites.scale;
  }
}
