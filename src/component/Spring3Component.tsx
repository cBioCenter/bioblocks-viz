import * as React from 'react';
import { ISpringGraphData, ISpringLink, ISpringNode } from 'spring';
import * as THREE from 'three';

export interface ISpring3ComponentProps {
  data: ISpringGraphData;
}

const FRUSTUM_SIZE = 1000;

export class Spring3Component extends React.Component<ISpring3ComponentProps, any> {
  public static defaultProps: Partial<ISpring3ComponentProps> = {
    data: {
      links: [],
      nodes: [],
    },
  };

  private canvas: HTMLCanvasElement | null = null;

  private scene: THREE.Scene = new THREE.Scene();
  private width = 800;
  private height = 600;
  private aspectRatio = this.width / this.height;

  // private camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
  private camera = new THREE.OrthographicCamera(
    FRUSTUM_SIZE * this.aspectRatio / -2,
    FRUSTUM_SIZE * this.aspectRatio / 2,
    FRUSTUM_SIZE / 2,
    FRUSTUM_SIZE / -2,
    1,
    2000,
  );

  private renderer = new THREE.WebGLRenderer();

  constructor(props: any) {
    super(props);
  }

  public componentDidMount() {
    if (this.canvas) {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas });
      this.renderer.setPixelRatio(this.width / this.height);
      this.renderer.setSize(this.width, this.height);
      this.renderer.setClearColor(0x000000, 1);

      this.createScene();
    } else {
      console.error('Unable to get canvas! Does the browser support webgl?');
    }
  }

  public componentWillReceiveProps(nextProps: ISpring3ComponentProps) {
    const isNewData = nextProps && nextProps.data !== this.props.data;
    if (isNewData) {
      const { data } = nextProps;
    }
  }

  public render() {
    const style = { width: this.width, height: this.height };
    return (
      <div id="SpringComponent" style={style}>
        {<canvas ref={el => (this.canvas = el ? el : null)} style={{ width: '100%', height: '100%' }} />}
      </div>
    );
  }

  private createScene() {
    const geometry = new THREE.CircleGeometry(20, 20);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const circle = new THREE.Mesh(geometry, material);
    const box = new THREE.Mesh(geometry, material);

    circle.position.set(0, 0, 0);
    box.position.set(40, 140, 0);

    this.scene.add(circle);
    this.scene.add(box);
    this.camera.position.z = 100;
    this.camera.lookAt(circle.position);

    const animate = () => {
      requestAnimationFrame(animate);

      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }
}
