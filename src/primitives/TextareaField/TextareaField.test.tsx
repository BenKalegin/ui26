import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TextareaField } from "./TextareaField";

describe("TextareaField", () => {
  it("renders label tied to textarea via htmlFor/id", () => {
    render(<TextareaField label="Description" value="" onChange={() => {}} />);
    const textarea = screen.getByLabelText("Description") as HTMLTextAreaElement;
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  it("calls onChange with the new value", () => {
    const onChange = vi.fn();
    render(<TextareaField label="Description" value="hi" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "longer text" } });
    expect(onChange).toHaveBeenCalledWith("longer text");
  });

  it("renders helperText", () => {
    render(<TextareaField label="Notes" helperText="Be brief" value="" onChange={() => {}} />);
    expect(screen.getByText("Be brief")).toBeInTheDocument();
  });

  it("applies error class when error=true", () => {
    const { container } = render(
      <TextareaField label="Notes" error helperText="Bad" value="" onChange={() => {}} />
    );
    expect(container.querySelector(".ui26-field--error")).not.toBeNull();
  });

  it("forwards rows and placeholder", () => {
    render(<TextareaField label="X" rows={6} placeholder="say something" value="" onChange={() => {}} />);
    const textarea = screen.getByLabelText("X");
    expect(textarea).toHaveAttribute("rows", "6");
    expect(textarea).toHaveAttribute("placeholder", "say something");
  });

  it("defaults to rows=4 when unspecified", () => {
    render(<TextareaField label="X" value="" onChange={() => {}} />);
    expect(screen.getByLabelText("X")).toHaveAttribute("rows", "4");
  });
});
