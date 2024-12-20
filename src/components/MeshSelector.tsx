import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { toast } from '@/hooks/use-toast';
import LoadingOverlay from './LoadingOverlay';
import { MeshSelectorProps, SceneRefs } from '@/types/mesh';
import { setupMeshMaterials, handleMeshSelection, initializeScene } from '@/utils/meshUtils';

interface ExtendedMeshSelectorProps extends MeshSelectorProps {
  pendingSelections: string[];
  visibleMeshes: string[];
}

const MeshSelector = ({ 
  onMeshSelect, 
  selectedMeshes, 
  pendingSelections,
  visibleMeshes,
  hideMeshes = false 
}: ExtendedMeshSelectorProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneRefs>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize scene
    const sceneRefs = initializeScene(mountRef.current);
    sceneRef.current = sceneRefs;
    mountRef.current.appendChild(sceneRefs.renderer.domElement);

    // Prevent context menu
    sceneRefs.renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    sceneRefs.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    sceneRefs.scene.add(directionalLight);

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
            sceneRefs.meshes[child.name] = child;
            setupMeshMaterials(child, selectedMeshes.includes(child.name));
          }
        });

        sceneRefs.scene.add(gltf.scene);
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
      if (sceneRef.current) {
        handleMeshSelection(event, sceneRef.current, selectedMeshes, onMeshSelect);
      }
    };

    sceneRefs.renderer.domElement.addEventListener('contextmenu', handleContextMenu);

    // Animation loop
    const animate = () => {
      if (!sceneRef.current) return;
      
      sceneRef.current.animationFrameId = requestAnimationFrame(animate);
      sceneRef.current.controls.update();
      sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
    };
    
    animate();

    // Cleanup
    return () => {
      if (sceneRef.current) {
        sceneRef.current.renderer.domElement.removeEventListener('contextmenu', handleContextMenu);
        if (sceneRef.current.animationFrameId) {
          cancelAnimationFrame(sceneRef.current.animationFrameId);
        }
        if (mountRef.current) {
          mountRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
        sceneRef.current.renderer.dispose();
        sceneRef.current.controls.dispose();
      }
    };
  }, [onMeshSelect, selectedMeshes]);

  // Update mesh materials based on selection state
  const updateMeshMaterials = (mesh: THREE.Mesh) => {
    if (selectedMeshes.includes(mesh.name)) {
      // Assigned to this part (blue)
      mesh.material = new THREE.MeshPhongMaterial({ 
        color: 0x0066ff,
        opacity: 0.8,
        transparent: true
      });
    } else if (pendingSelections.includes(mesh.name)) {
      // Pending assignment (orange)
      mesh.material = new THREE.MeshPhongMaterial({ 
        color: 0xff6600,
        opacity: 0.8,
        transparent: true
      });
    } else {
      // Unassigned (gray)
      mesh.material = new THREE.MeshPhongMaterial({ 
        color: 0x999999,
        opacity: 0.6,
        transparent: true
      });
    }
  };

  // Update mesh visibility and materials
  useEffect(() => {
    if (!sceneRef.current) return;
    
    console.log('Updating mesh visibility in MeshSelector:', {
      meshes: Object.keys(sceneRef.current.meshes),
      visibleMeshes,
      selectedMeshes,
      pendingSelections
    });
    
    Object.entries(sceneRef.current.meshes).forEach(([name, mesh]) => {
      // A mesh should only be visible if it's in the visibleMeshes array
      // and we're not hiding all meshes
      const isVisible = visibleMeshes.includes(name) && !hideMeshes;
      
      // Update visibility
      if (mesh.visible !== isVisible) {
        console.log(`Setting visibility of ${name} to ${isVisible}`);
        mesh.visible = isVisible;
      }
      
      // Only update materials for visible meshes
      if (isVisible) {
        if (selectedMeshes.includes(name)) {
          // Assigned to this part (blue)
          mesh.material = new THREE.MeshPhongMaterial({ 
            color: 0x0066ff,
            opacity: 0.8,
            transparent: true
          });
        } else if (pendingSelections.includes(name)) {
          // Pending assignment (orange)
          mesh.material = new THREE.MeshPhongMaterial({ 
            color: 0xff6600,
            opacity: 0.8,
            transparent: true
          });
        } else {
          // Unassigned (gray)
          mesh.material = new THREE.MeshPhongMaterial({ 
            color: 0x999999,
            opacity: 0.6,
            transparent: true
          });
        }
      }
    });
  }, [selectedMeshes, pendingSelections, visibleMeshes, hideMeshes]);

  return (
    <div ref={mountRef} className="w-full h-[400px] relative rounded-lg overflow-hidden">
      <LoadingOverlay isLoading={isLoading} />
      <div className="absolute bottom-4 left-4 text-sm text-gaming-text/70">
        Click to select/unselect parts • Left-click drag to rotate • Middle-click to zoom
      </div>
    </div>
  );
};

export default MeshSelector;