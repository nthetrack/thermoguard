import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  Eye, EyeOff, ChevronDown, Wind, Copy, Check,
  CheckCircle, Users, Shield, LayoutDashboard, Wrench,
} from 'lucide-react'

// ── Demo accounts ─────────────────────────────────────────────────────────────
const quickLogins = [
  { email: 'admin@demo.com',         label: 'Admin',                   role: 'Platform Administrator' },
  { email: 'nursinghome@demo.com',   label: 'Customer (Nursing Home)',  role: 'Customer' },
  { email: '7eleven@demo.com',       label: 'Customer (7-Eleven)',      role: 'Customer' },
  { email: 'manager.nh@demo.com',    label: 'Maintenance Manager',     role: 'Manager' },
  { email: 'tech1@hvacservices.com', label: 'HVAC Technician',         role: 'Technician' },
  { email: 'rentals@coolair.com',    label: 'Rental Provider',         role: 'Rental Vendor' },
]

// ── Copy-to-clipboard button ──────────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }
  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy email address"
      className="ml-1 p-0.5 text-gray-400 hover:text-brand-600 focus:outline-none rounded transition-colors"
    >
      {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
    </button>
  )
}

// ── Temperature chart (fake dashboard screenshot) ─────────────────────────────
function TempChart() {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 shadow-xl shadow-black/30">
      {/* macOS-style window chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-black/40 border-b border-white/[0.06]">
        <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
        <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
        <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
        <span className="ml-2 text-[8.5px] text-white/25 font-mono tracking-wider">
          CoolResponse · Device Monitor
        </span>
      </div>
      {/* Chart area */}
      <div className="bg-brand-950/80 px-3.5 pt-3 pb-2.5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[11px] font-semibold text-white">Ward A — Temperature</p>
            <p className="text-[9px] text-brand-400 mt-0.5">Sunrise Nursing Home · Last 6 hours</p>
          </div>
          <div className="flex items-center gap-1.5 bg-red-500/15 border border-red-500/30 rounded-full px-2 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
            <span className="text-[8px] font-bold text-red-300 whitespace-nowrap">31.4°C — CRITICAL</span>
          </div>
        </div>
        <svg
          viewBox="0 0 280 78"
          className="w-full h-[65px] sm:h-[78px]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="crNormalFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="crSpikeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Faint grid */}
          {[14, 28, 42, 56].map(y => (
            <line key={y} x1="0" y1={y} x2="280" y2={y}
              stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          ))}

          {/* Threshold line */}
          <line x1="0" y1="37" x2="280" y2="37"
            stroke="#ef4444" strokeWidth="1" strokeDasharray="4,3" opacity="0.55" />
          <rect x="0" y="29" width="24" height="9" rx="2" fill="rgba(239,68,68,0.15)" />
          <text x="2" y="36.5" fill="#ef4444" fontSize="6" opacity="0.85" fontFamily="monospace">26°C</text>

          {/* Fill under normal segment */}
          <path
            d="M 0,60 C 22,59 45,62 70,60 C 95,58 118,61 143,59 C 162,58 172,57 182,56 L 182,68 L 0,68 Z"
            fill="url(#crNormalFill)"
          />
          {/* Fill under spike segment (above threshold) */}
          <path
            d="M 182,56 C 198,49 214,38 232,24 C 248,12 262,7 272,6 L 272,37 L 182,37 Z"
            fill="url(#crSpikeFill)"
          />

          {/* Normal temperature line */}
          <path
            d="M 0,60 C 22,59 45,62 70,60 C 95,58 118,61 143,59 C 162,58 172,57 182,56"
            fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          />
          {/* Spike line */}
          <path
            d="M 182,56 C 198,49 214,38 232,24 C 248,12 262,7 272,6"
            fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          />

          {/* Current-reading dot with halo */}
          <circle cx="272" cy="6" r="7" fill="#ef4444" opacity="0.15" />
          <circle cx="272" cy="6" r="3" fill="#ef4444" />

          {/* Time axis labels */}
          <text x="1"   y="76" fill="rgba(255,255,255,0.22)" fontSize="6">−6 h</text>
          <text x="88"  y="76" fill="rgba(255,255,255,0.22)" fontSize="6">−4 h</text>
          <text x="175" y="76" fill="rgba(255,255,255,0.22)" fontSize="6">−2 h</text>
          <text x="251" y="76" fill="rgba(255,255,255,0.22)" fontSize="6">Now</text>
        </svg>
      </div>
    </div>
  )
}

