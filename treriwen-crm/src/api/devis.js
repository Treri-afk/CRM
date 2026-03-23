
export async function getAllDevis() {
  try {
    const response = await fetch(`http://localhost:5002/api/devis`);
    if (!response.ok) throw new Error('Erreur réseau');
    const data = await response.json();
    return data; // 🔑 retourne les données
  } catch (error) {
    console.error('Erreur :', error);
    return [];
  }
}


export async function getDevisStatus(){
  try {
    const response = await fetch(`http://localhost:5002/api/devis/status`);
    if (!response.ok) throw new Error('Erreur réseau');
    const data = await response.json();
    return data; // 🔑 retourne les données
  } catch (error) {
    console.error('Erreur :', error);
    return [];
  }
}