import React from "react";
import { render, screen } from "@testing-library/react";
import QuoteConformityCard from "./QuoteConformityCard";

jest.mock("./ProgressGauge", () => ({
  __esModule: true,
  default: ({ percentage }: { percentage: number }) =>
    React.createElement(
      "div",
      { "data-testid": "progress-gauge" },
      `${percentage}%`
    ),
}));

jest.mock("./QuoteConformityCard.wording", () => ({
  QUOTE_CONFORMITY_CARD: {
    title: "Conformité du devis",
    corrections: "{count} correction{plural}",
    conformPoints: "{count} point{plural} conforme{plural}",
  },
}));

describe("QuoteConformityCard", () => {
  const defaultProps = {
    correctionsCount: 2,
    controlsCount: 10,
  };

  it("affiche le composant avec les bonnes valeurs", () => {
    render(<QuoteConformityCard {...defaultProps} />);

    expect(screen.getByText("Conformité du devis")).toBeInTheDocument();
    expect(screen.getByText("2 corrections")).toBeInTheDocument();
    expect(screen.getByText("8 points conformes")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
  });

  it("gère le singulier correctement", () => {
    const propsWithSingular = {
      correctionsCount: 1,
      controlsCount: 5,
    };

    render(<QuoteConformityCard {...propsWithSingular} />);

    expect(screen.getByText("1 correction")).toBeInTheDocument();
    expect(screen.getByText("4 points conformes")).toBeInTheDocument();
  });

  it("affiche 100% quand il n'y a aucune correction", () => {
    const propsWithNoCorrections = {
      correctionsCount: 0,
      controlsCount: 5,
    };

    render(<QuoteConformityCard {...propsWithNoCorrections} />);

    expect(screen.getByText("0 corrections")).toBeInTheDocument();
    expect(screen.getByText("5 points conformes")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("calcule 0% quand toutes les corrections sont nécessaires", () => {
    const propsWithAllCorrections = {
      correctionsCount: 5,
      controlsCount: 5,
    };

    render(<QuoteConformityCard {...propsWithAllCorrections} />);

    expect(screen.getByText("5 corrections")).toBeInTheDocument();
    expect(screen.getByText("0 points conformes")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("gère le cas où controlsCount est 0", () => {
    const propsWithZeroControls = {
      correctionsCount: 0,
      controlsCount: 0,
    };

    render(<QuoteConformityCard {...propsWithZeroControls} />);

    expect(screen.getByText("0 corrections")).toBeInTheDocument();
    expect(screen.getByText("0 points conformes")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });
});
