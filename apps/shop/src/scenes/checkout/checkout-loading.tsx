"use client";

import { useEffect, useState } from "react";

import CartIcon from "@/components/icons/cart-icon";

const loadingSteps = [
  "Preparing your checkout",
  "Securing your details",
  "Almost ready",
];

const CheckoutLoading = () => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % loadingSteps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mb-36 flex min-h-[60vh] flex-1 items-center justify-center overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="from-primary/5 via-transparent to-accent/5 absolute inset-0 bg-gradient-to-br" />
        <div
          className="bg-primary/10 absolute -top-32 -right-32 size-96 rounded-full blur-3xl"
          style={{ animation: "pulse 4s ease-in-out infinite" }}
        />
        <div
          className="bg-accent/10 absolute -bottom-32 -left-32 size-96 rounded-full blur-3xl"
          style={{ animation: "pulse 4s ease-in-out infinite 2s" }}
        />
      </div>

      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center px-4">
        {/* Icon container with animated rings */}
        <div className="relative mb-8">
          {/* Outer pulsing ring */}
          <div
            className="border-primary/20 absolute inset-0 rounded-full border-2"
            style={{
              animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
              width: "120px",
              height: "120px",
              left: "-10px",
              top: "-10px",
            }}
          />

          {/* Middle ring */}
          <div
            className="bg-primary/5 absolute rounded-full"
            style={{
              animation: "pulse 2s ease-in-out infinite",
              width: "110px",
              height: "110px",
              left: "-5px",
              top: "-5px",
            }}
          />

          {/* Inner circle with icon */}
          <div className="from-primary/10 to-primary/5 relative flex size-[100px] items-center justify-center rounded-full bg-gradient-to-br shadow-lg">
            <CartIcon
              className="fill-primary size-12"
              style={{ animation: "bounce-subtle 2s ease-in-out infinite" }}
            />
          </div>

          {/* Shimmer effect */}
          <div
            className="absolute inset-0 overflow-hidden rounded-full"
            style={{ width: "100px", height: "100px" }}
          >
            <div
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{ animation: "shimmer 2s infinite" }}
            />
          </div>
        </div>

        {/* Loading text with fade transition */}
        <div className="relative h-8 w-64 text-center">
          {loadingSteps.map((step, index) => (
            <p
              className="text-muted-foreground absolute inset-0 flex items-center justify-center text-lg font-medium tracking-wide transition-all duration-500"
              key={step}
              style={{
                opacity: stepIndex === index ? 1 : 0,
                transform:
                  stepIndex === index ? "translateY(0)" : "translateY(8px)",
              }}
            >
              {step}
            </p>
          ))}
        </div>

        {/* Animated dots */}
        <div className="mt-4 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              className="bg-primary/60 size-2 rounded-full"
              key={i}
              style={{
                animation: `bounce-dot 1.4s ease-in-out infinite`,
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes bounce-dot {
          0%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutLoading;
