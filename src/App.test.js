import { render, screen } from "@testing-library/react";
import App from "./App";

test("未登录访问时会跳转到登录页", () => {
  localStorage.clear();
  render(<App />);
  const loginTitle = screen.getByText(/商家登录/i);
  expect(loginTitle).toBeInTheDocument();
});
