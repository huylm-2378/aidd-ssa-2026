import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithLang } from "../../_lib/i18n/test-utils";
import LoginWelcome from "./login-welcome";
import AuthErrorContent from "../../auth/auth-code-error/auth-error-content";
import PrelaunchHeading from "../../prelaunch/prelaunch-heading";

/** F014 round 5: the last three pages (login / prelaunch / auth-code-error). */
describe("login/prelaunch/auth-error i18n (F014 round 5)", () => {
  it("renders the VN copy by default", () => {
    renderWithLang(
      <>
        <LoginWelcome />
        <PrelaunchHeading />
        <AuthErrorContent />
      </>,
      "vi",
    );
    expect(screen.getByText("Bắt đầu hành trình của bạn cùng SAA 2025.")).toBeInTheDocument();
    expect(screen.getByText("Đăng nhập để khám phá!")).toBeInTheDocument();
    expect(screen.getByText("Sự kiện sẽ bắt đầu sau")).toBeInTheDocument();
    expect(screen.getByText("Đăng nhập chưa hoàn tất")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Quay lại đăng nhập" })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("renders the EN copy under the en locale", () => {
    renderWithLang(
      <>
        <LoginWelcome />
        <PrelaunchHeading />
        <AuthErrorContent />
      </>,
      "en",
    );
    expect(screen.getByText("Begin your journey with SAA 2025.")).toBeInTheDocument();
    expect(screen.getByText("Sign in to explore!")).toBeInTheDocument();
    expect(screen.getByText("The event begins in")).toBeInTheDocument();
    expect(screen.getByText("Sign-in incomplete")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to sign-in" })).toBeInTheDocument();
  });
});
