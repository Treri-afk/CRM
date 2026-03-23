
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
    console.log(data)
    return data; // 🔑 retourne les données
  } catch (error) {
    console.error('Erreur :', error);
    return [];
  }
}