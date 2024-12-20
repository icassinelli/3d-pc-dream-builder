interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay = ({ isLoading }: LoadingOverlayProps) => {
  if (!isLoading) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gaming-background/50">
      <div className="text-gaming-text">Loading 3D Model...</div>
    </div>
  );
};

export default LoadingOverlay;