// ── Phone mockup with SMS alert ───────────────────────────────────────────────
function PhoneMockup() {
  return (
    <div className="flex flex-col items-center">
      <div style={{ width: '192px' }}>
        {/* Outer phone shell */}
        <div className="bg-[#1a1a1a] rounded-[2.75rem] p-[3px] shadow-2xl shadow-black/70 border border-white/[0.07]">
          {/* Screen */}
          <div className="bg-black rounded-[2.5rem] overflow-hidden">

            {/* Dynamic island */}
            <div className="flex justify-center pt-3 pb-0.5 bg-black">
              <div className="w-[74px] h-[18px] bg-[#111] rounded-[10px]" />
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between px-4 pb-2 bg-black">
              <span className="text-white text-[8px] font-semibold">9:41</span>
              <div className="flex items-center gap-1 opacity-80">
                {/* Signal bars */}
                <svg width="14" height="9" viewBox="0 0 14 9" fill="white">
                  <rect x="0" y="4" width="2.5" height="5" rx="0.5" />
                  <rect x="3.5" y="2.5" width="2.5" height="6.5" rx="0.5" />
                  <rect x="7" y="1" width="2.5" height="8" rx="0.5" />
                  <rect x="10.5" y="0" width="2.5" height="9" rx="0.5" opacity="0.35" />
                </svg>
                {/* Battery */}
                <svg width="20" height="9" viewBox="0 0 20 9" fill="white">
                  <rect x="0" y="1" width="16" height="7" rx="1.5" fill="none" stroke="white" strokeWidth="1" />
                  <rect x="1.5" y="2.5" width="10" height="4" rx="0.5" />
                  <rect x="17" y="3" width="2" height="3" rx="0.5" opacity="0.5" />
                </svg>
              </div>
            </div>

            {/* Messages app header */}
            <div className="bg-[#1c1c1e] px-3 py-2 flex items-center gap-2 border-b border-[#2c2c2e]">
              <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
                <span className="text-[8px] text-white font-bold">CR</span>
              </div>
              <div className="min-w-0">
                <p className="text-white text-[9.5px] font-semibold leading-none">CoolResponse</p>
                <p className="text-[#8e8e93] text-[7px] mt-0.5">Temperature Alerts</p>
              </div>
            </div>

            {/* Message thread */}
            <div className="bg-black px-2.5 pt-3 pb-2 space-y-2">
              {/* Alert bubble */}
              <div className="bg-[#ff3b30] rounded-[14px] rounded-tl-[3px] px-2.5 py-2" style={{ maxWidth: '90%' }}>
                <p className="text-white text-[7.5px] font-bold tracking-wide mb-1">⚠ THRESHOLD EXCEEDED</p>
                <p className="text-red-50 text-[7.5px] leading-[1.6]">
                  Ward A · <strong>31.4°C</strong><br />
                  Limit: 26°C &nbsp;·&nbsp; +5.4° over<br />
                  Sunrise Nursing Home
                </p>
              </div>
              {/* Follow-up prompt */}
              <div className="bg-[#1c1c1e] rounded-[14px] rounded-tl-[3px] px-2.5 py-2" style={{ maxWidth: '90%' }}>
                <p className="text-[#aeaeb2] text-[7.5px] leading-[1.5]">
                  How do you want to respond?
                </p>
              </div>
            </div>

            {/* Response option buttons */}
            <div className="bg-black px-2.5 pb-3 space-y-1.5">
              <div className="bg-brand-600 rounded-[10px] py-[8px] text-center">
                <p className="text-white text-[7.5px] font-semibold">1 · Dispatch a technician</p>
              </div>
              <div className="rounded-[10px] py-[8px] text-center" style={{ backgroundColor: '#30d158' }}>
                <p className="text-white text-[7.5px] font-semibold">2 · Order temporary AC units</p>
              </div>
              <div className="bg-[#1c1c1e] rounded-[10px] py-[8px] text-center border border-[#2c2c2e]">
                <p className="text-[#8e8e93] text-[7.5px]">3 · Acknowledge only</p>
              </div>
            </div>

            {/* Input bar */}
            <div className="bg-[#1c1c1e] px-2.5 py-2 flex items-center gap-1.5 border-t border-[#2c2c2e]">
              <div className="flex-1 bg-[#2c2c2e] rounded-full px-2.5 py-1">
                <p className="text-[#636366] text-[7px]">Reply…</p>
              </div>
            </div>

            {/* Home indicator */}
            <div className="flex justify-center py-1.5 bg-[#1c1c1e]">
              <div className="w-[68px] h-[3px] bg-white/20 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      <p className="text-[9px] text-brand-400 mt-2.5">SMS alert — no app install required</p>
    </div>
  )
}

