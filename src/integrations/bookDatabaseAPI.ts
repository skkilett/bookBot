export const fetchBooksFromAPI = async (searchTerm: string) => {
  try {
    const response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(searchTerm)}`);
    if (!response.ok) {
      throw new Error(`Error fetching: ${response.statusText}`);
    }
    const data = await response.json();
    return data.docs;
  } catch (error) {
    console.error('fetchBooksFromAPI error:', error);
    return []; 
  }
};
