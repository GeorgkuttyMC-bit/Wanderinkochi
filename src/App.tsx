/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ArrowUpRight,
  Camera,
  Check,
  Copy,
  ExternalLink,
  Instagram,
  MessageCircle,
  Mic,
  Send,
  Sparkles,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
  Eye,
  ArrowUp,
  Play,
} from 'lucide-react';
import {
  AVAILABILITY_OPTIONS,
  EXPERIENCE_LEVELS,
  HOSTING_STYLES,
  INSTAGRAM_FEED_POSTS,
  InstagramFeedPost,
  KOCHI_ZONES,
  OPEN_HOST_ROLE,
  SAMPLE_HOST_APPLICATIONS,
  TARGET_WHATSAPP_DISPLAY,
  TARGET_WHATSAPP_INTL,
  TARGET_WHATSAPP_RAW,
  WANDER_INSTAGRAM_HANDLE,
  WANDER_INSTAGRAM_URL,
} from './data/kochiData';

interface HostApplicationFormData {
  fullName: string;
  whatsappNumber: string;
  instagramHandle: string;
  portfolioUrl: string;
  hostingStyle: string;
  kochiZone: string;
  experienceLevel: string;
  availability: string;
  languages: string;
  cameraComfort: string;
  storyPitch: string;
}

interface SubmittedRecord extends HostApplicationFormData {
  id: string;
  submittedAt: string;
  whatsappMessage: string;
}

const INITIAL_FORM: HostApplicationFormData = {
  fullName: '',
  whatsappNumber: '',
  instagramHandle: '',
  portfolioUrl: '',
  hostingStyle: HOSTING_STYLES[0].title,
  kochiZone: KOCHI_ZONES[0],
  experienceLevel: EXPERIENCE_LEVELS[0],
  availability: AVAILABILITY_OPTIONS[0],
  languages: 'Malayalam, English',
  cameraComfort: '',
  storyPitch: '',
};

const QUICK_STRENGTH_TAGS = [
  'Fluent Malayalam + English',
  'Natural Walk-and-Talk',
  'Street Interviews & Vox Pop',
  'Food & Cafe Reviews',
  'Kochi Local Slang & Humour',
  'Voiceovers & Scripting',
];

const QUICK_PITCH_STARTERS = [
  'Hosting an evening Chaya & Pazhampori walk through Broadway talking to local regulars',
  'A 6 AM Fort Kochi-to-Vypin ferry walk-and-talk chatting with fishermen & commuters',
  'Exploring 3 hidden courtyard art cafes in Mattancherry & interviewing the chefs',
];

const STORAGE_KEY = 'wander_in_kochi_host_submissions_v2';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel: string;
}

function ResilientImage({ src, alt, className = '', fallbackLabel }: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#132A21] via-[#1C3B2F] to-[#0D1C16] text-[#E6E4DD] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Camera className="w-8 h-8 text-[#84A98C] mb-3 opacity-80" />
        <span className="font-display text-sm font-semibold tracking-tight">{fallbackLabel}</span>
        <span className="text-xs text-[#A3B1A8] mt-1">Wander in Kochi · {WANDER_INSTAGRAM_HANDLE}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}

