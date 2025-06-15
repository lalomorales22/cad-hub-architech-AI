
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CADGenerationResult } from '../services/aiServices';

interface ThreeJSCanvasProps {
  cadData?: CADGenerationResult | null;
}

// OrbitControls implementation
class OrbitControls {
  camera: THREE.PerspectiveCamera;
  domElement: HTMLElement;
  target: THREE.Vector3;
  
  enableDamping: boolean = true;
  dampingFactor: number = 0.05;
  enableZoom: boolean = true;
  enableRotate: boolean = true;
  enablePan: boolean = true;
  
  minDistance: number = 1;
  maxDistance: number = 50;
  
  private spherical: THREE.Spherical = new THREE.Spherical();
  private sphericalDelta: THREE.Spherical = new THREE.Spherical();
  private scale: number = 1;
  private panOffset: THREE.Vector3 = new THREE.Vector3();
  
  private rotateStart: THREE.Vector2 = new THREE.Vector2();
  private rotateEnd: THREE.Vector2 = new THREE.Vector2();
  private rotateDelta: THREE.Vector2 = new THREE.Vector2();
  
  private panStart: THREE.Vector2 = new THREE.Vector2();
  private panEnd: THREE.Vector2 = new THREE.Vector2();
  private panDelta: THREE.Vector2 = new THREE.Vector2();
  
  private dollyStart: THREE.Vector2 = new THREE.Vector2();
  private dollyEnd: THREE.Vector2 = new THREE.Vector2();
  private dollyDelta: THREE.Vector2 = new THREE.Vector2();
  
  private state: number = -1; // STATE.NONE
  private EPS: number = 0.000001;
  
  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.target = new THREE.Vector3();
    
    this.update();
    this.addEventListeners();
  }
  
  addEventListeners() {
    this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.domElement.addEventListener('wheel', this.onMouseWheel.bind(this));
    this.domElement.addEventListener('contextmenu', this.onContextMenu.bind(this));
  }
  
  removeEventListeners() {
    this.domElement.removeEventListener('mousedown', this.onMouseDown.bind(this));
    this.domElement.removeEventListener('wheel', this.onMouseWheel.bind(this));
    this.domElement.removeEventListener('contextmenu', this.onContextMenu.bind(this));
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }
  
  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    
    if (event.button === 0) { // left mouse button
      this.state = 0; // ROTATE
      this.rotateStart.set(event.clientX, event.clientY);
    } else if (event.button === 2) { // right mouse button
      this.state = 2; // PAN
      this.panStart.set(event.clientX, event.clientY);
    }
    
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }
  
  onMouseMove(event: MouseEvent) {
    event.preventDefault();
    
    if (this.state === 0) { // ROTATE
      this.rotateEnd.set(event.clientX, event.clientY);
      this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart).multiplyScalar(0.5);
      
      this.rotateLeft(2 * Math.PI * this.rotateDelta.x / this.domElement.clientHeight);
      this.rotateUp(2 * Math.PI * this.rotateDelta.y / this.domElement.clientHeight);
      
      this.rotateStart.copy(this.rotateEnd);
      this.update();
    } else if (this.state === 2) { // PAN
      this.panEnd.set(event.clientX, event.clientY);
      this.panDelta.subVectors(this.panEnd, this.panStart).multiplyScalar(0.5);
      this.pan(this.panDelta.x, this.panDelta.y);
      this.panStart.copy(this.panEnd);
      this.update();
    }
  }
  
  onMouseUp() {
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
    this.state = -1; // NONE
  }
  
  onMouseWheel(event: WheelEvent) {
    event.preventDefault();
    
    if (event.deltaY < 0) {
      this.dollyIn(this.getZoomScale());
    } else if (event.deltaY > 0) {
      this.dollyOut(this.getZoomScale());
    }
    
    this.update();
  }
  
  onContextMenu(event: Event) {
    event.preventDefault();
  }
  
  rotateLeft(angle: number) {
    this.sphericalDelta.theta -= angle;
  }
  
  rotateUp(angle: number) {
    this.sphericalDelta.phi -= angle;
  }
  
  pan(deltaX: number, deltaY: number) {
    const offset = new THREE.Vector3();
    offset.copy(this.camera.position).sub(this.target);
    
    let targetDistance = offset.length();
    targetDistance *= Math.tan((this.camera.fov / 2) * Math.PI / 180.0);
    
    this.panLeft(2 * deltaX * targetDistance / this.domElement.clientHeight, this.camera.matrix);
    this.panUp(2 * deltaY * targetDistance / this.domElement.clientHeight, this.camera.matrix);
  }
  
  panLeft(distance: number, objectMatrix: THREE.Matrix4) {
    const v = new THREE.Vector3();
    v.setFromMatrixColumn(objectMatrix, 0);
    v.multiplyScalar(-distance);
    this.panOffset.add(v);
  }
  
  panUp(distance: number, objectMatrix: THREE.Matrix4) {
    const v = new THREE.Vector3();
    v.setFromMatrixColumn(objectMatrix, 1);
    v.multiplyScalar(distance);
    this.panOffset.add(v);
  }
  
  dollyIn(dollyScale: number) {
    this.scale /= dollyScale;
  }
  
  dollyOut(dollyScale: number) {
    this.scale *= dollyScale;
  }
  
  getZoomScale() {
    return Math.pow(0.95, 1);
  }
  
  update() {
    const offset = new THREE.Vector3();
    const quat = new THREE.Quaternion().setFromUnitVectors(this.camera.up, new THREE.Vector3(0, 1, 0));
    const quatInverse = quat.clone().invert();
    
    offset.copy(this.camera.position).sub(this.target);
    offset.applyQuaternion(quat);
    
    this.spherical.setFromVector3(offset);
    
    if (this.enableDamping) {
      this.spherical.theta += this.sphericalDelta.theta * this.dampingFactor;
      this.spherical.phi += this.sphericalDelta.phi * this.dampingFactor;
    } else {
      this.spherical.theta += this.sphericalDelta.theta;
      this.spherical.phi += this.sphericalDelta.phi;
    }
    
    this.spherical.phi = Math.max(this.EPS, Math.min(Math.PI - this.EPS, this.spherical.phi));
    this.spherical.makeSafe();
    this.spherical.radius *= this.scale;
    this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));
    
    this.target.add(this.panOffset);
    
    offset.setFromSpherical(this.spherical);
    offset.applyQuaternion(quatInverse);
    
    this.camera.position.copy(this.target).add(offset);
    this.camera.lookAt(this.target);
    
    if (this.enableDamping) {
      this.sphericalDelta.theta *= (1 - this.dampingFactor);
      this.sphericalDelta.phi *= (1 - this.dampingFactor);
    } else {
      this.sphericalDelta.set(0, 0, 0);
    }
    
    this.scale = 1;
    this.panOffset.set(0, 0, 0);
  }
  
  dispose() {
    this.removeEventListeners();
  }
}

