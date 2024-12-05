import { useState } from "react";
import { IGame } from "../types/game";
import { validateCoupon, checkout } from "../services/cartService";

interface CartItem {
  _id: string;
  game: IGame | null;
}

interface CartProps {
  cartItems: CartItem[];
  fetchCartItems: () => Promise<void>;
  handleRemoveFromCart: (cartItemId: string) => Promise<void>;
}

const Cart = ({ cartItems, fetchCartItems, handleRemoveFromCart }: CartProps) => {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const totalValue = cartItems.reduce((total, item) => {
    if (item.game && item.game.price_overview) {
      return total + item.game.price_overview.final / 100;
    }
    return total;
  }, 0);

  const discountedValue = totalValue * (1 - discount / 100);

  const applyCoupon = async () => {
    try {
      if (discount > 0) {
        setDiscount(0);
        setCoupon("");
        alert("Cupom removido.");
      } else {
        const newDiscount = await validateCoupon(coupon);
        setDiscount(newDiscount);
        alert(`Cupom aplicado com sucesso: ${newDiscount}% de desconto.`);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.message || "Erro ao aplicar o cupom.");
    }
  };

  // Function to handle the checkout process
  const handleCheckout = async () => {
    try {
      setLoadingCheckout(true);
      await checkout();
      alert("Compra finalizada com sucesso!");
      fetchCartItems(); 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.message || "Erro ao finalizar compra.");
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <div className="p-4 w-3/4">
      <h1 className="text-2xl font-bold mb-4">Meu Carrinho</h1>
      {cartItems.length === 0 ? (
        <p>
          Seu carrinho está vazio. <a href="/">Explore os jogos</a>
        </p>
      ) : (
        <div>
          {/* Display Cart Items */}
          <div className="space-y-4">
            {cartItems.map((item) => {
              if (!item.game) return null;

              return (
                <div
                  key={item._id}
                  className="flex items-center justify-between bg-gray-800 p-4 rounded-lg shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.game.header_image || "/images/placeholder.jpg"}
                      alt={item.game.name || "Imagem do jogo"}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="text-white font-bold">{item.game.name}</h3>
                      <p className="text-gray-400 text-sm">
                        {item.game.release_date?.date || "Data de lançamento não disponível"}
                      </p>
                      <p className="text-green-500 font-bold">
                        {item.game.price_overview
                          ? `R$ ${(item.game.price_overview.final / 100).toFixed(2)}`
                          : "GRÁTIS"}
                      </p>
                    </div>
                  </div>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={async () => {
                      try {
                        await handleRemoveFromCart(item._id);
                        fetchCartItems();
                      } catch (err) {
                        console.error("Erro ao remover o item do carrinho:", err);
                      }
                    }}
                  >
                    Remover
                  </button>
                </div>
              );
            })}
          </div>

          {/* Coupon Section */}
          <div className="mt-4">
            <h2 className="text-lg font-bold mb-2">Aplicar Cupom</h2>
            <div className="flex space-x-2">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Insira o código do cupom"
                className="p-2 rounded border border-gray-600 bg-gray-800 text-white w-full"
              />
              <button
                className={`px-4 py-2 rounded ${
                  discount > 0 ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
                onClick={applyCoupon}
              >
                {discount > 0 ? "Remover" : "Aplicar"}
              </button>
            </div>
            {discount > 0 && (
              <p className="text-green-500 mt-2">Cupom aplicado: {discount}% de desconto</p>
            )}
          </div>

          {/* Total and Checkout Section */}
          <div className="mt-4">
            <h2 className="text-lg font-bold">Total: R$ {discountedValue.toFixed(2)}</h2>
            <button
              className={`bg-green-500 text-white px-6 py-3 rounded mt-4 hover:bg-green-600 ${
                loadingCheckout && "opacity-50 cursor-not-allowed"
              }`}
              onClick={handleCheckout}
              disabled={loadingCheckout}
            >
              {loadingCheckout ? "Finalizando..." : "Finalizar Compra"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
