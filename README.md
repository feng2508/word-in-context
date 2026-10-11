# WXT + React

This template should help get you started developing with React in WXT.

## Test the DeepSeek API

The extension stores a user-provided API key in `browser.storage.local` rather
than in a local `.env` file. The upcoming Settings page will provide the UI for
adding and testing that key.

For a direct endpoint check during development, set a temporary shell variable
and run this command from the project root:

```zsh
export DEEPSEEK_API_KEY="your_deepseek_api_key"

curl --fail-with-body --silent --show-error \
  https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  -d '{
    "model": "deepseek-flash",
    "stream": false,
    "thinking": { "type": "disabled" },
    "messages": [
      {
        "role": "user",
        "content": "Reply with exactly: DeepSeek connection works."
      }
    ]
  }'
```

The returned JSON should contain `DeepSeek connection works.` in the first
message response.
