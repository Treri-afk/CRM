
export async function getStatusCustomers() {
  try {
    const response = await fetch(`http://localhost:5000/api/status/customers`);
    if (!response.ok) throw new Error('Erreur réseau');
    const data = await response.json();
    return data; // 🔑 retourne les données
  } catch (error) {
    console.error('Erreur :', error);
    return [];
  }
}