// ── Dispatch outcome cards ─────────────────────────────────────────────────────
function ResponseCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {/* Technician */}
      <div className="bg-white/[0.08] border border-white/[0.12] rounded-xl p-3 hover:bg-white/[0.12] transition-colors">
        <div className="w-7 h-7 rounded-lg bg-brand-600/50 flex items-center justify-center mb-2.5">
          <Wrench size={13} className="text-brand-200" />
        </div>
        <p className="text-[10.5px] font-semibold text-white leading-snug mb-0.5">
          Technician dispatch
        </p>
        <p className="text-[8.5px] text-brand-400 mb-2">ProCool HVAC Services</p>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
            <p className="text-[8px] text-emerald-400 font-medium">Available now</p>
          </div>
          <p className="text-[8px] text-brand-400">ETA ~45 minutes</p>
        </div>
        <div className="mt-2 pt-2 border-t border-white/10">
          <p className="text-[7.5px] text-white/40">On-site diagnosis & repair</p>
        </div>
      </div>

      {/* Temporary AC */}
      <div className="bg-white/[0.08] border border-white/[0.12] rounded-xl p-3 hover:bg-white/[0.12] transition-colors">
        <div className="w-7 h-7 rounded-lg bg-emerald-600/40 flex items-center justify-center mb-2.5">
          <Wind size={13} className="text-emerald-300" />
        </div>
        <p className="text-[10.5px] font-semibold text-white leading-snug mb-0.5">
          Temporary AC units
        </p>
        <p className="text-[8.5px] text-brand-400 mb-2">CoolAir Rentals</p>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
            <p className="text-[8px] text-emerald-400 font-medium">2 units available</p>
          </div>
          <p className="text-[8px] text-brand-400">Delivery ~2 hours</p>
        </div>
        <div className="mt-2 pt-2 border-t border-white/10">
          <p className="text-[7.5px] text-white/40">Immediate cooling cover</p>
        </div>
      </div>
    </div>
  )
}

