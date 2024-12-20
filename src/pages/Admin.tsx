import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Eye, Settings } from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();

  const parts = [
    { name: '27" Gaming Monitor', meshCount: 29 },
    { name: 'Gaming Tower', meshCount: 105 },
    { name: 'Mechanical Keyboard', meshCount: 534 },
    { name: 'Gaming Mouse', meshCount: 18 },
    { name: '2.1 Speaker System', meshCount: 9 },
    { name: 'Non-Configurable Items', meshCount: 1 },
  ];

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
          Double-click on any field to edit • Use 3D view to select meshes
        </p>

        <div className="border border-dashed border-gaming-accent/30 rounded-lg p-4 mb-8 hover:border-gaming-accent/50 transition-colors cursor-pointer">
          <div className="flex items-center justify-center text-gaming-accent gap-2">
            <Plus className="h-5 w-5" />
            Create New Part
          </div>
        </div>

        <div className="space-y-3">
          {parts.map((part) => (
            <div
              key={part.name}
              className="bg-[#1A1F2C] rounded-lg p-4 hover:bg-[#1F242F] transition-colors"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button className="text-gray-400 hover:text-gaming-accent">
                    <Plus className="h-4 w-4" />
                  </button>
                  <span>{part.name}</span>
                  <span className="text-sm text-gray-500">{part.meshCount} meshes</span>
                </div>
                <Button
                  variant="ghost"
                  className="text-gaming-accent hover:text-gaming-accent/80 hover:bg-transparent"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Mesh List
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            className="bg-transparent border-gaming-accent/30 text-gaming-accent hover:bg-gaming-accent/10"
          >
            <Settings className="mr-2 h-4 w-4" />
            Advanced Tools
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Admin;