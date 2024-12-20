import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { toast } from '@/hooks/use-toast';
import LoadingOverlay from './LoadingOverlay';

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
  const animationFrameId = useRef<number>();
  const [isLoading, setIsLoading] = useState(true);

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
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.NONE  // Disable right-click pan
    };
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

        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            meshesRef.current[child.name] = child;
            setupMeshMaterials(child, selectedMeshes.includes(child.name));
          }
        });

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

    // Right-click handler for mesh selection
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycasterRef.current.setFromCamera(new THREE.Vector2(x, y), camera);
      const intersects = raycasterRef.current.intersectObjects(Object.values(meshesRef.current), false);
      
      if (intersects.length > 0 && intersects[0].object instanceof THREE.Mesh) {
        onMeshSelect(intersects[0].object.name);
      }
    };

    renderer.domElement.addEventListener('contextmenu', handleContextMenu);

    // Animation loop
    const animate = () => {
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
      renderer.domElement.removeEventListener('contextmenu', handleContextMenu);
      
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
  }, [onMeshSelect, selectedMeshes]);

  // Update mesh visibility and materials
  useEffect(() => {
    Object.entries(meshesRef.current).forEach(([name, mesh]) => {
      const isSelected = selectedMeshes.includes(name);
      mesh.visible = hideMeshes ? !isSelected : true;
      setupMeshMaterials(mesh, isSelected);
    });
  }, [selectedMeshes, hideMeshes]);

  const setupMeshMaterials = (mesh: THREE.Mesh, isSelected: boolean) => {
    const material = new THREE.MeshPhongMaterial({
      color: isSelected ? 0x00A3FF : 0xCCCCCC,
    });
    mesh.material = material;
  };

  return (
    <div ref={mountRef} className="w-full h-[400px] relative rounded-lg overflow-hidden">
      <LoadingOverlay isLoading={isLoading} />
      <div className="absolute bottom-4 left-4 text-sm text-gaming-text/70">
        Right-click to select parts • Left-click drag to rotate • Middle-click to zoom
      </div>
    </div>
  );
};

export default MeshSelector;