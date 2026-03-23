
export async function getCalendars() {
  try {
    const response = await fetch(`http://localhost:5002/api/calendars`);
    if (!response.ok) throw new Error('Erreur réseau');
    const data = await response.json();
    return data; // 🔑 retourne les données
  } catch (error) {
    console.error('Erreur :', error);
    return [];
  }
}

