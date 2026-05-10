import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("renders label tied to input via htmlFor/id", () => {
    render(<TextField label="Name" value="" onChange={() => {}} />);
    const input = screen.getByLabelText("Name") as HTMLInputElement;
    expect(input.tagName).toBe("INPUT");
  });

  it("calls onChange with the new value", () => {
    const onChange = vi.fn();
    render(<TextField label="Name" value="hi" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "hello" } });
    expect(onChange).toHaveBeenCalledWith("hello");
  });

  it("renders helperText", () => {
    render(<TextField label="Name" helperText="Required" value="" onChange={() => {}} />);
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("applies error class on container when error=true", () => {
    const { container } = render(
      <TextField label="Name" error helperText="Bad" value="" onChange={() => {}} />
    );
    expect(container.querySelector(".ui26-field--error")).not.toBeNull();
  });

  it("forwards type and placeholder", () => {
    render(
      <TextField
        label="Pwd"
        type="password"
        placeholder="enter password"
        value=""
        onChange={() => {}}
      />
    );
    const input = screen.getByLabelText("Pwd");
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAttribute("placeholder", "enter password");
  });
});
