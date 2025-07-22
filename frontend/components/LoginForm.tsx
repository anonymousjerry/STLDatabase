'use client'

import { useRouter } from "next/router"
import { useState } from "react"
import toast from "react-hot-toast"
import { useModal } from "@/context/ModalContext";
import { isValidEmailAddressFormat } from "@/lib/utils";
import { signIn } from "next-auth/react";



const LoginForm = () => {
    const [error, setError] = useState("");
    const {openModal} = useModal();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;

        if (!isValidEmailAddressFormat(email)) {
            setError("Email is invalid");
            toast.error("Email is invalid");
            return;
        }

        if (!password || password.length < 8) {
            setError("Password is invalid");
            toast.error("Password is invalid");
            return;
        }

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (res?.error) {
            setError("Invalid email or password");
            toast.error("Invalid email or password");            
        } else {
            setError("");
            toast.success("Successful login");
        }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="basis-1/4 bg-gradient-to-b from-white to-[#f4f7fb] rounded-[40px] p-6 border-[5px] border-white shadow-[0_30px_30px_-20px_rgba(133,189,215,0.88)] m-5">
            <div className="text-center font-black text-[30px] text-[#1089d3]">Sign In</div>
                <form className="mt-5" onSubmit={handleSubmit}>
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
                    <span className="block mt-2 ml-2 text-xs text-[#0099ff]">
                        <a href="#">Forgot Password ?</a>
                    </span>
                    <input
                        defaultValue="Sign In"
                        type="submit"
                        className="block w-full font-bold bg-gradient-to-r from-[#1089d3] to-[#12b1d1] text-white py-4 mt-5 rounded-[20px] shadow-[0_20px_10px_-15px_rgba(133,189,215,0.88)] border-none transition-transform duration-200 ease-in-out hover:scale-[1.03] hover:shadow-[0_23px_10px_-20px_rgba(133,189,215,0.88)] active:scale-95 active:shadow-[0_15px_10px_-10px_rgba(133,189,215,0.88)]"
                    />
                </form>

                <div className="flex ml-2 items-center mt-5">
                    <span className="text-xs text-gray-400">Don't have an account?</span>
                    <button
                        onClick={() => openModal('register')}
                        className="ml-2 text-sm text-[#0099ff] hover:underline"
                    >
                        Sign Up
                    </button>
                </div>

                <div className="mt-6">
                    <span className="block text-center text-[10px] text-gray-400">Or Sign in with</span>
                    <div className="flex justify-center gap-4 mt-1">
                        {["google", "apple", "twitter"].map((provider, index) => (
                            <button
                            key={provider}
                            className="bg-gradient-to-br from-black to-gray-500 border-4 border-white p-1.5 rounded-full w-10 aspect-square grid place-content-center shadow-[0_12px_10px_-8px_rgba(133,189,215,0.88)] transition-transform duration-200 ease-in-out hover:scale-110 active:scale-90"
                            >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox={
                                provider === "google"
                                    ? '0 0 488 512'
                                    : provider === "apple"
                                    ? '0 0 384 512'
                                    : '0 0 512 512'
                                }
                                className="fill-white w-4 h-4"
                            >
                                <path
                                d={
                                    provider === "google"
                                    ? 'M488 261.8C488 403.3 391.1 504 248 504...'
                                    : provider === "apple"
                                    ? 'M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8...'
                                    : 'M389.2 48h70.6L305.6 224.2 487 464H345...'
                                }
                                />
                            </svg>
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
  );
}

export default LoginForm;