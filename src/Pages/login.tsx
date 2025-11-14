import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import loginimg from '../assets/login/loging-siteimg1.png';
import logo from "../assets/logo.png";
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <main className="min-h-screen bg-[#0E73F6] flex items-center justify-center p-4">
      {/* Outer container (keeps nice max width while staying responsive) */}
      <div className="w-full max-w-5xl">
        {/* Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* LEFT: form */}
          <section className="p-6 sm:p-8">
            {/* Logo + tagline */}
            <div className="flex items-center gap-3 mb-8">
              <img
                src={logo}
                alt="FlowTap Logo"
                className="w-[210px] h-[98px] object-contain"
              />
            </div>

            <h1 className="text-lg sm:text-xl font-semibold text-neutral-900">
              Please set your password
            </h1>

            <form className="mt-6 space-y-4">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                  Password<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-[#0E73F6] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 my-auto text-neutral-500 hover:text-neutral-700 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible className="w-5 h-5" />
                    ) : (
                      <AiOutlineEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm */}
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-neutral-700">
                  Confirm Password<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-[#0E73F6] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-2 my-auto text-neutral-500 hover:text-neutral-700 focus:outline-none"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <AiOutlineEyeInvisible className="w-5 h-5" />
                    ) : (
                      <AiOutlineEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Subdomain */}
              <div>
                <label htmlFor="sub" className="block text-sm font-medium text-neutral-700">
                  Choose your subdomain
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-neutral-300 bg-neutral-50 px-3 text-sm text-neutral-600">
                    https://
                  </span>
                  <input
                    id="sub"
                    type="text"
                    placeholder="test"
                    className="w-0 flex-1 min-w-0 border-y border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0E73F6] focus:border-transparent"
                  />
                  <span className="inline-flex items-center rounded-r-md border border-l-0 border-neutral-300 bg-neutral-50 px-3 text-sm text-neutral-600">
                    flowtap.com
                  </span>
                </div>
              </div>

              {/* How did you hear about us */}
              <div>
                <label htmlFor="source" className="block text-sm font-medium text-neutral-700">
                  How did you hear about us?
                </label>
                <select
                  id="source"
                  className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-[#0E73F6] focus:border-transparent"
                  defaultValue="LinkedIn"
                >
                  <option>LinkedIn</option>
                  <option>Google</option>
                  <option>Friend</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-[#0E73F6] focus:ring-[#0E73F6]"
                />
                <span>
                  I have read and agree with{" "}
                  <a href="#" className="text-[#0E73F6] hover:underline">
                    terms of use
                  </a>
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/steps');
                }}
                className="w-full rounded-md bg-[#0E73F6] px-4 py-2 text-white text-sm font-medium hover:brightness-105 focus:ring-2 focus:ring-offset-2 focus:ring-[#0E73F6]"
              >
                Continue
              </button>
            </form>
          </section>

          {/* RIGHT: profile + illustration */}
          <aside className="relative p-6 sm:p-8 bg-gradient-to-b from-neutral-50 to-white">
            <div className="space-y-1 text-sm text-neutral-800">
              <p className="font-medium tracking-wide">ANTONY RAJ</p>
              <p className="text-neutral-500">username@gmail.com</p>
              <p className="text-neutral-700">Jack Repair</p>
              <p className="text-neutral-700">+91 8925201489</p>
            </div>

            {/* Illustration */}
            <div className="mt-6 md:mt-8">
              <img
                src={loginimg}
                alt="Phone repair illustration"
                className="w-full max-w-md md:max-w-none md:w-[420px] ml-auto object-contain"
                loading="lazy"
              />
            </div>

            {/* subtle inset card look */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5" />
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Login;

