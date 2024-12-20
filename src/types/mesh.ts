import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface MeshSelectorProps {
  onMeshSelect: (meshName: string) => void;
  selectedMeshes: string[];
  pendingSelections: string[];
  visibleMeshes: string[];
  hideMeshes?: boolean;
}

export interface SceneRefs {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  meshes: { [key: string]: THREE.Mesh };
  raycaster: THREE.Raycaster;
  animationFrameId?: number;
}