
export async function getAllCustomers() {
  try {
    const response = await fetch(`http://localhost:5002/api/customers`);
    if (!response.ok) throw new Error('Erreur réseau');
    const data = await response.json();
    return data; // 🔑 retourne les données
  } catch (error) {
    console.error('Erreur :', error);
    return [];
  }
}

export async function getCustomerIndustry() {
  try {
    const response = await fetch('http://localhost:5002/api/customers/industry');
    if (!response.ok) throw new Error('Erreur réseau');
    const data = await response.json(); // ✅ ça marche seulement si response est un Response
    return data;
  } catch (err) {
    console.error('Erreur backend :', err);
    return [];
  }
}

export async function newCustomer(customerData) {
  try {
    const response = await fetch(`http://localhost:5002/api/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
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