"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { DonorCard } from "@/components/donors/DonorCard";
import { Pagination } from "@/components/shared/Pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  type Donor,
  type PaginatedResponse,
  BloodGroup,
  District,
  BLOOD_GROUPS,
  DISTRICTS,
} from "@/types/shared";
import {
  Search,
  X,
  UserPlus,
  Phone,
  PhoneCall,
  Copy,
  Check,
  ShieldCheck,
  MapPin,
  Sparkles,
  Users,
  RotateCcw,
  MessageSquare,
  AlertCircle,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
import { getCompatibleDonors } from "@/lib/constants/compatibility";
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";

async function requestContactInfo(
  donorId: string,
): Promise<{ phone: string; email?: string }> {
  const response = await apiFetch(`/api/donors/${donorId}/request-contact`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to request contact information");
  }

  const result = await response.json();
  return result.data;
}

type DonorDirectoryContentProps = {
  initialData: PaginatedResponse<Donor>;
  initialFilters: {
    bloodGroups: BloodGroup[];
    districts: District[];
    search: string;
  };
  initialPage: number;
};

export default function DonorDirectoryContent({
  initialData,
  initialFilters,
  initialPage,
}: DonorDirectoryContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // Filter state
  const [selectedBloodGroups, setSelectedBloodGroups] = React.useState<BloodGroup[]>(
    initialFilters.bloodGroups,
  );
  const [selectedDistrict, setSelectedDistrict] = React.useState<string>(
    initialFilters.districts[0] || "",
  );
  const [searchQuery, setSearchQuery] = React.useState<string>(initialFilters.search);
  const [recipientGroup, setRecipientGroup] = React.useState<string>("");

  // Contact Modal State
  const [activeModalDonor, setActiveModalDonor] = React.useState<Donor | null>(null);
  const [unmaskedContact, setUnmaskedContact] = React.useState<{
    phone: string;
    email?: string;
  } | null>(null);
  const [isRequestingContact, setIsRequestingContact] = React.useState(false);
  const [copiedPhone, setCopiedPhone] = React.useState(false);

  // Sync state when props change
  React.useEffect(() => {
    setSelectedBloodGroups(initialFilters.bloodGroups);
    setSelectedDistrict(initialFilters.districts[0] || "");
    setSearchQuery(initialFilters.search);
  }, [initialFilters]);

  // Apply filters via Next.js router
  const applyFilters = React.useCallback(
    (params: {
      bloodGroups?: BloodGroup[];
      district?: string;
      search?: string;
      page?: number;
    }) => {
      const query = new URLSearchParams();

      const bgs = params.bloodGroups !== undefined ? params.bloodGroups : selectedBloodGroups;
      const dist = params.district !== undefined ? params.district : selectedDistrict;
      const search = params.search !== undefined ? params.search : searchQuery;
      const p = params.page !== undefined ? params.page : 1;

      if (bgs.length > 0) {
        bgs.forEach((bg) => query.append("bloodGroup", bg));
      }
      if (dist) {
        query.append("district", dist);
      }
      if (search.trim()) {
        query.set("search", search.trim());
      }
      if (p > 1) {
        query.set("page", p.toString());
      }

      const queryString = query.toString();
      router.push(queryString ? `/donors?${queryString}` : "/donors");
    },
    [router, selectedBloodGroups, selectedDistrict, searchQuery],
  );

  // Blood group quick toggle
  const handleBloodGroupToggle = (bg: BloodGroup) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    setRecipientGroup(""); // Clear recipient mode if manually selecting
    let newGroups: BloodGroup[];
    if (selectedBloodGroups.includes(bg)) {
      newGroups = selectedBloodGroups.filter((g) => g !== bg);
    } else {
      newGroups = [...selectedBloodGroups, bg];
    }
    setSelectedBloodGroups(newGroups);
    applyFilters({ bloodGroups: newGroups, page: 1 });
  };

  // Recipient compatibility mode helper
  const handleRecipientGroupSelect = (recGroup: string) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.MEDIUM);
    setRecipientGroup(recGroup);
    if (!recGroup) {
      setSelectedBloodGroups([]);
      applyFilters({ bloodGroups: [], page: 1 });
      return;
    }
    const compatibleDonors = getCompatibleDonors(recGroup as BloodGroup);
    setSelectedBloodGroups(compatibleDonors);
    applyFilters({ bloodGroups: compatibleDonors, page: 1 });
  };

  // District selector
  const handleDistrictChange = (dist: string) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    setSelectedDistrict(dist);
    applyFilters({ district: dist, page: 1 });
  };

  // Search input handler with debounce
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    applyFilters({ search: searchQuery, page: 1 });
  };

  // Reset all filters
  const handleResetFilters = () => {
    triggerTactileFeedback(HAPTIC_PATTERNS.MEDIUM);
    setSelectedBloodGroups([]);
    setSelectedDistrict("");
    setSearchQuery("");
    setRecipientGroup("");
    router.push("/donors");
  };

  // Handle contact request
  const handleRequestContact = async (donor: Donor) => {
    if (!session?.user) {
      toast.error("Sign-in Required", {
        description: "Please sign in with a verified account to view donor contact numbers.",
      });
      router.push(`/signin?callbackUrl=${encodeURIComponent("/donors")}`);
      return;
    }

    setActiveModalDonor(donor);
    setIsRequestingContact(true);

    try {
      const contact = await requestContactInfo(donor._id);
      setUnmaskedContact(contact);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to retrieve verified contact.",
      );
      setActiveModalDonor(null);
    } finally {
      setIsRequestingContact(false);
    }
  };

  // Copy phone number to clipboard
  const handleCopyPhone = (phone: string) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.SUCCESS);
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    toast.success("Phone number copied to clipboard");
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const hasActiveFilters =
    selectedBloodGroups.length > 0 ||
    Boolean(selectedDistrict) ||
    Boolean(searchQuery) ||
    Boolean(recipientGroup);

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-16">
      {/* Registry Hero Header */}
      <section className="border-b border-border/70 bg-card/60 backdrop-blur-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-teal/10 text-teal border border-teal/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal" />
                </span>
                <span>Live Bangladesh Donor Registry</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Verified Blood Donors
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                Connect directly with biologically verified volunteer blood donors across all 64 districts. Real-time eligibility tracking ensures safe and rapid transfusions.
              </p>
            </div>

            {/* Registry Telemetry Stats & Action */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3.5 border border-border/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-mono text-xl font-bold tabular-nums text-foreground">
                    {initialData.totalCount}
                  </div>
                  <div className="text-[11px] text-muted-foreground uppercase font-mono tracking-wider">
                    Registered Donors
                  </div>
                </div>
              </div>

              <Link
                href="/profile"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                <UserPlus className="h-4 w-4" />
                <span>Join Donor Registry</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Command & Filter Strip */}
      <section className="sticky top-14 z-20 border-b border-border/80 bg-background/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 space-y-3.5">
          {/* Edge-to-Edge Blood Group Quick Selection Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-mono font-medium text-muted-foreground shrink-0 mr-1 hidden sm:inline">
              Blood Group:
            </span>

            <button
              type="button"
              onClick={() => {
                triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
                setSelectedBloodGroups([]);
                setRecipientGroup("");
                applyFilters({ bloodGroups: [], page: 1 });
              }}
              className={`h-9 px-3.5 rounded-xl text-xs font-mono font-bold shrink-0 transition-all cursor-pointer ${
                selectedBloodGroups.length === 0 && !recipientGroup
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60"
              }`}
            >
              ALL GROUPS
            </button>

            {BLOOD_GROUPS.map((bg) => {
              const isSelected = selectedBloodGroups.includes(bg);
              return (
                <button
                  key={bg}
                  type="button"
                  onClick={() => handleBloodGroupToggle(bg)}
                  className={`h-9 px-3.5 rounded-xl text-xs font-mono font-bold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs scale-105"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60"
                  }`}
                >
                  {bg}
                </button>
              );
            })}
          </div>

          {/* Secondary Controls Bar: Compatibility Mode, District, Search, Reset */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Recipient Compatibility Mode Dropdown */}
            <div className="lg:col-span-4 relative">
              <select
                value={recipientGroup}
                onChange={(e) => handleRecipientGroupSelect(e.target.value)}
                className="w-full h-10 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer"
              >
                <option value="">🎯 Filter by Recipient Blood Group...</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    Compatible Donors for Recipient ({bg})
                  </option>
                ))}
              </select>
            </div>

            {/* 64-District Selector */}
            <div className="lg:col-span-3 relative">
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full h-10 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer"
              >
                <option value="">📍 All 64 Districts</option>
                {DISTRICTS.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="lg:col-span-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search donor by name or keyword..."
                className="w-full h-10 rounded-xl border border-border bg-card pl-9 pr-8 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    applyFilters({ search: "", page: 1 });
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </form>

            {/* Reset Filters CTA */}
            <div className="lg:col-span-1 flex justify-end">
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="h-10 w-full lg:w-10 rounded-xl border border-border bg-muted/50 hover:bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="Reset all filters"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="lg:hidden ml-2">Reset Filters</span>
                </button>
              ) : (
                <div className="h-10 w-10 hidden lg:block" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-8">
        {/* Active Filter Indicators Summary */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-border/60">
            <span className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              Active Filters:
            </span>

            {recipientGroup && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-primary/10 text-primary border border-primary/20 font-mono font-medium">
                Recipient: {recipientGroup}
                <button
                  type="button"
                  onClick={() => handleRecipientGroupSelect("")}
                  className="hover:opacity-75 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedBloodGroups.length > 0 && !recipientGroup && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-muted text-foreground border border-border font-mono font-medium">
                Groups: {selectedBloodGroups.join(", ")}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBloodGroups([]);
                    applyFilters({ bloodGroups: [], page: 1 });
                  }}
                  className="hover:opacity-75 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedDistrict && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-muted text-foreground border border-border font-medium">
                District: {selectedDistrict}
                <button
                  type="button"
                  onClick={() => handleDistrictChange("")}
                  className="hover:opacity-75 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-muted text-foreground border border-border font-medium">
                &ldquo;{searchQuery}&rdquo;
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    applyFilters({ search: "", page: 1 });
                  }}
                  className="hover:opacity-75 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-primary hover:underline ml-auto font-medium cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Empty State */}
        {initialData.data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border border-dashed border-border bg-card/40 my-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
              <Users className="h-8 w-8" />
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-2">
              No Registered Donors Found
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
              {hasActiveFilters
                ? "No verified donors matched your current filter criteria. Try expanding your search to neighboring districts or compatible blood groups."
                : "There are currently no active registered blood donors in the directory."}
            </p>

            {hasActiveFilters ? (
              <Button onClick={handleResetFilters} variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                <span>Reset All Filters</span>
              </Button>
            ) : (
              <Link
                href="/profile"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
              >
                <UserPlus className="h-4 w-4" />
                <span>Be the First Donor to Register</span>
              </Link>
            )}
          </div>
        )}

        {/* Results Grid */}
        {initialData.data.length > 0 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {initialData.data.map((donor, index) => (
                <DonorCard
                  key={donor._id}
                  donor={donor}
                  staggerIndex={index}
                  onRequestContact={handleRequestContact}
                  isRequestingContact={
                    isRequestingContact && activeModalDonor?._id === donor._id
                  }
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {initialData.totalPages > 1 && (
              <div className="pt-4 border-t border-border/60">
                <Pagination
                  metadata={{
                    page: initialData.page,
                    limit: initialData.limit,
                    totalPages: initialData.totalPages,
                    totalCount: initialData.totalCount,
                    hasNextPage: initialData.hasNextPage,
                    hasPrevPage: initialData.hasPrevPage,
                  }}
                  onPageChange={(newPage) => applyFilters({ page: newPage })}
                  showTotalCount={true}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Verified Contact Details Dialog */}
      <Dialog
        open={Boolean(activeModalDonor && unmaskedContact)}
        onOpenChange={(open) => {
          if (!open) {
            setActiveModalDonor(null);
            setUnmaskedContact(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-teal mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>VERIFIED DONOR CONTACT DISCLOSURE</span>
            </div>
            <DialogTitle className="font-heading text-xl font-bold">
              {activeModalDonor?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Direct contact details retrieved for legitimate medical blood donation coordination.
            </DialogDescription>
          </DialogHeader>

          {activeModalDonor && unmaskedContact && (
            <div className="space-y-4 py-2">
              {/* Donor Meta Summary */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm bg-primary text-primary-foreground px-2.5 py-1 rounded-lg">
                    {activeModalDonor.bloodGroup}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-teal" />
                    <span>{activeModalDonor.district}</span>
                  </div>
                </div>
                <span className="text-[11px] text-teal font-medium">Ready for Outreach</span>
              </div>

              {/* Phone Number Display & Fast Copy */}
              <div className="rounded-xl border border-border/80 bg-card p-4 space-y-2 text-center">
                <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                  Direct Mobile Number
                </div>
                <div className="font-mono text-2xl font-bold tracking-wider text-foreground">
                  {unmaskedContact.phone}
                </div>
                {unmaskedContact.email && (
                  <div className="text-xs font-mono text-muted-foreground">
                    {unmaskedContact.email}
                  </div>
                )}
              </div>

              {/* Instant Call & Messaging Action Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`tel:${unmaskedContact.phone}`}
                  onClick={() => triggerTactileFeedback(HAPTIC_PATTERNS.SUCCESS)}
                  className="h-11 rounded-xl bg-teal text-paper font-semibold text-xs flex items-center justify-center gap-2 hover:bg-teal/90 shadow-xs transition-transform active:scale-[0.98]"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>Call Donor</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopyPhone(unmaskedContact.phone)}
                  className="h-11 rounded-xl border border-border bg-card font-semibold text-xs text-foreground flex items-center justify-center gap-2 hover:bg-muted/60 shadow-xs transition-transform active:scale-[0.98] cursor-pointer"
                >
                  {copiedPhone ? (
                    <>
                      <Check className="h-4 w-4 text-teal" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-muted-foreground" />
                      <span>Copy Number</span>
                    </>
                  )}
                </button>
              </div>

              {/* Protocol Security Notice */}
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 flex items-start gap-2.5 text-[11px] text-amber-700 dark:text-amber-400">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Security & Ethics Notice:</strong> All contact disclosures are logged. Contact donors strictly for urgent, legitimate medical blood donation coordination.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActiveModalDonor(null);
                setUnmaskedContact(null);
              }}
              className="w-full text-xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

