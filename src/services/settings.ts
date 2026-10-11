const DEEPSEEK_API_KEY_STORAGE_KEY = "deepseekApiKey";

/**
 * Gets the user-managed DeepSeek API key stored in this browser profile.
 *
 * A missing or invalid stored value is treated as an unconfigured key.
 */
export async function getDeepSeekApiKey(): Promise<string | null> {
  const stored = await browser.storage.local.get(DEEPSEEK_API_KEY_STORAGE_KEY);
  const apiKey = stored[DEEPSEEK_API_KEY_STORAGE_KEY];

  return typeof apiKey === "string" && apiKey.trim().length > 0
    ? apiKey.trim()
    : null;
}

/** Saves a user-provided DeepSeek API key in browser-local extension storage. */
export async function saveDeepSeekApiKey(apiKey: string): Promise<void> {
  await browser.storage.local.set({
    [DEEPSEEK_API_KEY_STORAGE_KEY]: apiKey.trim(),
  });
}

/** Removes the DeepSeek API key from browser-local extension storage. */
export async function removeDeepSeekApiKey(): Promise<void> {
  await browser.storage.local.remove(DEEPSEEK_API_KEY_STORAGE_KEY);
}
