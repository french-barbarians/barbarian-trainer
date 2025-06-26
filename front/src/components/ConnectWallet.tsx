"use client";

import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ConnectWallet() {
  const { open } = useAppKit();
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const router = useRouter();

  const handleConnectWallet = () => {
    open({ view: "Connect" });
  };

  const handleDisconnect = async () => {
    try {
      await disconnectAsync();
    } catch (err) {
      console.error("Failed to disconnect:", err);
    }
  };

  // Redirect to next screen when wallet is connected
  const handleContinue = () => {
    router.push("/create-profile");
  };

  return (
    <div className="min-h-screen w-full max-w-[375px] mx-auto flex flex-col justify-center items-center px-6 bg-[#0F0641]">
      {/* App Logo */}
      <div className="w-[268px] h-[72px] flex-shrink-0 relative mb-12">
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

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-white text-2xl font-bold mb-4">
          Connect Your Wallet
        </h1>
        <p className="text-white/70 text-base">
          Connect your wallet to get started with Barbarian Trainer
        </p>
      </div>

      {/* Wallet Connection */}
      <div className="w-full space-y-4">
        {!isConnected ? (
          <Button
            onClick={handleConnectWallet}
            className="w-full py-4 text-lg font-semibold bg-white text-[#0F0641] hover:bg-gray-100"
            size="lg"
          >
            Connect Wallet
          </Button>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-green-400 text-lg font-semibold mb-6">
              ✓ Wallet Connected Successfully
            </div>

            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              className="w-full py-4 text-lg font-semibold bg-[#E0F466] text-[#0F0641] hover:bg-[#d1e855] mb-4"
              size="lg"
            >
              Continue to Create Profile
            </Button>

            {/* Disconnect Button */}
            <Button
              onClick={handleDisconnect}
              //   variant="outline"
              className="w-full py-4 text-lg font-semibold bg-white text-[#0F0641] hover:bg-gray-100 mb-4"
              size="lg"
            >
              Disconnect Wallet
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
