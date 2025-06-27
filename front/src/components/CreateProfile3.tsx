"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function CreateProfile3() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    // Handle different connection types
    switch(option) {
      case 'strava':
        // Integrate with Strava API
        console.log('Connecting to Strava...');
        break;
      case 'garmin':
        // Integrate with Garmin API
        console.log('Connecting to Garmin...');
        break;
      case 'manual':
        // Navigate to manual GPX upload
        router.push('/create-profile-4');
        break;
      case 'reference':
        // Navigate to reference time input
        console.log('Reference time input...');
        break;
      case 'start':
        // Start the race/training
        router.push('/dashboard');
        break;
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
            
            {/* Step 2 - Completed */}
            <div className="flex items-center ml-6">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">✓</span>
              </div>
            </div>
            
            {/* Step 3 - Active */}
            <div className="flex items-center ml-4">
              <div className="w-8 h-8 bg-[#E0F466] rounded-full flex items-center justify-center">
                <span className="text-[#0F0641] font-semibold text-sm">3</span>
              </div>
              <span className="ml-2 text-[#0F0641] text-center text-base font-bold leading-[160%]" style={{ fontFamily: 'Inter, sans-serif' }}>Your run information</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-12">
          <h2 className="text-[#0F0641] text-2xl font-bold leading-[150%] mb-8 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
            Connect your running data
          </h2>
          
          <div className="space-y-4">
            {/* Connect with Strava */}
            <Button
              onClick={() => handleOptionSelect('strava')}
              className="w-full h-12 bg-white border border-gray-300 text-[#0F0641] font-semibold rounded-lg hover:bg-gray-50 flex items-center justify-center"
            >
              Connect with Strava
            </Button>

            {/* Connect with Garmin */}
            <Button
              onClick={() => handleOptionSelect('garmin')}
              className="w-full h-12 bg-white border border-gray-300 text-[#0F0641] font-semibold rounded-lg hover:bg-gray-50 flex items-center justify-center"
            >
              Connect with Garmin
            </Button>

            {/* Add race data manually */}
            <Button
              onClick={() => handleOptionSelect('manual')}
              className="w-full h-12 bg-white border border-gray-300 text-[#0F0641] font-semibold rounded-lg hover:bg-gray-50 flex items-center justify-center"
            >
              Add your race data manually (GPX data)
            </Button>

            {/* Reference time */}
            <Button
              onClick={() => handleOptionSelect('reference')}
              className="w-full h-12 bg-white border border-gray-300 text-[#0F0641] font-semibold rounded-lg hover:bg-gray-50 flex items-center justify-center"
            >
              Give you reference time for your runs
            </Button>

            {/* Start the race */}
            <Button
              onClick={() => handleOptionSelect('start')}
              className="w-full h-12 bg-[#E0F466] hover:bg-[#d1e855] text-[#0F0641] font-semibold rounded-lg flex items-center justify-center"
            >
              I start the race
            </Button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-4">
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
