import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Part {
  id: string;
  name: string;
  meshNames: string[];
}

interface PCPartsAdminProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableMeshes: string[];
}

const PCPartsAdmin = ({ open, onOpenChange, availableMeshes }: PCPartsAdminProps) => {
  const [parts, setParts] = useState<Part[]>([]);
  const [newPartName, setNewPartName] = useState('');
  const [editingPartId, setEditingPartId] = useState<string | null>(null);

  const addPart = () => {
    if (!newPartName.trim()) {
      toast({
        title: "Error",
        description: "Part name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setParts([
      ...parts,
      {
        id: crypto.randomUUID(),
        name: newPartName,
        meshNames: [],
      },
    ]);
    setNewPartName('');
  };

  const toggleMeshForPart = (partId: string, meshName: string) => {
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

  const deletePart = (partId: string) => {
    setParts(parts.filter(part => part.id !== partId));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-gaming-background text-gaming-text">
        <SheetHeader>
          <SheetTitle className="text-gaming-text">PC Parts Admin</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div className="flex gap-2">
            <Input
              placeholder="New part name"
              value={newPartName}
              onChange={(e) => setNewPartName(e.target.value)}
              className="bg-gaming-muted text-gaming-text"
            />
            <Button onClick={addPart} className="bg-gaming-accent hover:bg-gaming-accent/80">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {parts.map((part) => (
              <div key={part.id} className="bg-gaming-muted p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{part.name}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePart(part.id)}
                    className="text-gaming-text hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {availableMeshes.map((meshName) => (
                    <label
                      key={meshName}
                      className="flex items-center space-x-2 text-sm cursor-pointer hover:text-gaming-accent"
                    >
                      <input
                        type="checkbox"
                        checked={part.meshNames.includes(meshName)}
                        onChange={() => toggleMeshForPart(part.id, meshName)}
                        className="rounded border-gaming-accent text-gaming-accent"
                      />
                      <span>{meshName}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PCPartsAdmin;