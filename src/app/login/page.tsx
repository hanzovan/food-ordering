"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { SignInResponse, signIn } from "next-auth/react";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');    
    const [loginInProgress, setloginInProgress] = useState(false);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [error, setError] = useState(false);
    const [errorName, setErrorName] = useState("");

    // Asynchronous function that handle form submit
    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setloginInProgress(true);
        // setUserLoggedIn(false);
        // setError(false);
        // setErrorName("");

        // // Send submit information to server
        // const response = await fetch('/api/login', {
        //     method: 'POST',
        //     body: JSON.stringify({ email, password }),
        //     headers: {'Content-Type': 'application/json'}
        // })

        // // if send request to server not successfully, inform error
        // if (!response.ok) {
        //     if (response.status === 404) {
        //         setError(true);
        //         setErrorName("Failed to send request to server")
        //     } else {
        //         const data = await response.json();
        //         setError(true);
        //         setErrorName(data.errors.join(', '));
        //     }
        // } else {
        //     setUserLoggedIn(true);
        // }
        
        await signIn('credentials', { email, password });
        
        // Enable logging again
        setloginInProgress(false); 
    }
    return (
        <section className="mt-8">
            <h1 className="text-center text-primary text-4xl mb-4">
                Login
            </h1>
            {error && (
                <div className="my-4 text-center">
                    An error occurred.<br />
                    {errorName}              
                </div>
            )}
            <form className="block max-w-xs mx-auto" onSubmit={handleFormSubmit}>
                <input type="email" name="email" placeholder="email"
                    value={email} onChange={e => setEmail(e.target.value)}
                    disabled={loginInProgress} />
                <input type="password" name="password" placeholder="password" 
                    value={password} onChange={e => setPassword(e.target.value)}
                    disabled={loginInProgress} />
                <button type="submit" disabled={loginInProgress}>
                    Login
                </button>
                <div className="my-4 text-center text-gray-500">
                    or login with provider
                </div>
                <button className="flex gap-4 justify-center">
                    <Image src={'/google.png'} alt={'google icon'} width={24} height={24} />
                    Login with google
                </button>
                <div className="text-center my-4 text-gray-500 border-t pt-4">
                    Not have an account?{' '}
                    <Link className="underline" href={'/register'}>Register here &raquo;</Link>
                </div>
            </form>
        </section>
    )
}