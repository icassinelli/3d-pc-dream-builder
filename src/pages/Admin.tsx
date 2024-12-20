import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PCPartsAdmin from '@/components/PCPartsAdmin';

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gaming-background text-gaming-text p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button
            variant="outline"
            className="bg-[#1A1F2C] text-gaming-text hover:bg-[#2A2F3C]"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to App
          </Button>
        </div>
        
        <p className="text-gray-400">
          Configure parts • Select meshes in 3D view • Changes are saved automatically
        </p>

        <PCPartsAdmin
          availableMeshes={[
            "Cube010", "Cube009", "Cube008", "Cube007", "Cube006",
            "MY_SCREEN", "Cube001_Material055_0", "gigabyte-logo001_gigabyte-logo_0"
          ]}
        />
      </div>
    </div>
  );
};

export default Admin;