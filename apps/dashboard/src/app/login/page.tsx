"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { GoogleLogo, EnvelopeSimple, Lock, ArrowRight } from "@phosphor-icons/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn("credentials", { email, password, callbackUrl: "/" });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-canvas-warm relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-slate/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-slate/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-10 rounded-[3rem] relative z-10">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-14 h-14 bg-text-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <span className="text-white font-bold text-xl">U</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">Content Outreach</h1>
            <p className="text-text-tertiary text-sm mt-1">Plateforme de prospection B2B intelligente</p>
          </div>

          <div className="space-y-6">
            {/* Google Sign In */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-3 py-4 bg-white border border-border rounded-2xl hover:bg-canvas-warm transition-all duration-300 font-medium text-text-secondary group"
            >
              <GoogleLogo size={20} weight="bold" />
              Continuer avec Google
              <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-xs font-medium text-text-tertiary uppercase tracking-widest">ou avec email</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-secondary ml-1">Email professionnel</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary">
                    <EnvelopeSimple size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@entreprise.com"
                    className="w-full pl-12 pr-4 py-4 bg-canvas-warm/50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-accent-slate/30 transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-semibold text-text-secondary">Mot de passe</label>
                  <a href="#" className="text-xs font-medium text-accent-slate hover:underline">Oublié ?</a>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-canvas-warm/50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-accent-slate/30 transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-text-primary text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 group mt-2"
              >
                {isLoading ? "Connexion..." : "Se connecter"}
                {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-text-tertiary">
              Pas encore de compte ?{" "}
              <a href="#" className="font-semibold text-text-primary hover:text-accent-slate transition-colors">
                Contacter l'administrateur
              </a>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center mt-8 text-xs text-text-tertiary uppercase tracking-[0.2em]">
          &copy; 2026 cc-outreach &bull; Quebec, Canada
        </p>
      </motion.div>
    </div>
  );
}
