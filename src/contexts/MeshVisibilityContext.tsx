import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type PartVisibility = Record<string, boolean>;

interface MeshVisibilityContextType {
  visibleParts: PartVisibility;
  setVisibleParts: (parts: PartVisibility) => void;
  isMeshVisible: (meshName: string) => boolean;
}

const MeshVisibilityContext = createContext<MeshVisibilityContextType | null>(null);

export function MeshVisibilityProvider({ children }: { children: ReactNode }) {
  const [visibleParts, setVisibleParts] = useState<PartVisibility>({});

  const isMeshVisible = useCallback((meshName: string): boolean => {
    // If no parts are explicitly set as visible, show everything
    if (Object.keys(visibleParts).length === 0) {
      return true;
    }

    // Check if this mesh should be visible based on component visibility
    return Object.entries(visibleParts).some(([_, isVisible]) => isVisible);
  }, [visibleParts]);

  return (
    <MeshVisibilityContext.Provider value={{ visibleParts, setVisibleParts, isMeshVisible }}>
      {children}
    </MeshVisibilityContext.Provider>
  );
}

export function useMeshVisibility() {
  const context = useContext(MeshVisibilityContext);
  if (!context) {
    throw new Error('useMeshVisibility must be used within a MeshVisibilityProvider');
  }
  return context;
}