import { MOCK_CONFIG } from "./config";
import { MOCK_QUOTE_CASE_VALID } from "./quoteCase/quoteCaseValid.mock";
// import { MOCK_QUOTE_CASE_WITH_ERRORS } from './quoteCase/quoteCaseWithErrors.mock';
// import { MOCK_QUOTE_CASE_EMPTY } from './quoteCase/quoteCaseEmpty.mock';

type MockScenario = "valid" | "invalid" | "empty";

// Fonction pour choisir le bon mock selon l'ID ou le scénario
export const getQuoteCaseMock = (quoteCaseId: string) => {
  const scenarioMap: Record<string, MockScenario> = {
    valid: "valid",
    "case-valid-12345": "valid",
    invalid: "invalid",
    "case-test-errors": "invalid",
    empty: "empty",
    "case-empty": "empty",
  };

  const scenario =
    scenarioMap[quoteCaseId] || (MOCK_CONFIG.defaultScenario as MockScenario);

  switch (scenario) {
    case "valid":
      return MOCK_QUOTE_CASE_VALID;
    case "invalid":
      return MOCK_QUOTE_CASE_VALID; // TODO
    case "empty":
      return MOCK_QUOTE_CASE_VALID; // TODO
    default:
      return MOCK_QUOTE_CASE_VALID;
  }
};
