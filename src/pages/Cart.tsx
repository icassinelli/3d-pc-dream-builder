import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, CreditCard } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  useEffect(() => {
    const savedCart = localStorage.getItem('pcCart');
    if (savedCart) {
      setCartData(JSON.parse(savedCart));
    }
  }, []);

  const handleCheckout = () => {
    toast({
      title: "Order Placed!",
      description: "Thank you for your purchase. We'll process your order soon.",
    });
    localStorage.removeItem('pcCart');
    setTimeout(() => navigate('/'), 2000);
  };

  if (!cartData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Add some awesome PC components to get started!</p>
          <Button onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <ShoppingCart className="h-8 w-8" />
          Your Cart
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Custom PC Build</CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src={cartData.screenshot} 
                  alt="Custom PC Build" 
                  className="w-full rounded-lg mb-4"
                />
                <div className="space-y-2">
                  {cartData.components.map((component) => (
                    <div key={component.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <h3 className="font-medium">{component.name}</h3>
                        <p className="text-sm text-gray-600">{component.description}</p>
                      </div>
                      <span className="font-medium">${component.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cartData.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>${cartData.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full flex items-center justify-center gap-2" 
                  onClick={handleCheckout}
                >
                  <CreditCard className="h-4 w-4" />
                  Checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;