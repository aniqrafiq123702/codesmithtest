export async function fetchQuotes(count = 10) {
    try {
      const quotePromises = [];
  
      for (let i = 0; i < count; i++) {
        quotePromises.push(
          fetch("https://api.api-ninjas.com/v1/quotes", {
            headers: {
              "X-Api-Key": "m6iEVcLKdVfw/JLjTYCRYg==o3YslZeMZs2R7rU9", // Your API key
            },
          }).then(res => {
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
          })
        );
      }
  
      const results = await Promise.all(quotePromises);
      // API returns an array with one quote, so flatten the array
      const flattened = results.map(arr => arr[0]); 
      return flattened;
    } catch (error) {
      console.error("Error fetching quotes:", error);
      throw error;
    }
  }