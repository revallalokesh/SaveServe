"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

interface SignInPageProps {
  className?: string;
  onSignIn?: (email: string, password: string) => void;
  isLoading?: boolean;
  error?: string;
}

// Simplified placeholder component that doesn't depend on Three.js
const SimplePlaceholder = ({ className }: { className?: string }) => (
  <div className={cn("relative h-full w-full bg-gradient-to-t from-black to-gray-900", className)} />
);

// Simplified SignInPage component with Three.js elements removed
export const SignInPage = ({
  className,
  onSignIn,
  isLoading,
  error,
}: SignInPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div
      className={cn(
        "flex w-[100%] flex-col min-h-screen bg-black relative",
        className
      )}
    >
      <div className="absolute inset-0 z-0">
          <div className="absolute inset-0">
          <SimplePlaceholder />
          </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex flex-1 flex-col lg:flex-row ">
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="w-full mt-[150px] max-w-sm">
                  <motion.div
                    key="email-step"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-1">
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">
                        Welcome Admin
                      </h1>
                    </div>

                    <div className="space-y-4">
                      <button className="backdrop-blur-[2px] w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full py-3 px-4 transition-colors">
                        <span className="text-lg">G</span>
                        <span>Sign in with Google</span>
                      </button>

                      <div className="flex items-center gap-4">
                        <div className="h-px bg-white/10 flex-1" />
                        <span className="text-white/40 text-sm">or</span>
                        <div className="h-px bg-white/10 flex-1" />
                      </div>

                      <form
                        onSubmit={e => {
                          e.preventDefault();
                          if (!email || !password) return;
                          if (onSignIn) onSignIn(email, password);
                        }}
                        className="space-y-4"
                      >
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full backdrop-blur-[1px] text-white border-1 border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border focus:border-white/30 text-center"
                            required
                          />
                        </div>
                        <div className="relative">
                          <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full backdrop-blur-[1px] text-white border-1 border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border focus:border-white/30 text-center"
                            required
                          />
                        </div>
                        {error && (
                          <div className="text-red-500">{error}</div>
                        )}
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full rounded-full bg-white text-black font-medium py-3 hover:bg-white/90 transition-colors mt-2"
                        >
                          {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                      </form>
                    </div>
                  </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