export const ThreeJSCanvas = ({ cadData }: ThreeJSCanvasProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cadObjectsRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Grid
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    scene.add(gridHelper);

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update CAD objects when cadData changes
  useEffect(() => {
    if (!sceneRef.current || !cadData) return;

    // Remove existing CAD objects
    if (cadObjectsRef.current) {
      sceneRef.current.remove(cadObjectsRef.current);
    }

    // Create new group for CAD objects
    const cadGroup = new THREE.Group();
    cadObjectsRef.current = cadGroup;

    // Create materials
    const materials = {
      cube: new THREE.MeshLambertMaterial({ color: 0x00ff88 }),
      sphere: new THREE.MeshLambertMaterial({ color: 0x0088ff }),
      cylinder: new THREE.MeshLambertMaterial({ color: 0xff8800 }),
      plane: new THREE.MeshLambertMaterial({ color: 0x888888 })
    };

    // Generate 3D objects from CAD data
    cadData.shapes.forEach((shape, index) => {
      let geometry: THREE.BufferGeometry;
      
      switch (shape.type) {
        case 'cube':
          geometry = new THREE.BoxGeometry(
            shape.scale.x || 1,
            shape.scale.y || 1,
            shape.scale.z || 1
          );
          break;
        case 'sphere':
          geometry = new THREE.SphereGeometry(
            Math.max(shape.scale.x, shape.scale.y, shape.scale.z) / 2 || 0.5,
            32,
            16
          );
          break;
        case 'cylinder':
          geometry = new THREE.CylinderGeometry(
            shape.scale.x / 2 || 0.5,
            shape.scale.x / 2 || 0.5,
            shape.scale.y || 1,
            32
          );
          break;
        case 'plane':
          geometry = new THREE.PlaneGeometry(
            shape.scale.x || 1,
            shape.scale.z || 1
          );
          break;
        default:
          geometry = new THREE.BoxGeometry(1, 1, 1);
      }

      const mesh = new THREE.Mesh(geometry, materials[shape.type] || materials.cube);
      
      // Set position
      mesh.position.set(
        shape.position.x || 0,
        shape.position.y || 0,
        shape.position.z || 0
      );

      // Set rotation if provided
      if (shape.rotation) {
        mesh.rotation.set(
          shape.rotation.x || 0,
          shape.rotation.y || 0,
          shape.rotation.z || 0
        );
      }

      mesh.castShadow = true;
      mesh.receiveShadow = true;
      
      cadGroup.add(mesh);
    });

    sceneRef.current.add(cadGroup);
  }, [cadData]);

  return <div ref={mountRef} className="w-full h-full" />;
};
