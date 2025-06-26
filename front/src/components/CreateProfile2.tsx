"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

const characters = [
  {
    id: "teddy",
    name: "Coach Teddy",
    image: "/teddy.png",
    description: "Calme, humble, protecteur."
  },
  {
    id: "zizou", 
    name: "Coach Zizou",
    image: "/zizou.png",
    description: "Humble, réfléchi, calme, il va te motiver à atteindre tes objectifs."
  },
  {
    id: "serena",
    name: "Coach Serena", 
    image: "/serena.png",
    description: "Humble, réfléchi, calme, il va te motiver à atteindre tes objectifs."
  }
];

export default function CreateProfile2() {
  const router = useRouter();
  const [selectedCharacter, setSelectedCharacter] = useState<string>("");

  const handleNextStep = () => {
    if (selectedCharacter) {
      // Navigate to next step (Create profile - 3)
      router.push('/create-profile-3');
    }
  };

  const handleBack = () => {
    router.back();
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
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            {/* Step 1 - Completed */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">✓</span>
              </div>
            </div>
            
            {/* Step 2 - Active */}
            <div className="flex items-center ml-6">
              <div className="w-8 h-8 bg-[#E0F466] rounded-full flex items-center justify-center">
                <span className="text-[#0F0641] font-semibold text-sm">2</span>
              </div>
              <span className="ml-2 text-[#0F0641] text-center text-base font-bold leading-[160%]" style={{ fontFamily: 'Inter, sans-serif' }}>Choose character</span>
            </div>
            
            {/* Step 3 - Inactive */}
            <div className="flex items-center ml-4">
              <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-400 font-semibold text-sm">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Character Selection */}
        <div className="mb-12">
          <h2 className="text-[#0F0641] text-2xl font-bold leading-[150%] mb-8 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
            Choose your coach
          </h2>
          
          <div className="space-y-4">
            {characters.map((character) => (
              <Card
                key={character.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedCharacter === character.id
                    ? 'ring-4 ring-[#E0F466] border-[#E0F466]'
                    : 'hover:shadow-md border-gray-200'
                }`}
                onClick={() => setSelectedCharacter(character.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* Coach Image */}
                    <div 
                      className="flex-shrink-0 rounded-2xl bg-gray-200 bg-cover bg-center bg-no-repeat"
                      style={{
                        width: '116px',
                        height: '177px',
                        backgroundImage: `url(${character.image})`
                      }}
                    >
                      <Image
                        src={character.image}
                        alt={character.name}
                        width={116}
                        height={177}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    </div>
                    
                    {/* Coach Info */}
                    <div className="flex-1 pt-2">
                      <CardTitle className="text-[#0F0641] text-lg font-bold mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {character.name}
                      </CardTitle>
                      <CardDescription className="text-[#0F0641] text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {character.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleNextStep}
            disabled={!selectedCharacter}
            className="w-full h-12 bg-[#0F0641] hover:bg-[#1a0b5c] text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Step
          </Button>
          
          <Button
            onClick={handleBack}
            variant="outline"
            className="w-full h-12 border-[#0F0641] text-[#0F0641] font-semibold rounded-lg hover:bg-[#0F0641] hover:text-white"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
