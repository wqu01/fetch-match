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

export const getDogs = async (searchParams) => {

    console.log(searchParams);
    try {
        const response = await fetch(`${BASE_URL}/dogs/search?${searchParams}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            })
    
        if (response.ok) {
            const dogIds = await response.json();

            console.log(dogIds);
            if(dogIds.resultIds.length > 0) {
                //make request to get dog details
                const dogDetailRes = await fetch(`${BASE_URL}/dogs`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(dogIds.resultIds)
                })

                if (dogDetailRes.ok) {
                    const dogDetails = await dogDetailRes.json();
                    return {dogDetails: dogDetails, error: false, total: dogIds.total};
                }
                else {
                    // Handle errors
                    throw new Error(`Response status: ${response.status}`);
                }
            }

            else {
                return {error: true};
            }
        } else {
        // Handle errors
        throw new Error(`Response status: ${response.status}`);
        }
    }
    catch (error) {
        console.error("Fetching dogs list failed with message", error);
    }

}