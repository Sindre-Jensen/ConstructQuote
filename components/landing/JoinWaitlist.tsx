"use client";
export default function JoinWaitlist({ className = "" }) {
    return (
        <a
            className={
                "mt-8 block w-full py-3 px-6 rounded-md text-center font-medium text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600 transition-colors " +
                className
            }
            href="/login"
        >
            Try it Free
        </a>
    )
}