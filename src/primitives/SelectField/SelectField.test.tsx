import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SelectField } from "./SelectField";

const OPTS = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
  { value: "c", label: "Cherry", disabled: true }
];

describe("SelectField", () => {
  it("renders all options", () => {
    render(<SelectField label="Fruit" value="a" onChange={() => {}} options={OPTS} />);
    expect(screen.getByRole("combobox", { name: "Fruit" })).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("calls onChange with the new value", () => {
    const onChange = vi.fn();
    render(<SelectField label="Fruit" value="a" onChange={onChange} options={OPTS} />);
    fireEvent.change(screen.getByRole("combobox", { name: "Fruit" }), { target: { value: "b" } });
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("respects option-level disabled", () => {
    render(<SelectField label="Fruit" value="a" onChange={() => {}} options={OPTS} />);
    const cherry = screen.getAllByRole("option").find((o) => o.textContent === "Cherry") as HTMLOptionElement;
    expect(cherry).toBeDisabled();
  });

  it("applies error class on container when error=true", () => {
    const { container } = render(
      <SelectField label="Fruit" error value="a" onChange={() => {}} options={OPTS} />
    );
    expect(container.querySelector(".ui26-field--error")).not.toBeNull();
  });

  it("renders helperText", () => {
    render(
      <SelectField label="Fruit" helperText="Pick one" value="a" onChange={() => {}} options={OPTS} />
    );
    expect(screen.getByText("Pick one")).toBeInTheDocument();
  });
});
