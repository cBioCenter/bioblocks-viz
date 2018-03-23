import * as PIXI from 'pixi.js';

export class LineSprite extends PIXI.Sprite {
  private baseTexture: any;
  private textureCache: any = {};
  private maxWidth = 100;
  private maxColors = 100;
  private colors = 0;
  private canvas: HTMLCanvasElement | null = null;

  // tslint:disable:variable-name
  private _color: any;
  private _thickness: any;
  // tslint:enable:variable-name

  get color(): string {
    return this._color;
  }

  set color(value: string) {
    this._color = value;
    this.texture = this.getTexture(this._thickness, this._color);
  }

  get thickness() {
    return this._thickness;
  }
  set thickness(value) {
    this._thickness = value;
    this.texture = this.getTexture(this._thickness, this._color);
  }

  constructor(
    thickness: number,
    color: any,
    readonly x1: number,
    readonly y1: number,
    readonly x2: number,
    readonly y2: number,
  ) {
    super(PIXI.Texture.WHITE);
    const texture = this.getTexture(thickness, color);
    this.texture = texture;
    this.updatePosition();
    this.anchor.x = 0.5;
  }

  private updatePosition() {
    this.position.x = this.x1;
    this.position.y = this.y1;
    this.height = Math.sqrt((this.x2 - this.x1) * (this.x2 - this.x1) + (this.y2 - this.y1) * (this.y2 - this.y1));
    const dir = Math.atan2(this.y1 - this.y2, this.x1 - this.x2);
    this.rotation = Math.PI * 0.5 + dir;
  }

  private getTexture(thickness: any, color: any) {
    const key = thickness + '-' + color;
    if (!this.textureCache[key]) {
      if (this.canvas === null) {
        this.initCanvas();
      }
      const canvas = this.canvas;
      const context = canvas!.getContext('2d');
      context!.fillStyle = PIXI.utils.hex2string(color);
      context!.fillRect(1, this.colors, thickness, 1);
      const texture = new PIXI.Texture(this!.baseTexture);
      // const texture = new PIXI.Texture(LineSprite!.baseTexture, PIXI.SCALE_MODES.LINEAR);
      texture.frame = new PIXI.Rectangle(0, this.colors, thickness + 2, 1);
      this.textureCache[key] = texture;
      this.colors++;
    }
    return this.textureCache[key];
  }

  private initCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.maxWidth + 2;
    this.canvas.height = this.maxColors;
    this.baseTexture = new PIXI.BaseTexture(this.canvas);
  }
}
