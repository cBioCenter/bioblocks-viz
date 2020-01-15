import { StructureView, ViewerControls } from 'ngl';

// tslint:disable:max-classes-per-file no-reserved-keywords
declare module 'ngl' {
  import { Signal } from 'signals';
  import { Box3, Color, Euler, Matrix4, Quaternion, Vector3 } from 'three';

  export type ShapeRepresentationType = 'buffer';

  export type StructureRepresentationType =
    | 'angle'
    | 'axes'
    | 'backbone'
    | 'ball+stick'
    | 'base'
    | 'cartoon'
    | 'contact'
    | 'default'
    | 'dihedral'
    | 'distance'
    | 'helixorient'
    | 'hyperball'
    | 'label'
    | 'licorice'
    | 'line'
    | 'surface'
    | 'ribbon'
    | 'rocket'
    | 'rope'
    | 'spacefill'
    | 'trace'
    | 'tube'
    | 'unitcell';

  export type SurfaceRepresentationType = 'surface' | 'dot';

  export type VolumeRepresentationType = 'surface' | 'slice' | 'dot';

  export const enum MeasurementFlags {
    Distance = 0x1,
    Angle = 0x2,
    Dihedral = 0x4,
  }

  export interface IAnnotationParams {
    offsetX?: number;
    offsetY?: number;
    visible?: boolean;
  }

  export interface IStructureRepresentationParams {
    atomPair: Array<Array<number | string>>;
    color: string;
    labelBackground: boolean;
    labelBackgroundColor: string;
    labelBackgroundMargin: number;
    labelBorder: boolean;
    labelBorderColor: string;
    labelBorderWidth: number;
    labelColor: string;
    labelSize: number;
    labelUnit: 'angstrom' | 'nm';
    labelXOffset: number;
    labelYOffset: number;
    labelZOffset: number;
    radiusScale: number;
    sele: string;
  }

  export class Annotation {
    // Properties
    public component: Component;
    public element: HTMLElement;
    public offsetX: number;
    public offsetY: number;
    public position: Vector3;
    public stage: Stage;
    public viewer: Viewer;
    public visible: boolean;

    constructor(component: Component, position: Vector3, content: string | HTMLElement, params?: IAnnotationParams);

    public _update(): void;
    public _updateViewerPosition(): void;
    public dispose(): void;
    public getVisibility(): boolean;
    public setContent(value: string | HTMLElement): void;
    public setVisibility(value: boolean): void;
    public updateVisibility(): void;
  }

  export interface IComponentParameters {
    name?: string;
    status?: string;
    visible?: boolean;
  }

  /**
   * Base class for components.
   *
   * @export
   */
  export class Component {
    // Accessors
    public defaultParameters: IComponentParameters;
    public name: string;
    public status: string;
    public type: string;
    public visible: boolean;

    // Properties
    public annotationList: Annotation[];
    public controls: ComponentControls;
    public matrix: Matrix4;
    public object: Record<string, any>;
    public parameters: IComponentParameters;
    public position: Vector3;
    public quaternion: Quaternion;
    public reprList: RepresentationElement[];
    public scale: Vector3;
    public structure: Structure;
    public structureView: StructureView;
    public viewerControls: ViewerControls;

    /** Events emitted by the component. */
    public readonly signals: {
      disposed: Signal;
      matrixChanged: Signal;
      nameChanged: Signal;
      representationAdded: Signal;
      representationRemoved: Signal;
      statusChanged: Signal;
      visibilityChanged: Signal;
    };
    public stage: Stage;
    public transform: Matrix4;
    public uuid: string;
    public viewer: Viewer;

    /**
     * Creates an instance of Component.
     *
     * @param stage Stage object the component belongs to.
     * @param [params] Parameter object.
     */
    constructor(stage: Stage, object: any, params?: Partial<IComponentParameters>);

