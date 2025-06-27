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

export default function Home() {
  const APP = "0xa4eff0Fe2890ac52D64c4156f7F9576E59201200"; // latest app version

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
      <nav className="bg-neutral-100">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-2">
          <div className="ml-3 font-mono leading-5 font-bold">
            Barbarian Trainer - GPX Protection
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
            <GPXUploader
              dataProtectorCore={dataProtectorCore}
              onProtectionComplete={setGpxProtectedData}
            />

            {gpxProtectedData && (
              <ProtectedDataDisplay protectedData={gpxProtectedData} />
            )}

            {gpxProtectedData && (
              <GrantAccess
                authorizedApp={APP}
                dataProtectorCore={dataProtectorCore}
                protectedDataAddress={gpxProtectedData.address}
                onAccessGranted={setGrantedAccess}
              />
            )}

            {grantedAccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-900 mb-4">
                  🎉 Ready to Process Your Data!
                </h3>
                <p className="text-green-800 mb-4">
                  Your protected data is now accessible by your iApp. You can
                  run your iApp to process the protected GPX data.
                </p>
                <div className="bg-green-100 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-900 mb-2">
                    Next Steps:
                  </p>
                  <ol className="list-decimal list-inside text-sm text-green-800 space-y-1">
                    <li>Deploy your iApp to the iExec platform</li>
                    <li>
                      Use the command below to run your iApp with the protected
                      data
                    </li>
                    <li>
                      Process the GPX data securely in a trusted environment
                    </li>
                  </ol>
                </div>
              </div>
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
