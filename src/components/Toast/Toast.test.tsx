import { render, screen, act } from "@testing-library/react";

import Toast from "./Toast";

describe("Toast", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders with message", () => {
    render(<Toast message="Test message" onClose={jest.fn()} />);
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("calls onClose after duration + animation time", () => {
    const onClose = jest.fn();
    render(<Toast message="Test message" duration={1000} onClose={onClose} />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onClose).toHaveBeenCalled();
  });

  it("uses default duration of 3000ms", () => {
    const onClose = jest.fn();
    render(<Toast message="Test message" onClose={onClose} />);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onClose).toHaveBeenCalled();
  });

  it("cleans up timeouts on unmount", () => {
    const onClose = jest.fn();
    const { unmount } = render(
      <Toast message="Test message" onClose={onClose} />
    );

    unmount();

    act(() => {
      jest.advanceTimersByTime(3500);
    });

    expect(onClose).not.toHaveBeenCalled();
  });
});
