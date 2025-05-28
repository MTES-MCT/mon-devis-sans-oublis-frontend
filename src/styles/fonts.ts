import localFont from "next/font/local";

export const marianne = localFont({
  src: [
    // Light (300)
    {
      path: "../../public/dsfr/fonts/Marianne-Light.woff2",
      style: "normal",
      weight: "300",
    },
    {
      path: "../../public/dsfr/fonts/Marianne-Light_Italic.woff2",
      style: "italic",
      weight: "300",
    },
    // Regular (400)
    {
      path: "../../public/dsfr/fonts/Marianne-Regular.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "../../public/dsfr/fonts/Marianne-Regular_Italic.woff2",
      style: "italic",
      weight: "400",
    },
    // Medium (500)
    {
      path: "../../public/dsfr/fonts/Marianne-Medium.woff2",
      style: "normal",
      weight: "500",
    },
    {
      path: "../../public/dsfr/fonts/Marianne-Medium_Italic.woff2",
      style: "italic",
      weight: "500",
    },
    // Bold (700)
    {
      path: "../../public/dsfr/fonts/Marianne-Bold.woff2",
      style: "normal",
      weight: "700",
    },
    {
      path: "../../public/dsfr/fonts/Marianne-Bold_Italic.woff2",
      style: "italic",
      weight: "700",
    },
  ],
  variable: "--font-marianne",
  display: "swap",
});

export const spectral = localFont({
  src: [
    // Regular (400)
    {
      path: "../../public/dsfr/fonts/Spectral-Regular.woff2",
      style: "normal",
      weight: "400",
    },
    // ExtraBold (800)
    {
      path: "../../public/dsfr/fonts/Spectral-ExtraBold.woff2",
      style: "normal",
      weight: "800",
    },
  ],
  variable: "--font-spectral",
  display: "swap",
});
