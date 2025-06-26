"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateProfile() {
  const router = useRouter();
  const [pseudo, setPseudo] = useState("");
  const [age, setAge] = useState("");

  const handleNextStep = () => {
    if (pseudo.trim() && age.trim()) {
      // Navigate to next step (Create profile - 2)
      router.push('/create-profile-2');
    }
  };

  return (
    <div className="min-h-screen w-full max-w-[375px] mx-auto bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white">
        {/* Logo */}
        <div className="w-10 h-10 relative">
          <Image
            src="/logo-bleu.png"
            alt="Barbarian Trainer Logo"
            width={40}
            height={40}
            className="w-full h-full object-contain"
          />
        </div>
        {/* Title */}
        <h1 className="text-[#0F0641] text-base font-bold leading-[150%]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Create your profile
        </h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h2 className="text-[#0F0641] text-2xl font-bold leading-[150%] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Hi there 🏃🏻‍♂️
          </h2>
          <p className="text-[#0F0641] text-2xl font-bold leading-[150%]" style={{ fontFamily: 'Inter, sans-serif' }}>Ready to start ?</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            {/* Step 1 - Active */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#E0F466] rounded-full flex items-center justify-center">
                <span className="text-[#0F0641] font-semibold text-sm">1</span>
              </div>
              <span className="ml-2 text-[#0F0641] text-center text-base font-bold leading-[160%]" style={{ fontFamily: 'Inter, sans-serif' }}>Your information</span>
            </div>
            
            {/* Step 2 - Inactive */}
            <div className="flex items-center ml-6">
              <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-400 font-semibold text-sm">2</span>
              </div>
            </div>
            
            {/* Step 3 - Inactive */}
            <div className="flex items-center ml-4">
              <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-400 font-semibold text-sm">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6 mb-12">
          {/* Pseudo Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Your pseudo
            </label>
            <Input
              type="text"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#E0F466] focus:border-transparent"
              placeholder="Enter your pseudo"
            />
          </div>

          {/* Age Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Your age
            </label>
            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#E0F466] focus:border-transparent"
              placeholder="Enter your age"
            />
          </div>
        </div>

        {/* Next Step Button */}
        <Button
          onClick={handleNextStep}
          disabled={!pseudo.trim() || !age.trim()}
          className="w-full h-12 bg-[#0F0641] hover:bg-[#1a0b5c] text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
}
