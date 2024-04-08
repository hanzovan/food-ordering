"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');    
    const [creatingUser, setCreatingUser] = useState(false);
    const [userCreated, setUserCreated] = useState(false);
    const [error, setError] = useState(false);
    const [errorName, setErrorName] = useState("");

    // Asynchronous function that handle form submit
    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setCreatingUser(true);
        setUserCreated(false);
        setError(false);
        setErrorName("");

        // Send submit information to server
        const response = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {'Content-Type': 'application/json'}
        });

        // If send request to server not successfully, inform error
        if (!response.ok) {
            if (response.status === 404) {
                setError(true);
                setErrorName("Failed to send request to server")
            } else {
                const data = await response.json();
                setError(true);
                setErrorName(data.errors.join(', '));
            }           
        } else {
            setUserCreated(true);
        }
                    
        // Later enable creating user again (if user need)
        setCreatingUser(false);
    }
    return (
        <section className="mt-8">
            <h1 className="text-center text-primary text-4xl 
            mb-4">
                Register
            </h1>
            {userCreated && (
                <div className="my-4 text-center">
                    User created.<br />
                    Now you can{' '}
                    <Link href={'/login'}>Login &raquo;</Link>
                </div>
            )}
            {error && (
                <div className="my-4 text-center">
                    An error occurred.<br />
                    {errorName}
                </div>
            )}
            <form className="block max-w-xs mx-auto" onSubmit={handleFormSubmit}>
                <input type="email" placeholder="email"
                    value={email} onChange={e => setEmail(e.target.value)}
                    disabled={creatingUser} />
                <input type="password" placeholder="password"
                    value={password} onChange={e => setPassword(e.target.value)}
                    disabled={creatingUser} />
                <button type="submit" disabled={creatingUser}>
                    Register
                </button>
                <div className="my-4 text-center text-gray-500">
                    or login with provider
                </div>
                <button className="flex gap-4 justify-center">
                    <Image src={'/google.png'} alt={'google icon'} width={24} height={24} />
                    Login with google
                </button>
                <div className="text-center my-4 text-gray-500 border-t pt-4">
                    Already have an account?{' '}
                    <Link className="underline" href={'/login'}>Login here &raquo;</Link>
                </div>
            </form>
        </section>
    )
}