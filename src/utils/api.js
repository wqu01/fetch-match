const BASE_URL = "https://frontend-take-home-service.fetch.com";

//get list of breeds
export const getBreeds = async () => {
    try {
        const response = await fetch(`${BASE_URL}/dogs/breeds`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            })
    
        if (response.ok) {
            const dogBreeds = await response.json();
            return dogBreeds;
        } else {
        // Handle errors
        throw new Error(`Response status: ${response.status}`);
        }
    }
    catch (error) {
        console.error("Fetching breed list failed with message", error);
    }

}