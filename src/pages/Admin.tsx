import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Eye, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import MeshSelector from '@/components/MeshSelector';
import PCPartsAdmin from '@/components/PCPartsAdmin';

interface Part {
  id: string;
  name: string;
  description: string;
  price: number;
  meshNames: string[];
}

const Admin = () => {
  const navigate = useNavigate();
  const [parts, setParts] = useState<Part[]>([
    {
      id: '1',
      name: '27" Gaming Monitor',
      description: '1440p 165Hz Display',
      price: 299.99,
      meshNames: [],
    },
    {
      id: '2',
      name: 'Gaming Tower',
      description: 'RGB Custom Build',
      price: 1499.99,
      meshNames: [],
    },
  ]);
  const [expandedPartId, setExpandedPartId] = useState<string | null>(null);
  const [isPartsAdminOpen, setIsPartsAdminOpen] = useState(false);

  const toggleExpand = (partId: string) => {
    setExpandedPartId(expandedPartId === partId ? null : partId);
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
      name: 'New Part',
      description: '',
      price: 0,
      meshNames: [],
    };
    setParts([...parts, newPart]);
    setExpandedPartId(newPart.id);
  };

  return (
    <div className="min-h-screen bg-gaming-background text-gaming-text p-8">
      <div className="max-w-4xl mx-auto">
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
        
        <p className="text-gray-400 mb-8">
          Click on parts to expand • Select meshes in 3D view • Changes are saved automatically
        </p>

        <div 
          className="border border-dashed border-gaming-accent/30 rounded-lg p-4 mb-8 hover:border-gaming-accent/50 transition-colors cursor-pointer"
          onClick={addNewPart}
        >
          <div className="flex items-center justify-center text-gaming-accent gap-2">
            <Plus className="h-5 w-5" />
            Create New Part
          </div>
        </div>

        <div className="space-y-3">
          {parts.map((part) => (
            <div
              key={part.id}
              className="bg-[#1A1F2C] rounded-lg overflow-hidden"
            >
              <div 
                className="p-4 hover:bg-[#1F242F] transition-colors cursor-pointer"
                onClick={() => toggleExpand(part.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <button className="text-gray-400">
                      {expandedPartId === part.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    <span>{part.name}</span>
                    <span className="text-sm text-gray-500">{part.meshNames.length} meshes</span>
                  </div>
                  <div className="text-gaming-accent">${part.price}</div>
                </div>
              </div>

              {expandedPartId === part.id && (
                <div className="p-4 border-t border-gaming-accent/10 animate-part-in">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Name</label>
                        <Input
                          value={part.name}
                          onChange={(e) => setParts(parts.map(p => 
                            p.id === part.id ? { ...p, name: e.target.value } : p
                          ))}
                          className="bg-gaming-muted text-gaming-text border-gaming-accent/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Price</label>
                        <Input
                          type="number"
                          value={part.price}
                          onChange={(e) => setParts(parts.map(p => 
                            p.id === part.id ? { ...p, price: parseFloat(e.target.value) || 0 } : p
                          ))}
                          className="bg-gaming-muted text-gaming-text border-gaming-accent/20"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Description</label>
                      <Input
                        value={part.description}
                        onChange={(e) => setParts(parts.map(p => 
                          p.id === part.id ? { ...p, description: e.target.value } : p
                        ))}
                        className="bg-gaming-muted text-gaming-text border-gaming-accent/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Mesh Selection</label>
                      <p className="text-xs text-gray-500 mb-2">Click on parts in the 3D view to select/deselect them</p>
                      <MeshSelector
                        selectedMeshes={part.meshNames}
                        onMeshSelect={(meshName) => handleMeshSelect(part.id, meshName)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            className="bg-transparent border-gaming-accent/30 text-gaming-accent hover:bg-gaming-accent/10"
            onClick={() => setIsPartsAdminOpen(true)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Advanced Tools
          </Button>
        </div>

        <PCPartsAdmin
          open={isPartsAdminOpen}
          onOpenChange={setIsPartsAdminOpen}
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