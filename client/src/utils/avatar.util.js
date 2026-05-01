export const normalizeAvatarGender = (gender) => {
  if (!gender) return "human";
  const normalized = String(gender).trim().toLowerCase();
  if (normalized.startsWith("m")) return "male";
  if (normalized.startsWith("f")) return "female";
  return "human";
};

export const buildAvatarSeed = (seed) => {
  const normalizedSeed = String(seed || "anonymous").trim();
  return encodeURIComponent(normalizedSeed || "anonymous");
};

const isValidAvatarSource = (source) => {
  if (!source || typeof source !== "string") return false;
  const trimmed = source.trim();
  return ["http://", "https://", "//", "data:", "blob:"].some((prefix) =>
    trimmed.startsWith(prefix),
  );
};

export const getAvatarUrl = ({
  profilePhoto,
  avatarGender,
  gender,
  name,
  id,
  fallbackSeed,
}) => {
  if (isValidAvatarSource(profilePhoto)) {
    return profilePhoto.trim();
  }

  const seed = buildAvatarSeed(fallbackSeed || id || name || "anonymous");
  const normalizedGender = normalizeAvatarGender(avatarGender || gender);
  const genderParam = normalizedGender === "human" ? "" : `&gender=${normalizedGender}`;

  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}${genderParam}`;
};
