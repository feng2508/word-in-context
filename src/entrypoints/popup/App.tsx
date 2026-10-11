import { useEffect, useState } from "react";
import {
  getDeepSeekApiKey,
  removeDeepSeekApiKey,
  saveDeepSeekApiKey,
} from "../../services/settings";
import {
  testDeepSeekConnection,
  type DeepSeekConnectionResult,
} from "../../services/deepseek";

function App() {
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
    <main>
      <h1>Settings</h1>
      <p>AI explanations</p>
      <p>Use your own DeepSeek API key</p>

      <label htmlFor="api-key">API key</label>
      <input
        id="api-key"
        type={isKeyVisible ? "text" : "password"}
        value={apiKey}
        onChange={(event) => setApiKey(event.target.value)}
      />
      <button type="button" onClick={() => setIsKeyVisible(!isKeyVisible)}>
        {isKeyVisible ? "Hide" : "Show"}
      </button>

      <p>
        <a
          href="https://platform.deepseek.com/api_keys"
          target="_blank"
          rel="noreferrer"
        >
          Get a DeepSeek API key ↗
        </a>
      </p>

      <button type="button" onClick={handleSaveAndTest}>
        Save and test
      </button>

      <p>
        Status:{" "}
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

      <p>
        Your key is stored locally in this browser and is sent only to DeepSeek
        when you request an explanation.
      </p>

      <button type="button" onClick={handleRemove}>
        Remove API key
      </button>
    </main>
  );
}

export default App;
