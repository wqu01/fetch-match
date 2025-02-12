"use client";
import { useEffect, useState } from "react";
import { getBreeds, getDogs, getDogDetails, getMatch } from "@/utils/api";
import {
  Button,
  Form,
  Select,
  SelectItem,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Pagination,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
} from "@heroui/react";

export default function Home() {
  const PAGE_SIZE = 20;
  //form status
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  //filters
  const [dogBreeds, setDogBreeds] = useState();
  const [selectedBreeds, setSelectedBreeds] = useState(new Set([]));
  const [minAge, setMinAge] = useState();
  const [maxAge, setMaxAge] = useState();
  const [zipcode, setZipcode] = useState();
  const [sortOrder, setSortOrder] = useState(new Set(["asc"]));
  const [dogData, setDogData] = useState();

  //paginations
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState();

  //favorites
  const {
    isOpen: isFavOpen,
    onOpen: onOpenFav,
    onClose: onCloseFav,
    onOpenChange: onOpenFavChange,
  } = useDisclosure();
  const [favoritesList, setFavoritesList] = useState([]);
  const [favoriteDogs, setFavoriteDogs] = useState([]);

  //matches
  const {
    isOpen: isModalOpen,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const [match, setMatch] = useState();

  const fetchDogs = async () => {
    const query = [
      selectedBreeds.size > 0 &&
        `breeds=${Array.from(selectedBreeds).join("&")}`,
      `&sort=breed:${Array.from(sortOrder).join("")}`,
      minAge && `&ageMin=${minAge}`,
      maxAge && `&ageMax=${maxAge}`,
      zipcode && `&zipcode=${zipcode}`,
      `&from=${(currentPage - 1) * PAGE_SIZE}`,
      `&size=${PAGE_SIZE}`,
    ]
      .filter(Boolean)
      .join("");

    const data = await getDogs(query);

    if (data.error) {
      setHasError(true);
    }
    setDogData(data?.dogDetails);
    setMaxPage(Math.ceil(data?.total / PAGE_SIZE));

    setIsLoading(false);
  };

  const fetchMatch = async () => {
    const matchId = await getMatch(favoritesList);
    //get dog details from existing favorites list instead of another API request
    const matchDog = favoriteDogs.find((dog) => dog.id === matchId);
    setMatch(matchDog);
    onCloseFav();
    onOpenModal();
  };

  const FetchButton = () => (
    <Button
      onPress={handleMatch}
      isDisabled={favoritesList.length > 0 ? false : true}
      color="primary"
    >
      Fetch my match
    </Button>
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setCurrentPage(1);
    fetchDogs();
  };

  const handleRemoveFavorite = (id) => {
    setFavoritesList([...favoritesList.filter((faves) => faves !== id)]);
  };

  const handleAddToFavorite = (id) => {
    //add to favorite
    setFavoritesList([...favoritesList, id]);
  };

  const handleMatch = () => {
    //find match
    fetchMatch();
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentPage]);

  useEffect(() => {
    const fetchDogDetails = async () => {
      const favDogs = await getDogDetails(favoritesList);
      setFavoriteDogs(favDogs);
    };
    fetchDogDetails();
  }, [favoritesList]);

  useEffect(() => {
    setIsLoading(true);
    fetchDogs();
  }, [currentPage]);

  useEffect(() => {
    const fetchBreeds = async () => {
      const data = await getBreeds();
      setDogBreeds(data);
    };
    fetchBreeds();
  }, []);

  //fetch initial list of dogs
  useEffect(() => {
    const fetchInitDog = async () => {
      const data = await getDogs(`sort=breed:asc&size=${PAGE_SIZE}`);
      setDogData(data?.dogDetails);
      setMaxPage(Math.ceil(data?.total / PAGE_SIZE));
    };
    fetchInitDog();
  }, []);

  return (
    <>
      <div className="container max-w-[1440px] p-8 lg:px-36">
        <section className="hero flex flex-row flex-wrap justify-between pt-16 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold pb-8">
              Welcome to Fetch Match
            </h1>
            <p>
              Start finding your match by filtering for a breed (or just browse
              all breeds!)
            </p>
            <p>Saw a dog you like? Add them to your favorites</p>
            <p>Once you are ready, click on Fetch my match and get matched.</p>
          </div>
          <div className="btn-wrapper flex gap-2 items-center">
            <Button onPress={onOpenFav} color="primary" variant="flat">
              View favorites
            </Button>
            <FetchButton />
          </div>
        </section>
        <div className="filter py-16">
          <Form
            className="w-full flex flex-row flex-wrap gap-4"
            onSubmit={handleSearch}
            validationBehavior="native"
          >
            <Select
              className="max-w-[260px]"
              size="sm"
              label="Filter by breed"
              placeholder="All breeds"
              selectionMode="multiple"
              selectedKeys={selectedBreeds}
              onSelectionChange={setSelectedBreeds}
            >
              {dogBreeds &&
                dogBreeds.map((breed) => (
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
                } else {
                  return null;
                }
              }}
              value={minAge}
              onValueChange={setMinAge}
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
                } else {
                  return null;
                }
              }}
              value={maxAge}
              onValueChange={setMaxAge}
            />
            <Input
              size="sm"
              className="max-w-[120px]"
              label="Zipcode"
              placeholder="000000"
              value={zipcode}
              onValueChange={setZipcode}
            />
            <Select
              className="max-w-[120px]"
              size="sm"
              label="Sort breed by"
              placeholder="Ascending"
              defaultSelectedKeys={["asc"]}
              selectedKeys={sortOrder}
              onSelectionChange={setSortOrder}
            >
              <SelectItem key="asc">Ascending</SelectItem>
              <SelectItem key="desc">Descending</SelectItem>
            </Select>

            <div className="flex gap-2">
              <Button
                color="primary"
                type="submit"
                isLoading={isLoading ? true : false}
              >
                Search
              </Button>
              <Button color="primary" variant="ghost" type="reset">
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
        <section className="search-result gap-6 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {dogData &&
            dogData?.map((dog) => (
              <Card key={dog.id}>
                <CardBody className="overflow-visible p-0">
                  <Image
                    alt={`profile picture of ${dog.name}`}
                    className="object-cover w-full h-[200px]"
                    src={dog.img}
                    width="100%"
                  />
                </CardBody>
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <small className="text-default-500">{dog.breed}</small>
                  <h4 className="font-bold text-large">{dog.name}</h4>
                  <p className="text-tiny font-bold">{dog.age} years old</p>
                  <small className="text-default-500">
                    Located in zip code: {dog.zip_code}
                  </small>
                </CardHeader>

                <CardFooter>
                  <Button
                    onPress={() => handleAddToFavorite(dog.id)}
                    isDisabled={favoritesList.includes(dog.id)}
                    size="sm"
                  >
                    Add to Favorite
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </section>
        <div className="pagination flex flex-col gap-5 items-center py-16">
          <Pagination
            showControls
            initialPage={1}
            total={maxPage}
            page={currentPage}
            onChange={setCurrentPage}
          />
        </div>
      </div>
      <Drawer isOpen={isFavOpen} onOpenChange={onOpenFavChange}>
        <DrawerContent>
          {(onCloseFav) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                Your favorites
              </DrawerHeader>
              <DrawerBody>
                {favoritesList.length > 0 ? (
                  favoriteDogs?.map((favDog) => (
                    <Card key={favDog.id}>
                      <CardBody className="overflow-visible p-0 grid grid-cols-12 gap-6 md:gap-4 items-center justify-center">
                        <div className="relative col-span-4">
                          <Image
                            alt={`profile picture of ${favDog.name}`}
                            className="object-cover h-[120px]"
                            src={favDog.img}
                            width="100%"
                          />
                        </div>
                        <div className="flex flex-col col-span-4">
                          <small className="text-default-500">
                            {favDog.breed}
                          </small>
                          <h4 className="font-bold text-large">
                            {favDog.name}
                          </h4>
                          <p className="text-tiny font-bold">
                            {favDog.age} years old
                          </p>
                          <small className="text-default-500">
                            Located in zip code: {favDog.zip_code}
                          </small>
                        </div>

                        <div className="flex flex-col col-span-1">
                          <Button
                            onPress={() => handleRemoveFavorite(favDog.id)}
                            size="sm"
                          >
                            Remove
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  ))
                ) : (
                  <p>Your favorites are empty.</p>
                )}
              </DrawerBody>
              <DrawerFooter>
                <FetchButton />
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
      <Modal
        isOpen={isModalOpen}
        onOpenChange={onOpenModal}
        onClose={onCloseModal}
      >
        <ModalContent>
          {(onCloseModal) => (
            <>
              <ModalHeader className="flex flex-col gap-1 items-center">
                {`You matched with ${match.name}`}!
              </ModalHeader>
              <ModalBody className="max-w-200px">
                <Image
                  alt={`profile picture of ${match.name}`}
                  className="object-cover w-full h-[300px]"
                  src={match.img}
                  width="100%"
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
