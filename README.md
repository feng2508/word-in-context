# WXT + React

This template should help get you started developing with React in WXT.

## Local LiteLLM proxy

The local proxy loads `litellm_config.yaml` and exposes LiteLLM at
`http://localhost:4000`. It does not make a model request when it starts.

Set secrets in your shell; never write them to a tracked file:

```zsh
export DEEPSEEK_API_KEY="your-deepseek-key"
export LITELLM_MASTER_KEY="sk-$(openssl rand -hex 32)"
docker compose -f docker-compose.litellm.yml up
```

Stop the proxy with `docker compose -f docker-compose.litellm.yml down`.
