// src/utils/index.js
export function createPageUrl(pageName) {
  switch (pageName) {
    case "Home":
      return "/";
    case "Wardrobe":
      return "/wardrobe";
    case "Outfits":
      return "/outfits";
    case "Shopping":
      return "/shopping";
    case "Scan":
      return "/scan";
    case "Profile":
      return "/profile";
    default:
      return "/";
  }
}