    // Methods
    /**
     * Add an annotation object.
     *
     * @param position The 3d position.
     * @param content The HTML content.
     * @returns The added annotation object.
     */
    public addAnnotation(position: Vector3, content: string | HTMLElement, params: IAnnotationParams): Annotation;

    public addBufferRepresentation(buffer: any, params: any): any;
    public addRepresentation(type: any, params?: any): any;

    /**
     * Automatically center and zoom the component.
     */
    public autoView(duration?: undefined | number): void;

    public dispose(): void;

    /**
     * Iterator over each annotation and executing the callback.
     *
     * @param callback Function to execute.
     */
    public eachAnnotation(callback: () => void): void;

    /**
     * Iterator over each representation and executing the callback.
     *
     * @param callback Function to execute.
     */
    public eachRepresentation(callback: () => void): void;

    /**
     * @returns The component's bounding box.
     */
    public getBox(...args: any[]): Box3;

    /**
     * @returns The untransformed component's bounding box.
     */
    public getBoxUntransformed(...args: any[]): Box3;

    /**
     * @returns The component's center position.
     */
    public getCenter(...args: any[]): Vector3;

    public getCenterUntransformed(...args: any[]): Vector3;
    public getZoom(...args: any[]): number;
    public hasRepresentation(repr: RepresentationElement): boolean;

    /**
     * Remove all annotations from the component.
     */
    public removeAllAnnotations(): void;

    /**
     * Removes all representation components.
     */
    public removeAllRepresentations(): void;

    /**
     * Remove the give annotation from the component
     *
     * @param annotation The annotation to remove.
     */
    public removeAnnotation(annotation: Annotation): void;

    /**
     * Removes a representation component.
     *
     * @param repr The representation element.
     */
    public removeRepresentation(repr: RepresentationElement): void;
    public setName(value: string): this;

    /**
     * Set position transform.
     *
     * @example // translate by 25 angstrom along x axis.
     * component.setPosition([ 25, 0, 0 ]);
     *
     * @param p The coordinates.
     * @returns This Component object.
     */
    public setPosition(p: [number, number, number] | Vector3): this;

    /**
     * Set rotation transform.
     *
     * @example // rotate by 2 degree radians on x axis.
     * component.setRotation( [ 2, 0, 0 ] );
     *
     * @param r The rotation.
     * @returns This Component object.
     */
    public setRotation(r: [number, number, number] | Euler | Quaternion): this;

    /**
     * Set scale transform.
     *
     * @example // scale by factor of two.
     * component.setScale( 2 );
     *
     * @param s The scale.
     * @returns This Component object.
     */
    public setScale(s: number): this;

    public setStatus(value: string): this;

    /**
     * Set general transform. Is applied before and in addition to the position, rotation and scale transformations.
     * @example component.setTransform( matrix );
     * @param m The matrix.
     * @returnsThis component object.
     */
    public setTransform(m: Matrix4): this;

    /**
     * Set the visibility of the component, including added representations.
     *
     * @param value Visibility flag.
     * @returns This component object.
     */
    public setVisibility(value: boolean): this;
    public updateMatrix(): void;
    public updateRepresentations(what: any): void;
  }

  export class ComponentCollection {
    // Properties
    public list: Component[];

    constructor(list?: Component[]);

    // Accessories
    public first(): undefined | Component;

    // Methods
    public _remove(elm: Component): void;
    public addRepresentation(name: string, params: Partial<IStructureRepresentationParams>): this;
    public autoView(duration: number): this;
    public dispose(): this;
    public forEach(fn: (x: Component) => any): this;
  }

  export interface IComponentSignals {
    disposed: Signal;
    matrixChanged: Signal;
    nameChanged: Signal;
    representationAdded: Signal;
    representationRemoved: Signal;
    statusChanged: Signal;
    visibilityChanged: Signal;
  }

  // tslint:disable-next-line:no-unnecessary-class
  export class RepresentationCollection {}

