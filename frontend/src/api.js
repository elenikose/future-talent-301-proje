const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const generateRecipe = async (ingredients) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/recipes/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients: ingredients }),
    });

    if (!response.ok) throw new Error("Tarif üretilemedi.");
    const data = await response.json();
    return data; // Backend'den gelen veriyi doğrudan döndür
  } catch (error) {
    console.error("API Hatası:", error);
    throw error;
  }
};