"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Coach data - this would ideally come from context or props
const coaches = {
  teddy: {
    id: "teddy",
    name: "Coach Teddy",
    image: "/teddy.png",
    description: "Calme, humble, protecteur.",
  },
  zizou: {
    id: "zizou",
    name: "Coach Zizou",
    image: "/zizou.png",
    description:
      "Humble, réfléchi, calme, il va te motiver à atteindre tes objectifs.",
  },
  serena: {
    id: "serena",
    name: "Coach Serena",
    image: "/serena.png",
    description:
      "Humble, réfléchi, calme, il va te motiver à atteindre tes objectifs.",
  },
};

// Questions data
const questions = [
  {
    id: "objective",
    text: "Now let's create your personalized training plan! What are you looking for with MyPrivateCoach?",
    type: "select",
    icon: "🎯",
    options: [
      "Prepare for a race",
      "Start running",
      "Weight loss & fitness",
      "Improve my performance",
    ],
  },
  {
    id: "prepareRace",
    text: "Great! What is your race goal?",
    type: "select",
    icon: "🏁",
    options: ["5K", "10K", "Half-marathon", "Marathon", "Ultra", "Other"],
  },
  {
    id: "date",
    text: "Perfect! When is your race? 📅",
    type: "date",
    icon: "📅",
  },
  {
    id: "frequency",
    text: "How many times a week can you train? 💪",
    type: "select",
    icon: "📊",
    options: ["2 times/week", "3 times/week", "4 times/week", "5+ times/week"],
  },
  {
    id: "intensity",
    text: "What finish time are you aiming for? ⚡",
    type: "select",
    icon: "🔥",
    options: ["1h", "55 minutes", "50 minutes", "40 minutes", "No goal"],
  },
  {
    id: "complete",
    text: "Awesome! I have everything I need to create your personalized training plan! 🎉",
    type: "complete",
    icon: "✅",
  },
];

interface ChatMessage {
  id: string;
  text: string;
  isCoach: boolean;
  timestamp: Date;
  questionId?: string;
}