  export interface IRepresentationElementParameters {
    name: string;
    sele: string;
    status: string;
    visible: boolean;
  }

  export interface IRepresentationElementSignals {
    disposed: Signal;
    nameChanged: Signal;
    parametersChanged: Signal;
    statusChanged: Signal;
    visibilityChanged: Signal;
  }

  export class RepresentationElement extends Element {
    // Properties
    public parameters: IRepresentationElementParameters;
    public parent: Component;
    public repr: Representation;
    public signals: IRepresentationElementSignals;
    public stage: Stage;
    public uuid: string;
    public type: string;

    constructor(
      stage: Stage,
      repr: Representation,
      params: Partial<IRepresentationElementParameters>,
      parent: Component,
    );

    public _disposeRepresentation(): void;
    public build(params?: any): this;
    public defaultParameters(): IRepresentationElementParameters;
    public dispose(): void;
    public getParameters(): {
      lazy: any;
      quality: any;
      visible: any;
    };
    public getType(): string;
    public getVisibility(): boolean;
    public name(): string;
    public setColor(value: string | number | Color): this;
    public setName(value: string): this;
    public setParameters(params: any): this;
    public setRepresentation(repr: Representation): void;
    public setSelection(selection: string): this;
    public setStatus(value: string): this;
    public setVisibility(value: boolean): this;
    public toggleVisibility(): this;
    public update(what: any): this;
    public updateVisibility(): void;
    public visible(): boolean;
  }

  /**
   * Component wrapping a Shape object.
   *
   * @example // Get a shape component by adding a shape object to the stage.
   * var shape = new NGL.Shape( "shape" );
   * shape.addSphere( [ 0, 0, 0 ], [ 1, 0, 0 ], 1.5 );
   * var shapeComponent = stage.addComponentFromObject( shape );
   * shapeComponent.addRepresentation( "buffer" );
   *
   * @export
   * @extends {Component}
   */
  export class ShapeComponent extends Component {
    // Properties
    public shape: Shape;

    constructor(stage: Stage, shape: Shape, params?: Partial<IComponentParameters>);

    // Methods

    /**
     * Add a new shape representation to the component
     *
     * @param type The name of the representation, one of: buffer.
     * @param [params] Representation parameters.
     * @returns The created representation wrapped into a representation component object.
     */
    public addRepresentation(
      type: ShapeRepresentationType,
      params?: Partial<IStructureRepresentationParams>,
    ): RepresentationElement;
  }

  export interface IStructureComponentSignals extends IComponentSignals {
    refreshed: Signal;
  }

  export interface IStructureComponentParameters {
    sele: string;
    defaultAssembly: string;
    name: string;
    status: string;
    visible: boolean;
  }

  /**
   * Component wrapping a Structure object.
   *
   * @example // Get a structure component by loading a structure file into the stage.
   * stage.loadFile("rcsb://4opj").then(function(structureComponent){
   *   structureComponent.addRepresentation("cartoon");
   *   structureComponent.autoView();
   * });
   *
   * @export
   * @extends {Component}
   */
  export class StructureComponent extends Component {
    // Properties
    public angleRepresentation: RepresentationElement;
    public dihedralRepresentation: RepresentationElement;
    public distanceRepresentation: RepresentationElement;
    public lastPick: undefined | number;
    public measureRepresentations: RepresentationCollection;
    public parameters: IStructureComponentParameters;
    public pickBuffer: IRingBuffer<number>;
    public pickDict: ISimpleDict<number[], number[]>;
    public selection: Selection;
    public signals: IStructureComponentSignals;
    public spacefillRepresentation: RepresentationElement;
    public structure: Structure;
    public structureView: StructureView;
    public trajList: TrajectoryElement[];

    constructor(stage: Stage, structure: Structure, params?: Partial<IStructureComponentParameters>);

