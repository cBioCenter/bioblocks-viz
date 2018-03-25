import * as d3 from 'd3';
import * as PIXI from 'pixi.js';
import * as React from 'react';
import { ISpringGraphData, ISpringLink, ISpringNode } from 'spring';

export interface ISpringComponentProps {
  data: ISpringGraphData;
}

export class SpringComponent extends React.Component<ISpringComponentProps, any> {
  public static defaultProps: Partial<ISpringComponentProps> = {
    data: {
      links: [],
      nodes: [],
    },
  };

  private canvasElement: HTMLCanvasElement | undefined = undefined;
  private app: PIXI.Application = new PIXI.Application();
  private width = 800;
  private height = 800;

  private sprites = new PIXI.particles.ParticleContainer();
  private edges = new PIXI.particles.ParticleContainer();

  constructor(props: any) {
    super(props);
  }

  public componentDidMount() {
    this.app = new PIXI.Application(this.width, this.height, {
      backgroundColor: 0x000000,
      view: this.canvasElement,
    });
  }

  public componentWillReceiveProps(nextProps: ISpringComponentProps) {
    const isNewData = nextProps && nextProps.data !== this.props.data;
    if (isNewData) {
      const { data } = nextProps;
      const { app } = this;

      const SPRITE_IMG_SIZE = 32;
      const scaleFactor = 0.5 * 32 / SPRITE_IMG_SIZE;

      this.sprites = new PIXI.particles.ParticleContainer(data.nodes.length);
      for (const node of data.nodes) {
        const sprite = PIXI.Sprite.fromImage('assets/spring2/disc.png');
        sprite.x = node.x;
        sprite.y = node.y;

        sprite.scale.set(scaleFactor);
        sprite.anchor.set(0.5, 0.5);
        sprite.alpha = 0.5;
        sprite.interactive = true;
        this.sprites.addChild(sprite);
      }

      const linesSprite = this.generateLinesSprite(data.links);

      this.edges.addChild(linesSprite);

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

  private generateLinesSprite(links: ISpringLink[]) {
    const lines = new PIXI.Graphics(true);
    this.edges = new PIXI.particles.ParticleContainer(links.length);
    for (const link of links) {
      const source = link.source as ISpringNode;
      const target = link.target as ISpringNode;

      lines.lineStyle(3, 0xff0000, 1);
      lines.moveTo(source.x, source.y);
      lines.lineTo(target.x, target.y);
    }
    const linesBounds = lines.getBounds();
    const textureRect = new PIXI.Rectangle(
      linesBounds.x,
      linesBounds.y,
      Math.max(this.width, linesBounds.width),
      Math.max(this.height, linesBounds.height),
    );
    const linesTexture = this.app.renderer.generateTexture(
      lines,
      PIXI.SCALE_MODES.LINEAR,
      this.width / this.height,
      textureRect,
    );
    const linesSprite = new PIXI.Sprite(linesTexture);
    linesSprite.x = textureRect.x;
    linesSprite.y = textureRect.y;
    return linesSprite;
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
