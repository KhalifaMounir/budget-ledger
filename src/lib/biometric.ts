function toBase64(value: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(value)));
}

function fromBase64(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

export async function registerBiometric() {
  if (!window.isSecureContext) throw new Error("Face ID requires HTTPS or localhost");
  if (!window.PublicKeyCredential || !navigator.credentials) throw new Error("Face ID is not supported in this browser");

  const platformAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable?.();
  if (platformAvailable === false) throw new Error("This device does not have a Face ID or biometric authenticator available");

  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      rp: { name: "Pocket Ledger", id: window.location.hostname },
      user: { id: crypto.getRandomValues(new Uint8Array(16)), name: "local-user", displayName: "Pocket Ledger user" },
      pubKeyCredParams: [{ alg: -7, type: "public-key" }],
      authenticatorSelection: { authenticatorAttachment: "platform", residentKey: "preferred", userVerification: "required" },
      timeout: 60000,
    },
  });

  if (!credential) throw new Error("Face ID setup was cancelled");
  return toBase64((credential as PublicKeyCredential).rawId);
}

export async function authenticateBiometric(credentialId: string) {
  if (!window.isSecureContext || !navigator.credentials) throw new Error("Face ID requires HTTPS or localhost");
  await navigator.credentials.get({
    publicKey: {
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      allowCredentials: [{ id: fromBase64(credentialId), type: "public-key" }],
      userVerification: "required",
      timeout: 60000,
    },
  });
}