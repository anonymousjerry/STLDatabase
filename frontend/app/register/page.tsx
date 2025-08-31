"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaGoogle, FaApple } from "react-icons/fa6";
import { signIn } from "next-auth/react";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const providers = [
    { name: "google", Icon: FaGoogle },
    { name: "apple", Icon: FaApple },
  ];

  useEffect(() => {
    // chechking if user has already registered redirect to home page
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const username = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const confirmPassword = e.target[3].value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      toast.error("Email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password is invalid");
      toast.error("Password is invalid");
      return;
    }

    if (confirmPassword !== password) {
      setError("Passwords are not equal");
      toast.error("Passwords are not equal");
      return;
    }

    try {
        // sending API request for registering user
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/register`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                email,
                password,
            }),
        });

        if (res.status === 400) {
            toast.error("This email is already registered");
            setError("The email already in use");
        }
        if (res.status === 201) {
            setError("");
            toast.success("Registration successful");
            router.push("/login");
        }
    } catch (error) {
        toast.error("Error, try again");
        setError("Error, try again");
        console.log(error);
    }
  };

  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="bg-white h-screen">
      <div className="inset-0 h-full bg-custom-light-secondcolor flex items-center justify-center py-20">
        <div className="basis-1/4 bg-gradient-to-b from-white to-[#f4f7fb] rounded-[40px] p-6 border-[5px] border-white shadow-[0_30px_30px_-20px_rgba(133,189,215,0.88)] m-5">
             <div className="text-center font-black text-[30px] text-[#1089d3]">Sign Up</div>
                 <form className="mt-5" onSubmit={handleSubmit}>
                     <input
                        placeholder="Name"
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full bg-white border-none px-5 py-4 rounded-[20px] shadow-[0_10px_10px_-5px_#cff0ff] placeholder:text-gray-400 focus:outline-none focus:border-x-2 focus:border-[#12b1d1]"
                    />
                    <input
                        placeholder="E-mail"
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full bg-white border-none px-5 py-4 rounded-[20px] mt-4 shadow-[0_10px_10px_-5px_#cff0ff] placeholder:text-gray-400 focus:outline-none focus:border-x-2 focus:border-[#12b1d1]"
                    />
                    <input
                        placeholder="Password"
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="w-full bg-white border-none px-5 py-4 rounded-[20px] mt-4 shadow-[0_10px_10px_-5px_#cff0ff] placeholder:text-gray-400 focus:outline-none focus:border-x-2 focus:border-[#12b1d1]"
                    />
                    <input
                        placeholder="Confirm Password"
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        className="w-full bg-white border-none px-5 py-4 rounded-[20px] mt-4 shadow-[0_10px_10px_-5px_#cff0ff] placeholder:text-gray-400 focus:outline-none focus:border-x-2 focus:border-[#12b1d1]"
                    />
                    <span className="block mt-2 ml-2 text-xs text-[#0099ff]">
                        <a href="#">Forgot Password ?</a>
                    </span>
                    <input
                        defaultValue="Sign Up"
                        type="submit"
                        className="block w-full font-bold bg-gradient-to-r from-[#1089d3] to-[#12b1d1] text-white py-4 mt-5 rounded-[20px] shadow-[0_20px_10px_-15px_rgba(133,189,215,0.88)] border-none transition-transform duration-200 ease-in-out hover:scale-[1.03] hover:shadow-[0_23px_10px_-20px_rgba(133,189,215,0.88)] active:scale-95 active:shadow-[0_15px_10px_-10px_rgba(133,189,215,0.88)]"
                    />
                </form>

                <div className="flex ml-2 items-center mt-5">
                    <span className="text-xs text-gray-400">Already have and account?</span>
                    <button
                        onClick={() => router.replace('/login')}
                        className="ml-2 text-sm text-[#0099ff] hover:underline"
                    >
                        Sign In
                    </button>
                </div>

                <div className="mt-6">
                    <span className="block text-center text-[10px] text-gray-400">Or Sign in with</span>
                    <div className="flex justify-center gap-4 mt-1">
                        {providers.map(({ name, Icon }) => (
                          <button
                            key={name}
                            onClick={() => signIn(name)}
                            className="bg-gradient-to-br from-black to-gray-500 
                                      border-4 border-white p-1.5 rounded-full 
                                      w-10 aspect-square grid place-content-center 
                                      shadow-[0_12px_10px_-8px_rgba(133,189,215,0.88)] 
                                      transition-transform duration-200 ease-in-out 
                                      hover:scale-110 active:scale-90"
                          >
                            <Icon className="text-white w-4 h-4" />
                          </button>
                        ))}
                    </div>
                </div>
                <span className="block text-center mt-4 text-[#0099ff] text-[9px]">
                    <a href="#">Learn user licence agreement</a>
                </span>
            </div>
        {/* </div> */}
    </div>
    </div>

  );
};

export default RegisterPage;
