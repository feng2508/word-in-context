import { useEffect, useState } from "react";
import {
  getDeepSeekApiKey,
  removeDeepSeekApiKey,
  saveDeepSeekApiKey,
} from "../../services/settings";

function App() {
  const [apiKey, setApiKey] = useState("");
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [status, setStatus] = useState("Not connected");

  useEffect(() => {
    void getDeepSeekApiKey().then((storedKey) => {
      setApiKey(storedKey ?? "");
    });
  }, []);

  async function handleSave() {
    await saveDeepSeekApiKey(apiKey);
    setStatus("Saved");
  }

  async function handleRemove() {
    await removeDeepSeekApiKey();
    setApiKey("");
    setStatus("Not connected");
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

      <button type="button" onClick={handleSave}>
        Save
      </button>

      <p>Status: {status}</p>

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