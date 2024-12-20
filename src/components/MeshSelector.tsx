import { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { toast } from '@/hooks/use-toast';

interface MeshSelectorProps {
  onMeshSelect: (meshName: string) => void;
  selectedMeshes: string[];
  hideMeshes?: boolean;
}

const MeshSelector = ({ onMeshSelect, selectedMeshes, hideMeshes = false }: MeshSelectorProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const controlsRef = useRef<OrbitControls>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const meshesRef = useRef<{ [key: string]: THREE.Mesh }>({});
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const animationFrameId = useRef<number>();
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPosition = useRef<{ x: number; y: number } | null>(null);

  // Track all available meshes
  const [availableMeshes, setAvailableMeshes] = useState<string[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0A0A0A');
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Model loading
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    dracoLoader.preload();

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      '/PC.glb',
      (gltf) => {
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        gltf.scene.position.sub(center);

        const meshNames: string[] = [];
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            meshesRef.current[child.name] = child;
            meshNames.push(child.name);
            child.material = new THREE.MeshPhongMaterial({
              color: selectedMeshes.includes(child.name) ? 0x00A3FF : 0xCCCCCC,
            });
          }
        });

        setAvailableMeshes(meshNames);
        scene.add(gltf.scene);
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
        toast({
          title: "Error",
          description: "Failed to load 3D model",
          variant: "destructive",
        });
      }
    );

    // Mouse event handlers
    const handleMouseDown = (event: MouseEvent) => {
      dragStartPosition.current = { x: event.clientX, y: event.clientY };
      setIsDragging(false);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (dragStartPosition.current) {
        const deltaX = Math.abs(event.clientX - dragStartPosition.current.x);
        const deltaY = Math.abs(event.clientY - dragStartPosition.current.y);
        if (deltaX > 5 || deltaY > 5) {
          setIsDragging(true);
        }
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (!isDragging && mountRef.current) {
        const rect = mountRef.current.getBoundingClientRect();
        mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        if (cameraRef.current && sceneRef.current) {
          raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
          const intersects = raycasterRef.current.intersectObjects(
            Object.values(meshesRef.current),
            false
          );

          if (intersects.length > 0) {
            const mesh = intersects[0].object;
            if (mesh instanceof THREE.Mesh) {
              event.preventDefault();
              onMeshSelect(mesh.name);
            }
          }
        }
      }
      dragStartPosition.current = null;
      setIsDragging(false);
    };

    mountRef.current.addEventListener('mousedown', handleMouseDown);
    mountRef.current.addEventListener('mousemove', handleMouseMove);
    mountRef.current.addEventListener('mouseup', handleMouseUp);

    // Animation loop
    const animate = () => {
      if (!mountRef.current) return;
      
      animationFrameId.current = requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();

    // Cleanup
    return () => {
      mountRef.current?.removeEventListener('mousedown', handleMouseDown);
      mountRef.current?.removeEventListener('mousemove', handleMouseMove);
      mountRef.current?.removeEventListener('mouseup', handleMouseUp);
      
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
    };
  }, [onMeshSelect, selectedMeshes, isDragging]);

  // Update mesh visibility and colors
  useEffect(() => {
    Object.entries(meshesRef.current).forEach(([name, mesh]) => {
      if (mesh.material instanceof THREE.MeshPhongMaterial) {
        const isSelected = selectedMeshes.includes(name);
        mesh.visible = hideMeshes ? !isSelected : true;
        mesh.material.color.setHex(isSelected ? 0x00A3FF : 0xCCCCCC);
      }
    });
  }, [selectedMeshes, hideMeshes]);

  return (
    <div ref={mountRef} className="w-full h-[400px] relative rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gaming-background/50">
          <div className="text-gaming-text">Loading 3D Model...</div>
        </div>
      )}
    </div>
  );
};

export default MeshSelector;