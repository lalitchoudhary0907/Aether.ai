"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  ImageIcon,
  Video,
  CodeXml,
  LayoutGrid,
  FolderOpen,
  SlidersHorizontal,
  ChevronDown,
  Brain,
  Mic,
  ArrowUp,
  ArrowUpRight,
  Menu,
  X,
  Sparkles,
  Zap,
  Check,
  CheckCircle2,
} from "lucide-react";

// --- Glowing 3D Orb SVG Graphics ---

function GlowingOrb({ size = 80 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      {/* Ambient background bloom */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/40 via-emerald-400/30 to-sky-400/20 blur-xl animate-orb-float"
        style={{ transform: "scale(1.2)" }}
      />
      {/* Floor glow / drop reflection */}
      <div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-2 rounded-full bg-cyan-400/30 blur-md"
      />

      {/* Main 3D Sphere SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="relative z-10 animate-orb-float drop-shadow-[0_10px_20px_rgba(6,182,212,0.4)]"
      >
        <defs>
          {/* Main sphere radial gradient: deep ocean to electric teal & emerald */}
          <radialGradient
            id="orb-base"
            cx="40%"
            cy="35%"
            r="65%"
            fx="35%"
            fy="30%"
          >
            <stop offset="0%" stopColor="#99f6e4" />
            <stop offset="18%" stopColor="#2dd4bf" />
            <stop offset="42%" stopColor="#06b6d4" />
            <stop offset="68%" stopColor="#0284c7" />
            <stop offset="88%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* Emerald swirl overlay */}
          <radialGradient
            id="orb-emerald-accent"
            cx="60%"
            cy="25%"
            r="50%"
            fx="55%"
            fy="20%"
          >
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#10b981" stopOpacity="0.5" />
            <stop offset="85%" stopColor="#059669" stopOpacity="0" />
          </radialGradient>

          {/* Top specular reflection */}
          <linearGradient id="orb-specular" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Inner ring refraction */}
          <radialGradient
            id="orb-inner-glow"
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="80%" stopColor="#06b6d4" stopOpacity="0" />
            <stop offset="96%" stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.8" />
          </radialGradient>
        </defs>

        {/* Base Sphere */}
        <circle cx="50" cy="50" r="46" fill="url(#orb-base)" />

        {/* Dynamic Swirl Layer */}
        <ellipse
          cx="58"
          cy="32"
          rx="32"
          ry="24"
          transform="rotate(-15 58 32)"
          fill="url(#orb-emerald-accent)"
        />

        {/* Secondary Cyan Glow Pool */}
        <circle
          cx="42"
          cy="58"
          r="26"
          fill="#00f2fe"
          opacity="0.25"
          filter="blur(4px)"
        />

        {/* Curved Glass Specular Highlight (Top Rim) */}
        <ellipse
          cx="44"
          cy="20"
          rx="22"
          ry="9"
          transform="rotate(-10 44 20)"
          fill="url(#orb-specular)"
        />

        {/* Micro Pinpoint Glint */}
        <circle cx="36" cy="18" r="3" fill="#ffffff" opacity="0.9" />

        {/* Bottom Crescent Refraction */}
        <path
          d="M 24 68 A 46 46 0 0 0 76 68 A 43 43 0 0 1 24 68"
          fill="#38bdf8"
          opacity="0.45"
        />

        {/* Outer Edge Rim Light */}
        <circle
          cx="50"
          cy="50"
          r="45.5"
          fill="none"
          stroke="url(#orb-inner-glow)"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
}

function MiniOrbLogo() {
  return (
    <div className="relative w-7 h-7 flex-shrink-0 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-sm" />
      <svg
        width="26"
        height="26"
        viewBox="0 0 100 100"
        className="relative z-10"
      >
        <circle cx="50" cy="50" r="46" fill="url(#orb-base)" />
        <ellipse
          cx="56"
          cy="34"
          rx="30"
          ry="20"
          fill="#34d399"
          opacity="0.75"
        />
        <ellipse
          cx="45"
          cy="22"
          rx="20"
          ry="8"
          fill="#ffffff"
          opacity="0.8"
        />
      </svg>
    </div>
  );
}

// --- Types ---
interface ChatItem {
  id: string;
  title: string;
  date?: string;
}

const DEFAULT_CHATS: ChatItem[] = [
  { id: "chat-1", title: "Image Editing Request" },
  { id: "chat-2", title: "Replace characters request" },
  { id: "chat-3", title: "Shorten Notification Message" },
  { id: "chat-4", title: "Image Concept Creation" },
  { id: "chat-5", title: "Design Enhancement Guide" },
];

const FEATURES = [
  { label: "Images", icon: ImageIcon, soon: true },
  { label: "Videos", icon: Video, soon: true },
  { label: "Codex", icon: CodeXml, soon: true },
  { label: "Apps", icon: LayoutGrid, soon: true },
  { label: "Projects", icon: FolderOpen, soon: true },
];

const MODELS = [
  { id: "aether-v4.2", name: "Syntrix v4.2", tag: "Recommended", desc: "Default multimodal powerhouse" },
  { id: "aether-2.5-pro", name: "Aether 2.5 Pro", tag: "Deep Reasoning", desc: "Complex coding & analytical tasks" },
  { id: "aether-flash", name: "Aether Flash", tag: "Ultra Fast", desc: "Instant low-latency responses" },
];

const QUICK_CARDS = [
  {
    id: "card-image",
    title: "Image Generator",
    desc: "Turn ideas into stunning visuals in seconds.",
    icon: ImageIcon,
    prompt:
      "Generate a high-detail cinematic concept art of an obsidian floating monolith in a bioluminescent rainforest at twilight.",
  },
  {
    id: "card-video",
    title: "Video Generator",
    desc: "Create cinematic videos from simple prompts.",
    icon: Video,
    prompt:
      "Create a smooth 4K 60fps drone sequence flying over snow-covered volcanic peaks under vibrant cyan and emerald aurora borealis.",
  },
  {
    id: "card-dev",
    title: "Dev Assistant",
    desc: "Accelerate development with intelligent assistance.",
    icon: CodeXml,
    prompt:
      "Build a modern Next.js 16 full-stack dashboard with Supabase auth, responsive slide-over drawer, and dark obsidian UI styling.",
  },
];

export default function AetherShell() {
  // Mobile drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Chat history state
  const [chats, setChats] = useState<ChatItem[]>(DEFAULT_CHATS);
  const [activeChatId, setActiveChatId] = useState<string>("chat-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Composer & prompt state
  const [prompt, setPrompt] = useState("");
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  // Model selection state
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  // Toggle pills state
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [deepThinkActive, setDeepThinkActive] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const chatCountRef = useRef(DEFAULT_CHATS.length);

  // Auto-resize textarea based on input
  useEffect(() => {
    if (promptInputRef.current) {
      promptInputRef.current.style.height = "auto";
      promptInputRef.current.style.height = `${Math.min(
        promptInputRef.current.scrollHeight,
        180
      )}px`;
    }
  }, [prompt]);

  // Handle new chat creation
  const handleNewChat = () => {
    chatCountRef.current += 1;
    const newId = `chat-session-${chatCountRef.current}`;
    const newChat: ChatItem = {
      id: newId,
      title: "New Conversation",
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newId);
    setPrompt("");
    if (mobileDrawerOpen) setMobileDrawerOpen(false);
    promptInputRef.current?.focus();
    showNotice("New chat started");
  };

  // Quick card pre-fill and focus
  const handleCardClick = (cardPrompt: string) => {
    setPrompt(cardPrompt);
    promptInputRef.current?.focus();
    showNotice("Prompt prefilled");
  };

  // Prompt submit (local interaction without fake AI responses)
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) return;

    // Update the active chat title if it's currently generic
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChatId) {
          const newTitle =
            chat.title === "New Conversation"
              ? trimmed.slice(0, 32) + (trimmed.length > 32 ? "..." : "")
              : chat.title;
          return { ...chat, title: newTitle };
        }
        return chat;
      })
    );

    // Clear prompt and give clear interactive feedback
    setPrompt("");
    showNotice(`Prompt dispatched: "${trimmed.slice(0, 36)}..."`);
  };

  const showNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => {
      setStatusNotice((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  // Filtered chats based on search
  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen w-full bg-[#070a0f] text-zinc-100 flex overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 z-0 aether-glow-bg" />

      {/* Mobile Drawer Backdrop */}
      {mobileDrawerOpen && (
        <div
          onClick={() => setMobileDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* LEFT SIDEBAR (Desktop 256px, Mobile slide-over drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0c1118] border-r border-white/[0.08] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Section */}
        <div className="flex flex-col flex-1 min-h-0 px-3.5 pt-4">
          {/* Logo & Header Row */}
          <div className="flex items-center justify-between px-1 mb-5">
            <div className="flex items-center gap-2.5">
              <MiniOrbLogo />
              <span className="text-[17px] font-semibold tracking-tight text-white">
                Aether
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsSearching(!isSearching);
                  if (isSearching) setSearchQuery("");
                }}
                className={`p-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer ${
                  isSearching ? "bg-white/[0.08] text-white" : "hover:bg-white/[0.05]"
                }`}
                title="Search Chats"
                aria-label="Search Chats"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Close button on mobile */}
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white lg:hidden cursor-pointer"
                aria-label="Close Sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Input (conditionally visible or toggleable) */}
          {isSearching && (
            <div className="mb-3 px-1">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-2.5 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter chats..."
                  autoFocus
                  className="w-full bg-[#121822] border border-white/[0.08] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>
          )}

          {/* "New Chat" Button */}
          <button
            type="button"
            onClick={handleNewChat}
            className="group relative w-full h-10 px-3 rounded-xl bg-gradient-to-r from-white/[0.07] to-white/[0.03] hover:from-white/[0.12] hover:to-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] text-zinc-200 hover:text-white flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-all cursor-pointer mb-6"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-white/[0.08] flex items-center justify-center text-zinc-300 group-hover:text-white">
                <Plus className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium tracking-tight">New Chat</span>
            </div>
            {/* Subtle frosted right sheen */}
            <div className="w-6 h-full bg-gradient-to-l from-cyan-500/10 to-transparent rounded-r-xl pointer-events-none" />
          </button>

          {/* Scrollable Nav Section */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-1 -mr-1">
            {/* FEATURES Section */}
            <div>
              <div className="px-2 mb-2 text-[10px] font-semibold tracking-[0.16em] text-zinc-500 uppercase">
                Features
              </div>
              <div className="space-y-0.5">
                {FEATURES.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                        <span className="text-xs font-normal">{item.label}</span>
                      </div>
                      {item.soon && (
                        <span className="text-[9px] font-medium tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-white/[0.05] text-zinc-400 border border-white/[0.06]">
                          Soon
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* YOUR CHATS Section */}
            <div>
              <div className="px-2 mb-2 text-[10px] font-semibold tracking-[0.16em] text-zinc-500 uppercase flex items-center justify-between">
                <span>Your Chats</span>
                <span className="text-[10px] font-normal text-zinc-600">
                  {filteredChats.length}
                </span>
              </div>
              <div className="space-y-0.5">
                {filteredChats.length === 0 ? (
                  <div className="px-2.5 py-3 text-xs text-zinc-500 italic">
                    No matching chats
                  </div>
                ) : (
                  filteredChats.map((chat) => {
                    const isActive = chat.id === activeChatId;
                    return (
                      <button
                        key={chat.id}
                        type="button"
                        onClick={() => {
                          setActiveChatId(chat.id);
                          if (mobileDrawerOpen) setMobileDrawerOpen(false);
                          showNotice(`Switched to "${chat.title}"`);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between group cursor-pointer ${
                          isActive
                            ? "bg-white/[0.07] text-white font-medium shadow-sm border border-white/[0.06]"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                        }`}
                      >
                        <span className="truncate pr-2">{chat.title}</span>
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)] flex-shrink-0" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Upgrade to Pro Card */}
        <div className="p-3.5 pt-2">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-950/30 via-[#121822] to-[#0c1118] border border-white/[0.08] p-3.5 shadow-lg group">
            {/* Top ambient corner glow */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>

              <div className="mt-2.5">
                <h4 className="text-xs font-semibold text-white tracking-tight">
                  Upgrade to Pro
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                  Get more tools, faster AI, and exclusive features
                </p>
              </div>

              <div className="mt-2.5 flex items-baseline gap-1">
                <span className="text-base font-bold text-white tracking-tight">
                  $49
                </span>
                <span className="text-[11px] text-zinc-400 font-normal">
                  /month
                </span>
              </div>

              <button
                type="button"
                onClick={() => showNotice("Pro subscription modal")}
                className="mt-3 w-full py-1.5 px-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <Zap className="w-3 h-3 fill-current" />
                <span>Upgrade Now</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN WORKSPACE CANVAS */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative z-10">
        {/* TOP BAR */}
        <header className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-white/[0.06] flex-shrink-0 z-30">
          {/* Left: Mobile Menu + Model Selector Pill */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] lg:hidden cursor-pointer"
              aria-label="Open Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Model Pill Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                className="h-8 px-3 rounded-full bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.14] text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                <span className="tracking-tight">{selectedModel.name}</span>
                <ChevronDown
                  className={`w-3 h-3 text-zinc-400 transition-transform ${
                    modelDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Model Dropdown Menu */}
              {modelDropdownOpen && (
                <div className="absolute top-10 left-0 w-64 rounded-2xl bg-[#0c1118]/95 backdrop-blur-xl border border-white/[0.12] p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2.5 py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Select AI Engine
                  </div>
                  {MODELS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelectedModel(m);
                        setModelDropdownOpen(false);
                        showNotice(`Switched model to ${m.name}`);
                      }}
                      className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        selectedModel.id === m.id
                          ? "bg-white/[0.08] text-white"
                          : "text-zinc-300 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div>
                        <div className="font-medium flex items-center gap-1.5">
                          <span>{m.name}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {m.tag}
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">
                          {m.desc}
                        </div>
                      </div>
                      {selectedModel.id === m.id && (
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Nav Links + Avatar */}
          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="flex items-center gap-4 sm:gap-6 text-xs font-normal">
              <span className="text-white font-medium tracking-tight cursor-pointer">
                Dashboard
              </span>
              <button
                type="button"
                onClick={() => showNotice("Settings panel")}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Settings
              </button>
              <button
                type="button"
                onClick={() => showNotice("Help & Support modal")}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Help & Support
              </button>
            </nav>

            {/* User Avatar Circle */}
            <div
              onClick={() => showNotice("User Profile")}
              className="w-8 h-8 rounded-full ring-1 ring-white/20 bg-gradient-to-tr from-cyan-600 via-emerald-600 to-indigo-600 flex items-center justify-center text-[11px] font-semibold text-white shadow-md cursor-pointer hover:ring-white/40 transition-all"
              title="User Account"
            >
              LC
            </div>
          </div>
        </header>

        {/* Notification Toast */}
        {statusNotice && (
          <div className="absolute top-18 right-6 z-40 bg-[#121822]/95 border border-cyan-500/30 text-cyan-200 text-xs px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{statusNotice}</span>
          </div>
        )}

        {/* CENTER HERO & PROMPT CANVAS */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 max-w-3xl w-full mx-auto">
          {/* Glowing Center Orb Graphic */}
          <GlowingOrb size={76} />

          {/* WELCOME BACK Label */}
          <div className="mt-5 text-[11px] font-semibold tracking-[0.24em] text-zinc-400 uppercase">
            Welcome Back
          </div>

          {/* Main Title Heading */}
          <h1 className="mt-2 text-2xl sm:text-3xl md:text-[34px] font-normal tracking-tight text-white text-center leading-tight">
            Bring your ideas to life today
          </h1>

          {/* ROUNDED PROMPT CONTAINER */}
          <div className="w-full mt-7 sm:mt-9 rounded-[24px] bg-[#0c1118]/85 backdrop-blur-2xl border border-white/[0.09] shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-3.5 sm:p-4.5 transition-all focus-within:border-white/[0.18] focus-within:shadow-[0_20px_60px_rgba(6,182,212,0.12)]">
            {/* Top Prompt Row: Sparkle + Input */}
            <div className="flex items-start gap-3">
              <div className="pt-0.5 text-cyan-400 flex-shrink-0">
                <Sparkles className="w-4 h-4 fill-cyan-400/20" />
              </div>
              <textarea
                ref={promptInputRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Ask me anything..."
                rows={1}
                className="w-full bg-transparent text-sm sm:text-base text-zinc-100 placeholder-zinc-500 outline-none resize-none min-h-[42px] max-h-[160px] leading-relaxed"
              />
            </div>

            {/* Bottom Controls Row */}
            <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex items-center justify-between gap-2 flex-wrap">
              {/* Left Controls: +, Tools, Deep Think */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Plus (+) Button */}
                <button
                  type="button"
                  onClick={() => showNotice("Add attachment / file")}
                  className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Attach file or context"
                  aria-label="Attach file or context"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>

                {/* Tools Dropdown Pill */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                    className="h-7 px-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-[11px] font-medium text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3 h-3 text-zinc-400" />
                    <span>Tools</span>
                    <ChevronDown className="w-2.5 h-2.5 text-zinc-400" />
                  </button>

                  {toolsDropdownOpen && (
                    <div className="absolute bottom-9 left-0 w-48 rounded-xl bg-[#121822] border border-white/[0.1] p-1.5 shadow-xl z-50 text-xs">
                      <div className="px-2 py-1 text-[10px] text-zinc-500 uppercase font-semibold">
                        Available Tools
                      </div>
                      <div className="p-1.5 text-zinc-300 hover:bg-white/[0.05] rounded-lg cursor-pointer flex items-center gap-2">
                        <Check className="w-3 h-3 text-cyan-400" />
                        <span>Web Browsing</span>
                      </div>
                      <div className="p-1.5 text-zinc-300 hover:bg-white/[0.05] rounded-lg cursor-pointer flex items-center gap-2">
                        <Check className="w-3 h-3 text-cyan-400" />
                        <span>Code Execution</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Deep Think Pill */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !deepThinkActive;
                    setDeepThinkActive(next);
                    showNotice(next ? "Deep Think activated" : "Deep Think disabled");
                  }}
                  className={`h-7 px-2.5 rounded-full border text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    deepThinkActive
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                      : "bg-white/[0.06] hover:bg-white/[0.1] border-white/[0.08] text-zinc-300 hover:text-white"
                  }`}
                >
                  <Brain className="w-3 h-3" />
                  <span>Deep Think</span>
                  <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                </button>
              </div>

              {/* Right Controls: Voice + Circular Send Button */}
              <div className="flex items-center gap-2">
                {/* Voice Button */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !voiceActive;
                    setVoiceActive(next);
                    showNotice(next ? "Voice listening active..." : "Voice deactivated");
                  }}
                  className={`h-7 px-2.5 rounded-full border text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    voiceActive
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                      : "bg-white/[0.06] hover:bg-white/[0.1] border-white/[0.08] text-zinc-300 hover:text-white"
                  }`}
                >
                  <Mic className="w-3 h-3 text-zinc-400" />
                  <span>Voice</span>
                </button>

                {/* Circular Send Button */}
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={!prompt.trim()}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                    prompt.trim()
                      ? "bg-white text-zinc-950 hover:bg-zinc-200 hover:scale-105 active:scale-95"
                      : "bg-white/90 text-zinc-950 hover:bg-white opacity-85"
                  }`}
                  aria-label="Send prompt"
                >
                  <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>

          {/* 3 BOTTOM QUICK ACTION CARDS */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5 mt-5 sm:mt-6">
            {QUICK_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.prompt)}
                  className="group relative rounded-2xl bg-[#121822]/90 hover:bg-[#161f2c] border border-white/[0.07] hover:border-white/[0.16] p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-0.5 select-none"
                >
                  {/* Card Top Row: Icon + Arrow */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-8 h-8 rounded-xl bg-white/[0.05] group-hover:bg-cyan-500/10 border border-white/[0.06] group-hover:border-cyan-500/20 flex items-center justify-center text-zinc-300 group-hover:text-cyan-300 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-200 transition-colors" />
                  </div>

                  {/* Card Bottom: Title + Description */}
                  <div>
                    <h3 className="text-xs sm:text-[13px] font-semibold text-white tracking-tight">
                      {card.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed line-clamp-2">
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
