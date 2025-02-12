"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Link } from "@heroui/react";

export default function LoginForm() {
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [isAuth, setAuth] = useState(
    document?.cookie.indexOf("isAuth=") !== -1,
  );
  const [hasError, setHasError] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const name = formData.get("name");

    try {
      const response = await fetch(
        "https://frontend-take-home-service.fetch.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, name }),
        },
      );

      //login succeed
      if (response.ok) {
        setLoading(false);
        setAuth(true);
        console.log(response);
        //purely for user experience purpose
        //save auth status as cookie (1 hour)
        document.cookie = "isAuth=true;max-age=3600";
        //redirect to home page
        router.push("/");
      } else {
        throw new Error(`Response status: ${response.status}`);
      }
    } catch (error) {
      setLoading(false);
      setHasError(true);
      console.error("Could not log in", error);
    }
  };

  return isAuth ? (
    <>
      <div className="flex flex-col items-center">
        <p className="text-center pb-8">You are already logged in.</p>
        <Button as={Link} color="primary" href="/" variant="solid">
          Back to home
        </Button>
      </div>
    </>
  ) : (
    <Form
      className="w-full max-w-xs flex flex-col gap-4"
      onSubmit={onSubmit}
      validationBehavior="native"
    >
      <Input
        isRequired
        errorMessage="Please enter a valid name"
        label="Name"
        labelPlacement="outside"
        name="name"
        placeholder="Enter your name"
        type="text"
      />
      <Input
        isRequired
        errorMessage="Please enter a valid email"
        label="Email"
        labelPlacement="outside"
        name="email"
        placeholder="Enter your email"
        type="email"
      />
      <div className="flex gap-2">
        <Button
          color="primary"
          type="submit"
          isLoading={isLoading ? true : false}
        >
          Submit
        </Button>
      </div>
      {hasError && (
        <div className="text-small text-default-500">
          Log in failed. Please try again later.
        </div>
      )}
    </Form>
  );
}
