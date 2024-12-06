const API_BASE_URL = "http://localhost:3000/api";

export const validateCoupon = async (code: string): Promise<number> => {
  const response = await fetch(`${API_BASE_URL}/cupons/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao validar o cupom.");
  }

  const data = await response.json();
  return data.discount;
};

export const checkout = async (): Promise<void> => {
  const response = await fetch("http://localhost:3000/api/cart/checkout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao finalizar compra.");
  }
};
