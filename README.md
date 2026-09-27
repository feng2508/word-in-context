# WXT + React

This template should help get you started developing with React in WXT.

## Test the DeepSeek API

Create a local `.env` file containing your API key. Do not commit this file.

```env
WXT_DEEPSEEK_API_KEY=your_deepseek_api_key
```

Then run this command from the project root to verify that the key, endpoint,
and model work before starting the extension:

```zsh
set -a
source .env
set +a

curl --fail-with-body --silent --show-error \
  https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $WXT_DEEPSEEK_API_KEY" \
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
