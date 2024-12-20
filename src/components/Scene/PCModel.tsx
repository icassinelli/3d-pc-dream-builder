import { useEffect } from 'react';
import * as THREE from 'three';
import { useMeshVisibility } from '@/contexts/MeshVisibilityContext';

interface PCModelProps {
  scene: THREE.Scene;
  visibleParts: string[];
}

export function PCModel({ scene, visibleParts }: PCModelProps) {
  const { isMeshVisible } = useMeshVisibility();

  useEffect(() => {
    console.log('Updating mesh visibility with parts:', visibleParts);
    
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        const shouldBeVisible = isMeshVisible(object.name);
        if (object.visible !== shouldBeVisible) {
          object.visible = shouldBeVisible;
          console.log(`Setting visibility of ${object.name} to ${shouldBeVisible}`);
        }
      }
    });
  }, [scene, isMeshVisible, visibleParts]);

  return null;
}