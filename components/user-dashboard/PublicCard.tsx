"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  cardPublicSlug,
  cardPublicUrl,
  getCardProfile,
  type HexaCardProfile,
} from "@/lib/card-profile";
import { getAuthUser } from "@/lib/auth";
import ProfileBanner from "./ProfileBanner";

export default function PublicCard() {
  const params = useParams();
  const slugParam = String(params?.cardSlug ?? params?.slug ?? "");
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<HexaCardProfile | null>(null);
  const [userName, setUserName] = useState("HexaCards User");

  useEffect(() => {
    const auth = getAuthUser();
    const stored = getCardProfile(auth?.name, auth?.phone);
    setUserName(auth?.name || stored.contact.cardName || "HexaCards User");
    setProfile(stored);
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F5F7]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#BC7C10]/25 border-t-[#BC7C10]" />
          <p className="mt-3 text-sm font-medium text-[#5c5346]">
            Loading card…
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F4F5F7] px-4 text-center">
        <p className="text-sm font-semibold text-[#141414]">Card not found</p>
        <Link
          href="/"
          className="rounded-lg bg-[#141414] px-4 py-2.5 text-sm font-semibold text-white"
        >
          Back to home
        </Link>
      </div>
    );
  }

  const actualSlug = cardPublicSlug(profile);
  const slugMismatch = slugParam && slugParam !== actualSlug;

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-4">
        <Link
          href="/dashboard/edit-card"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5c5346] hover:text-[#141414]"
        >
          <ArrowLeft className="h-4 w-4" />
          Edit card
        </Link>
        <p className="truncate font-mono text-[11px] text-[#8a8174]">
          {cardPublicUrl(profile)}
        </p>
      </div>

      {slugMismatch ? (
        <p className="mx-auto mb-3 max-w-lg px-4 text-center text-xs text-[#9a650d]">
          Showing your saved Hexa card profile.
        </p>
      ) : null}

      <div className="mx-auto max-w-lg px-3 pb-10 sm:px-4">
        <ProfileBanner
          profile={profile}
          userName={userName}
          slug={actualSlug}
          compact={false}
        />
      </div>
    </div>
  );
}
