"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { generateKeyPairBase64 } from "@/https-tunnel/crypto";
import { waitForTunnel } from "@/https-tunnel/waitForTunnel";
import { IExecDataProtectorCore } from "@iexec/dataprotector";
import { useState, useEffect } from "react";

interface CoachProps {
  authorizedApp: string;
  dataProtectorCore: IExecDataProtectorCore | null;
  protectedData: string;
  coachName: string;
}

export default function Coach({
  dataProtectorCore,
  authorizedApp,
  protectedData,
  coachName,
}: CoachProps) {
  const [agentUrl, setAgentUrl] = useState("");
  console.log("🚀 ~ Coach ~ agentUrl:", agentUrl);

  const [messagesHistory, setMessageHistory] = useState<
    { role: string; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "J'ai bien reçu et analysé tes données d'entraînement. Je les garde en mémoire pour personnaliser mes conseils. Tu peux maintenant me poser tes questions sur ton plan d'entraînement.",
    },
  ]);

  const [prompt, setPrompt] = useState("");

  const [isReady, setIsReady] = useState(true);

  const [isStarting, setIsStarting] = useState(false);

  const [publicPemBase64, setPublicPemBase64] = useState<string>();

  useEffect(() => {
    const key = generateKeyPairBase64();
    console.log("🚀 ~ useEffect ~ publicPemBase64:", key.publicPemBase64);
    setPublicPemBase64(key.publicPemBase64);
    waitForTunnel({
      gossipAddress: "0xCA302f663d7E4F9D4eFD6B57A0586c9c39ED0033",
      privatePemBase64: key.privatePemBase64,
    }).then(setAgentUrl);
  }, []);

  if (!dataProtectorCore) return null;

  const startCoachingSession = async () => {
    setIsStarting(true);
    await dataProtectorCore
      .processProtectedData({
        app: authorizedApp,
        protectedData,
        workerpool: "tdx-labs.pools.iexec.eth",
        args: publicPemBase64,
      })
      .catch()
      .finally(() => {
        setIsStarting(false);
      });
  };

  if (!agentUrl) {
    return (
      <div className="space-y-6 p-6 bg-white rounded-lg border border-gray-200 text-center">
        {!isStarting && (
          <>
            <div>Nous sommes prets!</div>
            <Button
              disabled={isStarting || !publicPemBase64}
              onClick={() => {
                startCoachingSession();
              }}
            >
              Commencer votre session de coaching
            </Button>
          </>
        )}
        {isStarting && (
          <div>
            <p>🏃 Votre coach arrive bientôt 🏃</p>
            <p>Merci de patienter</p>
          </div>
        )}
      </div>
    );
  }

  const postMessage = async () => {
    setIsReady(false);
    const userMessage = {
      role: "user",
      content: prompt,
    };
    const requestBody = {
      model: "thewhitewizard/teddy:3b",
      messages: [...messagesHistory, userMessage], // TODO remove messagesHistory when the API is stateful
      stream: false,
      options: {
        temperature: 0.7,
      },
    };
    try {
      const { message } = await fetch(`${agentUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }).then((res) => res.json());
      if (message) {
        setMessageHistory([...messagesHistory, userMessage, message]);
        setPrompt("");
      }
    } catch {
      // noop
    } finally {
      setIsReady(true);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border border-gray-200">
      {agentUrl && (
        <div className="space-y-6 p-6">
          <p>Vous êtes en relation avec {coachName}</p>
          {messagesHistory.map(({ role, content }, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>
                  {role === "assistant" ? coachName : "Vous"}
                </CardTitle>
                <CardDescription>
                  {content.split("\n").map((line) => (
                    <>
                      {line}
                      <br />
                    </>
                  ))}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
      <div className="space-y-6 p-6 text-right">
        <Input
          type="text"
          disabled={!isReady || !agentUrl}
          value={prompt}
          onChange={(e) => {
            e.preventDefault();
            setPrompt(e.target.value);
          }}
          placeholder="Ecrivez votre message"
        ></Input>
        <Button
          className="a"
          disabled={!isReady || !agentUrl}
          onClick={(e) => {
            e.preventDefault();
            postMessage();
          }}
        >
          Envoyer
        </Button>
      </div>
    </div>
  );
}
