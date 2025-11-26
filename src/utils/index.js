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
    case "StyleSwiper":
      return "/styleswiper";
    case "Profile":
      return "/profile";
    default:
      return "/";
  }
}

export const shouldShowForProfile = (item, profile) => {
  const pref =
    (profile?.genderPreference || profile?.gender || "unspecified").toLowerCase();
  const audience = (item?.audience || "unisex").toLowerCase();

  if (pref === "unspecified" || pref === "unisex" || !pref) return true;
  if (audience === "unisex") return true;
  return audience === pref;
};
