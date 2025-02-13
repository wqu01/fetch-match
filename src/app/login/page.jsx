"use client";
import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("../../components/LoginForm"), {
  ssr: false,
});

export default function Login() {
  return (
    <div className="mt-32 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold pt-8">Welcome to Fetch Match</h1>
      <h3 className="font-semibold text-gray-500 pt-8 pb-8">
        To get started, log in with your name and email
      </h3>
      <div className="form-wrapper w-full max-w-80">
        <LoginForm />
      </div>
    </div>
  );
}
