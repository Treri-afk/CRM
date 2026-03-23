
export async function getAllDeals() {
  try {
    const response = await fetch(`http://localhost:5002/api/deals`);
    if (!response.ok) throw new Error('Erreur réseau');
    const data = await response.json();
    return data; // 🔑 retourne les données
  } catch (error) {
    console.error('Erreur :', error);
    return [];
  }
}


export async function getDealsStatus(){
  try {
    const response = await fetch(`http://localhost:5002/api/deals/status`);
    if (!response.ok) throw new Error('Erreur réseau');
    const data = await response.json();
    return data; // 🔑 retourne les données
  } catch (error) {
    console.error('Erreur :', error);
    return [];
  }
}

export async function newDeal(dealData) {
  try {
    const response = await fetch(`http://localhost:5002/api/deals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dealData),
    });

    const data = await response.json(); // 👈 récupère toujours

    if (!response.ok) {
      console.error("Erreur backend :", data); // 🔥 IMPORTANT
      throw new Error(data.message || "Erreur serveur");
    }

    return data;

  } catch (error) {
    console.error("Erreur :", error);
    return null;
  }
}