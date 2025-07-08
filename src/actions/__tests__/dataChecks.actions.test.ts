import { apiClient } from "@/lib/server/apiClient";
import { checkRGE, checkSIRET } from "../dataChecks.actions";

// Mock du client API
jest.mock("@/lib/server/apiClient", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("DataChecks Server Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("checkSIRET", () => {
    it("doit vérifier un SIRET valide", async () => {
      const mockResponse = {
        data: {
          valid: true,
          error_details: null,
        },
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await checkSIRET("12345678901234");

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/v1/data_checks/siret?siret=12345678901234"
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("doit retourner une erreur pour un SIRET invalide", async () => {
      const mockResponse = {
        data: {
          valid: false,
          error_details: [{ code: "SIRET_INVALID" }],
        },
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await checkSIRET("12345678901234");

      expect(result.valid).toBe(false);
      expect(result.error_details).toHaveLength(1);
    });

    it("doit lever une erreur si le SIRET est vide", async () => {
      await expect(checkSIRET("")).rejects.toThrow("Le SIRET est requis");
      expect(mockApiClient.get).not.toHaveBeenCalled();
    });

    it("doit lever une erreur si le SIRET est null", async () => {
      // @ts-expect-error - Test intentionnel avec valeur null
      await expect(checkSIRET(null)).rejects.toThrow("Le SIRET est requis");
      expect(mockApiClient.get).not.toHaveBeenCalled();
    });

    it("doit gérer les erreurs de l'API", async () => {
      const mockError = new Error("Erreur API");
      mockApiClient.get.mockRejectedValue(mockError);

      await expect(checkSIRET("12345678901234")).rejects.toThrow("Erreur API");
    });

    it("doit trimmer les espaces du SIRET", async () => {
      const mockResponse = {
        data: { valid: true, error_details: null },
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      await checkSIRET("  12345678901234  ");

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/v1/data_checks/siret?siret=12345678901234"
      );
    });
  });

  describe("checkRGE", () => {
    const validSiret = "12345678901234";

    it("doit vérifier un RGE avec seulement le SIRET", async () => {
      const mockResponse = {
        data: {
          valid: true,
          error_details: null,
          results: [
            {
              siret: validSiret,
              nom_entreprise: "Test Entreprise",
              adresse: "123 rue Test",
              code_postal: "75001",
              commune: "Paris",
              telephone: "0123456789",
              email: "test@test.fr",
              site_internet: "www.test.fr",
              code_qualification: "RGE001",
              nom_qualification: "Qualification Test",
              nom_certificat: "QUALIBAT-RGE",
              domaine: "Isolation par l'extérieur",
              meta_domaine: "Travaux d'efficacité énergétique",
              organisme: "qualibat",
              particulier: true,
              lien_date_debut: "2024-01-01",
              lien_date_fin: "2025-12-31",
            },
          ],
        },
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await checkRGE({ siret: validSiret });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/v1/data_checks/rge?siret=12345678901234"
      );
      expect(result.valid).toBe(true);
      expect(result.results).toHaveLength(1);
    });

    it("doit vérifier un RGE avec SIRET et numéro RGE", async () => {
      const rgeNumber = "RGE123456";
      const mockResponse = {
        data: {
          valid: true,
          error_details: null,
          results: [],
        },
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      await checkRGE({ siret: validSiret, rge: rgeNumber });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/v1/data_checks/rge?siret=12345678901234&rge=RGE123456"
      );
    });

    it("doit vérifier un RGE avec SIRET, RGE et date", async () => {
      const rgeNumber = "RGE123456";
      const date = "2024-06-15";
      const mockResponse = {
        data: {
          valid: true,
          error_details: null,
          results: [],
        },
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      await checkRGE({ siret: validSiret, rge: rgeNumber, date });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/v1/data_checks/rge?siret=12345678901234&rge=RGE123456&date=2024-06-15"
      );
    });

    it("doit lever une erreur si le SIRET est vide", async () => {
      await expect(checkRGE({ siret: "" })).rejects.toThrow(
        "Le SIRET est requis pour la vérification RGE"
      );
      expect(mockApiClient.get).not.toHaveBeenCalled();
    });

    it("doit ignorer les paramètres RGE et date vides", async () => {
      const mockResponse = {
        data: { valid: true, error_details: null, results: [] },
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      await checkRGE({ siret: validSiret, rge: "", date: "   " });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/v1/data_checks/rge?siret=12345678901234"
      );
    });

    it("doit retourner une erreur 404 si aucun RGE n'est trouvé", async () => {
      const mockResponse = {
        data: {
          valid: false,
          error_details: [{ code: "RGE_NOT_FOUND" }],
          results: null,
        },
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await checkRGE({ siret: validSiret, rge: "INEXISTANT" });

      expect(result.valid).toBe(false);
      expect(result.error_details).toHaveLength(1);
      expect(result.results).toBeNull();
    });

    it("doit gérer les erreurs de l'API", async () => {
      const mockError = new Error("Erreur API RGE");
      mockApiClient.get.mockRejectedValue(mockError);

      await expect(checkRGE({ siret: validSiret })).rejects.toThrow(
        "Erreur API RGE"
      );
    });

    it("doit trimmer les espaces des paramètres", async () => {
      const mockResponse = {
        data: { valid: true, error_details: null, results: [] },
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      await checkRGE({
        siret: "  " + validSiret + "  ",
        rge: "  RGE123  ",
        date: "  2024-06-15  ",
      });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/v1/data_checks/rge?siret=12345678901234&rge=RGE123&date=2024-06-15"
      );
    });
  });
});