    // Methods
    /**
     * Add a measurement given as a pair, triple, quad of atom indices.
     */
    public addMeasurement(atomList: number[]): void;
    public addRepresentation(
      type: StructureRepresentationType,
      params?: Partial<IStructureRepresentationParams>,
      hidden?: boolean,
    ): RepresentationElement;

    /**
     * Add a new trajectory component to the structure.
     */
    public addTrajectory(trajPath?: string, params?: object): TrajectoryElement;

    /**
     * Automatically center and zoom the component
     */
    public autoView(duration?: undefined | number): any;
    public dispose(): void;
    public getBoxUntransformed(sele: string): Box3;
    public getCenterUntransformed(sele: string): Vector3;
    public getMaxRepresentationRadius(atomIndex: number): number;
    public measureBuild(): void;
    public measureClear(): void;
    public measureData(): {
      angle: number[][];
      dihedral: number[][];
      distance: number[][];
    };
    public measurePick(atom: AtomProxy): void;
    public measureUpdate(): void;
    public rebuildRepresentations(): void;
    public rebuildTrajectories(): void;

    /**
     * Remove all measurements, optionally limit to distance, angle or dihedral.
     */
    public removeAllMeasurements(type?: MeasurementFlags): void;

    /**
     * Remove a measurement given as a pair, triple, quad of atom indices.
     */
    public removeMeasurement(atomList: number[]): void;
    public removeTrajectory(traj: TrajectoryElement): void;

    /**
     * Set the default assembly.
     *
     * @param value Assembly name.
     */
    public setDefaultAssembly(value: string): this;

    /**
     * Set selection of structureView.
     *
     * @param sel Selection string.
     */
    public setSelection(sel: string): this;
    public superpose(component: StructureComponent, align: boolean, sele1: string, sele2: string): this;
    public updateRepresentations(what: any): void;
  }

  /**
   * Component wrapping a Surface object
   *
   * @example // get a surface component by loading a surface file into the stage
   * stage.loadFile("url/for/surface").then(function(surfaceComponent) {
   *   surfaceComponent.addRepresentation("surface");
   *   surfaceComponent.autoView();
   * });
   *
   * @export
   */
  export class SurfaceComponent {
    // Properties
    /** Surface object to wrap. */
    public surface: Surface;

    // Accessors
    /** Component type. */
    public type: string;

    /**
     * Creates an instance of SurfaceComponent.
     * @param stage Stage object the component belongs to.
     * @param surface Surface object to wrap.
     * @param [params] Component parameters.
     */
    constructor(stage: Stage, surface: Surface, params?: Partial<IComponentParameters>);

    // Methods
    /**
     * Add a new surface representation to the component.
     *
     * @param type The name of the representation, one of: surface, dot.
     * @param [params] Representation parameters.
     * @returns The created representation wrapped into a representation component object.
     */
    public addRepresentation(type: SurfaceRepresentationType, params?: object): RepresentationElement;
    public dispose(): void;
    public getBoxUntransformed(): Box3;
    public getCenterUntransformed(): Vector3;
  }

  export class TrajectoryElement extends Element {}

  /**
   * Component wrapping a Volume object.
   *
   * @example // Get a volume component by loading a volume file into the stage.
   * stage.loadFile( "url/for/volume" ).then(function(volumeComponent) {
   *   volumeComponent.addRepresentation('surface');
   *   volumeComponent.autoView();
   * });
   *
   * @export
   * @extends {Component}
   */
  export class VolumeComponent extends Component {
    // Properties
    /** Volume object to wrap. */
    public volume: Volume;

    /**
     * Creates an instance of VolumeComponent.
     *
     * @param stage Stage object the component belongs to.
     * @param volume Volume object to wrap.
     * @param [params] Component parameters.
     */
    constructor(stage: Stage, volume: Volume, params?: Partial<IComponentParameters>);

    // Methods
    /**
     * Add a new volume representation to the component.
     */
    public addRepresentation(type: VolumeRepresentationType, params?: object): RepresentationElement;
  }
}
