
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export const ThreeJSCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0x00ffff, 0x444444);
    gridHelper.material.opacity = 0.3;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Sample architecture - simple building
    const buildingGroup = new THREE.Group();
    
    // Base/foundation
    const baseGeometry = new THREE.BoxGeometry(4, 0.2, 3);
    const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.1;
    buildingGroup.add(base);

    // Main structure
    const wallGeometry = new THREE.BoxGeometry(4, 2, 3);
    const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
    const walls = new THREE.Mesh(wallGeometry, wallMaterial);
    walls.position.y = 1;
    buildingGroup.add(walls);

    // Roof
    const roofGeometry = new THREE.BoxGeometry(4.2, 0.2, 3.2);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 2.1;
    buildingGroup.add(roof);

    // Windows (as wireframes)
    const windowGeometry = new THREE.PlaneGeometry(0.8, 1.2);
    const windowMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ffff, 
      transparent: true, 
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    
    // Front windows
    const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
    window1.position.set(-0.8, 1.2, 1.51);
    buildingGroup.add(window1);
    
    const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
    window2.position.set(0.8, 1.2, 1.51);
    buildingGroup.add(window2);

    scene.add(buildingGroup);
    setScene(scene);

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;

      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };

      // Rotate camera around the building
      const spherical = new THREE.Spherical();
      spherical.setFromVector3(camera.position);
      spherical.theta -= deltaMove.x * 0.01;
      spherical.phi += deltaMove.y * 0.01;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
      
      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, 1, 0);

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (event: WheelEvent) => {
      const distance = camera.position.distanceTo(new THREE.Vector3(0, 1, 0));
      const newDistance = Math.max(2, Math.min(20, distance + event.deltaY * 0.01));
      
      const direction = new THREE.Vector3();
      direction.subVectors(camera.position, new THREE.Vector3(0, 1, 0)).normalize();
      camera.position.copy(direction.multiplyScalar(newDistance).add(new THREE.Vector3(0, 1, 0)));
    };

    canvasRef.current.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvasRef.current.addEventListener('wheel', handleWheel);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      camera.lookAt(0, 1, 0);
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvasRef.current?.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvasRef.current?.removeEventListener('wheel', handleWheel);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-pointer"
      style={{ display: 'block' }}
    />
  );
};
