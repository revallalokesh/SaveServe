"use client";

import React from "react";
import { motion } from "framer-motion";
import { Folder, HeartHandshakeIcon, SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatabaseWithRestApiProps {
  className?: string;
  circleText?: string;
  badgeTexts?: {
    first: string;
    second: string;
    third: string;
    fourth: string;
  };
  buttonTexts?: {
    first: string;
    second: string;
  };
  title?: string;
  lightColor?: string;
}

const DatabaseWithRestApi = ({
  className,
  circleText,
  badgeTexts,
  buttonTexts,
  title,
  lightColor,
}: DatabaseWithRestApiProps) => {
  return (
    <div
      className={cn(
        "relative flex h-[400px] w-full max-w-[600px] flex-col items-center",
        className
      )}
    >
      {/* SVG Paths  */}
      <svg
        className="h-full w-full text-muted"
        width="100%"
        height="100%"
        viewBox="0 0 220 110"
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          stroke="currentColor"
          fill="none"
          strokeWidth="0.4"
          strokeDasharray="100 100"
          pathLength="100"
        >
          <path d="M 31 10 v 15 q 0 5 5 5 h 59 q 5 0 5 5 v 10" />
          <path d="M 77 10 v 10 q 0 5 5 5 h 13 q 5 0 5 5 v 10" />
          <path d="M 124 10 v 10 q 0 5 -5 5 h -14 q -5 0 -5 5 v 10" />
          <path d="M 170 10 v 15 q 0 5 -5 5 h -60 q -5 0 -5 5 v 10" />
          {/* Animation For Path Starting */}
          <animate
            attributeName="stroke-dashoffset"
            from="100"
            to="0"
            dur="1s"
            fill="freeze"
            calcMode="spline"
            keySplines="0.25,0.1,0.5,1"
            keyTimes="0; 1"
          />
        </g>
        {/* Blue Lights */}
        <g mask="url(#db-mask-1)">
          <circle
            className="database db-light-1"
            cx="0"
            cy="0"
            r="12"
            fill={`url(#db-${lightColor ? 'custom' : 'blue'}-grad)`}
          />
        </g>
        <g mask="url(#db-mask-2)">
          <circle
            className="database db-light-2"
            cx="0"
            cy="0"
            r="12"
            fill={`url(#db-${lightColor ? 'custom' : 'blue'}-grad)`}
          />
        </g>
        <g mask="url(#db-mask-3)">
          <circle
            className="database db-light-3"
            cx="0"
            cy="0"
            r="12"
            fill={`url(#db-${lightColor ? 'custom' : 'blue'}-grad)`}
          />
        </g>
        <g mask="url(#db-mask-4)">
          <circle
            className="database db-light-4"
            cx="0"
            cy="0"
            r="12"
            fill={`url(#db-${lightColor ? 'custom' : 'blue'}-grad)`}
          />
        </g>
        {/* Buttons */}
        <g stroke="currentColor" fill="none" strokeWidth="0.4">
          {/* First Button - QR */}
          <g>
            <rect
              fill="#18181B"
              x="10"
              y="5"
              width="47"
              height="12"
              rx="6"
              stroke="#fff"
              strokeWidth="0.5"
            ></rect>
            <QRIcon x="15" y="8.5"></QRIcon>
            <text
              x="25"
              y="11"
              fill="#ffffff"
              stroke="none"
              fontSize="4.2"
              fontWeight="700"
              textAnchor="start"
              dominantBaseline="middle"
              letterSpacing="0.05"
              filter="url(#glow)"
            >
              {badgeTexts?.first || "GET"}
            </text>
          </g>
          {/* Second Button - Food Waste */}
          <g>
            <rect
              fill="#18181B"
              x="62"
              y="5"
              width="47"
              height="12"
              rx="6"
              stroke="#fff"
              strokeWidth="0.5"
            ></rect>
            <RecycleIcon x="67" y="8.5"></RecycleIcon>
            <text
              x="77"
              y="11"
              fill="#ffffff"
              stroke="none"
              fontSize="4.2"
              fontWeight="700"
              textAnchor="start"
              dominantBaseline="middle"
              letterSpacing="0.05"
              filter="url(#glow)"
            >
              {badgeTexts?.second || "POST"}
            </text>
          </g>
          {/* Third Button - Ratings */}
          <g>
            <rect
              fill="#18181B"
              x="114"
              y="5"
              width="43"
              height="12"
              rx="6"
              stroke="#fff"
              strokeWidth="0.5"
            ></rect>
            <StarIcon x="119" y="8.5"></StarIcon>
            <text
              x="129"
              y="11"
              fill="#ffffff"
              stroke="none"
              fontSize="4.2"
              fontWeight="700"
              textAnchor="start"
              dominantBaseline="middle"
              letterSpacing="0.05"
              filter="url(#glow)"
            >
              {badgeTexts?.third || "PUT"}
            </text>
          </g>
          {/* Fourth Button - Campus */}
          <g>
            <rect
              fill="#18181B"
              x="162"
              y="5"
              width="47"
              height="12"
              rx="6"
              stroke="#fff"
              strokeWidth="0.5"
            ></rect>
            <BuildingIcon x="167" y="8.5"></BuildingIcon>
            <text
              x="177"
              y="11"
              fill="#ffffff"
              stroke="none"
              fontSize="4.2"
              fontWeight="700"
              textAnchor="start"
              dominantBaseline="middle"
              letterSpacing="0.05"
              filter="url(#glow)"
            >
              {badgeTexts?.fourth || "DELETE"}
            </text>
          </g>
        </g>
        <defs>
          {/* Text glow filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          {/* 1 -  user list */}
          <mask id="db-mask-1">
            <path
              d="M 31 10 v 15 q 0 5 5 5 h 59 q 5 0 5 5 v 10"
              strokeWidth="0.5"
              stroke="white"
            />
          </mask>
          {/* 2 - task list */}
          <mask id="db-mask-2">
            <path
              d="M 77 10 v 10 q 0 5 5 5 h 13 q 5 0 5 5 v 10"
              strokeWidth="0.5"
              stroke="white"
            />
          </mask>
          {/* 3 - backlogs */}
          <mask id="db-mask-3">
            <path
              d="M 124 10 v 10 q 0 5 -5 5 h -14 q -5 0 -5 5 v 10"
              strokeWidth="0.5"
              stroke="white"
            />
          </mask>
          {/* 4 - misc */}
          <mask id="db-mask-4">
            <path
              d="M 170 10 v 15 q 0 5 -5 5 h -60 q -5 0 -5 5 v 10"
              strokeWidth="0.5"
              stroke="white"
            />
          </mask>
          {/* Blue Grad */}
          <radialGradient id="db-blue-grad" fx="1">
            <stop offset="0%" stopColor="#00A6F5" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          {/* Custom color Grad */}
          <radialGradient id="db-custom-grad" fx="1">
            <stop offset="0%" stopColor={lightColor || "#00A6F5"} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>
      {/* Main Box */}
      <div className="absolute bottom-10 flex w-full flex-col items-center">
        {/* bottom shadow */}
        <div className="absolute -bottom-4 h-[100px] w-[62%] rounded-lg bg-accent/30" />
        {/* box title */}
        <div className="absolute -top-3 z-20 flex items-center justify-center rounded-lg border border-[#333] bg-[#101112] px-3 py-1.5 text-center">
          <SparklesIcon className="size-3 mr-1 flex-shrink-0 text-white" />
          <span className="ml-1 text-[10px] whitespace-normal max-w-[280px] text-white font-medium">
            {title ? title : "Data exchange using a customized REST API"}
          </span>
        </div>
        {/* box outter circle */}
        <div className="absolute -bottom-8 z-30 grid h-[60px] w-[60px] place-items-center rounded-full border-t border-[#333] bg-[#141516] font-semibold text-xs">
          {circleText ? circleText : "SVG"}
        </div>
        {/* box content */}
        <div className="relative z-10 flex h-[150px] w-full items-center justify-center overflow-hidden rounded-lg border border-[#333] bg-background shadow-md">
          {/* Badges */}
          <div className="absolute bottom-8 left-10 z-10 h-7 rounded-full bg-[#101112] px-3 text-xs border border-[#333] flex items-center gap-2 max-w-[120px] overflow-hidden">
            <HeartHandshakeIcon className="size-4 flex-shrink-0" />
            <span className="truncate">{buttonTexts?.first || "LegionDev"}</span>
          </div>
          <div className="absolute right-10 z-10 hidden h-7 rounded-full bg-[#101112] px-3 text-xs sm:flex border border-[#333] items-center gap-2 max-w-[120px] overflow-hidden">
            <Folder className="size-4 flex-shrink-0" />
            <span className="truncate">{buttonTexts?.second || "v2_updates"}</span>
          </div>
          {/* Circles */}
          <motion.div
            className="absolute -bottom-14 h-[100px] w-[100px] rounded-full border-t border-[#333] bg-accent/5"
            animate={{
              scale: [0.98, 1.02, 0.98, 1, 1, 1, 1, 1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 h-[145px] w-[145px] rounded-full border-t border-[#333] bg-accent/5"
            animate={{
              scale: [1, 1, 1, 0.98, 1.02, 0.98, 1, 1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-[100px] h-[190px] w-[190px] rounded-full border-t border-[#333] bg-accent/5"
            animate={{
              scale: [1, 1, 1, 1, 1, 0.98, 1.02, 0.98, 1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-[120px] h-[235px] w-[235px] rounded-full border-t border-[#333] bg-accent/5"
            animate={{
              scale: [1, 1, 1, 1, 1, 1, 0.98, 1.02, 0.98, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>
    </div>
  );
};

export default DatabaseWithRestApi;

const QRIcon = ({ x = "0", y = "0" }: { x: string; y: string }) => {
  return (
    <svg
      x={x}
      y={y}
      xmlns="http://www.w3.org/2000/svg"
      width="5"
      height="5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
};

const RecycleIcon = ({ x = "0", y = "0" }: { x: string; y: string }) => {
  return (
    <svg
      x={x}
      y={y}
      xmlns="http://www.w3.org/2000/svg"
      width="5"
      height="5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
      <path d="m14 16-3 3 3 3" />
      <path d="M8.293 13.596 4.875 9.5l3.418-4.096" />
      <path d="m7.813 9.5 5.032-6.036a1.83 1.83 0 0 1 1.55-.794 1.784 1.784 0 0 1 1.508.86l3.206 5.54" />
      <path d="m18.187 9.5-5.032 6.036a1.83 1.83 0 0 1-1.55.794 1.784 1.784 0 0 1-1.508-.86l-.87-1.506" />
    </svg>
  );
};

const StarIcon = ({ x = "0", y = "0" }: { x: string; y: string }) => {
  return (
    <svg
      x={x}
      y={y}
      xmlns="http://www.w3.org/2000/svg"
      width="5"
      height="5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};

const BuildingIcon = ({ x = "0", y = "0" }: { x: string; y: string }) => {
  return (
    <svg
      x={x}
      y={y}
      xmlns="http://www.w3.org/2000/svg"
      width="5"
      height="5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
};


