import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import PCPartsAdmin from '@/components/PCPartsAdmin';
import PartsList from '@/components/PartsList';
import PartDetailsForm from '@/components/PartDetailsForm';

interface Part {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  isConfigurable: boolean;
  meshNames: string[];
}

const Admin = () => {
  const navigate = useNavigate();
  const [parts, setParts] = useState<Part[]>([
    {
      id: '1',
      code: 'Monitor',
      name: '27" Gaming Monitor',
      description: '1440p 165Hz Display',
      price: 299.99,
      isConfigurable: true,
      meshNames: [],
    },
    {
      id: '2',
      code: 'PC',
      name: 'Gaming Tower',
      description: 'RTX 4070, i7, 32GB RAM',
      price: 1499.99,
      isConfigurable: true,
      meshNames: [],
    },
  ]);
  const [expandedPartId, setExpandedPartId] = useState<string | null>(null);

  const toggleExpand = (partId: string) => {
    setExpandedPartId(expandedPartId === partId ? null : partId);
  };

  const handlePartUpdate = (updatedPart: Part) => {
    setParts(parts.map(part => 
      part.id === updatedPart.id ? updatedPart : part
    ));
  };

  const handleMeshSelect = (partId: string, meshName: string) => {
    setParts(parts.map(part => {
      if (part.id === partId) {
        const meshNames = part.meshNames.includes(meshName)
          ? part.meshNames.filter(name => name !== meshName)
          : [...part.meshNames, meshName];
        return { ...part, meshNames };
      }
      return part;
    }));
  };

  const addNewPart = () => {
    const newPart: Part = {
      id: crypto.randomUUID(),
      code: '',
      name: 'New Part',
      description: '',
      price: 0,
      isConfigurable: true,
      meshNames: [],
    };
    setParts([...parts, newPart]);
    setExpandedPartId(newPart.id);
  };

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
          Click on parts to expand • Select meshes in 3D view • Changes are saved automatically
        </p>

        <div 
          className="border border-dashed border-gaming-accent/30 rounded-lg p-4 hover:border-gaming-accent/50 transition-colors cursor-pointer"
          onClick={addNewPart}
        >
          <div className="flex items-center justify-center text-gaming-accent gap-2">
            <Plus className="h-5 w-5" />
            Create New Part
          </div>
        </div>

        <PartsList
          parts={parts}
          expandedPartId={expandedPartId}
          onToggleExpand={toggleExpand}
        >
          {(part) => (
            <PartDetailsForm
              part={part}
              onUpdate={handlePartUpdate}
              onMeshSelect={handleMeshSelect}
            />
          )}
        </PartsList>

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