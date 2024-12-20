import * as THREE from 'three';
import { SceneRefs } from '@/types/mesh';

export const setupMeshMaterials = (mesh: THREE.Mesh, isSelected: boolean) => {
  const material = new THREE.MeshPhongMaterial({
    color: isSelected ? 0x00A3FF : 0xCCCCCC,
  });
  mesh.material = material;
};

export const handleMeshSelection = (
  event: MouseEvent,
  sceneRefs: SceneRefs,
  selectedMeshes: string[],
  onMeshSelect: (meshName: string) => void
) => {
  event.preventDefault();
  
  if (!sceneRefs.renderer || !sceneRefs.camera) return;
  
  const rect = sceneRefs.renderer.domElement.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
  sceneRefs.raycaster.setFromCamera(new THREE.Vector2(x, y), sceneRefs.camera);
  const intersects = sceneRefs.raycaster.intersectObjects(Object.values(sceneRefs.meshes), false);
  
  if (intersects.length > 0 && intersects[0].object instanceof THREE.Mesh) {
    const meshName = intersects[0].object.name;
    onMeshSelect(meshName);
    setupMeshMaterials(intersects[0].object as THREE.Mesh, !selectedMeshes.includes(meshName));
  }
};

export const initializeScene = (container: HTMLDivElement): SceneRefs => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0A0A0A');

  const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(5, 5, 5);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 3;
  controls.maxDistance = 10;
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN
  };

  return {
    scene,
    camera,
    renderer,
    controls,
    meshes: {},
    raycaster: new THREE.Raycaster()
  };
};