import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, CreditCard } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CartData {
  screenshot: string;
  components: Array<{
    id: string;
    name: string;
    price: number;
    description: string;
  }>;
  totalPrice: number;
}

const Cart = () => {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem('pcCart');
    if (savedCart) {
      setCartData(JSON.parse(savedCart));
    }
  }, []);

  const handleCheckout = () => {
    localStorage.removeItem('pcCart');
    setTimeout(() => navigate('/'), 2000);
  };

  if (!cartData) {
    return (
      <div className="min-h-screen bg-gaming-background text-gaming-text p-8">
        <div className="max-w-4xl mx-auto text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-gaming-accent mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gaming-text">Your cart is empty</h2>
          <p className="text-gaming-text/70 mb-4">Add some awesome PC components to get started!</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-gaming-accent hover:bg-gaming-accent/90"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-background text-gaming-text p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-gaming-text hover:text-gaming-accent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Builder
          </Button>
          <h1 className="text-3xl font-bold text-gaming-text">Your Cart</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gaming-muted border-gaming-accent/20 p-6">
              <h2 className="text-xl font-bold mb-4 text-gaming-text">Your Custom PC Build</h2>
              {cartData.screenshot && (
                <img 
                  src={cartData.screenshot} 
                  alt="Custom PC Build" 
                  className="w-full rounded-lg mb-6 border border-gaming-accent/20"
                />
              )}
              <div className="space-y-4">
                {cartData.components.map((component) => (
                  <div key={component.id} className="flex justify-between items-center py-3 border-b border-gaming-accent/20">
                    <div>
                      <h3 className="font-medium text-gaming-text">{component.name}</h3>
                      <p className="text-sm text-gaming-text/70">{component.description}</p>
                    </div>
                    <span className="font-medium text-gaming-accent">
                      ${component.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <Card className="bg-gaming-muted border-gaming-accent/20 p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4 text-gaming-text">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gaming-text/70">Subtotal</span>
                  <span className="text-gaming-text">${cartData.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gaming-text/70">Shipping</span>
                  <span className="text-gaming-text">Free</span>
                </div>
                <div className="flex justify-between font-bold pt-3 border-t border-gaming-accent/20">
                  <span className="text-gaming-text">Total</span>
                  <span className="text-gaming-accent">${cartData.totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <Button 
                className="w-full mt-6 bg-gaming-accent hover:bg-gaming-accent/90 flex items-center justify-center gap-2" 
                onClick={handleCheckout}
              >
                <CreditCard className="h-4 w-4" />
                Checkout
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;