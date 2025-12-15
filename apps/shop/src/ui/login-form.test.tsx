import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, mock } from "bun:test";

import { LoginForm } from "./login-form";

// Mock the auth server action
mock.module("@/lib/auth", () => ({
  login: mock(() => Promise.resolve({})),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    render(<LoginForm />);
  });

  it("renders the login title", () => {
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("renders the description text", () => {
    expect(
      screen.getByText("Enter your email below to login to your account"),
    ).toBeInTheDocument();
  });

  it("renders email input field", () => {
    const emailInput = screen.getByPlaceholderText("m@example.com");

    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("name", "email");
    expect(emailInput).toBeRequired();
  });

  it("renders password input field", () => {
    const passwordInput = screen.getByLabelText("Password");

    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toHaveAttribute("name", "password");
    expect(passwordInput).toBeRequired();
  });

  it("renders submit button", () => {
    const submitButton = screen.getByRole("button", { name: /login/i });

    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("renders terms and privacy links", () => {
    expect(screen.getByText("Terms of Service")).toBeInTheDocument();
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
  });

  it("wraps form elements in a form tag", () => {
    const form = document.querySelector("form");

    expect(form).toBeInTheDocument();
  });
});
