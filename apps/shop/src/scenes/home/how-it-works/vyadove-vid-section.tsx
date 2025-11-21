"use client";

import React, { useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa6";
import { PiConfettiBold } from "react-icons/pi";

import { Button } from "@ui/shadcn/button";

import InvertedCornerMask from "@/components/inverted-corner-mask";

import { cn } from "@/lib/utils";

const VyadoveVidSection = () => {
  const [paused, setPaused] = useState(false);
  const vidRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (vidRef.current) {
      if (paused) {
        vidRef.current.pause();
      } else {
        vidRef.current.play();
      }
    }
  }, [paused]);

  return (
    <InvertedCornerMask
      className={cn(
        "mt-10",
        // "animate-gradient-xy flex w-full bg-linear-95 ",
        // "bg-linear-45 from-[rgba(243,224,214,1)] from-20%  to-green-900/50 bg-[length:140%_100%]  h-full",
      )}
      cornerContent={
        <div className="p-2 sm:p-3">
          <Button
            className="size-12"
            onClick={() => setPaused(!paused)}
            size="icon-lg"
          >
            {paused ? (
              <FaPause className="size-6 text-xl sm:text-2xl" />
            ) : (
              <FaPlay className="size-6 text-xl sm:text-2xl" />
            )}
          </Button>
        </div>
      }
      cornersRadius={25}
      invertedCorners={{
        tr: { inverted: true, corners: [25, 25, 25] },
      }}
    >
      <div
        className=""
        style={{
          filter: "brightness(0.7)",
          opacity: 1,
        }}
      >
        <video
          className="block h-full max-h-[70vh] w-full rounded-none bg-transparent object-cover object-center"
          loop
          playsInline
          preload="auto"
          src="https://framerusercontent.com/assets/rfC1p1gUmOqGA6GUrdSJt8IjRA4.mp4"
          ref={vidRef}
          // controls
          autoPlay
        ></video>
      </div>
    </InvertedCornerMask>
  );
};

export default VyadoveVidSection;
