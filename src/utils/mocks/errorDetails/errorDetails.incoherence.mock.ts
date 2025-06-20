import { Category, ErrorDetails } from "@/types";

export const MOCK_ERROR_DETAILS_INCOHERENCE = {
  clientPrenomIncoherent: {
    id: "error-prenom-incoherent-001",
    code: "client_prenom_incoherent",
    category: Category.INCOHERENCE_DEVIS,
    type: "error",
    title: "Le prénom du client est différent dans les documents",
    deleted: false,
    comment: null,
    geste_id: null,
    problem: 'Prénom "Jean" dans un devis et "John" dans l\'autre',
    solution: "Harmoniser le prénom du client dans tous les documents",
    provided_value: null,
  } as ErrorDetails,

  clientAdresseIncoherente: {
    id: "error-adresse-incoherente-001",
    code: "client_adresse_incoherent",
    category: Category.INCOHERENCE_DEVIS,
    type: "error",
    title: "L'adresse du client est différente dans les documents",
    deleted: false,
    comment: "Client a confirmé la bonne adresse par téléphone",
    geste_id: null,
    problem: 'Adresse "123 rue de la Paix" vs "456 avenue des Fleurs"',
    solution: "Utiliser l'adresse du lieu des travaux",
    provided_value: null,
  } as ErrorDetails,
};
