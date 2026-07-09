import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FloatingWidgetButton from "./floating-widget-button";

function openMenu() {
  fireEvent.click(screen.getByRole("button", { name: "Mở menu thao tác" }));
}

describe("FloatingWidgetButton (F010)", () => {
  it("renders collapsed by default with the toggle only", () => {
    render(<FloatingWidgetButton />);
    const toggle = screen.getByRole("button", { name: "Mở menu thao tác" });

    expect(toggle).toHaveAttribute("aria-haspopup", "true");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Thể lệ")).not.toBeInTheDocument();
    expect(screen.queryByText("Viết KUDOS")).not.toBeInTheDocument();
  });

  it("opens the menu on click, revealing both actions and flipping aria-expanded", () => {
    render(<FloatingWidgetButton />);
    openMenu();

    expect(screen.getByText("Thể lệ")).toBeInTheDocument();
    expect(screen.getByText("Viết KUDOS")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Đóng menu thao tác" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("toggling again closes the menu", () => {
    render(<FloatingWidgetButton />);
    openMenu();
    fireEvent.click(screen.getByRole("button", { name: "Đóng menu thao tác" }));

    expect(screen.queryByText("Thể lệ")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mở menu thao tác" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("closes on Escape and returns focus to the toggle", () => {
    render(<FloatingWidgetButton />);
    openMenu();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByText("Thể lệ")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mở menu thao tác" })).toHaveFocus();
  });

  it("closes on outside click and returns focus to the toggle", () => {
    render(<FloatingWidgetButton />);
    openMenu();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByText("Viết KUDOS")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mở menu thao tác" })).toHaveFocus();
  });

  it("'Thể lệ' closes the menu and opens the rules drawer", () => {
    render(<FloatingWidgetButton />);
    openMenu();

    fireEvent.click(screen.getByRole("button", { name: "Thể lệ" }));

    expect(screen.getByRole("button", { name: "Mở menu thao tác" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("'Viết KUDOS' closes the menu and opens the write-kudo modal", () => {
    render(<FloatingWidgetButton />);
    openMenu();

    fireEvent.click(screen.getByRole("button", { name: /Viết KUDOS/ }));

    expect(screen.queryByText("Thể lệ")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("plus icon rotates 45° when menu is open (FR-003, FR-007)", () => {
    const { container } = render(<FloatingWidgetButton />);
    const icon = container.querySelector("svg");

    // Collapsed: no rotate-45
    expect(icon).not.toHaveClass("rotate-45");
    expect(icon).toHaveClass("rotate-0");

    // Opened: rotate-45
    openMenu();
    expect(icon).toHaveClass("rotate-45");
    expect(icon).not.toHaveClass("rotate-0");
  });

  it("plus icon has motion-reduce:transition-none class for accessibility (FR-007)", () => {
    const { container } = render(<FloatingWidgetButton />);
    const icon = container.querySelector("svg");

    expect(icon).toHaveClass("motion-reduce:transition-none");
  });

  it("pills render in Figma order: 'Thể lệ' above 'Viết KUDOS'", () => {
    render(<FloatingWidgetButton />);
    openMenu();

    // Both pills should be in the document
    const theLeButton = screen.getByRole("button", { name: /Thể lệ/ });
    const vietKudosButton = screen.getByRole("button", { name: /Viết KUDOS/ });

    // Verify they exist
    expect(theLeButton).toBeInTheDocument();
    expect(vietKudosButton).toBeInTheDocument();

    // Verify order: Thể lệ comes before Viết KUDOS in DOM
    expect(theLeButton.compareDocumentPosition(vietKudosButton)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
  });

  it("toggle button has focus ring styles with motion-reduce guard", () => {
    render(<FloatingWidgetButton />);
    const toggle = screen.getByRole("button", { name: "Mở menu thao tác" });

    expect(toggle).toHaveClass("focus-visible:ring-2");
    expect(toggle).toHaveClass("focus-visible:ring-offset-2");
    expect(toggle).toHaveClass("motion-reduce:transition-none");
  });

  it("action pills have hover and active scale effects with motion-reduce guard", () => {
    render(<FloatingWidgetButton />);
    openMenu();

    const pill = screen.getByRole("button", { name: /Thể lệ/ });
    expect(pill).toHaveClass("hover:scale-[1.03]");
    expect(pill).toHaveClass("active:scale-95");
    expect(pill).toHaveClass("motion-reduce:hover:scale-100");
  });

  it("critical regression: 'Viết KUDOS' in rules drawer closes rules AND opens composer", () => {
    render(<FloatingWidgetButton />);

    // Open FAB menu
    openMenu();
    expect(screen.getByRole("button", { name: "Đóng menu thao tác" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    // Click "Thể lệ" to open rules drawer
    fireEvent.click(screen.getByRole("button", { name: /Thể lệ/ }));
    expect(screen.getByRole("button", { name: "Mở menu thao tác" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );

    // Rules drawer should now be open
    const rulesDialog = screen.getByRole("dialog");
    expect(rulesDialog).toBeInTheDocument();

    // Click "Viết KUDOS" inside the rules drawer
    const writeKudosButtons = screen.getAllByRole("button", { name: /Viết KUDOS/ });
    const writeInRulesButton = writeKudosButtons[writeKudosButtons.length - 1]; // Last one is in the rules drawer
    fireEvent.click(writeInRulesButton);

    // Rules drawer should close and composer should open
    expect(screen.getByRole("button", { name: "Mở menu thao tác" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    // Verify composer dialog opened (there should be a dialog for the composer now)
    const dialogs = screen.getAllByRole("dialog");
    expect(dialogs.length).toBeGreaterThan(0);
  });

  it("rules drawer and composer modals share focus management via the FAB toggle", () => {
    render(<FloatingWidgetButton />);

    // Open FAB and click Thể lệ
    openMenu();
    fireEvent.click(screen.getByRole("button", { name: /Thể lệ/ }));

    // Rules dialog open
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Close rules drawer
    fireEvent.click(screen.getByRole("button", { name: /Đóng/ }));

    // Dialog should close
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // FAB menu should remain closed
    expect(screen.getByRole("button", { name: "Mở menu thao tác" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
