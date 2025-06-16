export const typeRenovationStorage = {
  save: (data: { aides: string[]; gestes: string[]; type: string }) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("typeRenovationMetadata", JSON.stringify(data));
    }
  },

  load: () => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("typeRenovationMetadata");
      return saved ? JSON.parse(saved) : { aides: [], gestes: [], type: null };
    }
    return { aides: [], gestes: [], type: null };
  },

  clear: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("typeRenovationMetadata");
    }
  },
};