export default function Dashboard() {
  // For now, default to teddy - later this should come from context/state
  const [selectedCoach] = useState(coaches.teddy);
  const [isOnline, setIsOnline] = useState(false);
  const [showInitialMessage, setShowInitialMessage] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isWaitingForAnswer, setIsWaitingForAnswer] = useState(false);
  const [dateInput, setDateInput] = useState("");

  // Simulate going online after 3 seconds and show initial message
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOnline(true);
      setShowInitialMessage(true);

      // Add initial welcome message
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        text: "Hello, je vais générer un programme personnalisé de courses, j'ai besoin que tu choisisses une de ces réponses",
        isCoach: true,
        timestamp: new Date(),
      };

      setMessages([welcomeMessage]);

      // Start asking questions after a short delay
      setTimeout(() => {
        askNextQuestion();
      }, 1500);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const askNextQuestion = (questionIndex?: number) => {
    const indexToUse =
      questionIndex !== undefined ? questionIndex : currentQuestionIndex;
    if (indexToUse < questions.length) {
      const question = questions[indexToUse];
      const questionMessage: ChatMessage = {
        id: `question-${question.id}`,
        text: question.text,
        isCoach: true,
        timestamp: new Date(),
        questionId: question.id,
      };

      setMessages((prev) => [...prev, questionMessage]);
      setIsWaitingForAnswer(true);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (!isWaitingForAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];

    // Add user response to chat
    const userMessage: ChatMessage = {
      id: `answer-${currentQuestion.id}`,
      text: option,
      isCoach: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsWaitingForAnswer(false);

    // Move to next question
    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setTimeout(() => {
        askNextQuestion(nextIndex);
      }, 1000);
    }, 500);
  };

  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateInput.trim() || !isWaitingForAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];

    // Add user response to chat
    const userMessage: ChatMessage = {
      id: `answer-${currentQuestion.id}`,
      text: dateInput,
      isCoach: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsWaitingForAnswer(false);
    setDateInput("");

    // Move to next question
    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setTimeout(() => {
        askNextQuestion(nextIndex);
      }, 1000);
    }, 500);
  };

  const getCurrentQuestion = () => {
    return currentQuestionIndex < questions.length
      ? questions[currentQuestionIndex]
      : null;
  };

  const currentQuestion = getCurrentQuestion();

  return (
    <div
      className="min-h-screen w-full max-w-[375px] mx-auto flex flex-col"
      style={{
        background: "linear-gradient(180deg, #0F0641 0.01%, #260FA7 122.61%)",
      }}
    >
      {/* Header Section */}
      <div className="flex flex-col items-center text-center px-6 py-8">
        {/* Logo + Title Row */}
        <div className="flex items-center mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
            style={{ backgroundColor: "#E9ED0E" }}
          >
            <Image
              src="/logo vert .png"
              alt="Barbarian Trainer Logo"
              width={24}
              height={24}
              className="w-6 h-6 object-contain"
            />
          </div>
          <h1
            className="text-lg font-bold"
            style={{ color: "#E9ED0E", fontFamily: "Inter, sans-serif" }}
          >
            Create your Programm
          </h1>
        </div>

        {/* Main Title */}
        <h2
          className="text-3xl font-bold mb-8"
          style={{ color: "#FFFFFF", fontFamily: "Inter, sans-serif" }}
        >
          Chat with {selectedCoach.name.replace("Coach ", "")}
        </h2>
      </div>

      {/* Chat Card */}
      <div
        className="mx-6 rounded-3xl p-6 flex-1"
        style={{ backgroundColor: "#302F73" }}
      >
        {/* Coach Info Row */}
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
            <Image
              src={selectedCoach.image}
              alt={selectedCoach.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">
              {selectedCoach.name}
            </h3>
            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  isOnline ? "bg-[#E9ED0E]" : "bg-gray-400"
                }`}
              ></div>
              <span
                className="text-sm"
                style={{ color: isOnline ? "#E9ED0E" : "#9CA3AF" }}
              >
                {isOnline ? "En ligne" : "Hors ligne"}
              </span>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {!showInitialMessage && (
          <div className="text-center text-gray-300 py-8">
            <p>Connexion en cours...</p>
          </div>
        )}

        {/* Chat Messages */}
        {showInitialMessage && (
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isCoach ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.isCoach ? "bg-white text-[#352D47]" : "bg-[#C6CAFF]"
                  }`}
                >
                  <p
                    className={`text-base leading-relaxed ${
                      message.isCoach ? "" : "text-right"
                    }`}
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "16px",
                      fontWeight: 400,
                      lineHeight: "150%",
                      color: message.isCoach ? "#352D47" : "#1621AF",
                    }}
                  >
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Question Options */}
        {isWaitingForAnswer &&
          currentQuestion &&
          currentQuestion.type === "select" && (
            <div className="space-y-3">
              {currentQuestion.options?.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  className="w-full py-4 px-4 rounded-2xl text-base font-medium transition-all duration-200 hover:shadow-md"
                  style={{
                    backgroundColor: "#E9ED0E",
                    color: "#201F4D",
                    fontFamily: "Inter, sans-serif",
                    minHeight: "48px",
                  }}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

        {/* Date Input */}
        {isWaitingForAnswer &&
          currentQuestion &&
          currentQuestion.type === "date" && (
            <form onSubmit={handleDateSubmit} className="space-y-3">
              <Input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full rounded-2xl border-2 border-[#E9ED0E] focus:border-[#E9ED0E] focus:ring-[#E9ED0E] text-[#201F4D]"
                style={{
                  backgroundColor: "white",
                  minHeight: "48px",
                  fontFamily: "Inter, sans-serif",
                }}
              />
              <Button
                type="submit"
                disabled={!dateInput}
                className="w-full py-4 px-4 rounded-2xl text-base font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50"
                style={{
                  backgroundColor: "#E9ED0E",
                  color: "#201F4D",
                  fontFamily: "Inter, sans-serif",
                  minHeight: "48px",
                }}
              >
                Confirm Date
              </Button>
            </form>
          )}

        {/* Completion Message */}
        {currentQuestion &&
          currentQuestion.type === "complete" &&
          !isWaitingForAnswer && (
            <div className="text-center py-4">
              <p
                className="text-[#E9ED0E] text-lg font-medium"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Training plan is being generated... 🏃‍♂️
              </p>
            </div>
          )}
      </div>

      {/* Bottom padding */}
      <div className="h-8"></div>
    </div>
  );
}
