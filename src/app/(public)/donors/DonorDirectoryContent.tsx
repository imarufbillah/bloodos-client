"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  PhoneCall,
  Copy,
  Check,
  ShieldCheck,
  MapPin,
  Users,
  RotateCcw,
  AlertCircle,
  Filter,
  SlidersHorizontal,
  ChevronDown,
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
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);

  // Contact Modal State
  const [activeModalDonor, setActiveModalDonor] = React.useState<Donor | null>(null);
  const [unmaskedContact, setUnmaskedContact] = React.useState<{
    phone: string;
    email?: string;
  } | null>(null);
  const [isRequestingContact, setIsRequestingContact] = React.useState(false);
  const [copiedPhone, setCopiedPhone] = React.useState(false);

  // Sync state when initialFilters change
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
      const bgs = params.bloodGroups !== undefined ? params.bloodGroups : selectedBloodGroups;
      const dist = params.district !== undefined ? params.district : selectedDistrict;
      const search = params.search !== undefined ? params.search : searchQuery;
      const p = params.page !== undefined ? params.page : 1;

      const query = new URLSearchParams();
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
    setRecipientGroup("");
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

  // Search input handler
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

  const activeFilterCount =
    (selectedBloodGroups.length > 0 ? selectedBloodGroups.length : 0) +
    (selectedDistrict ? 1 : 0) +
    (recipientGroup ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const hasActiveFilters =
    selectedBloodGroups.length > 0 ||
    Boolean(selectedDistrict) ||
    Boolean(searchQuery) ||
    Boolean(recipientGroup);

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-16">
      {/* Page Header */}
      <section className="border-b border-border/70 bg-card/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Verified Blood Donors
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
                {initialData.totalCount} active volunteer donors across 64 districts in Bangladesh.
              </p>
            </div>

            <Link
              href={session?.user ? "/profile" : "/signup"}
              prefetch={false}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98] self-start sm:self-auto"
            >
              <UserPlus className="h-4 w-4" />
              <span>Register as a Donor</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Filter Toolbar */}
      <section className="sticky top-14 sm:top-16 z-20 border-b border-border bg-card/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 space-y-2.5">
          {/* Main Bar: Keyword Search + Filter Toggle Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* Keyword Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1" role="search">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search verified donors by name..."
                aria-label="Search donors by name"
                className="w-full h-10 pl-9 pr-9 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    applyFilters({ search: "", page: 1 });
                  }}
                  aria-label="Clear search input"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg hover:bg-muted/60"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </form>

            {/* Filter Toggle Button */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant={isFiltersOpen ? "secondary" : "outline"}
                size="default"
                onClick={() => {
                  triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
                  setIsFiltersOpen(!isFiltersOpen);
                }}
                aria-expanded={isFiltersOpen}
                aria-controls="donors-filter-panel"
                className={`h-10 px-3.5 rounded-xl text-xs font-semibold gap-2 border-border shadow-xs transition-all cursor-pointer ${
                  hasActiveFilters ? "border-primary/50 text-foreground bg-primary/5" : ""
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="flex items-center justify-center h-4.5 px-1.5 rounded-full bg-crimson text-white text-[10px] font-mono font-bold leading-none">
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown
                  className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
                    isFiltersOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              <div className="hidden sm:flex items-center text-[11px] font-mono text-muted-foreground pl-2 border-l border-border/60">
                <span>
                  <strong className="text-foreground font-bold">{initialData.totalCount}</strong> donors
                </span>
              </div>
            </div>
          </div>

          {/* Active Filters Summary (When collapsed) */}
          {!isFiltersOpen && hasActiveFilters && (
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap overflow-hidden">
                <span className="text-[11px] font-mono text-muted-foreground">Active:</span>
                {recipientGroup && (
                  <span className="px-2 py-0.5 rounded-md bg-primary/15 text-primary text-[11px] font-mono font-bold">
                    Recipient: {recipientGroup}
                  </span>
                )}
                {selectedBloodGroups.length > 0 && !recipientGroup && (
                  <span className="px-2 py-0.5 rounded-md bg-crimson/15 text-crimson text-[11px] font-mono font-bold">
                    {selectedBloodGroups.join(", ")}
                  </span>
                )}
                {selectedDistrict && (
                  <span className="px-2 py-0.5 rounded-md bg-muted text-foreground text-[11px] font-mono">
                    {selectedDistrict}
                  </span>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-7 px-2 text-[11px] font-semibold text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 rounded-md shrink-0 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </Button>
            </div>
          )}

          {/* Collapsible Filter Panel */}
          {isFiltersOpen && (
            <div
              id="donors-filter-panel"
              className="pt-3 border-t border-border/60 space-y-3 animate-in fade-in-0 slide-in-from-top-2 duration-150"
            >
              {/* Blood Group Selection Chips */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground hidden sm:inline shrink-0">
                  Blood Group:
                </span>
                <div
                  role="group"
                  aria-label="Filter by donor blood group"
                  className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border/60 shrink-0"
                >
                  <button
                    type="button"
                    onClick={() => {
                      triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
                      setSelectedBloodGroups([]);
                      setRecipientGroup("");
                      applyFilters({ bloodGroups: [], page: 1 });
                    }}
                    aria-pressed={selectedBloodGroups.length === 0 && !recipientGroup}
                    className={`h-8 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer select-none shrink-0 ${
                      selectedBloodGroups.length === 0 && !recipientGroup
                        ? "bg-primary text-primary-foreground shadow-xs font-black"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    ALL
                  </button>

                  {BLOOD_GROUPS.map((bg) => {
                    const isSelected = selectedBloodGroups.includes(bg);
                    return (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => handleBloodGroupToggle(bg)}
                        aria-pressed={isSelected}
                        aria-label={`Blood group ${bg}`}
                        className={`h-8 px-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer select-none shrink-0 ${
                          isSelected
                            ? "bg-crimson text-white shadow-xs font-black"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        }`}
                      >
                        {bg}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Secondary Controls: Cross-Match Compatibility + District + Reset */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-border/40">
                <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2">
                  {/* Recipient Cross-Match Selector */}
                  <div className="w-full sm:w-60">
                    <Select
                      value={recipientGroup || "all"}
                      onValueChange={(val) => handleRecipientGroupSelect(val === "all" ? "" : (val || ""))}
                    >
                      <SelectTrigger className="h-9 w-full rounded-xl text-xs bg-background border-border/80 shadow-xs">
                        <SelectValue placeholder="Cross-Match for Recipient..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Recipient (Direct Match)</SelectItem>
                        {BLOOD_GROUPS.map((bg) => (
                          <SelectItem key={bg} value={bg}>
                            Recipient: {bg} (Compatible Donors)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* District Select */}
                  <div className="w-full sm:w-48">
                    <Select
                      value={selectedDistrict || "all"}
                      onValueChange={(val) => handleDistrictChange(val === "all" ? "" : (val || ""))}
                    >
                      <SelectTrigger className="h-9 w-full rounded-xl text-xs bg-background border-border/80 shadow-xs">
                        <SelectValue placeholder="All 64 Districts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All 64 Districts</SelectItem>
                        {DISTRICTS.map((dist) => (
                          <SelectItem key={dist} value={dist}>
                            {dist}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Result count & Reset */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0">
                  <span className="text-[11px] font-mono text-muted-foreground sm:hidden">
                    Showing <strong className="text-foreground font-bold">{initialData.totalCount}</strong> active donors
                  </span>

                  {hasActiveFilters && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleResetFilters}
                      className="h-8 px-2.5 text-xs font-semibold text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 rounded-lg cursor-pointer"
                      aria-label="Reset all applied filters"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Reset Filters</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Donor List */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        {/* Active Filter Indicators */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 mb-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-mono">
              <Filter className="h-3 w-3" /> Active Filters:
            </span>

            {recipientGroup && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-mono">
                Recipient: {recipientGroup}
                <button
                  type="button"
                  onClick={() => handleRecipientGroupSelect("")}
                  aria-label={`Remove recipient ${recipientGroup} filter`}
                  className="hover:opacity-75"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedBloodGroups.length > 0 && !recipientGroup && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border font-mono">
                Groups: {selectedBloodGroups.join(", ")}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBloodGroups([]);
                    applyFilters({ bloodGroups: [], page: 1 });
                  }}
                  aria-label="Remove blood group filter"
                  className="hover:opacity-75"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedDistrict && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border">
                District: {selectedDistrict}
                <button
                  type="button"
                  onClick={() => handleDistrictChange("")}
                  aria-label={`Remove ${selectedDistrict} district filter`}
                  className="hover:opacity-75"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border">
                &ldquo;{searchQuery}&rdquo;
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    applyFilters({ search: "", page: 1 });
                  }}
                  aria-label="Remove search filter"
                  className="hover:opacity-75"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-primary hover:underline ml-2 font-medium cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Empty State */}
        {initialData.data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-border bg-card/40 my-4">
            <Users className="h-10 w-10 text-muted-foreground/60 mb-3" />
            <h2 className="font-heading text-lg font-bold text-foreground mb-1">
              {hasActiveFilters ? "No Matching Donors Found" : "No Donors Registered Yet"}
            </h2>
            <p className="text-xs text-muted-foreground max-w-sm mb-4 leading-relaxed">
              {hasActiveFilters
                ? "No verified donors matched your current filter criteria. Try expanding your search to neighboring districts or clearing some filters."
                : "There are currently no active registered blood donors in the directory."}
            </p>

            {hasActiveFilters ? (
              <Button onClick={handleResetFilters} variant="outline" size="sm" className="gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Clear All Filters</span>
              </Button>
            ) : (
              <Link
                href={session?.user ? "/profile" : "/signup"}
                prefetch={false}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Register as a Donor</span>
              </Link>
            )}
          </div>
        )}

        {/* Results Grid */}
        {initialData.data.length > 0 && (
          <div className="space-y-6">
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
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-teal mb-0.5">
              <ShieldCheck className="h-4 w-4" />
              <span>VERIFIED DONOR CONTACT</span>
            </div>
            <DialogTitle className="font-heading text-lg font-bold">
              {activeModalDonor?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Direct contact retrieved for medical blood donation coordination.
            </DialogDescription>
          </DialogHeader>

          {activeModalDonor && unmaskedContact && (
            <div className="space-y-4 py-1">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm bg-primary text-primary-foreground px-2 py-0.5 rounded-md">
                    {activeModalDonor.bloodGroup}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-teal" />
                    <span>{activeModalDonor.district}</span>
                  </div>
                </div>
                <span className="text-[11px] text-teal font-medium">Verified Donor</span>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center space-y-1">
                <div className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider">
                  Direct Phone Number
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

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${unmaskedContact.phone}`}
                  onClick={() => triggerTactileFeedback(HAPTIC_PATTERNS.SUCCESS)}
                  aria-label={`Call donor directly at ${unmaskedContact.phone}`}
                  className="h-10 rounded-lg bg-teal text-paper font-semibold text-xs flex items-center justify-center gap-2 hover:bg-teal/90 transition-transform active:scale-[0.98]"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>Call Donor</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopyPhone(unmaskedContact.phone)}
                  aria-label="Copy phone number to clipboard"
                  className="h-10 rounded-lg border border-border bg-card font-semibold text-xs text-foreground flex items-center justify-center gap-2 hover:bg-muted/60 transition-transform active:scale-[0.98] cursor-pointer"
                >
                  {copiedPhone ? (
                    <>
                      <Check className="h-4 w-4 text-teal" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-muted-foreground" />
                      <span>Copy Number</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-lg bg-muted/50 border border-border p-2.5 flex items-start gap-2 text-[11px] text-muted-foreground">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-500" />
                <p className="leading-relaxed">
                  <strong>Privacy & Safety Notice:</strong> All disclosures are logged. Contact donors strictly for urgent medical blood donation coordination.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveModalDonor(null);
                setUnmaskedContact(null);
              }}
              className="w-full text-xs"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

