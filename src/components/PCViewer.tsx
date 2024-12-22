import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { toast } from '@/hooks/use-toast';
import { PCModel } from './Scene/PCModel';

interface PCViewerProps {
  visibleParts: string[];
  onMeshesLoaded?: (meshNames: string[]) => void;
}

const PCViewer = ({ visibleParts, onMeshesLoaded }: PCViewerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const controlsRef = useRef<OrbitControls>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const animationFrameId = useRef<number>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sceneRef.current) return;

    console.log('Updating mesh visibility in scene');
    sceneRef.current.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        const shouldBeVisible = visibleParts.includes(object.name);
        if (object.visible !== shouldBeVisible) {
          console.log(`Setting visibility of ${object.name} to ${shouldBeVisible}`);
          object.visible = shouldBeVisible;
        }
      }
    });
  }, [visibleParts]);

  useEffect(() => {
    if (!mountRef.current) return;

    if (!sceneRef.current) {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#1a1a1a');
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
        alpha: true,
        preserveDrawingBuffer: true
      });
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mountRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 3;
      controls.maxDistance = 10;
      controlsRef.current = controls;

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);

      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
      dracoLoader.preload();
      loader.setDRACOLoader(dracoLoader);
      
      console.log('Loading model...');
      
      loader.load(
        '/PC.glb',
        (gltf) => {
          console.log('Model loaded successfully!');
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = box.getCenter(new THREE.Vector3());
          gltf.scene.position.sub(center);
          
          const meshNames: string[] = [];
          
          gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              console.log('Found mesh:', child.name);
              meshNames.push(child.name);
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          
          scene.add(gltf.scene);
          setIsLoading(false);
          
          if (onMeshesLoaded) {
            onMeshesLoaded(meshNames);
          }
        },
        (progress) => {
          const percentComplete = (progress.loaded / progress.total) * 100;
          console.log('Loading progress:', percentComplete + '%');
        },
        (error) => {
          console.error('Error loading model:', error);
          toast({
            title: "Error",
            description: "Failed to load 3D model. Please try refreshing the page.",
            variant: "destructive",
          });
          setIsLoading(false);
        }
      );
    }

    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      if (cameraRef.current) {
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      }
      
      if (rendererRef.current) {
        rendererRef.current.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);

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
      window.removeEventListener('resize', handleResize);
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
  }, []);

  return (
    <div ref={mountRef} className="w-full h-full relative">
      {sceneRef.current && <PCModel scene={sceneRef.current} visibleParts={visibleParts} />}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gaming-background/50">
          <div className="text-gaming-text">Loading 3D Model...</div>
        </div>
      )}
    </div>
  );
};

export default PCViewer;
