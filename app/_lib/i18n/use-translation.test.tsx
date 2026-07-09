import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider } from "../../_components/i18n/language-provider";
import { interpolate, makeT, useTranslation } from "./use-translation";
import { vi as viCatalog } from "./vi";
import { en as enCatalog } from "./en";

/** Minimal consumer used to assert what `useTranslation()` resolves to. */
function Probe() {
  const { lang, t, setLang } = useTranslation();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="text">{t("nav.about")}</span>
      <button type="button" onClick={() => setLang("en")}>
        go-en
      </button>
    </div>
  );
}

describe("interpolate", () => {
  it("replaces {token} placeholders with the matching var", () => {
    expect(interpolate("Hi {name}", { name: "An" })).toBe("Hi An");
  });

  it("passes the template through unchanged when no vars are given", () => {
    expect(interpolate("Hi {name}")).toBe("Hi {name}");
  });

  it("leaves unmatched tokens as-is", () => {
    expect(interpolate("Hi {name}", { other: "x" })).toBe("Hi {name}");
  });
});

describe("makeT fallback chain", () => {
  it("resolves the active locale's value", () => {
    expect(makeT("en")("common.detail")).toBe(enCatalog["common.detail"]);
    expect(makeT("vi")("common.detail")).toBe(viCatalog["common.detail"]);
  });

  it("falls back to the vi value when the active catalog is missing the key at runtime (never a bare key when vi has it)", () => {
    const mutableEn = enCatalog as Record<string, string>;
    const original = mutableEn["nav.about"];
    // Intentional runtime-only gap (types guarantee this can't happen in real
    // code) to exercise the active -> vi fallback branch honestly.
    delete mutableEn["nav.about"];
    expect(makeT("en")("nav.about")).toBe(viCatalog["nav.about"]);
    mutableEn["nav.about"] = original;
  });

  it("falls back to the raw key when neither catalog has it", () => {
    expect(makeT("en")("bogus.key" as never)).toBe("bogus.key");
  });
});

describe("useTranslation without a provider (AC-7)", () => {
  it("resolves the VI default context value", () => {
    render(<Probe />);
    expect(screen.getByTestId("lang")).toHaveTextContent("vi");
    expect(screen.getByTestId("text")).toHaveTextContent(viCatalog["nav.about"]);
  });
});

describe("LanguageProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to vi and renders VI copy", () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );
    expect(screen.getByTestId("lang")).toHaveTextContent("vi");
    expect(screen.getByTestId("text")).toHaveTextContent(viCatalog["nav.about"]);
  });

  it("setLang flips context + persists to localStorage (AC-5)", () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );

    fireEvent.click(screen.getByText("go-en"));

    expect(screen.getByTestId("lang")).toHaveTextContent("en");
    expect(screen.getByTestId("text")).toHaveTextContent(enCatalog["nav.about"]);
    expect(localStorage.getItem("saa-lang")).toBe("en");
  });

  it("restores a persisted locale after mount", () => {
    localStorage.setItem("saa-lang", "en");

    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );

    expect(screen.getByTestId("lang")).toHaveTextContent("en");
    expect(screen.getByTestId("text")).toHaveTextContent(enCatalog["nav.about"]);
  });

  it("ignores an invalid persisted value and keeps the vi default", () => {
    localStorage.setItem("saa-lang", "fr");

    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );

    expect(screen.getByTestId("lang")).toHaveTextContent("vi");
  });
});
