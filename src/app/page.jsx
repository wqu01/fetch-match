"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from 'next/navigation';
import { getBreeds, getDogs } from "@/utils/api";
import {Button, Form, Select, SelectItem, Input} from "@heroui/react";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dogBreeds, setDogBreeds] = useState();
  const [selectedBreeds, setSelectedBreeds] = useState(new Set([]));
  const [minAge, setMinAge] = useState();
  const [maxAge, setMaxAge] = useState();
  const [zipcode, setZipcode] = useState();
  const [sortOrder, setSortOrder] = useState();

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitted(true);
    setIsLoading(false);
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
    console.log('fetching dog ids');
    const fetchDogIds = async () => {
       const data = await getDogs(new URLSearchParams({
        size: '10',
        from: '10',
        sort: 'breed:asc'
      }).toString());
      //  setDogBreeds(data);
      console.log(data)
    }
    fetchDogIds();
  }, []);

  return (
   <div>
    <div className="hero">
      <p>Start finding your match by filtering for a breed (or just browse all breeds!)</p>
      <p>Saw a dog you like? Add them to your favorites</p>
      <p>Once you are ready, click on Find my match and get matched.</p>
    </div>
    <div className="filter">
    <Form className="w-full max-w-xs flex gap-4" onSubmit={handleSearch}  validationBehavior="native">  
      <Select
        className="max-w-xs"
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
          label="Minimum age"
          placeholder="0"
          type="number"
          min="0"
          value={minAge} onValueChange={setMinAge}
        />
         <Input
          label="Maximum age"
          placeholder="29"
          type="number"
          max="29"
          value={maxAge} onValueChange={setMaxAge}

        />
        <Input
          label="Filter by Zipcode"
          placeholder="000000"
          value={zipcode} onValueChange={setZipcode}
        />
        <Select className="max-w-xs" label="Sort breed by" placeholder="Ascending" defaultSelectedKeys={["ascending"]} selectedKeys={sortOrder} onValueChange={setSortOrder}>
            <SelectItem key="ascending">Ascending</SelectItem>
            <SelectItem key="descending">Descending</SelectItem>
        </Select>

      <div className="flex gap-2">
        <Button color="primary" type="submit" isLoading={isLoading ? true : false}>
          Search
        </Button>
        <Button color="secondary" type="reset">
          Reset filter
        </Button>
      </div>

      {submitted && <>
        <p className="text-small text-default-500">Selected: {Array.from(selectedBreeds).join(", ")}</p>
        <p className="text-small text-default-500">Min age: {minAge}</p>
        <p className="text-small text-default-500">Max age: {maxAge}</p>
        <p className="text-small text-default-500">Zipcode: {zipcode}</p>
      </> 
}
      {hasError && (
        <div className="text-small text-default-500">
          Oops something went wrong. Please try again later.
        </div>
      )}
  </Form>  
    </div>
   </div>
  );
}
