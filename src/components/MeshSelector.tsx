import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { toast } from '@/hooks/use-toast';

interface MeshSelectorProps {
  onMeshSelect: (meshName: string) => void;
  selectedMeshes: string[];
}

const MeshSelector = ({ onMeshSelect, selectedMeshes }: MeshSelectorProps) => {
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

  useEffect(() => {
    if (!mountRef.current) return;

    if (!sceneRef.current) {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#0A0A0A');
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        50,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.set(5, 5, 5);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
      });
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      mountRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controlsRef.current = controls;

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

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
              child.material = new THREE.MeshPhongMaterial({
                color: selectedMeshes.includes(child.name) ? 0x00A3FF : 0xCCCCCC,
              });
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

      const handleClick = (event: MouseEvent) => {
        if (!mountRef.current) return;

        const rect = mountRef.current.getBoundingClientRect();
        mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        if (cameraRef.current && sceneRef.current) {
          raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
          const intersects = raycasterRef.current.intersectObjects(Object.values(meshesRef.current), true);

          if (intersects.length > 0) {
            const mesh = intersects[0].object;
            onMeshSelect(mesh.name);
          }
        }
      };

      mountRef.current.addEventListener('click', handleClick);
    }

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

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [onMeshSelect, selectedMeshes]);

  useEffect(() => {
    Object.entries(meshesRef.current).forEach(([name, mesh]) => {
      if (mesh.material instanceof THREE.Material) {
        mesh.material.color.setHex(selectedMeshes.includes(name) ? 0x00A3FF : 0xCCCCCC);
      }
    });
  }, [selectedMeshes]);

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