import axios from "axios";

const BASE_URL = "https://frontend-take-home-service.fetch.com";

export const getDogIds = async (searchParams) => {
  try {
    const response = await axios.get(`${BASE_URL}/dogs/search`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: "true",
      params: searchParams,
    });

    const dogIds = response.data;

    if (dogIds.resultIds.length > 0) {
      return {
        ids: dogIds.resultIds,
        total: dogIds.total,
      };
    } else {
      return { dogDetails: [], total: 0 };
    }
  } catch (error) {
    console.error("Fetching dogs list failed with message", error);
  }
};
//get list of breeds
export const getBreeds = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/dogs/breeds`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: "true",
    });

    const dogBreeds = response.data;
    return dogBreeds;
  } catch (error) {
    console.error("Fetching breed list failed with message", error);
  }
};

export const getDogDetails = async (ids) => {
  try {
    //make request to get dog details
    const dogDetailRes = await axios.post(`${BASE_URL}/dogs`, ids, {
      withCredentials: "true",
    });

    const dogDetails = dogDetailRes.data;
    return dogDetails;
  } catch (error) {
    console.error("Fetching dogs details failed with message", error);
  }
};

export const getMatch = async (ids) => {
  try {
    //make request to get match
    const matchRes = await axios.post(`${BASE_URL}/dogs/match`, ids, {
      withCredentials: "true",
    });

    const matchId = await matchRes.data;
    return matchId.match;
  } catch (error) {
    console.error("Fetching match failed with message", error);
  }
};
