import { render, screen, fireEvent, act } from "@testing-library/react";

import Upload from "./Upload";

describe("Upload Component", () => {
  const mockOnFileUpload = jest.fn();
  const mockSetError = jest.fn();
  const maxFileSize = 5; // 5MB

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should display basic component elements", () => {
    render(
      <Upload
        maxFileSize={maxFileSize}
        onFileUpload={mockOnFileUpload}
        setError={mockSetError}
      />
    );

    expect(screen.getByTestId("upload-area")).toBeInTheDocument();
    expect(screen.getByTestId("file-upload")).toBeInTheDocument();
    expect(screen.getByTestId("upload-description")).toBeInTheDocument();
  });

  it("should trigger file selector when clicking on upload area", () => {
    render(
      <Upload
        maxFileSize={maxFileSize}
        onFileUpload={mockOnFileUpload}
        setError={mockSetError}
      />
    );

    const fileInput = screen.getByTestId("file-upload");
    const uploadArea = screen.getByTestId("upload-area");

    jest.spyOn(fileInput, "click");
    fireEvent.click(uploadArea);

    expect(fileInput.click).toHaveBeenCalled();
  });

  it("should handle valid file upload", async () => {
    render(
      <Upload
        maxFileSize={maxFileSize}
        onFileUpload={mockOnFileUpload}
        setError={mockSetError}
      />
    );

    const file = new File(["dummy content"], "document.pdf", {
      type: "application/pdf",
    });
    const fileInput = screen.getByTestId("file-upload");

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(mockOnFileUpload).toHaveBeenCalledWith(file);
    expect(mockSetError).toHaveBeenCalledWith(null);
    expect(screen.getByTestId("upload-file-name")).toHaveTextContent(
      "document.pdf"
    );
  });

  it("should show error when uploading oversized file", async () => {
    render(
      <Upload
        maxFileSize={1}
        onFileUpload={mockOnFileUpload}
        setError={mockSetError}
      />
    );

    const largeFile = new File(["a".repeat(2 * 1024 * 1024)], "large.pdf", {
      type: "application/pdf",
    }); // 2MB
    const fileInput = screen.getByTestId("file-upload");

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [largeFile] } });
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(mockOnFileUpload).not.toHaveBeenCalled();
    expect(mockSetError).toHaveBeenCalled();
    expect(screen.getByTestId("upload-error-message")).toBeInTheDocument();
  });

  it("should show error when uploading invalid file type", async () => {
    render(
      <Upload
        maxFileSize={maxFileSize}
        onFileUpload={mockOnFileUpload}
        setError={mockSetError}
      />
    );

    const invalidFile = new File(["dummy content"], "doc.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const fileInput = screen.getByTestId("file-upload");

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [invalidFile] } });
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(mockOnFileUpload).not.toHaveBeenCalled();
    expect(mockSetError).toHaveBeenCalled();
    expect(screen.getByTestId("upload-error-message")).toBeInTheDocument();
  });

  it("should handle valid file drag and drop", async () => {
    render(
      <Upload
        maxFileSize={maxFileSize}
        onFileUpload={mockOnFileUpload}
        setError={mockSetError}
      />
    );

    const file = new File(["dummy content"], "document.pdf", {
      type: "application/pdf",
    });
    const uploadArea = screen.getByTestId("upload-area");

    await act(async () => {
      fireEvent.drop(uploadArea, { dataTransfer: { files: [file] } });
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(mockOnFileUpload).toHaveBeenCalledWith(file);
    expect(mockSetError).toHaveBeenCalledWith(null);
  });

  it("should show error when drag and dropping oversized file", async () => {
    render(
      <Upload
        maxFileSize={1}
        onFileUpload={mockOnFileUpload}
        setError={mockSetError}
      />
    );

    const largeFile = new File(["a".repeat(2 * 1024 * 1024)], "large.pdf", {
      type: "application/pdf",
    }); // 2MB
    const uploadArea = screen.getByTestId("upload-area");

    await act(async () => {
      fireEvent.drop(uploadArea, { dataTransfer: { files: [largeFile] } });
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(mockOnFileUpload).not.toHaveBeenCalled();
    expect(mockSetError).toHaveBeenCalled();
    expect(screen.getByTestId("upload-error-message")).toBeInTheDocument();
  });

  it("should handle drag and drop events", () => {
    render(
      <Upload
        maxFileSize={maxFileSize}
        onFileUpload={mockOnFileUpload}
        setError={mockSetError}
      />
    );

    const uploadArea = screen.getByTestId("upload-area");

    fireEvent.dragOver(uploadArea);
    fireEvent.dragEnter(uploadArea);
    expect(uploadArea).toHaveClass("bg-blue-100 border-blue-500");

    fireEvent.dragLeave(uploadArea);
    expect(uploadArea).toHaveClass("bg-white border-gray-300");
  });

  it("should handle mouse hover", () => {
    render(
      <Upload
        maxFileSize={maxFileSize}
        onFileUpload={mockOnFileUpload}
        setError={mockSetError}
      />
    );

    const uploadButton = screen.getByTestId("upload-button");

    fireEvent.mouseEnter(uploadButton);
    expect(uploadButton).toHaveStyle({
      backgroundColor: "var(--background-contrast-grey-hover)",
    });

    fireEvent.mouseLeave(uploadButton);
    expect(uploadButton).toHaveStyle({
      backgroundColor: "var(--background-contrast-grey)",
    });
  });

  it("should change button background on click and release", () => {
    render(
      <Upload
        maxFileSize={maxFileSize}
        onFileUpload={mockOnFileUpload}
        setError={mockSetError}
      />
    );

    const uploadButton = screen.getByTestId("upload-button");

    fireEvent.mouseDown(uploadButton);
    expect(uploadButton).toHaveStyle({
      backgroundColor: "var(--background-contrast-grey-active)",
    });

    fireEvent.mouseUp(uploadButton);
    expect(uploadButton).toHaveStyle({
      backgroundColor: "var(--background-contrast-grey-hover)",
    });
  });
});
