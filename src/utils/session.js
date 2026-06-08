export function isValidClientSession(session) {
  return Boolean(
    session &&
      typeof session === "object" &&
      session.id &&
      session.phone &&
      session.name &&
      String(session.name).trim().length >= 2,
  );
}

export function isValidMasterSession(profile, verifiedPhone, loggedInFlag = false) {
  if (!profile || !loggedInFlag) return false;
  const phone = verifiedPhone || profile.phone || "";
  return String(phone).replace(/\D/g, "").length >= 11;
}