export default function App() {
  const [selectedPost, setSelectedPost] = useState<InstagramFeedPost | null>(null);
  const [formData, setFormData] = useState<HostApplicationFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof HostApplicationFormData, string>>>({});
  const [sampleIndex, setSampleIndex] = useState(0);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [whatsappMode, setWhatsappMode] = useState<'wa_me' | 'web' | 'raw'>('wa_me');
  const [activeDispatchModal, setActiveDispatchModal] = useState<SubmittedRecord | null>(null);
  const [submissions, setSubmissions] = useState<SubmittedRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const formSectionRef = useRef<HTMLElement | null>(null);
  const directWhatsappLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    } catch {
      // Ignore storage quota errors
    }
  }, [submissions]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPost(null);
        setActiveDispatchModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const completedStepsCount = useMemo(() => {
    let count = 0;
    if (formData.fullName.trim().length >= 2) count++;
    if (formData.whatsappNumber.replace(/\D/g, '').length >= 10) count++;
    if (formData.instagramHandle.trim().length >= 2) count++;
    if (formData.portfolioUrl.trim().length >= 4) count++;
    if (formData.storyPitch.trim().length >= 15) count++;
    return count;
  }, [formData]);

  const formattedWhatsappMessage = useMemo(() => {
    const name = formData.fullName.trim() || '[Your Full Name]';
    const senderPhone = formData.whatsappNumber.trim() || '[Your WhatsApp Number]';
    const ig = formData.instagramHandle.trim()
      ? formData.instagramHandle.trim().startsWith('@')
        ? formData.instagramHandle.trim()
        : `@${formData.instagramHandle.trim()}`
      : '[Your Instagram Handle]';
    const portfolio = formData.portfolioUrl.trim() || '[Instagram / Audition Reel Link]';
    const strengths = formData.cameraComfort.trim() || 'Natural on-camera storytelling & local conversations';
    const pitch = formData.storyPitch.trim() || '[Your Kochi On-Camera Reel Idea]';

    return [
      `Hello *Wander in Kochi* (${WANDER_INSTAGRAM_HANDLE}) Team!`,
      `I am applying for the *On-Camera Host & Storyteller* position.`,
      ``,
      `*ON-CAMERA HOST APPLICATION*`,
      `• *Name:* ${name}`,
      `• *Position:* ${OPEN_HOST_ROLE.title}`,
      `• *Hosting Vibe:* ${formData.hostingStyle}`,
      `• *Instagram:* ${ig}`,
      `• *Audition / Reel Link:* ${portfolio}`,
      `• *Applicant WhatsApp:* ${senderPhone}`,
      `• *Kochi Base:* ${formData.kochiZone}`,
      `• *Experience:* ${formData.experienceLevel}`,
      `• *Availability:* ${formData.availability}`,
      `• *Languages on Camera:* ${formData.languages || 'Malayalam, English'}`,
      `• *On-Camera Strengths:* ${strengths}`,
      ``,
      `*30-SECOND KOCHI REEL PITCH*`,
      `"${pitch}"`,
      ``,
      `Sent via Wander in Kochi Host Portal (${WANDER_INSTAGRAM_URL})`,
    ].join('\n');
  }, [formData]);

  const buildWhatsappHref = (messageText: string, mode: 'wa_me' | 'web' | 'raw' = whatsappMode) => {
    const encoded = encodeURIComponent(messageText);
    if (mode === 'web') {
      return `https://web.whatsapp.com/send?phone=${TARGET_WHATSAPP_INTL}&text=${encoded}`;
    }
    if (mode === 'raw') {
      return `https://wa.me/${TARGET_WHATSAPP_RAW}?text=${encoded}`;
    }
    return `https://wa.me/${TARGET_WHATSAPP_INTL}?text=${encoded}`;
  };

  const currentWhatsappHref = useMemo(
    () => buildWhatsappHref(formattedWhatsappMessage, whatsappMode),
    [formattedWhatsappMessage, whatsappMode]
  );

  const handleFieldChange = (field: keyof HostApplicationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleToggleStrengthTag = (tag: string) => {
    const current = formData.cameraComfort;
    if (current.toLowerCase().includes(tag.toLowerCase())) {
      return;
    }
    const updated = current.trim() ? `${current.trim()}, ${tag}` : tag;
    handleFieldChange('cameraComfort', updated);
  };

  const handleUsePostAsPitch = (post: InstagramFeedPost) => {
    setFormData((prev) => ({
      ...prev,
      storyPitch: post.hostingPrompt,
    }));
    setSelectedPost(null);
    setStatusNotice(`Loaded reel inspiration from "${post.title}" into your form!`);
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleLoadSampleProfile = () => {
    const sample = SAMPLE_HOST_APPLICATIONS[sampleIndex % SAMPLE_HOST_APPLICATIONS.length];
    setFormData(sample);
    setErrors({});
    setSampleIndex((prev) => prev + 1);
    setStatusNotice(`Sample On-Camera Host profile loaded (${sample.fullName}). Ready to send!`);
  };

  const handleResetForm = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
    setStatusNotice(null);
  };

  const validateForm = (): boolean => {
    const nextErrors: Partial<Record<keyof HostApplicationFormData, string>> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }

    const digitsOnly = formData.whatsappNumber.replace(/\D/g, '');
    if (!digitsOnly || digitsOnly.length < 10) {
      nextErrors.whatsappNumber = 'Enter a valid 10-digit WhatsApp number.';
    }

    if (!formData.instagramHandle.trim()) {
      nextErrors.instagramHandle = 'Enter your Instagram handle (e.g. @yourname).';
    }

    if (!formData.portfolioUrl.trim()) {
      nextErrors.portfolioUrl = 'Paste a link to your Instagram profile, Reel, or audition video.';
    }

    if (!formData.storyPitch.trim() || formData.storyPitch.trim().length < 15) {
      nextErrors.storyPitch = 'Write a short Kochi Reel idea (or tap one of the starter prompts above).';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const newRecord: SubmittedRecord = {
      ...formData,
      id: `wik-host-${Date.now()}`,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      whatsappMessage: formattedWhatsappMessage,
    };

    setSubmissions((prev) => [newRecord, ...prev]);
    setActiveDispatchModal(newRecord);

    if (directWhatsappLinkRef.current) {
      directWhatsappLinkRef.current.href = buildWhatsappHref(formattedWhatsappMessage, whatsappMode);
      directWhatsappLinkRef.current.click();
    }
  };

  const handleCopyMessage = async (textToCopy = formattedWhatsappMessage) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    }
  };

  const handleCopyWhatsappNumber = async () => {
    try {
      await navigator.clipboard.writeText(TARGET_WHATSAPP_RAW);
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2500);
    } catch {
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F5F0] text-[#111312] flex flex-col">
      {/* Hidden native anchor for direct WhatsApp launch upon valid form submission */}
      <a
        ref={directWhatsappLinkRef}
        href={currentWhatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      >
        Direct WhatsApp Dispatch
      </a>

      {/* Top Bar Contract: Strictly 1 row, 3 zones (Wordmark | 4 Nav Links | 1 Primary Action) */}
      <header className="sticky top-0 z-30 h-16 bg-[#F6F5F0]/95 backdrop-blur-md border-b border-[#E2E0D8] px-4 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#apply"
          className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#111312] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F523A]"
        >
          Wander in Kochi
        </a>

        {/* Zone 2: 4 clean text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4A4E4B]"
        >
          <a
            href="#apply"
            className="text-[#111312] font-semibold hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Host Application
          </a>
          <a
            href="#instagram-feed"
            className="hover:text-[#111312] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Instagram Feed
          </a>
          <a
            href="#role-details"
            className="hover:text-[#111312] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Role Details
          </a>
          <a
            href={WANDER_INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#111312] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            @wander.in.kochi
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center">
          <a
            href={WANDER_INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#0F523A] hover:bg-[#0B3E2B] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F523A]"
          >
            View Instagram Profile
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* 1. FIRST ABOVE THE FOLD: ON-CAMERA HOSTING APPLICATION FORM + INSTAGRAM STRIP */}
        <section
          id="apply"
          ref={formSectionRef}
          className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 pb-14 lg:pt-8 lg:pb-16 border-b border-[#E2E0D8]"
        >
          {/* Compact Top Banner with Visual Reel Previews from @wander.in.kochi */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-8 pb-6 border-b border-[#E2E0D8]">
            <div className="lg:col-span-7 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#4A4E4B]">
                <span className="font-semibold text-[#0F523A]">Now Hiring: On-Camera Host</span>
                <span aria-hidden="true">·</span>
                <a
                  href={WANDER_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#111312] hover:underline underline-offset-4"
                >
                  {WANDER_INSTAGRAM_HANDLE}
                </a>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">WhatsApp: {TARGET_WHATSAPP_RAW}</span>
              </div>

              <h1
                className="font-display text-2xl sm:text-4xl lg:text-[40px] font-bold tracking-tight text-[#111312] leading-[1.12]"
                style={{ textWrap: 'balance' }}
              >
                Be the Face &amp; Voice of Wander in Kochi
              </h1>

              <p className="text-sm sm:text-base text-[#3F4441] leading-relaxed">
                We are looking for an energetic <strong>On-Camera Host &amp; Presenter</strong> to explore Kochi’s food spots, heritage lanes, and island ferries on Instagram Reels. Fill out the quick form below to send your application directly to{' '}
                <strong className="font-mono-tabular text-[#111312]">{TARGET_WHATSAPP_RAW}</strong> on WhatsApp.
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleLoadSampleProfile}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-[#0F523A] bg-[#E6F0EC] hover:bg-[#D5E7DF] border border-[#B7D5C8] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Fill Sample Host Profile</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetForm}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-[#5A605D] hover:text-[#111312] bg-[#ECEAE2] hover:bg-[#E2DFD5] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Form</span>
                </button>

                <a
                  href="#instagram-feed"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-[#111312] hover:text-[#0F523A] underline underline-offset-4 whitespace-nowrap"
                >
                  <span>See {WANDER_INSTAGRAM_HANDLE} Reels ↓</span>
                </a>
              </div>
            </div>

            {/* Mini Visual Strip of 4 Featured Instagram Reels right at the top */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {INSTAGRAM_FEED_POSTS.slice(0, 4).map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => setSelectedPost(post)}
                    className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-[#DCD9CE] bg-[#141615] text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0F523A]"
                  >
                    <ResilientImage
                      src={post.image}
                      alt={post.title}
                      fallbackLabel={post.title}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-[10px] sm:text-[11px] font-medium text-white leading-tight line-clamp-2">
                        {post.title}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-[#5A605D]">
                <span>Recent stories from {WANDER_INSTAGRAM_HANDLE}</span>
                <a
                  href="#instagram-feed"
                  className="font-semibold text-[#0F523A] hover:underline underline-offset-4"
                >
                  View all 7 posts ↓
                </a>
              </div>
            </div>
          </div>

          {statusNotice && (
            <div
              role="status"
              className="mb-6 p-3.5 rounded-xl bg-[#E6F0EC] border border-[#B7D5C8] text-[#0F523A] flex items-center justify-between gap-4 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{statusNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setStatusNotice(null)}
                aria-label="Dismiss notification"
                className="text-[#0F523A] hover:opacity-75 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Main Application Workspace: Left Form (7 cols) + Right Live WhatsApp Preview (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* LEFT 7 COLUMNS: ON-CAMERA HOSTING FORM */}
            <form
              onSubmit={handleSubmitApplication}
              noValidate
              className="lg:col-span-7 bg-[#FBF9F5] border border-[#DCD9CE] rounded-2xl p-5 sm:p-8 space-y-7 shadow-2xs"
            >
              {/* Form Header & 5-Step Readiness Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E6DF]">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F523A]">
                    <Mic className="w-3.5 h-3.5" />
                    <span>Position: {OPEN_HOST_ROLE.title}</span>
                  </div>
                  <p className="text-xs text-[#5A605D] mt-0.5">
                    {completedStepsCount === 5
                      ? 'All 5 required fields completed — Ready to send to 8891396469!'
                      : `${completedStepsCount} of 5 required fields filled`}
                  </p>
                </div>

                <div className="flex items-center gap-1.5" aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <span
                      key={step}
                      className={`h-2 w-6 rounded-full transition-colors ${
                        step <= completedStepsCount ? 'bg-[#0F523A]' : 'bg-[#E2DFD5]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* STEP 1: Your Contact & Instagram Profile */}
              <div className="space-y-4">
                <div className="text-sm font-bold text-[#111312]">
                  1. Your Details &amp; Audition Link *
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-semibold text-[#111312] mb-1.5"
                    >
                      Full Name *
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleFieldChange('fullName', e.target.value)}
                      placeholder="e.g. Diya Varghese"
                      className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl text-[#111312] placeholder-[#8C928E] focus:outline-none focus:ring-2 focus:ring-[#0F523A] ${
                        errors.fullName ? 'border-red-600' : 'border-[#D0CDC2]'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-700 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="whatsappNumber"
                      className="block text-xs font-semibold text-[#111312] mb-1.5"
                    >
                      Your WhatsApp Number *
                    </label>
                    <input
                      id="whatsappNumber"
                      name="whatsappNumber"
                      type="tel"
                      required
                      value={formData.whatsappNumber}
                      onChange={(e) => handleFieldChange('whatsappNumber', e.target.value)}
                      placeholder="e.g. 9447890123"
                      className={`w-full px-3.5 py-2.5 text-sm font-mono-tabular bg-white border rounded-xl text-[#111312] placeholder-[#8C928E] focus:outline-none focus:ring-2 focus:ring-[#0F523A] ${
                        errors.whatsappNumber ? 'border-red-600' : 'border-[#D0CDC2]'
                      }`}
                    />
                    {errors.whatsappNumber && (
                      <p className="mt-1 text-xs text-red-700 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.whatsappNumber}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="instagramHandle"
                      className="block text-xs font-semibold text-[#111312] mb-1.5"
                    >
                      Your Instagram Handle *
                    </label>
                    <input
                      id="instagramHandle"
                      name="instagramHandle"
                      type="text"
                      required
                      value={formData.instagramHandle}
                      onChange={(e) => handleFieldChange('instagramHandle', e.target.value)}
                      placeholder="e.g. @diyawanders.kochi"
                      className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl text-[#111312] placeholder-[#8C928E] focus:outline-none focus:ring-2 focus:ring-[#0F523A] ${
                        errors.instagramHandle ? 'border-red-600' : 'border-[#D0CDC2]'
                      }`}
                    />
                    {errors.instagramHandle && (
                      <p className="mt-1 text-xs text-red-700 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.instagramHandle}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="portfolioUrl"
                      className="block text-xs font-semibold text-[#111312] mb-1.5"
                    >
                      On-Camera Reel / Video Link *
                    </label>
                    <input
                      id="portfolioUrl"
                      name="portfolioUrl"
                      type="url"
                      required
                      value={formData.portfolioUrl}
                      onChange={(e) => handleFieldChange('portfolioUrl', e.target.value)}
                      placeholder="Instagram Reel, Drive, or YouTube link"
                      className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl text-[#111312] placeholder-[#8C928E] focus:outline-none focus:ring-2 focus:ring-[#0F523A] ${
                        errors.portfolioUrl ? 'border-red-600' : 'border-[#D0CDC2]'
                      }`}
                    />
                    {errors.portfolioUrl && (
                      <p className="mt-1 text-xs text-red-700 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.portfolioUrl}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* STEP 2: Pick Your On-Camera Hosting Style */}
              <div className="space-y-3 pt-2 border-t border-[#E8E6DF]">
                <label className="block text-sm font-bold text-[#111312]">
                  2. Pick Your On-Camera Hosting Vibe
                </label>

                <div
                  role="radiogroup"
                  aria-label="Pick your on-camera hosting vibe"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                >
                  {HOSTING_STYLES.map((style) => {
                    const isSelected = formData.hostingStyle === style.title;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => handleFieldChange('hostingStyle', style.title)}
                        className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                          isSelected
                            ? 'bg-[#E6F0EC] border-[#0F523A] text-[#111312]'
                            : 'bg-white border-[#D6D3C9] text-[#3F4441] hover:border-[#ABA79A]'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-[#111312] truncate">
                            {style.title}
                          </div>
                          <div className="text-[11px] font-medium text-[#0F523A] mt-0.5 truncate">
                            {style.subtitle}
                          </div>
                          <div className="text-[11px] text-[#5A605D] mt-1 line-clamp-1">
                            {style.description}
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-[#0F523A] text-white'
                              : 'border border-[#C5C2B8] bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 3: Location, Availability & Languages */}
              <div className="space-y-4 pt-2 border-t border-[#E8E6DF]">
                <div className="text-sm font-bold text-[#111312]">
                  3. Kochi Base, Availability &amp; On-Camera Strengths
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label
                      htmlFor="kochiZone"
                      className="block text-xs font-semibold text-[#111312] mb-1.5"
                    >
                      Your Base in Kochi
                    </label>
                    <select
                      id="kochiZone"
                      name="kochiZone"
                      value={formData.kochiZone}
                      onChange={(e) => handleFieldChange('kochiZone', e.target.value)}
                      className="w-full px-3 py-2.5 text-xs sm:text-sm bg-white border border-[#D0CDC2] rounded-xl text-[#111312] focus:outline-none focus:ring-2 focus:ring-[#0F523A]"
                    >
                      {KOCHI_ZONES.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="availability"
                      className="block text-xs font-semibold text-[#111312] mb-1.5"
                    >
                      Shoot Availability
                    </label>
                    <select
                      id="availability"
                      name="availability"
                      value={formData.availability}
                      onChange={(e) => handleFieldChange('availability', e.target.value)}
                      className="w-full px-3 py-2.5 text-xs sm:text-sm bg-white border border-[#D0CDC2] rounded-xl text-[#111312] focus:outline-none focus:ring-2 focus:ring-[#0F523A]"
                    >
                      {AVAILABILITY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="experienceLevel"
                      className="block text-xs font-semibold text-[#111312] mb-1.5"
                    >
                      Hosting Experience
                    </label>
                    <select
                      id="experienceLevel"
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={(e) => handleFieldChange('experienceLevel', e.target.value)}
                      className="w-full px-3 py-2.5 text-xs sm:text-sm bg-white border border-[#D0CDC2] rounded-xl text-[#111312] focus:outline-none focus:ring-2 focus:ring-[#0F523A]"
                    >
                      {EXPERIENCE_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <label
                      htmlFor="cameraComfort"
                      className="block text-xs font-semibold text-[#111312]"
                    >
                      Your On-Camera Strengths &amp; Languages (Optional)
                    </label>
                    <span className="text-[11px] text-[#5A605D]">
                      Tap to quick-add:
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {QUICK_STRENGTH_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleStrengthTag(tag)}
                        className="px-2.5 py-1 text-xs font-medium bg-[#ECEAE2] hover:bg-[#DFDDD3] text-[#111312] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>

                  <input
                    id="cameraComfort"
                    name="cameraComfort"
                    type="text"
                    value={formData.cameraComfort}
                    onChange={(e) => handleFieldChange('cameraComfort', e.target.value)}
                    placeholder="e.g. Fluent Malayalam & English, spontaneous street interviews, food tasting"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D0CDC2] rounded-xl text-[#111312] placeholder-[#8C928E] focus:outline-none focus:ring-2 focus:ring-[#0F523A]"
                  />
                </div>
              </div>

              {/* STEP 4: 30-Second On-Camera Pitch */}
              <div className="space-y-3 pt-2 border-t border-[#E8E6DF]">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="storyPitch"
                    className="block text-sm font-bold text-[#111312]"
                  >
                    4. What Kochi Spot Would You Host in Your First Reel? *
                  </label>
                  <span className="font-mono-tabular text-xs text-[#5A605D]">
                    {formData.storyPitch.length} chars
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs text-[#5A605D]">
                    Tap a quick starter below or write your own hosting idea:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_PITCH_STARTERS.map((starter, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleFieldChange('storyPitch', starter)}
                        className="text-left px-2.5 py-1.5 text-xs bg-[#ECEAE2] hover:bg-[#DFDDD3] text-[#111312] rounded-lg transition-colors cursor-pointer"
                      >
                        “{starter}”
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  id="storyPitch"
                  name="storyPitch"
                  rows={3}
                  required
                  value={formData.storyPitch}
                  onChange={(e) => handleFieldChange('storyPitch', e.target.value)}
                  placeholder="Describe a 60-second Reel you’d love to host for @wander.in.kochi—where are we walking, who are we talking to, and what is your opening line?"
                  className={`w-full px-3.5 py-3 text-sm bg-white border rounded-xl text-[#111312] placeholder-[#8C928E] focus:outline-none focus:ring-2 focus:ring-[#0F523A] leading-relaxed ${
                    errors.storyPitch ? 'border-red-600' : 'border-[#D0CDC2]'
                  }`}
                />
                {errors.storyPitch && (
                  <p className="mt-1 text-xs text-red-700 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.storyPitch}</span>
                  </p>
                )}
              </div>

              {/* PRIMARY SUBMIT CTA */}
              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-[#15803D] hover:bg-[#166534] text-white font-semibold text-base rounded-xl transition-colors flex items-center justify-center gap-2.5 shadow-sm cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Host Application on WhatsApp ({TARGET_WHATSAPP_RAW})</span>
                </button>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5A605D]">
                  <span>
                    Sends directly from your WhatsApp to{' '}
                    <strong className="font-mono-tabular text-[#111312]">
                      {TARGET_WHATSAPP_DISPLAY}
                    </strong>
                    .
                  </span>
                  <a
                    href={currentWhatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#0F523A] hover:underline underline-offset-4 whitespace-nowrap"
                  >
                    Direct WhatsApp Link ↗
                  </a>
                </div>
              </div>
            </form>

            {/* RIGHT 5 COLUMNS: LIVE WHATSAPP PREVIEW & INSTANT SEND */}
            <aside className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
              <div className="bg-[#111614] text-[#F4F3EE] rounded-2xl p-6 border border-[#242E29] space-y-5">
                <div className="flex items-start justify-between gap-4 border-b border-[#26312C] pb-4">
                  <div>
                    <div className="text-xs text-[#84A98C] tracking-wide">
                      Live WhatsApp Message Preview
                    </div>
                    <h2 className="font-display text-lg font-bold text-white mt-0.5">
                      To: {TARGET_WHATSAPP_DISPLAY}
                    </h2>
                    <div className="text-xs text-[#A3B1A8] mt-0.5">
                      Wander in Kochi ({WANDER_INSTAGRAM_HANDLE}) Casting Desk
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyWhatsappNumber}
                    className="px-3 py-1.5 text-xs font-mono-tabular font-medium bg-[#1C2621] hover:bg-[#27352E] text-[#D8E2DC] rounded-lg border border-[#2F3E37] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {copiedNumber ? 'Copied 8891396469' : 'Copy 8891396469'}
                  </button>
                </div>

                {/* Device Mode Switcher */}
                <div className="space-y-1.5">
                  <div className="text-xs text-[#A3B1A8]">
                    Choose how WhatsApp opens on your device:
                  </div>
                  <div
                    role="group"
                    aria-label="WhatsApp launch mode"
                    className="grid grid-cols-3 gap-1.5 p-1 bg-[#1A221E] rounded-xl border border-[#26312C]"
                  >
                    {[
                      { id: 'wa_me', label: 'WhatsApp App' },
                      { id: 'web', label: 'WhatsApp Web' },
                      { id: 'raw', label: '8891396469' },
                    ].map((modeOption) => (
                      <button
                        key={modeOption.id}
                        type="button"
                        onClick={() =>
                          setWhatsappMode(modeOption.id as 'wa_me' | 'web' | 'raw')
                        }
                        className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap truncate cursor-pointer ${
                          whatsappMode === modeOption.id
                            ? 'bg-[#0F523A] text-white'
                            : 'text-[#A3B1A8] hover:text-white'
                        }`}
                      >
                        {modeOption.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Formatted Message Bubble */}
                <div className="bg-[#18221E] border border-[#283630] rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#84A98C]">
                    <span>Auto-formatted On-Camera Host pitch</span>
                    <span className="font-mono-tabular">8891396469</span>
                  </div>
                  <pre className="text-xs text-[#E6E4DD] whitespace-pre-wrap font-sans leading-relaxed max-h-[260px] overflow-y-auto pr-1">
                    {formattedWhatsappMessage}
                  </pre>
                </div>

                {/* Direct Launch & Copy Buttons */}
                <div className="space-y-2.5">
                  <a
                    href={currentWhatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-[#15803D] hover:bg-[#166534] text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open WhatsApp &amp; Send to 8891396469</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopyMessage(formattedWhatsappMessage)}
                    className="w-full py-2.5 px-4 bg-[#1C2621] hover:bg-[#27352E] text-[#E6E4DD] font-medium text-xs rounded-xl border border-[#2F3E37] transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    {copiedMessage ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#4ADE80]" />
                        <span>Copied Application Text!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Formatted Message Text</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Recent Submissions Log */}
              {submissions.length > 0 && (
                <div className="bg-[#FBF9F5] border border-[#DCD9CE] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-sm font-bold text-[#111312]">
                      Your Prepared Applications ({submissions.length})
                    </h3>
                    <span className="text-xs text-[#5A605D]">Saved locally</span>
                  </div>

                  <div className="space-y-2.5">
                    {submissions.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-[#F3F1EA] border border-[#E2DFD5] flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-[#111312] truncate">
                            {item.fullName} · {item.hostingStyle}
                          </div>
                          <div className="text-[11px] text-[#5A605D] font-mono-tabular mt-0.5">
                            {item.instagramHandle} · {item.submittedAt}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setActiveDispatchModal(item)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-[#0F523A] bg-white hover:bg-[#E6F0EC] border border-[#D0CDC2] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Re-send
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>

        {/* 2. EXPANDED INSTAGRAM PROFILE SHOWCASE (@wander.in.kochi) — 7 Visual Stories */}
        <section
          id="instagram-feed"
          className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 py-14 lg:py-20 border-b border-[#E2E0D8]"
        >
          {/* Instagram Profile Header Card */}
          <div className="bg-[#FBF9F5] border border-[#DCD9CE] rounded-2xl p-6 sm:p-8 mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#DCD9CE] shrink-0 bg-[#141615]">
                <ResilientImage
                  src={INSTAGRAM_FEED_POSTS[0].image}
                  alt="Wander in Kochi Instagram Avatar"
                  fallbackLabel="WIK"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#111312]">
                    {WANDER_INSTAGRAM_HANDLE}
                  </h2>
                  <span className="text-xs text-[#5A605D]">·</span>
                  <span className="text-xs font-semibold text-[#0F523A]">
                    Official Instagram Feed &amp; Reels Showcase
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#3F4441] max-w-2xl leading-relaxed">
                  Exploring the soul of Cochin—from Fort Kochi’s heritage streets and Mattancherry spice lanes to evening chaya stalls, Kathakali greenrooms, and Kadamakkudy backwater sunsets.
                </p>
                <div className="text-xs text-[#5A605D] pt-0.5">
                  <span>Fort Kochi</span>
                  <span aria-hidden="true"> · </span>
                  <span>Mattancherry</span>
                  <span aria-hidden="true"> · </span>
                  <span>Ernakulam</span>
                  <span aria-hidden="true"> · </span>
                  <span>Kadamakkudy Islands</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={WANDER_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[#0F523A] hover:bg-[#0B3E2B] rounded-xl transition-colors whitespace-nowrap"
              >
                <Instagram className="w-4 h-4" />
                <span>Open {WANDER_INSTAGRAM_HANDLE} on Instagram</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 7-Item Visual Masonry / Bento Grid from @wander.in.kochi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {INSTAGRAM_FEED_POSTS.map((post, index) => {
              const isWide = index === 2;
              return (
                <article
                  key={post.id}
                  className={`group rounded-2xl overflow-hidden border border-[#DCD9CE] bg-[#FBF9F5] flex flex-col justify-between ${
                    isWide ? 'sm:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <div
                    onClick={() => setSelectedPost(post)}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-[#141615] cursor-pointer"
                  >
                    <ResilientImage
                      src={post.image}
                      alt={post.title}
                      fallbackLabel={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/90">
                      <span className="font-mono-tabular bg-black/55 backdrop-blur-xs px-2.5 py-1 rounded-md">
                        {post.format}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-black/55 backdrop-blur-xs px-2.5 py-1 rounded-md">
                        <Play className="w-3 h-3 fill-current" />
                        <span>Preview</span>
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-stone-200">
                      <span className="truncate">{post.location}</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="text-xs text-[#5A605D]">{post.viewsOrLikes}</div>
                      <h3 className="font-display text-lg font-bold text-[#111312] leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#4A4E4B] leading-relaxed">
                        {post.caption}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E8E6DF] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPost(post)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111312] hover:text-[#0F523A] transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Post</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUsePostAsPitch(post)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F523A] hover:underline underline-offset-4 whitespace-nowrap cursor-pointer"
                      >
                        <span>Host a Reel Like This ↑</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 3. SINGLE EXCLUSIVE ROLE BRIEF: ON-CAMERA HOST & STORYTELLER */}
        <section
          id="role-details"
          className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 py-14 lg:py-18"
        >
          <div className="bg-[#FBF9F5] border border-[#DCD9CE] rounded-2xl p-6 sm:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-[#E8E6DF]">
              <div className="space-y-2 max-w-2xl">
                <div className="text-xs text-[#0F523A] font-semibold">
                  {OPEN_HOST_ROLE.department} · {OPEN_HOST_ROLE.schedule}
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#111312]">
                  {OPEN_HOST_ROLE.title}
                </h2>
                <p className="text-sm sm:text-base text-[#3F4441] leading-relaxed">
                  {OPEN_HOST_ROLE.summary}
                </p>
              </div>

              <a
                href="#apply"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-[#0F523A] hover:bg-[#0B3E2B] rounded-xl transition-colors whitespace-nowrap self-start lg:self-center"
              >
                <ArrowUp className="w-4 h-4" />
                <span>Apply for On-Camera Hosting ↑</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div className="space-y-3">
                <h3 className="font-display text-base font-bold text-[#111312]">
                  What You Will Do as Host
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#3F4441]">
                  {OPEN_HOST_ROLE.whatYouDo.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-[#0F523A] font-bold select-none">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-display text-base font-bold text-[#111312]">
                  Who We Are Looking For
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#3F4441]">
                  {OPEN_HOST_ROLE.requirements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-[#0F523A] font-bold select-none">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 text-xs text-[#5A605D]">
                  <strong className="text-[#111312]">Primary Shoot Zones:</strong>{' '}
                  {OPEN_HOST_ROLE.locations}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* QUIET EDITORIAL FOOTER */}
      <footer className="border-t border-[#DCD9CE] bg-[#EFECE4] py-8 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="font-display text-base font-bold text-[#111312]">
              Wander in Kochi
            </div>
            <p className="text-xs text-[#5A605D]">
              On-Camera Hosting &amp; Visual Stories of Cochin · Kerala, India
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-[#3F4441]">
            <a
              href={WANDER_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0F523A] underline underline-offset-4"
            >
              Instagram ({WANDER_INSTAGRAM_HANDLE})
            </a>
            <a
              href={`https://wa.me/${TARGET_WHATSAPP_INTL}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0F523A] font-mono-tabular underline underline-offset-4"
            >
              WhatsApp: {TARGET_WHATSAPP_DISPLAY}
            </a>
            <a href="#apply" className="hover:text-[#0F523A]">
              Back to Application Form ↑
            </a>
          </div>
        </div>
      </footer>

      {/* LIGHTBOX MODAL FOR INSTAGRAM FEED POSTS */}
      {selectedPost && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ig-modal-title"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-[#FBF9F5] text-[#111312] border border-[#DCD9CE] rounded-2xl max-w-2xl w-full overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video bg-[#141615]">
              <ResilientImage
                src={selectedPost.image}
                alt={selectedPost.title}
                fallbackLabel={selectedPost.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                aria-label="Close post preview modal"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="text-xs text-[#5A605D]">
                {selectedPost.format} · {selectedPost.location}
              </div>
              <h3
                id="ig-modal-title"
                className="font-display text-2xl font-bold text-[#111312]"
              >
                {selectedPost.title}
              </h3>
              <p className="text-sm text-[#3F4441] leading-relaxed">
                {selectedPost.caption}
              </p>

              <div className="p-3.5 rounded-xl bg-[#F1EFE8] border border-[#E2DFD5] text-xs text-[#3F4441]">
                <strong className="text-[#0F523A]">Host Pitch Idea:</strong> “{selectedPost.hostingPrompt}”
              </div>

              <div className="pt-3 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={WANDER_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F523A] hover:underline underline-offset-4"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>View on {WANDER_INSTAGRAM_HANDLE}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPost(null)}
                    className="px-4 py-2.5 text-xs font-semibold text-[#4A4E4B] hover:text-[#111312] cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUsePostAsPitch(selectedPost)}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-[#0F523A] hover:bg-[#0B3E2B] rounded-lg transition-colors cursor-pointer"
                  >
                    Use This Idea in My Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP DISPATCH CONFIRMATION MODAL */}
      {activeDispatchModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dispatch-modal-title"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveDispatchModal(null)}
        >
          <div
            className="bg-[#FBF9F5] text-[#111312] border border-[#DCD9CE] rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F523A]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>On-Camera Host Application Ready</span>
                </div>
                <h3
                  id="dispatch-modal-title"
                  className="font-display text-xl sm:text-2xl font-bold text-[#111312]"
                >
                  Send to Wander in Kochi ({TARGET_WHATSAPP_RAW})
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveDispatchModal(null)}
                aria-label="Close WhatsApp dispatch dialog"
                className="p-1.5 rounded-lg text-[#5A605D] hover:text-[#111312] hover:bg-[#ECEAE2] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#3F4441] leading-relaxed">
              Your <strong>On-Camera Host &amp; Storyteller</strong> application is ready to send to{' '}
              <strong className="font-mono-tabular">{TARGET_WHATSAPP_DISPLAY}</strong>. Click below to open WhatsApp and send the message from your account:
            </p>

            <div className="bg-[#141A17] text-[#E6E4DD] rounded-xl p-4 border border-[#283630]">
              <div className="flex items-center justify-between text-[11px] text-[#84A98C] mb-2">
                <span>Recipient: +91 88913 96469</span>
                <span>Applicant: {activeDispatchModal.fullName}</span>
              </div>
              <pre className="text-xs whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto">
                {activeDispatchModal.whatsappMessage}
              </pre>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={buildWhatsappHref(activeDispatchModal.whatsappMessage, 'wa_me')}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 bg-[#15803D] hover:bg-[#166534] text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open WhatsApp (+91 8891396469)</span>
              </a>

              <a
                href={buildWhatsappHref(activeDispatchModal.whatsappMessage, 'web')}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 bg-[#0F523A] hover:bg-[#0B3E2B] text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in WhatsApp Web</span>
              </a>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E8E6DF]">
              <button
                type="button"
                onClick={() => handleCopyMessage(activeDispatchModal.whatsappMessage)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111312] hover:text-[#0F523A] cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedMessage ? 'Copied Message!' : 'Copy Full Message Text'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDispatchModal(null)}
                className="px-4 py-2 text-xs font-semibold text-[#5A605D] hover:text-[#111312] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
