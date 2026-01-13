
"use client";

import { redirect } from 'next/navigation'
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
    const { data: session } = useSession();

    if(session){

        // if already logged in then redirect to dashboard
        redirect('/dashboard');
    }else{ // if not logged in the show login page
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, var(--color-primary-800) 0%, var(--color-primary-900) 100%)",
                    fontFamily: "var(--font-sans)",
                }}
            >
                <div
                    style={{
                        background: "#fff",
                        borderRadius: "20px",
                        boxShadow: "0 8px 32px 0 rgba(20, 184, 166, 0.18)",
                        padding: "56px 36px 40px 36px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        maxWidth: "370px",
                        width: "100%",
                        border: "1.5px solid var(--color-primary-100)",
                    }}
                >
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ marginBottom: 24 }}
                    >
                        <circle cx="24" cy="24" r="24" fill="var(--color-primary-100)" />
                        <path d="M16 32v-8.5a8 8 0 1 1 16 0V32" stroke="var(--color-primary-700)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="24" cy="20" r="3" fill="var(--color-primary-700)" />
                    </svg>
                    <h2
                        style={{
                            marginBottom: "18px",
                            color: "var(--color-primary-900)",
                            fontWeight: 800,
                            fontSize: "2.1rem",
                            letterSpacing: "-1px",
                            textAlign: "center",
                        }}
                    >
                        Welcome to <span style={{ color: "var(--color-primary-600)" }}>DevTrackr</span>
                    </h2>
                    <p
                        style={{
                            color: "var(--color-primary-700)",
                            fontSize: "1.05rem",
                            marginBottom: "32px",
                            textAlign: "center",
                            fontWeight: 500,
                            maxWidth: 260,
                        }}
                    >
                        Sign in to track your goals, habits, and GitHub activity in one place.
                    </p>
                    <button
                        style={{
                            background: "#24292f",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "13px 28px",
                            fontSize: "1.08rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            transition: "background 0.2s, transform 0.1s",
                            outline: "none",
                            borderBottom: "3px solid var(--color-primary-400)",
                        }}
                        onClick={() => signIn("github")}
                        onMouseOver={e => {
                            e.currentTarget.style.background = 'var(--color-primary-700)';
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.background = '#24292f';
                            e.currentTarget.style.transform = 'none';
                        }}
                    >
                        <svg height="22" width="22" viewBox="0 0 16 16" fill="currentColor" style={{marginRight: 8}}>
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                        </svg>
                        Login with GitHub
                    </button>
                </div>
            </div>
        );
    }
}