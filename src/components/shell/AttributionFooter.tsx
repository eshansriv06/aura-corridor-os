"use client";

import React from "react";
import Link from "next/link";

export function AttributionFooter() {
  return (
    <footer className="h-8 w-full border-t border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 text-[10px] font-mono text-[var(--text-secondary)] flex items-center justify-end select-none shrink-0 z-30 mb-0">
      <div className="flex items-center space-x-3">
        <Link
          href="/privacy"
          className="hover:text-[var(--text-primary)] hover:underline transition-colors"
        >
          PRIVACY POLICY
        </Link>
        <span className="text-[var(--border-hairline)]">/</span>
        <Link
          href="/terms"
          className="hover:text-[var(--text-primary)] hover:underline transition-colors"
        >
          TERMS & CONDITIONS
        </Link>
      </div>
    </footer>
  );
}
