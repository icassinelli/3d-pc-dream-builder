import * as THREE from 'three';

export const setupMeshMaterials = (
  mesh: THREE.Mesh,
  isSelected: boolean
) => {
  if (mesh.material instanceof THREE.MeshPhongMaterial) {
    mesh.material.color.setHex(isSelected ? 0x00A3FF : 0xCCCCCC);
  } else {
    mesh.material = new THREE.MeshPhongMaterial({
      color: isSelected ? 0x00A3FF : 0xCCCCCC,
    });
  }
};

export const handleMeshIntersection = (
  event: MouseEvent,
  raycaster: THREE.Raycaster,
  camera: THREE.Camera,
  meshes: { [key: string]: THREE.Mesh },
  onSelect: (meshName: string) => void
) => {
  const rect = (event.target as HTMLElement).getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
  const intersects = raycaster.intersectObjects(Object.values(meshes), false);

  if (intersects.length > 0) {
    const mesh = intersects[0].object;
    if (mesh instanceof THREE.Mesh) {
      event.preventDefault();
      onSelect(mesh.name);
    }
  }
};