// ── Marketing panel (left column) ─────────────────────────────────────────────
function MarketingPanel() {
  return (
    <div className="relative">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-brand-400 opacity-[0.05] blur-3xl" />
        <div className="absolute bottom-20 -left-20 w-80 h-80 rounded-full bg-brand-500 opacity-[0.06] blur-3xl" />
      </div>

      <div className="relative">

        {/* Wordmark — hidden on mobile (nav carries it), shown once side-by-side layout kicks in */}
        <div className="hidden md:flex items-center gap-2.5 mb-8 lg:mb-10">
          <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
            <Wind size={18} className="text-white" />
          </div>
          <span className="text-white text-xl font-bold tracking-tight">CoolResponse</span>
        </div>

        {/* Live status pill */}
        <div className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1 mb-4 md:mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
          <span className="text-[10px] font-semibold text-red-300 tracking-widest uppercase">
            Live monitoring active
          </span>
        </div>

        {/* Hero */}
        <h1 className="text-2xl sm:text-3xl xl:text-[2.4rem] font-bold text-white leading-tight mb-3">
          When cold rooms fail,<br />response time is everything.
        </h1>
        <p className="text-brand-200 text-sm sm:text-[15px] leading-relaxed max-w-lg mb-6 md:mb-8">
          CoolResponse watches temperatures across all your sites around the clock.
          The moment a reading exceeds your limit, the right people get an SMS —
          with a one-tap option to dispatch a technician or order temporary cooling.
          No app. No manual calls. Just action.
        </p>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 pb-6 md:mb-8 md:pb-8 border-b border-white/10">
          {[
            { value: '30 sec',  label: 'Sensor polling' },
            { value: '< 2 min', label: 'Alert to SMS'   },
            { value: '24 / 7',  label: 'Always-on'      },
          ].map(s => (
            <div key={s.label}>
              <p className="text-lg sm:text-[1.35rem] font-bold text-white leading-none">{s.value}</p>
              <p className="text-[9px] sm:text-[10px] text-brand-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Body — always fully visible; on mobile this section scrolls below the login card */}
        <div className="space-y-10 sm:space-y-12">

          {/* ── Workflow ── */}
          <section id="how-it-works">
            <p className="text-[11px] uppercase tracking-widest font-semibold text-brand-400 mb-1">
              How it works
            </p>
            <h2 className="text-xl font-bold text-white mb-7">
              From alarm to action — in minutes.
            </h2>

            {/* Step 1 */}
            <div className="mb-8">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                  1
                </div>
                <p className="text-[13px] font-semibold text-white">Continuous monitoring</p>
              </div>
              <p className="text-xs text-brand-300 leading-relaxed mb-4 pl-[29px]">
                Sensors report in every 30 seconds. You set the temperature limits per
                device — CoolResponse watches around the clock, across every room and
                every site.
              </p>
              <TempChart />
            </div>

            {/* Step connector */}
            <div className="flex pl-[9px] mb-8">
              <div className="w-[2px] h-6 bg-gradient-to-b from-brand-600/70 to-transparent rounded-full" />
            </div>

            {/* Step 2 */}
            <div className="mb-8">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                  2
                </div>
                <p className="text-[13px] font-semibold text-white">Instant SMS alert</p>
              </div>
              <p className="text-xs text-brand-300 leading-relaxed mb-5 pl-[29px]">
                The moment a threshold is crossed, the right people get a plain-text SMS
                with full context and a clear response menu — no app to download, no
                account to log in to.
              </p>
              <PhoneMockup />
            </div>

            {/* Step connector */}
            <div className="flex pl-[9px] mb-8">
              <div className="w-[2px] h-6 bg-gradient-to-b from-brand-600/70 to-transparent rounded-full" />
            </div>

            {/* Step 3 */}
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                  3
                </div>
                <p className="text-[13px] font-semibold text-white">Dispatch & resolve</p>
              </div>
              <p className="text-xs text-brand-300 leading-relaxed mb-4 pl-[29px]">
                Replying triggers an automated workflow. A certified technician heads to
                site, or portable cooling units are dispatched — your choice, instantly
                actioned and tracked end-to-end.
              </p>
              <ResponseCards />
            </div>
          </section>

          {/* ── Built for ── */}
          <section>
            <h2 className="text-[11px] uppercase tracking-widest font-semibold text-brand-400 mb-3">
              Built for
            </h2>
            <ul className="space-y-2.5">
              {[
                'Aged care & nursing homes — resident safety',
                'Convenience & grocery retail — prevent spoilage, protect stock',
                'Childcare, healthcare & critical facilities',
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-brand-100">
                  <CheckCircle size={14} className="text-brand-400 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* ── Trust signals ── */}
          <section id="security" className="pt-6 border-t border-white/10">
            <div className="flex flex-wrap gap-x-6 gap-y-2.5">
              {[
                { icon: LayoutDashboard, label: 'Designed for multi-site operations' },
                { icon: Users,           label: 'Role-based access: Admin, Manager, Vendor' },
                { icon: Shield,          label: 'Secure by design (demo environment)' },
              ].map(t => (
                <div key={t.label} className="flex items-center gap-1.5 text-xs text-brand-300">
                  <t.icon size={12} className="text-brand-400 flex-shrink-0" />
                  {t.label}
                </div>
              ))}
            </div>
          </section>

        </div>{/* end space-y body */}
      </div>{/* end inner relative */}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [email, setEmail]                       = useState('admin@demo.com')
  const [password, setPassword]                 = useState('password123')
  const [showPassword, setShowPassword]         = useState(false)
  const [error, setError]                       = useState('')
  const [showDemoAccounts, setShowDemoAccounts] = useState(false)
  const { login }  = useApp()
  const navigate   = useNavigate()

  // Auth logic — unchanged
  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    const result = login(email, password)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError('Invalid email or password')
    }
  }

  const handleQuickLogin = (quickEmail) => {
    setEmail(quickEmail)
    setPassword('password123')
    setShowDemoAccounts(false)
    const result = login(quickEmail, 'password123')
    if (result.success) navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Top nav ──────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-20 h-14 bg-brand-950/95 backdrop-blur-sm border-b border-white/[0.06]">
        <div className="max-w-screen-xl mx-auto h-full px-5 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wind size={18} className="text-brand-400" />
            <span className="text-white font-bold text-[15px] tracking-tight">CoolResponse</span>
          </div>
          <div className="flex items-center gap-3 md:gap-5">
            {/* Desktop nav links */}
            <a href="#how-it-works" className="hidden md:block text-sm text-brand-300 hover:text-white transition-colors">
              How it works
            </a>
            <a href="#security" className="hidden md:block text-sm text-brand-300 hover:text-white transition-colors">
              Security
            </a>
            {/* Sign-in CTA — mobile shows text link, desktop shows button */}
            <a href="#login" className="md:hidden text-sm font-semibold text-brand-300 hover:text-white transition-colors">
              Sign in ↑
            </a>
            <a
              href="#login"
              className="hidden md:block text-[13px] font-semibold bg-brand-600 hover:bg-brand-500 text-white px-4 py-1.5 rounded-lg transition-colors"
            >
              Sign in
            </a>
          </div>
        </div>
      </nav>

      {/* ── Layout ───────────────────────────────────────────────────────────────
           flex-col-reverse: on mobile (single column) the DOM-second child (login)
           floats to the TOP visually — login is immediately visible without scrolling.
           md:flex-row: side-by-side from 768 px upward.
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col-reverse md:flex-row min-h-screen pt-14">

        {/* Left: marketing — visually below login on mobile, left column on md+ */}
        <div className="md:flex-1 overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800
                        px-5 py-10 sm:px-8 md:px-10 lg:px-14 lg:py-16">
          <MarketingPanel />
        </div>

        {/* Right: login — visually first on mobile (col-reverse), right column + sticky on md+ */}
        <div
          id="login"
          className="md:w-[370px] lg:w-[460px] xl:w-[500px] bg-gray-50
                     flex items-center justify-center
                     px-5 py-10 sm:px-8
                     md:sticky md:top-14 md:h-[calc(100vh-3.5rem)]"
        >
          <div className="w-full max-w-sm">

            {/* Login card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7 sm:p-8">

              {/* Card header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                    <Wind size={15} className="text-white" />
                  </div>
                  <span className="text-[13px] font-bold text-gray-900 tracking-tight">
                    CoolResponse
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Sign in</h2>
                <p className="text-sm text-gray-500 mt-0.5">Use your CoolResponse account</p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="cr-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email address
                  </label>
                  <input
                    id="cr-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none transition
                               focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="you@company.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="cr-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="cr-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm pr-10 outline-none transition
                                 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="Enter password"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                                 hover:text-gray-600 focus:outline-none focus:text-brand-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2.5 rounded-lg"
                  >
                    <span className="mt-px w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      !
                    </span>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full btn-primary py-2.5 text-sm font-semibold mt-1"
                >
                  Sign in
                </button>
              </form>

              {/* Demo accounts accordion */}
              <div className="mt-5 pt-5 border-t border-gray-100">
                <button
                  onClick={() => setShowDemoAccounts(v => !v)}
                  className="w-full flex items-center justify-between text-sm text-gray-500 hover:text-gray-800 transition-colors group"
                  aria-expanded={showDemoAccounts}
                  aria-controls="demo-accounts-list"
                >
                  <span className="font-medium">Demo accounts</span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 group-hover:text-gray-600 transition-transform duration-200 ${showDemoAccounts ? 'rotate-180' : ''}`}
                  />
                </button>

                {showDemoAccounts && (
                  <div id="demo-accounts-list" className="mt-2.5 space-y-0.5">
                    {quickLogins.map(q => (
                      <button
                        key={q.email}
                        onClick={() => handleQuickLogin(q.email)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                                   hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 leading-tight">{q.label}</p>
                          <div className="flex items-center">
                            <p className="text-xs text-gray-400 truncate">{q.email}</p>
                            <CopyButton text={q.email} />
                          </div>
                        </div>
                        <span className="ml-2 flex-shrink-0 text-[11px] font-medium bg-brand-50 text-brand-700 border border-brand-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                          {q.role}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Demo disclaimer */}
            <p className="mt-5 text-center text-xs text-gray-400 leading-relaxed px-2">
              Demo prototype &mdash; notifications and dispatch are simulated for proof-of-concept.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
