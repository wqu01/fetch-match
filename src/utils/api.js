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

                const dogDetails = await getDogDetails(dogIds.resultIds);

                return { 
                    dogDetails: dogDetails,
                    error: false,
                    total: dogIds.total
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

export const getDogDetails = async (ids) => {
    try {
        //make request to get dog details
        const dogDetailRes = await fetch(`${BASE_URL}/dogs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(ids)
        })

        if (dogDetailRes.ok) {
            const dogDetails = await dogDetailRes.json();
            return dogDetails;
        }
        else {
            // Handle errors
            throw new Error(`Response status: ${response.status}`);
        }
    }
    catch (error) {
        console.error("Fetching dogs details failed with message", error);
    }
}

export const getMatch = async (ids) => {
    try {
        //make request to get match
        const matchRes = await fetch(`${BASE_URL}/dogs/match`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(ids)
        })

        if (matchRes.ok) {
            const matchId = await matchRes.json();
            return matchId.match;
        }
        else {
            // Handle errors
            throw new Error(`Response status: ${response.status}`);
        }
    }
    catch (error) {
        console.error("Fetching match failed with message", error);
    }
}

