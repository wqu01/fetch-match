"use client";
import { useEffect, useState } from "react";
import { getBreeds, getDogs } from "@/utils/api";
import {Button, Form, Select, SelectItem, Input, Card, CardHeader, CardBody, CardFooter, Image} from "@heroui/react";
// import Image from 'next/image';

export default function Home() {

  //form status
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  //filters
  const [dogBreeds, setDogBreeds] = useState();
  const [selectedBreeds, setSelectedBreeds] = useState(new Set([]));
  const [minAge, setMinAge] = useState();
  const [maxAge, setMaxAge] = useState();
  const [zipcode, setZipcode] = useState();
  const [sortOrder, setSortOrder] = useState(new Set(['asc']));
  const [dogData, setDogData] = useState();

  //paginations
  const [prevQuery, setPrevQuery] = useState();
  const [nextQuery, setNextQuery] = useState();

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const fetchDogs = async () => {

      const query = [
        selectedBreeds.size > 0 && `breeds=${Array.from(selectedBreeds).join('&')}`,
        `&sort=breed:${Array.from(sortOrder).join('')}`,
        minAge && `&ageMin=${minAge}`,
        maxAge && `&ageMax=${maxAge}`,
        zipcode && `&zipcode=${zipcode}`
      ].filter(Boolean).join('');

      const data = await getDogs(query);
      setSubmitted(true);

      if(data.error) {
        setHasError(true);
      }
      setDogData(data?.dogDetails);
      setNextQuery(data?.nextQuery);
      setPrevQuery(data?.prevQuery);

      setIsLoading(false);
    }
    fetchDogs();
  }

  const handleReset = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitted(true);
    setIsLoading(false);

    // setMinAge('');
    // setMaxAge('');
    // setZipcode('');
    // setSelectedBreeds(new Set([]));
  }

  const handleFavorite = (e) => {
    e.preventDefault;
    //add to favorite
  }
   useEffect(() => {
    console.log('fetching breeds');
    const fetchBreeds = async () => {
       const data = await getBreeds();
       setDogBreeds(data);
    }
    fetchBreeds();
  }, []);

  //fetch initial list of dogs
  
  useEffect(() => {
    console.log('fetching init dog data');
    const fetchInitDog = async () => {
      const data = await getDogs('sort=breed:asc');
      setDogData(data?.dogDetails);
    }
    fetchInitDog();
  }, []);

  return (
   <div className="container max-w-[1440px] p-8 lg:p-36">
    <div className="hero">
      <p>Start finding your match by filtering for a breed (or just browse all breeds!)</p>
      <p>Saw a dog you like? Add them to your favorites</p>
      <p>Once you are ready, click on Find my match and get matched.</p>
    </div>
    <div className="filter py-16">
      <Form className="w-full flex flex-row flex-wrap gap-4" onSubmit={handleSearch}  validationBehavior="native">  
      <Select
        className="max-w-[280px]"
        size="sm"
        label="Filter by breed"
        placeholder="All breeds"
        selectionMode="multiple"
        selectedKeys={selectedBreeds}
        onSelectionChange={setSelectedBreeds}
        >
        {dogBreeds && dogBreeds.map((breed) => (
          <SelectItem key={breed}>{breed}</SelectItem>
        ))}
      </Select>    
      <Input
        size="sm"
        className="max-w-[120px]"
        label="Minimum age"
        placeholder="0"
        type="number"
        max="29"
        min="0"
        validate={(value) => {
          if (maxAge && value > maxAge) {
            return "Mininum age must be less than the maximum age.";
          }
          else {
            return null;
          }
        }}
        value={minAge} onValueChange={setMinAge}
      />
      <Input
        size="sm"
        className="max-w-[120px]"
        label="Maximum age"
        placeholder="29"
        type="number"
        min="0"
        max="29"
        validate={(value) => {
          if (minAge && maxAge && value < minAge) {
            return "Maximum age must be greater than the minimum age.";
          }
          else {
            return null;
          }
        }}
        value={maxAge} onValueChange={setMaxAge}
      />
      <Input
        size="sm"
        className="max-w-[120px]"
        label="Zipcode"
        placeholder="000000"
        value={zipcode} onValueChange={setZipcode}
      />
      <Select className="max-w-[120px]" size="sm" label="Sort breed by" placeholder="Ascending" defaultSelectedKeys={["asc"]} selectedKeys={sortOrder} onSelectionChange={setSortOrder}>
          <SelectItem key="asc">Ascending</SelectItem>
          <SelectItem key="desc">Descending</SelectItem>
      </Select>

      <div className="flex gap-2">
        <Button color="primary" type="submit" isLoading={isLoading ? true : false}>
          Search
        </Button>
        <Button color="secondary" type="reset">
          Reset filter
        </Button>
      </div>
      {hasError && (
        <div className="text-small text-default-500">
          Oops something went wrong. Please try again later.
        </div>
      )}
      </Form>  
    </div>
    <div className="search-result gap-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      {dogData && dogData.map((dog) =>(
        <Card key={dog.id}>
         <CardBody className="overflow-visible p-0">
          <Image
            alt={`profile picture of ${dog.name}`}
            className="object-cover w-full h-[200px]"
            src={dog.img}
            width="100%"
          />
        </CardBody><CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <small className="text-default-500">{dog.breed}</small>
          <h4 className="font-bold text-large">{dog.name}</h4>
          <p className="text-tiny font-bold">{dog.age} years old</p>
          <small className="text-default-500">Located in zip code: {dog.zip_code}</small>
        </CardHeader>
       
        <CardFooter>
          {/* TODO: change button state if dog was already added to favorite */}
          <Button onPress={() => handleFavorite(dog.id)}>
            Add to Favorite
          </Button>
        </CardFooter>
        </Card>
      ))}
    </div>
   </div>
  );
}
