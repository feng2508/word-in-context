import { useEffect, useState } from "react";
import {
  getDeepSeekApiKey,
  removeDeepSeekApiKey,
  saveDeepSeekApiKey,
} from "../services/settings";
import {
  testDeepSeekConnection,
  type DeepSeekConnectionResult,
} from "../services/deepseek";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [status, setStatus] = useState<
    DeepSeekConnectionResult | "not-connected"
  >("not-connected");

  useEffect(() => {
    void getDeepSeekApiKey().then((storedKey) => {
      setApiKey(storedKey ?? "");
    });
  }, []);

  async function handleSaveAndTest() {
    const trimmedApiKey = apiKey.trim();

    if (!trimmedApiKey) {
      setStatus("invalid-key");
      return;
    }

    await saveDeepSeekApiKey(trimmedApiKey);
    setStatus(await testDeepSeekConnection());
  }

  async function handleRemove() {
    await removeDeepSeekApiKey();
    setApiKey("");
    setStatus("not-connected");
  }

  return (
    <main className="settings">
      <header className="settings__header">
        <h1 className="settings__title">Settings</h1>
        <p className="settings__description">Use your own DeepSeek API key</p>
      </header>

      <div className="settings__field">
        <label className="settings__label" htmlFor="api-key">
          API key
        </label>
        <div className="settings__key-control">
          <input
            className="settings__key-input"
            id="api-key"
            type={isKeyVisible ? "text" : "password"}
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
          />
          <button
            className="settings__show-button"
            type="button"
            onClick={() => setIsKeyVisible(!isKeyVisible)}
          >
            {isKeyVisible ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <p className="settings__api-link">
        <a
          href="https://platform.deepseek.com/api_keys"
          target="_blank"
          rel="noreferrer"
        >
          Get a DeepSeek API key ↗
        </a>
      </p>

      <button
        className="settings__primary-button"
        type="button"
        onClick={handleSaveAndTest}
      >
        Save and test
      </button>

      <p className={`status status--${status}`}>
        Status: {" "}
        {
          {
            "not-connected": "Not connected",
            connected: "Connected",
            "invalid-key": "This key could not be verified",
            "connection-failed":
              "Connection failed—check your network and try again",
          }[status]
        }
      </p>

      <p className="settings__privacy">
        Your key is stored locally in this browser and is sent only to DeepSeek
        when you request an explanation.
      </p>

      <button
        className="settings__remove-button"
        type="button"
        onClick={handleRemove}
      >
        Remove API key
      </button>
    </main>
  );
}
