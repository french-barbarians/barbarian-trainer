"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount, useDisconnect } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { Button } from "@/components/ui/button";
import {
  GrantedAccess,
  IExecDataProtector,
  IExecDataProtectorCore,
} from "@iexec/dataprotector";
import GPXUploader from "@/components/GPXUploader";
import ProtectedDataDisplay from "@/components/ProtectedDataDisplay";
import GrantAccess from "@/components/GrantAccess";
import { DualGPXProtectionResult } from "@/lib/gpxProtection";
import Coach from "@/components/Coach";
import Image from "next/image";

export default function Home() {
  const APP = "0x85305b1498E9268aFE2EB4f63ee767125c558074"; // latest app version

  const { open } = useAppKit();
  const { disconnectAsync } = useDisconnect();
  const { isConnected, connector } = useAccount();

  const [dataProtectorCore, setDataProtectorCore] =
    useState<IExecDataProtectorCore | null>(null);

  const [gpxProtectedData, setGpxProtectedData] =
    useState<DualGPXProtectionResult>();
  const [grantedAccess, setGrantedAccess] = useState<GrantedAccess | null>(
    null
  );

  const login = () => {
    open({ view: "Connect" });
  };

  const logout = async () => {
    try {
      await disconnectAsync();
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  useEffect(() => {
    const initializeDataProtector = async () => {
      if (isConnected && connector) {
        const iexecOptions = {
          smsURL: "https://sms.labs.iex.ec", // TDX sms
        };
        const provider =
          (await connector.getProvider()) as import("ethers").Eip1193Provider;
        const dataProtector = new IExecDataProtector(provider, {
          iexecOptions,
        });
        setDataProtectorCore(dataProtector.core);
      }
    };

    initializeDataProtector();
  }, [isConnected, connector]);

  return (
    <div className="max-w-6xl mx-auto">
      <nav className="bg-neutral-900">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-2">
          <div className="ml-3 font-mono leading-5 font-bold">
            <Image
              src="/logo-onboarding.png"
              alt="My Personal Coach"
              width={120}
              height={40}
            />
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/onboarding">
              <Button variant={"default"}>Onboarding</Button>
            </Link>
            <Link href="/connect-wallet">
              <Button variant={"outline"}>Connect Wallet</Button>
            </Link>
            {!isConnected ? (
              <Button onClick={login} variant={"default"}>
                Connect my wallet
              </Button>
            ) : (
              <Button onClick={logout} variant={"default"}>
                Logout
              </Button>
            )}
          </div>
        </div>
      </nav>
      <section className="p-4 pt-8">
        {isConnected ? (
          <div className="space-y-6">
            {!gpxProtectedData && (
              <GPXUploader
                dataProtectorCore={dataProtectorCore}
                onProtectionComplete={setGpxProtectedData}
              />
            )}

            {gpxProtectedData && !grantedAccess && (
              <ProtectedDataDisplay protectedData={gpxProtectedData} />
            )}

            {gpxProtectedData && !grantedAccess && (
              <GrantAccess
                authorizedApp={APP}
                dataProtectorCore={dataProtectorCore}
                protectedDataAddress={gpxProtectedData.address}
                onAccessGranted={setGrantedAccess}
              />
            )}

            {grantedAccess && (
              <Coach
                dataProtectorCore={dataProtectorCore}
                authorizedApp={APP}
                protectedData={grantedAccess?.dataset}
                coachName="Teddy 🥋"
              ></Coach>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">
              Please connect your wallet to start protecting your data
            </p>
            <Button onClick={login} size="lg">
              Connect Wallet
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
