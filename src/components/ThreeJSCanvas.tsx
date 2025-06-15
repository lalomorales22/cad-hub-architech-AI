
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CADGenerationResult } from '../services/aiServices';

interface ThreeJSCanvasProps {
  cadData?: CADGenerationResult | null;
}

export const ThreeJSCanvas = ({ cadData }: ThreeJSCanvasProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
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

    // Controls (basic mouse interaction)
    let mouseX = 0;
    let mouseY = 0;
    let isMouseDown = false;

    const handleMouseDown = () => { isMouseDown = true; };
    const handleMouseUp = () => { isMouseDown = false; };
    const handleMouseMove = (event: MouseEvent) => {
      if (!isMouseDown) return;
      
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      
      camera.position.x = camera.position.x * Math.cos(deltaX * 0.01) + camera.position.z * Math.sin(deltaX * 0.01);
      camera.position.z = camera.position.z * Math.cos(deltaX * 0.01) - camera.position.x * Math.sin(deltaX * 0.01);
      camera.position.y += deltaY * 0.01;
      
      camera.lookAt(0, 0, 0);
      
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);

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
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      
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
