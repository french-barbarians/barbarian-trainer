"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GrantedAccess, IExecDataProtectorCore } from "@iexec/dataprotector";

interface GrantAccessProps {
  authorizedApp: string;
  dataProtectorCore: IExecDataProtectorCore | null;
  protectedDataAddress: string;
  onAccessGranted: (grantedAccess: GrantedAccess) => void;
}

export default function GrantAccess({
  authorizedApp,
  dataProtectorCore,
  protectedDataAddress,
  onAccessGranted,
}: GrantAccessProps) {
  const [isGranting, setIsGranting] = useState(false);
  const [grantStatus, setGrantStatus] = useState<string>("");

  // Always grant access to all users (zero address)
  const authorizedUser = "0x0000000000000000000000000000000000000000";

  const handleGrantAccess = async () => {
    if (!dataProtectorCore) {
      alert("Please ensure wallet is connected");
      return;
    }

    setIsGranting(true);
    setGrantStatus("Connecting your private coach to your training data...");

    try {
      console.log("Granting access with:", {
        protectedData: protectedDataAddress,
        authorizedApp,
        authorizedUser,
      });

      const result = await dataProtectorCore.grantAccess({
        protectedData: protectedDataAddress,
        authorizedApp: authorizedApp,
        authorizedUser: authorizedUser,
      });

      console.log("Access granted successfully:", result);
      onAccessGranted(result);
      setGrantStatus("🎉 Your coach is now connected and ready to help!");
    } catch (error) {
      console.error("Error granting access:", error);
      setGrantStatus(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsGranting(false);
    }
  };

  const canGrantAccess = dataProtectorCore && protectedDataAddress && authorizedApp && !isGranting;

  return (
    <div className="space-y-4">
      {/* Grant Status */}
      {grantStatus && (
        <div
          className={`p-3 rounded-lg border text-center ${
            grantStatus.includes("Error")
              ? "bg-red-50 border-red-200 text-red-800"
              : grantStatus.includes("✅")
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          {grantStatus}
        </div>
      )}

      {/* Grant Access Button */}
      <Button
        onClick={handleGrantAccess}
        disabled={!canGrantAccess}
        className="w-full h-12 bg-[#E0F466] hover:bg-[#d1e855] text-[#0F0641] font-semibold rounded-lg disabled:opacity-50"
      >
        {isGranting ? 'Connecting your coach...' : '🤝 Allow My Private Coach'}
      </Button>

      {!canGrantAccess && !isGranting && (
        <div className="text-center">
          <p className="text-sm text-gray-500">
            {!dataProtectorCore
              ? "Please connect your wallet first"
              : "Please ensure all data is ready"}
          </p>
        </div>
      )}
    </div>
  );
}
