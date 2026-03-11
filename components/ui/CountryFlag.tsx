// components/ui/CountryFlag.tsx
//
// Wrapper autour de react-country-flag qui utilise des SVG (pas des emojis Unicode).
// → Fonctionne sur Windows, Linux, tous navigateurs, sans dépendance OS.
//
// Usage :
//   <CountryFlag code="CA" />
//   <CountryFlag code="CANADA" />   ← accepte aussi les codes Prisma
//   <DestinationFlag destination="BELGIUM" className="h-5 w-7" />

"use client";

import ReactCountryFlag from "react-country-flag";

// ── Mapping codes Prisma → ISO 3166-1 alpha-2 ────────────────────────────────
const DEST_TO_ISO: Record<string, string> = {
  CANADA: "CA",
  BELGIUM: "BE",
  FRANCE: "FR",
  // "OTHER" n'a pas de code ISO → on affiche une icône neutre
};

// ── Composant générique avec code ISO ─────────────────────────────────────────
interface CountryFlagProps {
  /** Code ISO 3166-1 alpha-2 : "CA", "BE", "FR"... */
  code: string;
  /** Taille en pixels (width & height du SVG). Défaut : 20 */
  size?: number;
  className?: string;
  title?: string;
}

export function CountryFlag({
  code,
  size = 20,
  className,
  title,
}: CountryFlagProps) {
  return (
    <ReactCountryFlag
      countryCode={code.toUpperCase()}
      svg
      style={{ width: size, height: size * 0.7, borderRadius: 2 }}
      className={className}
      title={title ?? code}
      aria-label={title ?? code}
    />
  );
}

// ── Composant spécialisé pour les destinations Prisma ────────────────────────
interface DestinationFlagProps {
  /** Valeur de l'enum Prisma : "CANADA" | "BELGIUM" | "FRANCE" | "OTHER" */
  destination: string;
  size?: number;
  className?: string;
}

export function DestinationFlag({
  destination,
  size = 18,
  className,
}: DestinationFlagProps) {
  const isoCode = DEST_TO_ISO[destination];

  // "OTHER" ou code inconnu → globe neutre en SVG inline
  if (!isoCode) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        style={{ width: size, height: size }}
        className={`text-muted-foreground ${className ?? ""}`}
        aria-label="Other"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    );
  }

  return (
    <CountryFlag
      code={isoCode}
      size={size}
      title={destination}
      className={className}
    />
  );
}

// ── Helper pour les endroits où on utilisait DEST_FLAGS[dest] ─────────────────
// Exemple : dans les Select, les badges, les textes simples
// Retourne le code ISO ou null si "OTHER"
export function getIsoCode(destination: string): string | null {
  return DEST_TO_ISO[destination] ?? null;
}
