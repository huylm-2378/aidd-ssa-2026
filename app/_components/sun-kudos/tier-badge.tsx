/**
 * Hero-tier pill (e.g. "Legend Hero"), extracted verbatim from `KudoCard`'s
 * `Person` sub-component so `ProfileIdentity` (F009) can reuse the exact same
 * markup without visual drift. Renders nothing for an empty tier.
 */
export default function TierBadge({ tier }: { tier: string }) {
  if (!tier) return null;
  return (
    <span className="rounded-full border-[0.5px] border-[#ffea9e] bg-[#ffea9e]/20 px-2 py-0.5 font-montserrat text-xs font-bold text-[#8a6d1a]">
      {tier}
    </span>
  );
}
