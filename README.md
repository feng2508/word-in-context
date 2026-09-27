# WXT + React

This template should help get you started developing with React in WXT.

## Local LiteLLM proxy

The local proxy loads `litellm_config.yaml` and exposes LiteLLM at
`http://localhost:4000`. It does not make a model request when it starts.

Create an untracked `.env` file with your local secrets:

```dotenv
DEEPSEEK_API_KEY=your-deepseek-key
LITELLM_MASTER_KEY=sk-your-long-random-secret
```

Load the file into the current Zsh session, then start the proxy:

```zsh
set -a
source .env
set +a
docker compose -f docker-compose.litellm.yml up
```

Stop the proxy with `docker compose -f docker-compose.litellm.yml down`.

## Test the DeepSeek connection

After the proxy starts, run this request to verify LiteLLM can reach DeepSeek:

```zsh
curl --fail-with-body http://localhost:4000/v1/chat/completions \
  -H "Authorization: Bearer $LITELLM_MASTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-flash",
    "messages": [
      { "role": "user", "content": "Reply with exactly: connected" }
    ],
    "max_tokens": 10,
    "temperature": 0
  }'
```

The response should contain `connected`. This request sends a small prompt to
DeepSeek and may incur a small charge. Never commit `.env` or share either key.
