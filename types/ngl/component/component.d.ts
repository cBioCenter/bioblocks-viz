// tslint:disable:max-classes-per-file
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
    name: string;
    status: string;
    visible: boolean;
  }

  /**
   * Base class for components.
   *
   * @export
   * @class Component
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
    public object: any;
    public parameters: IComponentParameters;
    public position: Vector3;
    public quaternion: Quaternion;
    public reprList: RepresentationElement[];
    public scale: Vector3;

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
     * @param {Stage} stage Stage object the component belongs to.
     * @param {*} object
     * @param {Partial<IComponentParameters>} [params] Parameter object.
     * @memberof Component
     */
    constructor(stage: Stage, object: any, params?: Partial<IComponentParameters>);

    // Methods
    /**
     * Add an annotation object.
     *
     * @param {Vector3} position The 3d position.
     * @param {(string | HTMLElement)} content The HTML content.
     * @param {IAnnotationParams} params
     * @returns {Annotation} The added annotation object.
     * @memberof Component
     */
    public addAnnotation(position: Vector3, content: string | HTMLElement, params: IAnnotationParams): Annotation;

    public addBufferRepresentation(buffer: any, params: any): any;
    public addRepresentation(type: any, params: any): any;

    /**
     * Automatically center and zoom the component.
     *
     * @param {(undefined | number)} [duration]
     * @memberof Component
     */
    public autoView(duration?: undefined | number): void;

    public dispose(): void;

    /**
     * Iterator over each annotation and executing the callback.
     *
     * @param {() => void} callback Function to execute.
     * @memberof Component
     */
    public eachAnnotation(callback: () => void): void;

    /**
     * Iterator over each representation and executing the callback.
     *
     * @param {() => void} callback Function to execute.
     * @memberof Component
     */
    public eachRepresentation(callback: () => void): void;

    /**
     * @param {...any[]} args
     * @returns {Box3} The component's bounding box.
     * @memberof Component
     */
    public getBox(...args: any[]): Box3;

    /**
     * @param {...any[]} args
     * @returns {Box3}
     * @memberof Component The untransformed component's bounding box.
     */
    public getBoxUntransformed(...args: any[]): Box3;

    /**
     * @param {...any[]} args
     * @returns {Vector3}
     * @memberof Component The component's center position.
     */
    public getCenter(...args: any[]): Vector3;

    public getCenterUntransformed(...args: any[]): Vector3;
    public getZoom(...args: any[]): number;
    public hasRepresentation(repr: RepresentationElement): boolean;

    /**
     * Remove all annotations from the component.
     *
     * @memberof Component
     */
    public removeAllAnnotations(): void;

    /**
     * Removes all representation components.
     *
     * @memberof Component
     */
    public removeAllRepresentations(): void;

    /**
     * Remove the give annotation from the component
     *
     * @param {Annotation} annotation The annotation to remove
     * @memberof Component
     */
    public removeAnnotation(annotation: Annotation): void;

    /**
     * Removes a representation component.
     *
     * @param {RepresentationElement} repr The representation element.
     * @memberof Component
     */
    public removeRepresentation(repr: RepresentationElement): void;
    public setName(value: string): this;

    /**
     * Set position transform.
     *
     * @example // translate by 25 angstrom along x axis.
     * component.setPosition([ 25, 0, 0 ]);
     *
     * @param {([number, number, number] | Vector3)} p The coordinates.
     * @returns {this} This Component object.
     * @memberof Component
     */
    public setPosition(p: [number, number, number] | Vector3): this;

    /**
     * Set rotation transform.
     *
     * @example // rotate by 2 degree radians on x axis.
     * component.setRotation( [ 2, 0, 0 ] );
     *
     * @param {([number, number, number] | Euler | Quaternion)} r The rotation.
     * @returns {this} This Component object.
     * @memberof Component
     */
    public setRotation(r: [number, number, number] | Euler | Quaternion): this;

    /**
     * Set scale transform.
     *
     * @example // scale by factor of two.
     * component.setScale( 2 );
     *
     * @param {number} s The scale.
     * @returns {this} This Component object.
     * @memberof Component
     */
    public setScale(s: number): this;

    public setStatus(value: string): this;

    /**
     * Set general transform. Is applied before and in addition to the position, rotation and scale transformations.
     * @example component.setTransform( matrix );
     * @param {Matrix4} m The matrix.
     * @returns {this} This component object.
     * @memberof Component
     */
    public setTransform(m: Matrix4): this;

    /**
     * Set the visibility of the component, including added representations.
     *
     * @param {boolean} value Visibility flag.
     * @returns {this} This component object.
     * @memberof Component
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
    public addRepresentation(name: string, params: any): this;
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

  export class RepresentationCollection {}

  export interface IRepresentationElementParameters {
    name: string;
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
    public type(): string;
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
   * @class ShapeComponent
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
     * @param {ShapeRepresentationType} type The name of the representation, one of: buffer.
     * @param {object} [params] Representation parameters.
     * @returns {RepresentationElement} The created representation wrapped into a representation component object.
     * @memberof ShapeComponent
     */
    public addRepresentation(type: ShapeRepresentationType, params?: object): RepresentationElement;
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
   * @class StructureComponent
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
     *
     * @param {number[]} atomList
     * @memberof StructureComponent
     */
    public addMeasurement(atomList: number[]): void;
    public addRepresentation(
      type: StructureRepresentationType,
      params?: object,
      hidden?: boolean,
    ): RepresentationElement;

    /**
     * Add a new trajectory component to the structure.
     *
     * @param {string} [trajPath]
     * @param {object} [params]
     * @returns {TrajectoryElement}
     * @memberof StructureComponent
     */
    public addTrajectory(trajPath?: string, params?: object): TrajectoryElement;

    /**
     * Automatically center and zoom the component
     *
     * @param {(undefined | number)} [duration]
     * @returns {*}
     * @memberof StructureComponent
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
     *
     * @param {MeasurementFlags} [type]
     * @memberof StructureComponent
     */
    public removeAllMeasurements(type?: MeasurementFlags): void;

    /**
     * Remove a measurement given as a pair, triple, quad of atom indices.
     *
     * @param {number[]} atomList
     * @memberof StructureComponent
     */
    public removeMeasurement(atomList: number[]): void;
    public removeTrajectory(traj: TrajectoryElement): void;

    /**
     * Set the default assembly.
     *
     * @param {string} value Assembly name.
     * @returns {this}
     * @memberof StructureComponent
     */
    public setDefaultAssembly(value: string): this;

    /**
     * Set selection of structureView.
     *
     * @param {string} sel Selection string.
     * @returns {this}
     * @memberof StructureComponent This StructureComponent object.
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
   * @class SurfaceComponent
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
     * @param {Stage} stage Stage object the component belongs to.
     * @param {Surface} surface Surface object to wrap.
     * @param {Partial<IComponentParameters>} [params] Component parameters.
     * @memberof SurfaceComponent
     */
    constructor(stage: Stage, surface: Surface, params?: Partial<IComponentParameters>);

    // Methods
    /**
     * Add a new surface representation to the component.
     *
     * @param {SurfaceRepresentationType} type The name of the representation, one of: surface, dot.
     * @param {object} [params] Representation parameters.
     * @returns {RepresentationElement} The created representation wrapped into a representation component object.
     * @memberof SurfaceComponent
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
   * @class VolumeComponent
   * @extends {Component}
   */
  export class VolumeComponent extends Component {
    // Properties
    /** Volume object to wrap. */
    public volume: Volume;

    /**
     * Creates an instance of VolumeComponent.
     *
     * @param {Stage} stage Stage object the component belongs to.
     * @param {Volume} volume Volume object to wrap.
     * @param {Partial<IComponentParameters>} [params] Component parameters.
     * @memberof VolumeComponent
     */
    constructor(stage: Stage, volume: Volume, params?: Partial<IComponentParameters>);

    // Methods
    /**
     * Add a new volume representation to the component.
     *
     * @param {VolumeRepresentationType} type
     * @param {object} [params]
     * @returns {RepresentationElement}
     * @memberof VolumeComponent
     */
    public addRepresentation(type: VolumeRepresentationType, params?: object): RepresentationElement;
  }
}
