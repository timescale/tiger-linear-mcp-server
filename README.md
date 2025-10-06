# Tiger Linear MCP Server

A wrapper around the Linear API to provide some focused tools to LLMs via the [Model Context Protocol](https://modelcontextprotocol.io/introduction).

## Development

Cloning and running the server locally.

```bash
git clone git@github.com:timescale/tiger-linear-mcp-server.git
```

### Building

Run `npm i` to install dependencies and build the project. Use `npm run watch` to rebuild on changes.

Create a `.env` file based on the `.env.sample` file.

```bash
cp .env.sample .env
```

### Testing

The MCP Inspector is very handy.

```bash
npx @modelcontextprotocol/inspector
```

| Field          | Value           |
| -------------- | --------------- |
| Transport Type | `STDIO`         |
| Command        | `node`          |
| Arguments      | `dist/index.js` |

#### Testing in Claude Desktop

Create/edit the file `~/Library/Application Support/Claude/claude_desktop_config.json` to add an entry like the following, making sure to use the absolute path to your local `tiger-linear-mcp-server` project, and use a valid api token.

```json
{
  "mcpServers": {
    "tiger-linear": {
      "command": "node",
      "args": [
        "/absolute/path/to/tiger-linear-mcp-server/dist/index.js",
        "stdio"
      ],
      "env": {
        "LINEAR_API_KEY": "lin_api_..."
      }
    }
  }
}
```

## Deployment

We use a Helm chart to deploy to Kubernetes. See the `chart/` directory for details.

### Secrets

Run the following to create a sealed secret for the various credentials. Be sure to fill in the correct values.

```bash
kubectl -n savannah-system create secret generic tiger-linear-mcp-server-linear \
  --dry-run=client \
  --from-literal=token="lin_api_" \
  -o yaml | kubeseal -o yaml

kubectl -n savannah-system create secret generic tiger-linear-mcp-server-logfire \
  --dry-run=client \
  --from-literal=token="pylf_v1_us_" \
  -o yaml | kubeseal -o yaml

kubectl -n savannah-system create secret generic tiger-linear-mcp-server-tailscale \
  --dry-run=client \
  --from-literal=authkey="tskey-auth-" \
  -o yaml | kubeseal -o yaml
```

Update `./chart/values/dev.yaml` with the output.
