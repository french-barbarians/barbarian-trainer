"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Onboarding() {
  const router = useRouter();

  // Auto-navigate to connect wallet after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/connect-wallet');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  // Allow manual navigation by tapping the screen
  const handleScreenTap = () => {
    router.push('/connect-wallet');
  };

  return (
    <div 
      className="min-h-screen w-full max-w-[375px] mx-auto flex flex-col justify-center items-center px-[53px] pr-[54px] bg-[#0F0641] cursor-pointer"
      onClick={handleScreenTap}
    >
      {/* App Logo */}
      <div className="w-[268px] h-[72px] flex-shrink-0 relative">
        <Image
          src="/logo-onboarding.png"
          alt="Barbarian Trainer Logo"
          width={268}
          height={72}
          className="w-full h-full object-cover"
          style={{ aspectRatio: "67/18" }}
          priority
        />
      </div>
    </div>
  );
}
