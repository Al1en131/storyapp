import CONFIG from '../config';

export async function register(name, email, password) {
  try {
      const response = await fetch(`${CONFIG.BASE_URL}/register`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      return data;
  } catch (error) {
      console.error("Error registering:", error);
      return null;
  }
}

export async function login(email, password) {
  try {
      const response = await fetch(`${CONFIG.BASE_URL}/login`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      localStorage.setItem("token", data.loginResult.token);
      return data.loginResult;
  } catch (error) {
      console.error("Error logging in:", error);
      return null;
  }
}

export async function getStories() {
  const token = localStorage.getItem("token"); 
  if (!token) {
      alert("Anda harus login terlebih dahulu!");
      return [];
  }

  try {
      const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
          method: "GET",
          headers: {
              "Authorization": `Bearer ${token}`
          }
      });

      const data = await response.json();
      if (data.error) {
          console.error("Gagal mengambil data:", data.message);
          return [];
      }

      return data.listStory || []; 
  } catch (error) {
      console.error("Error fetching stories:", error);
      return [];
  }
}


export async function addStory(name, description, photoBlob, lat, lon) {
  const token = localStorage.getItem("token"); 
  if (!token) {
      alert("Anda harus login terlebih dahulu!");
      return null;
  }

  const formData = new FormData();
  formData.append("description", description);
  formData.append("photo", photoBlob);
  if (lat && lon) {
      formData.append("lat", parseFloat(lat));
      formData.append("lon", parseFloat(lon));
  }

  try {
      const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
          method: "POST",
          body: formData,
          headers: {
              "Authorization": `Bearer ${token}` 
          }
      });

      return await response.json();
  } catch (error) {
      console.error("Error adding story:", error);
      return null;
  }
}

  export async function subscribePushNotification({ endpoint, keys: { p256dh, auth } }) {
    const accessToken = getAccessToken();
    const data = JSON.stringify({
      endpoint,
      keys: { p256dh, auth },
    });
  
    const fetchResponse = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: data,
    });
    const json = await fetchResponse.json();
  
    return {
      ...json,
      ok: fetchResponse.ok,
    };
  }
  
  export async function unsubscribePushNotification({ endpoint }) {
    const accessToken = getAccessToken();
    const data = JSON.stringify({
      endpoint,
    });
  
    const fetchResponse = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: data,
    });
    const json = await fetchResponse.json();
  
    return {
      ...json,
      ok: fetchResponse.ok,
    };
  }

  





