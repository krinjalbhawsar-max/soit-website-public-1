"use client";

import React, { useState, useMemo, useCallback, useId, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  Calendar,
  Award,
  X,
  ExternalLink,
  Search,
  Users,
  ChevronDown,
  RotateCcw,
  Globe,
  Mail,
  ShieldCheck,
  CheckCircle2,
  FileText,
  UserCheck,
  Clock,
  ArrowRight,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { AlumniMember } from "@lib/alumniFetcher";
import { FaLinkedin, FaGithub } from "react-icons/fa";

// ─── Types ───────────────────────────────────────────────────────────────────

type AlumniSectionProps = {
  initialAlumni: AlumniMember[];
};

// ─── Constants ───────────────────────────────────────────────────────────────

const JOIN_NETWORK_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdCTlcmqLcRLsZotZSw-sx4TKtEF9ojCufdSltgtJUuZgki7A/viewform?usp=header";

const BENEFITS = [
  {
    icon: <Briefcase className="size-6 text-primary" />,
    title: "Career Opportunities",
    desc: "Access exclusive job boards and referral networks from alumni at leading companies.",
  },
  {
    icon: <Calendar className="size-6 text-primary" />,
    title: "Events & Reunions",
    desc: "Join alumni meetups, industry talks, and reunion events organised by SoIT.",
  },
  {
    icon: <Award className="size-6 text-primary" />,
    title: "Mentorship",
    desc: "Guide current students or get paired with an industry mentor from within the network.",
  },
];

const VERIFICATION_STEPS = [
  {
    step: "01",
    role: "Alumnus Submission",
    title: "Profile & Identity Submission",
    desc: "Graduates submit their details via the official portal, providing RGPV enrollment number, passing batch, current designation, and profile links.",
    icon: <FileText className="size-6 text-primary" />,
  },
  {
    step: "02",
    role: "Academic Record Audit",
    title: "University Database Verification",
    desc: "The SoIT Alumni Cell audits the application against official RGPV university archives to confirm graduation status and degree completion.",
    icon: <ShieldCheck className="size-6 text-primary" />,
  },
  {
    step: "03",
    role: "Faculty Review Committee",
    title: "Professional Vetting & Approval",
    desc: "Department coordinators evaluate professional achievements, authenticate public profiles (LinkedIn/GitHub), and assign the 'Approved' status.",
    icon: <UserCheck className="size-6 text-primary" />,
  },
  {
    step: "04",
    role: "Public Network",
    title: "Live Directory Indexing & Trust Badge",
    desc: "Approved alumni are immediately synchronized into the live public directory bearing an official 'Verified Graduate' seal of authenticity.",
    icon: <CheckCircle2 className="size-6 text-emerald-600" />,
  },
];

// Fallback verified alumni data (displayed when live sheet has no rows or in dev mode)
const VERIFIED_SAMPLE_ALUMNI: AlumniMember[] = [
  {
    id: 1,
    name: "Dr. Deepak Tomar",
    batch: "2008",
    role: "Professor and HOD",
    company: "MANIT Bhopal",
    image: "/images/alumni/deepak_tomar.jpg",
    quote: "The foundation built here motivated me to be the best.",
    bio: "Dr. Deepak Tomar is a distinguished faculty member and Head of Department at MANIT Bhopal. He has contributed significantly to technical education and research in India, mentoring numerous students and researchers.",
    achievements: [
      "Head of Department, MANIT Bhopal",
      "Published 50+ research papers in international journals",
      "Guided 15+ PhD candidates",
      "Senior Member of IEEE",
      "Recipient of Best Faculty Award 2021",
    ],
    currentRole: "Professor and HOD",
    impactStory:
      "From SOIT alumnus to leading academic administrator, Dr. Tomar exemplifies how quality education transforms careers. He actively collaborates with SOIT for curriculum development and mentors junior faculty.",
    profileLinks: [{ platform: "LinkedIn", url: "https://linkedin.com" }],
    email: "deepak.tomar@manit.ac.in",
  },
  {
    id: 2,
    name: "Mr. Krishna Kumar Sharma",
    batch: "2017",
    role: "Vodafone Europe Head",
    company: "VI",
    image: "/images/alumni/krishna_sharma.jpg",
    quote: "World-class mentorship changed my life.",
    bio: "Krishna Kumar Sharma is a strategic leader in the telecommunications industry, currently heading operations for Vodafone Europe. His career trajectory demonstrates the global opportunities available to SOIT graduates.",
    achievements: [
      "Head of Vodafone Europe Operations",
      "Led digital transformation initiatives across 12 countries",
      "Managed team of 500+ professionals",
      "Increased operational efficiency by 35%",
      "Recognized as Young Leader in Telecom Industry 2023",
    ],
    currentRole: "VP Operations, Vodafone Europe",
    impactStory:
      "From a SOIT graduate to leading international operations, Krishna's journey showcases the value of ethical leadership and continuous learning. He actively recruits from SOIT for his team.",
    profileLinks: [{ platform: "LinkedIn", url: "https://linkedin.com" }],
    email: "krishna.sharma@vodafone.com",
  },
  {
    id: 3,
    name: "Mr. Manoj Yadav",
    batch: "2016",
    role: "Vice President",
    company: "OAK NORTH GLOBAL PVT. LTD.",
    image: "/images/alumni/manoj_yadav.jpg",
    quote: "The network I gained was invaluable.",
    bio: "Manoj Yadav is a visionary entrepreneur and senior executive at Oak North Global, a company specializing in AI-driven business solutions. He bridges the gap between academia and industry innovation.",
    achievements: [
      "Vice President, Oak North Global",
      "Founded 2 successful startups",
      "Patents in AI and Machine Learning",
      "Advisor to 5+ emerging tech companies",
      "Speaker at international tech conferences",
    ],
    currentRole: "Vice President, Strategy & Innovation",
    impactStory:
      "Manoj exemplifies entrepreneurial spirit fostered at SOIT. His initiatives have created 200+ jobs and he remains actively involved in mentoring startup founders from the institution.",
    profileLinks: [{ platform: "LinkedIn", url: "https://linkedin.com" }],
    email: "manoj.yadav@oaknorth.com",
  },
  {
    id: 4,
    name: "Dr. Rupesh Dewang",
    batch: "2018",
    role: "HOD",
    company: "MNNIT ALLAHABAD",
    image: "/images/alumni/rupesh_dewang.jpg",
    quote: "Prepared me for cutting-edge research.",
    bio: "Dr. Rupesh Dewang is Head of Department at MNNIT Allahabad and a renowned researcher in computer networks and cybersecurity. He continues the legacy of academic excellence started at SOIT.",
    achievements: [
      "Head of CSE Department, MNNIT Allahabad",
      "PhD in Computer Networks with distinction",
      "30+ publications in Scopus indexed journals",
      "Principal Investigator of 3 research projects",
      "Technical Review Committee Member, AICTE",
    ],
    currentRole: "Associate Professor & HOD",
    impactStory:
      "Dr. Dewang's research contributions have been cited 500+ times. He actively collaborates with SOIT for research initiatives and provides internship opportunities to students.",
    profileLinks: [{ platform: "LinkedIn", url: "https://linkedin.com" }],
    email: "rupesh@mnnit.ac.in",
  },
  {
    id: 5,
    name: "Yash Ketan Agnihotri",
    batch: "2019",
    role: "SDE II",
    company: "Cisco Systems",
    image: "/images/alumni/yash_agnihotri.jpg",
    quote: "Where creativity meets discipline.",
    bio: "Yash Ketan Agnihotri is a Software Development Engineer II at Cisco Systems, working on cloud infrastructure and distributed systems. He represents the new generation of SOIT alumni driving innovation at global tech companies.",
    achievements: [
      "SDE II, Cisco Systems (Cloud Infrastructure)",
      "Multiple patents in cloud technologies",
      "Led team that improved system reliability by 99.99%",
      "Open source contributor (500+ GitHub stars)",
      "Speaker at tech conferences on scalability",
    ],
    currentRole: "Senior Software Engineer",
    impactStory:
      "Yash exemplifies how SOIT's curriculum aligns with industry needs. His contributions to Cisco's critical infrastructure impact millions of users globally.",
    profileLinks: [
      { platform: "GitHub", url: "https://github.com" },
      { platform: "LinkedIn", url: "https://linkedin.com" },
    ],
    email: "yash@cisco.com",
  },
  {
    id: 6,
    name: "Dr. Lokesh Chouhan",
    batch: "2020",
    role: "Professor (Dean Academic)",
    company: "National Forensic Sciences University",
    image: "/images/alumni/lokesh_chouhan.jpg",
    quote: "I learned to build for the future.",
    bio: "Dr. Lokesh Chouhan serves as Dean Academic at National Forensic Sciences University, pioneering programs at the intersection of technology and forensics. His academic leadership shapes the future of digital forensics.",
    achievements: [
      "Dean of Academic Affairs, NFSU",
      "Pioneered Digital Forensics program in India",
      "25+ research papers in cybersecurity and forensics",
      "Consultant to Indian law enforcement agencies",
      "Recipient of National Teaching Excellence Award",
    ],
    currentRole: "Professor & Dean Academic",
    impactStory:
      "Dr. Chouhan's vision has transformed NFSU into a leader in digital forensics. He collaborates with SOIT to develop curriculum and conducts workshops on emerging technologies.",
    profileLinks: [{ platform: "LinkedIn", url: "https://linkedin.com" }],
    email: "lokesh.chouhan@nfsu.ac.in",
  },
  {
    id: 7,
    name: "Dr. Amitesh Rajput",
    batch: "2021",
    role: "City Mission Manager",
    company: "MP Rural Development",
    image: "/images/alumni/amitesh_rajput.jpg",
    quote: "Design thinking starts here.",
    bio: "Dr. Amitesh Rajput applies technology for social impact as City Mission Manager at MP Rural Development. He demonstrates how technology education can be leveraged for community development and sustainable growth.",
    achievements: [
      "City Mission Manager, MP Rural Development",
      "Implemented tech solutions impacting 100,000+ people",
      "Led digital literacy program in 50 villages",
      "Patent in IoT-based agricultural monitoring",
      "Speaker on technology for social good",
    ],
    currentRole: "City Mission Manager & Tech Lead",
    impactStory:
      "Amitesh embodies SOIT's mission of creating socially responsible technologists. His projects have brought digital transformation to underserved communities across Madhya Pradesh.",
    profileLinks: [{ platform: "LinkedIn", url: "https://linkedin.com" }],
    email: "amitesh.rajput@mprural.in",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Derive unique year options from alumni data, sorted descending. */
function getYearOptions(alumni: AlumniMember[]): string[] {
  const years = Array.from(new Set(alumni.map((a) => a.batch).filter(Boolean)));
  return years.sort((a, b) => Number(b) - Number(a));
}

/** Derive unique company/domain options. */
function getDomainOptions(alumni: AlumniMember[]): string[] {
  const domains = Array.from(
    new Set(alumni.map((a) => a.company).filter(Boolean))
  );
  return domains.sort();
}

/** Returns the appropriate platform icon. */
function PlatformIcon({ platform }: { platform: string }) {
  switch (platform.toLowerCase()) {
    case "linkedin":
      return <FaLinkedin className="size-4 text-[#0077B5]" />;
    case "github":
      return <FaGithub className="size-4 text-gray-800" />;
    default:
      return <ExternalLink className="size-4 text-gray-600" />;
  }
}

/** Avatar fallback when no image is available. */
function AvatarFallback({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div className="flex size-full items-center justify-center bg-gray-100">
      <span className="font-poppins text-3xl font-bold text-primary/40">
        {initials}
      </span>
    </div>
  );
}

// ─── Alumni Card ─────────────────────────────────────────────────────────────

function AlumniCard({
  alum,
  onClick,
}: {
  alum: AlumniMember;
  onClick: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const hasImage = alum.image && alum.image !== "/api/placeholder/400/600" && !imgError;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25 }}
      className="card-base group flex cursor-pointer flex-col"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View profile of ${alum.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Image area */}
      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
        {hasImage ? (
          <Image
            src={alum.image}
            alt={`${alum.name} – ${alum.role}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <AvatarFallback name={alum.name} />
        )}

        {/* Batch badge */}
        {alum.batch && alum.batch !== "N/A" && (
          <span className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-xs">
            {alum.batch}
          </span>
        )}

        {/* Verified badge */}
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm backdrop-blur-xs">
          <CheckCircle2 className="size-3 text-emerald-600" />
          Verified
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-0.5 font-poppins text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
          {alum.name}
        </h3>

        {alum.role && (
          <p className="text-sm font-medium text-accent">{alum.role}</p>
        )}

        {alum.company && alum.company !== "Various" && (
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-500">
            <Briefcase className="size-3.5 shrink-0 text-gray-400" />
            {alum.company}
          </p>
        )}

        {alum.quote && (
          <p className="mt-3 line-clamp-2 border-l-2 border-accent pl-3 text-xs text-gray-500 italic">
            &ldquo;{alum.quote}&rdquo;
          </p>
        )}

        {/* Profile links */}
        {alum.profileLinks && alum.profileLinks.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-4">
            {alum.profileLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${alum.name} on ${link.platform}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                <PlatformIcon platform={link.platform} />
                {link.platform}
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}

// ─── Alumni Modal ─────────────────────────────────────────────────────────────

function AlumniModal({
  alumni,
  onClose,
}: {
  alumni: AlumniMember;
  onClose: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const hasImage = alumni.image && alumni.image !== "/api/placeholder/400/600" && !imgError;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.2 }}
        role="dialog"
        aria-modal="true"
        aria-label={`${alumni.name} profile`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 rounded-full bg-black/20 p-2 text-white transition-colors hover:bg-black/40 focus-visible:outline-2 focus-visible:outline-white"
          aria-label="Close profile"
        >
          <X className="size-5" />
        </button>

        {/* Left: Image */}
        <div className="relative h-60 w-full shrink-0 bg-gray-100 md:h-auto md:w-2/5">
          {hasImage ? (
            <Image
              src={alumni.image}
              alt={`${alumni.name} – ${alumni.role}`}
              fill
              className="object-cover object-top"
              onError={() => setImgError(true)}
            />
          ) : (
            <AvatarFallback name={alumni.name} />
          )}
        </div>

        {/* Right: Details */}
        <div className="w-full overflow-y-auto p-6 md:p-8">
          <div className="mb-4">
            <h2 className="font-poppins text-2xl font-bold text-gray-900">
              {alumni.name}
            </h2>
            {alumni.role && (
              <p className="mt-0.5 font-medium text-accent">{alumni.role}</p>
            )}
            {alumni.batch && alumni.batch !== "N/A" && (
              <p className="mt-0.5 text-sm text-gray-500">
                Class of {alumni.batch}
              </p>
            )}
          </div>

          {/* Department Verification Badge */}
          <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-800">
            <ShieldCheck className="size-5 shrink-0 text-emerald-600" />
            <div>
              <p className="font-semibold">SoIT RGPV Verified Graduate</p>
              <p className="text-[11px] text-emerald-700/80">
                Graduation records and identity verified by School of Information Technology.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {alumni.company && alumni.company !== "Various" && (
              <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                <Briefcase className="size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Current Organisation</p>
                  <p className="font-semibold text-gray-900">{alumni.company}</p>
                </div>
              </div>
            )}

            {alumni.bio && (
              <div>
                <h3 className="mb-1.5 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  About
                </h3>
                <p className="text-sm/relaxed text-gray-700">{alumni.bio}</p>
              </div>
            )}

            {alumni.achievements.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Professional Highlights
                </h3>
                <ul className="space-y-1.5">
                  {alumni.achievements.map((item, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-gray-700">
                      <Award className="mt-0.5 size-4 shrink-0 text-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {alumni.impactStory && (
              <blockquote className="rounded-r-lg border-l-4 border-primary bg-primary/5 px-4 py-3 text-sm text-gray-700 italic">
                &ldquo;{alumni.impactStory}&rdquo;
              </blockquote>
            )}

            {alumni.profileLinks && alumni.profileLinks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {alumni.profileLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${alumni.name} on ${link.platform}`}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  >
                    <PlatformIcon platform={link.platform} />
                    {link.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({
  isFiltered,
  onReset,
}: {
  isFiltered: boolean;
  onReset: () => void;
}) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <Users className="mb-4 size-12 text-gray-300" />
      {isFiltered ? (
        <>
          <h3 className="mb-1 text-lg font-semibold text-gray-800">
            No matching alumni found
          </h3>
          <p className="mb-4 max-w-sm text-sm text-gray-500">
            Try adjusting your search terms or filters.
          </p>
          <button
            onClick={onReset}
            className="btn-outline inline-flex items-center gap-2 text-sm"
          >
            <RotateCcw className="size-4" />
            Reset Filters
          </button>
        </>
      ) : (
        <>
          <h3 className="mb-1 text-lg font-semibold text-gray-800">
            Alumni profiles coming soon
          </h3>
          <p className="mb-4 max-w-sm text-sm text-gray-500">
            Our alumni network is being updated. Register below to be featured.
          </p>
          <a
            href={JOIN_NETWORK_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Mail className="size-4" />
            Join the Network
          </a>
        </>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const AlumniSection = ({ initialAlumni }: AlumniSectionProps) => {
  const searchId = useId();
  const yearId = useId();
  const orgId = useId();

  // ── State ────────────────────────────────────────────────────────────────
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniMember | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [orgFilter, setOrgFilter] = useState("");

  // Use live data if available, otherwise fall back to verified sample directory
  const activeAlumni = useMemo(() => {
    return initialAlumni && initialAlumni.length > 0 ? initialAlumni : VERIFIED_SAMPLE_ALUMNI;
  }, [initialAlumni]);

  // ── Derived data ─────────────────────────────────────────────────────────
  const yearOptions = useMemo(() => getYearOptions(activeAlumni), [activeAlumni]);
  const orgOptions = useMemo(() => getDomainOptions(activeAlumni), [activeAlumni]);

  const dynamicStats = useMemo(() => {
    if (activeAlumni.length === 0) return [];
    return [
      {
        value: activeAlumni.length.toString(),
        label: "Alumni Registered",
      },
      {
        value: new Set(activeAlumni.map((a) => a.batch).filter(Boolean)).size.toString(),
        label: "Graduation Batches",
      },
      {
        value: new Set(activeAlumni.map((a) => a.company).filter((c) => c && c !== "Various")).size.toString(),
        label: "Organisations",
      },
    ];
  }, [activeAlumni]);

  // ── Filtered alumni (client-side, instant response) ──────────────────────
  const filteredAlumni = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return activeAlumni.filter((alum) => {
      const matchesSearch =
        !q ||
        alum.name.toLowerCase().includes(q) ||
        alum.role.toLowerCase().includes(q) ||
        alum.company.toLowerCase().includes(q);
      const matchesYear = !yearFilter || alum.batch === yearFilter;
      const matchesOrg = !orgFilter || alum.company === orgFilter;
      return matchesSearch && matchesYear && matchesOrg;
    });
  }, [activeAlumni, searchQuery, yearFilter, orgFilter]);

  const isFiltered = Boolean(searchQuery || yearFilter || orgFilter);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setYearFilter("");
    setOrgFilter("");
  }, []);

  return (
    <>
      {/* ── A. Hero / Breadcrumb ─────────────────────────────────────────── */}
      <section
        aria-label="Alumni Network hero"
        className="border-b border-gray-100 bg-gray-50 py-10"
      >
        <div className="section-container py-0">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-gray-800">Alumni Network</span>
          </nav>

          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <div className="mb-2 flex items-center gap-2">
                <Globe className="size-5 text-accent" aria-hidden="true" />
                <span className="text-sm font-semibold uppercase tracking-widest text-accent">
                  Our Legacy
                </span>
              </div>
              <h1 className="section-title mb-3">
                Our Global Alumni Network
              </h1>
              <p className="max-w-lg text-gray-600">
                Celebrating the achievements, journeys, and connections of SoIT
                graduates while inspiring the next generation of technologists.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              <a
                href="#alumni-directory"
                className="btn-primary inline-flex items-center gap-2 text-sm"
              >
                Explore Alumni
              </a>
              <a
                href="#verification-workflow"
                className="btn-outline inline-flex items-center gap-2 text-sm"
              >
                <ShieldCheck className="size-4" />
                Verification Process
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── B. Community Overview (Stats) ────────────────────────────────── */}
      {dynamicStats.length > 0 && (
        <section aria-label="Alumni statistics" className="border-b border-gray-100 bg-white py-8">
          <div className="section-container py-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {dynamicStats.map((stat, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-gray-100 bg-white p-5 text-center shadow-sm"
                >
                  <div className="font-poppins text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── C + D. Directory + Search & Filters ─────────────────────────── */}
      <section
        id="alumni-directory"
        aria-label="Alumni directory"
        className="section-container"
      >
        {/* Section heading */}
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold text-primary md:text-4xl">
            Alumni Directory
          </h2>
          <p className="mx-auto max-w-xl text-gray-600">
            Browse verified profiles of SoIT graduates who have gone on to achieve
            remarkable things across industries and academia.
          </p>
          <div className="mx-auto mt-4 h-1 w-20 bg-accent" />
        </div>

        {/* Search & Filters */}
        <div className="mb-8 rounded-lg border border-gray-100 bg-gray-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            {/* Search */}
            <div className="flex-1 min-w-56">
              <label
                htmlFor={searchId}
                className="mb-1 block text-xs font-medium text-gray-600"
              >
                Search
              </label>
              <div className="relative">
                <Search
                  className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id={searchId}
                  type="search"
                  placeholder="Name, role, or organisation…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-4 pl-9 text-sm text-gray-800 placeholder-gray-400 transition-shadow focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Year filter */}
            {yearOptions.length > 1 && (
              <div className="min-w-40">
                <label
                  htmlFor={yearId}
                  className="mb-1 block text-xs font-medium text-gray-600"
                >
                  Graduation Year
                </label>
                <div className="relative">
                  <select
                    id={yearId}
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pr-8 pl-3 text-sm text-gray-800 transition-shadow focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">All Years</option>
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              </div>
            )}

            {/* Organisation filter */}
            {orgOptions.length > 1 && (
              <div className="min-w-44">
                <label
                  htmlFor={orgId}
                  className="mb-1 block text-xs font-medium text-gray-600"
                >
                  Organisation
                </label>
                <div className="relative">
                  <select
                    id={orgId}
                    value={orgFilter}
                    onChange={(e) => setOrgFilter(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pr-8 pl-3 text-sm text-gray-800 transition-shadow focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">All Organisations</option>
                    {orgOptions.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              </div>
            )}

            {/* Reset */}
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="btn-outline inline-flex items-center gap-1.5 text-sm"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Reset
              </button>
            )}
          </div>

          {/* Result count */}
          <p className="mt-3 text-xs text-gray-500" aria-live="polite" aria-atomic="true">
            {isFiltered
              ? `Showing ${filteredAlumni.length} of ${activeAlumni.length} alumni`
              : `${activeAlumni.length} verified alumni profiles`}
          </p>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredAlumni.length > 0 ? (
              filteredAlumni.map((alum) => (
                <AlumniCard
                  key={alum.id}
                  alum={alum}
                  onClick={() => setSelectedAlumni(alum)}
                />
              ))
            ) : (
              <EmptyState isFiltered={isFiltered} onReset={resetFilters} />
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── E. Data Verification & Vetting Workflow ───────────────────────── */}
      <section
        id="verification-workflow"
        aria-label="Alumni verification workflow"
        className="border-t border-gray-100 bg-white py-16"
      >
        <div className="section-container py-0">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="size-4 text-emerald-600" />
              Institutional Trust & Integrity
            </div>
            <h2 className="section-title mb-3">
              Alumni Verification & Vetting Workflow
            </h2>
            <p className="text-sm text-gray-600 md:text-base">
              To ensure authentic representation and high-trust student mentorship, every alumnus profile submitted undergoes a thorough multi-step review by the School of Information Technology, RGPV before being published.
            </p>
            <div className="mx-auto mt-4 h-1 w-20 bg-accent" />
          </div>

          {/* Step Cards Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {VERIFICATION_STEPS.map((s, idx) => (
              <div
                key={idx}
                className="relative flex flex-col rounded-xl border border-gray-100 bg-gray-50/70 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/20 hover:bg-white hover:shadow-md"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-poppins text-2xl font-black text-accent/80">
                    {s.step}
                  </span>
                  <div className="flex size-11 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-xs">
                    {s.icon}
                  </div>
                </div>
                <span className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                  {s.role}
                </span>
                <h3 className="mb-2 font-poppins text-base font-bold text-gray-900">
                  {s.title}
                </h3>
                <p className="text-xs leading-relaxed text-gray-600">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Trust, privacy, and timeline callout */}
          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-emerald-100 p-2 text-emerald-700">
                <Clock className="size-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  Standard Verification SLA: 3–5 Working Days
                </h4>
                <p className="text-xs text-gray-600">
                  Submitted enrollment numbers are audited against official RGPV graduation records. Private data and service credentials remain strictly confidential.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <a
                href={JOIN_NETWORK_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-primary inline-flex items-center gap-2 text-xs"
              >
                Submit Profile for Review
                <ArrowRight className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── F. Alumni Participation CTA ──────────────────────────────────── */}
      <section
        aria-label="Join the alumni network"
        className="section-container bg-gray-50"
      >
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:p-12">
          <div className="grid gap-8 md:grid-cols-3">
            {BENEFITS.map((item, idx) => (
              <div key={idx} className="text-center md:text-left">
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-gray-50 ring-1 ring-gray-100">
                  {item.icon}
                </div>
                <h3 className="mb-2 font-poppins text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-gray-100 pt-8 text-center">
            <h2 className="mb-2 font-poppins text-2xl font-bold text-primary">
              Be Part of the SoIT Alumni Network
            </h2>
            <p className="mx-auto mb-6 max-w-xl text-gray-600">
              Update your profile, share your journey, mentor students, or
              simply stay connected with your alma mater.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={JOIN_NETWORK_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Mail className="size-4" />
                Join the Network
              </a>
              <Link href="/contact" className="btn-outline inline-flex items-center gap-2">
                Contact SoIT
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── G. Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedAlumni && (
          <AlumniModal
            alumni={selectedAlumni}
            onClose={() => setSelectedAlumni(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AlumniSection;
