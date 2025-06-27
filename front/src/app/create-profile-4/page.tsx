"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { IExecDataProtectorCore, IExecDataProtector } from "@iexec/dataprotector";
import CreateProfile4 from "@/components/CreateProfile4";

export default function CreateProfile4Page() {
  const { isConnected, connector } = useAccount();
  const [dataProtectorCore, setDataProtectorCore] = useState<IExecDataProtectorCore | null>(null);

  useEffect(() => {
    const initializeDataProtector = async () => {
      if (isConnected && connector) {
        try {
          const provider = (await connector.getProvider()) as import("ethers").Eip1193Provider;
          const dataProtector = new IExecDataProtector(provider);
          setDataProtectorCore(dataProtector.core);
        } catch (error) {
          console.error("Failed to initialize data protector:", error);
        }
      }
    };

    initializeDataProtector();
  }, [isConnected, connector]);

  return <CreateProfile4 dataProtectorCore={dataProtectorCore} />;
}
