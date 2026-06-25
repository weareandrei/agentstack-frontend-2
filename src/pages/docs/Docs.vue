<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { API_BASE } from '@/lib/api'

const inlineCode = 'rounded bg-muted px-1.5 py-px font-mono text-[0.82rem]'
const crossLink = 'font-medium text-foreground underline underline-offset-2 hover:text-foreground/80'
const navLink =
  'flex items-center gap-2 rounded-lg px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
const sectionLabel = 'px-2 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground'

interface SidebarItem {
  id: string
  label: string
  method?: 'GET' | 'POST'
}

const curlItems: SidebarItem[] = [
  { id: 'curl-get-projects', label: '/projects', method: 'GET' },
  { id: 'curl-post-projects', label: '/projects', method: 'POST' },
  { id: 'curl-post-ingest', label: '/ingest', method: 'POST' },
  { id: 'curl-get-logs', label: '/logs', method: 'GET' },
]

const sdkItems: SidebarItem[] = [
  { id: 'sdk-install', label: 'Install' },
  { id: 'sdk-agent-stack', label: 'Get started' },
  { id: 'sdk-log', label: 'Write logs' },
  { id: 'sdk-get-logs', label: 'getLogs()' },
  { id: 'sdk-agent-stack-account', label: 'AgentStackAccount' },
  { id: 'sdk-list-projects', label: 'listProjects()' },
  { id: 'sdk-create-project', label: 'createProject()' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebAPI',
  name: 'AgentStack Logs API',
  description:
    'Send log events to an AgentStack project and read them back. Authenticate with Bearer tokens. Use cURL or the agentstack-sdk package.',
  documentation: '/docs',
  provider: { '@type': 'Organization', name: 'AgentStack' },
  potentialAction: [
    {
      '@type': 'SearchAction',
      name: 'List projects',
      target: { '@type': 'EntryPoint', urlTemplate: `${API_BASE}/projects`, httpMethod: 'GET' },
    },
    {
      '@type': 'CreateAction',
      name: 'Create a project',
      target: { '@type': 'EntryPoint', urlTemplate: `${API_BASE}/projects`, httpMethod: 'POST' },
    },
    {
      '@type': 'ConsumeAction',
      name: 'Ingest a log',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${API_BASE}/ingest`,
        httpMethod: 'POST',
        contentType: 'application/json',
      },
    },
    {
      '@type': 'SearchAction',
      name: 'Read logs',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${API_BASE}/logs?limit={limit}&offset={offset}`,
        httpMethod: 'GET',
      },
    },
  ],
}

let scriptEl: HTMLScriptElement | null = null
onMounted(() => {
  scriptEl = document.createElement('script')
  scriptEl.type = 'application/ld+json'
  scriptEl.textContent = JSON.stringify(jsonLd)
  document.head.appendChild(scriptEl)
})
onUnmounted(() => {
  if (scriptEl && scriptEl.parentNode) scriptEl.parentNode.removeChild(scriptEl)
})

const agentExample = `curl -X POST ${API_BASE}/ingest \\
  -H "Authorization: Bearer agnt_YOUR_PROJECT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{ "level": "info", "message": "Agent run started" }'`

const projectsCurl = `curl "${API_BASE}/projects" \\
  -H "Authorization: Bearer agnt_acct_YOUR_ACCOUNT_KEY"`

const projectsResponse = `[
  {
    "id": "9f3c1e8a-...",
    "name": "web-scraper",
    "token_prefix": "agnt_3kf9a0",
    "created_at": "2026-06-20T09:00:00Z",
    "latest_log_at": "2026-06-22T18:04:00Z"
  }
]`

const createProjectCurl = `curl -X POST ${API_BASE}/projects \\
  -H "Authorization: Bearer agnt_acct_YOUR_ACCOUNT_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "name": "my-agent" }'`

const createProjectResponse = `{
  "id": "9f3c1e8a-...",
  "name": "my-agent",
  "token_prefix": "agnt_3kf9a0",
  "created_at": "2026-06-20T09:00:00Z",
  "token": "agnt_072c50e6cc951fd44bd0dd2d5325002f1b10ed4360b4979b"
}`

const writeCurl = `curl -X POST ${API_BASE}/ingest \\
  -H "Authorization: Bearer agnt_YOUR_PROJECT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{ "level": "error", "message": "Payment failed", "metadata": { "order_id": 99 } }'`

const writeResponse = `{ "received": 1 }`

const readCurl = `curl "${API_BASE}/logs?limit=15&offset=0" \\
  -H "Authorization: Bearer agnt_YOUR_PROJECT_TOKEN"`

const readResponse = `{
  "logs": [
    {
      "id": 412,
      "level": "error",
      "message": "Payment failed",
      "metadata": { "order_id": 99 },
      "logged_at": "2026-06-22T00:12:00Z",
      "received_at": "2026-06-22T00:12:01Z"
    }
  ],
  "limit": 15,
  "offset": 0
}`

const sdkInstall = `npm install git+https://github.com/your-org/agentstack.git#main:agentstack-sdk`

const sdkAgentStack = `import { AgentStack } from 'agentstack-sdk'

const client = new AgentStack({
  token: 'agnt_your_project_token',
})`

const sdkLog = `await client.log.info('Agent run started')
await client.log.warn('Retrying', { attempt: 2 })
await client.log.error('Payment failed', { order_id: 99 })
await client.log.debug('Cache hit')
await client.log.fatal('Unrecoverable error')`

const sdkGetLogs = `const { logs, limit, offset } = await client.getLogs({
  limit: 20,
  offset: 0,
})`

const sdkAccount = `import { AgentStackAccount } from 'agentstack-sdk'

const account = new AgentStackAccount({
  accountKey: 'agnt_acct_your_account_key',
})`

const sdkListProjects = `const projects = await account.listProjects()`

const sdkCreateProject = `const { token } = await account.createProject('my-agent')`
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-16 pt-20 lg:flex-row lg:items-start lg:gap-10">
    <aside class="w-full shrink-0 lg:sticky lg:top-20 lg:w-56">
      <nav class="rounded-xl border border-border bg-card p-2 pt-3 text-sm">
        <ul class="flex flex-col">
          <li>
            <a :href="'#using-with-an-agent'" :class="navLink">
              <span class="font-medium">How to use with Agent</span>
            </a>
          </li>
          <li>
            <a :href="'#authentication'" :class="navLink">
              <span class="font-medium">Authentication</span>
            </a>
          </li>
        </ul>

        <p :class="sectionLabel">cURL</p>
        <ul class="flex flex-col">
          <li v-for="item in curlItems" :key="item.id">
            <a :href="`#${item.id}`" :class="navLink">
              <span
                :class="cn(
                  'inline-flex w-10 shrink-0 justify-center rounded py-px text-[0.6rem] font-bold tracking-wide text-white',
                  item.method === 'POST' ? 'bg-green-600' : 'bg-blue-600',
                )"
              >
                {{ item.method }}
              </span>
              <span class="font-mono text-foreground/90">{{ item.label }}</span>
            </a>
          </li>
        </ul>

        <p :class="sectionLabel">SDK</p>
        <ul class="flex flex-col">
          <li v-for="item in sdkItems" :key="item.id">
            <a :href="`#${item.id}`" :class="navLink">
              <span class="font-mono text-[0.82rem] text-foreground/90">{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    <main class="flex min-w-0 flex-1 flex-col gap-5">
      <header>
        <h1 class="text-2xl font-semibold">API Documentation</h1>
        <p class="mt-1 text-muted-foreground">
          Send logs to a project and read them back — over plain HTTP (cURL) or with the
          <a href="#sdk-install" :class="crossLink">agentstack-sdk</a> package.
        </p>
      </header>

      <Card id="using-with-an-agent" class="scroll-mt-24">
        <CardHeader>
          <CardTitle>How to use with Agent</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-3 text-sm leading-normal">
          <p>
            AgentStack lets an AI agent (or any automated service) log what it does and read those
            logs back later. Use raw HTTP requests or install the
            <a href="#sdk-install" :class="crossLink">SDK</a> from GitHub.
          </p>

          <h3 class="text-[0.95rem] font-semibold">Get your API key</h3>
          <ol class="list-decimal space-y-1.5 pl-5">
            <li>
              <RouterLink to="/dashboard" class="underline underline-offset-2 hover:text-foreground">
                Open the dashboard
              </RouterLink>
              and select a project (or create one).
            </li>
            <li>Click <strong>Add to my project</strong>.</li>
            <li>
              Copy the API key shown there. If you only see the first characters, click
              <strong>Roll</strong> to generate a new key — the full token is shown once, so copy
              it immediately.
            </li>
            <li>Store the key in your agent's config and pass it on every request.</li>
          </ol>

          <h3 class="text-[0.95rem] font-semibold">What your agent can do</h3>
          <ul class="list-disc space-y-1.5 pl-5">
            <li>
              <strong>Account-level</strong> — list and create projects with an account API key
              (<code :class="inlineCode">agnt_acct_…</code>).
            </li>
            <li>
              <strong>Project-level</strong> — write and read logs for one project with a project API
              key (<code :class="inlineCode">agnt_…</code>).
            </li>
          </ul>
          <p>
            See <a href="#authentication" :class="crossLink">Authentication</a> for key types, then
            pick <a href="#curl" :class="crossLink">cURL</a> or
            <a href="#sdk" :class="crossLink">SDK</a> below.
          </p>

          <h3 class="text-[0.95rem] font-semibold">Minimal example</h3>
          <pre class="overflow-x-auto rounded-lg border border-border bg-background p-3"><code class="font-mono text-[0.82rem]">{{ agentExample }}</code></pre>
        </CardContent>
      </Card>

      <Card id="authentication" class="scroll-mt-24">
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-3 text-sm leading-normal">
          <p>Every request is authenticated with a Bearer token. There are two kinds of key:</p>
          <ul class="list-disc space-y-1.5 pl-5">
            <li>
              <strong>Account API key</strong>
              (<code :class="inlineCode">agnt_acct_…</code>) — list and create projects. Manage it
              under
              <RouterLink to="/dashboard/api-keys" class="underline underline-offset-2 hover:text-foreground">
                Agent API keys
              </RouterLink>.
            </li>
            <li>
              <strong>Project API key</strong>
              (<code :class="inlineCode">agnt_…</code>) — write and read that project's logs.
            </li>
          </ul>
          <pre class="overflow-x-auto rounded-lg border border-border bg-background p-3"><code class="font-mono text-[0.82rem]">Authorization: Bearer agnt_acct_YOUR_ACCOUNT_KEY   # account-level
Authorization: Bearer agnt_YOUR_PROJECT_TOKEN      # project-level</code></pre>
        </CardContent>
      </Card>

      <h2 id="curl" class="scroll-mt-24 pt-2 text-lg font-semibold">cURL</h2>
      <p class="-mt-3 text-sm text-muted-foreground">
        Raw HTTP examples. Each endpoint has a matching
        <a href="#sdk" :class="crossLink">SDK method</a>.
      </p>

      <Card id="curl-get-projects" class="scroll-mt-24">
        <CardHeader>
          <CardTitle>GET /projects</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-3 text-sm leading-normal">
          <div class="flex items-center gap-2.5">
            <span class="rounded-md bg-blue-600 px-2 py-0.5 text-[0.7rem] font-bold tracking-wide text-white">GET</span>
            <code class="font-mono text-sm">{{ API_BASE }}/projects</code>
          </div>
          <p>
            List every project in the account, newest first. Each project includes
            <code :class="inlineCode">latest_log_at</code> — the timestamp of its most recent log (or
            <code :class="inlineCode">null</code> if empty).
          </p>
          <div class="rounded-lg border border-border bg-background/60 p-3 text-[0.82rem]">
            <strong>Authentication:</strong> account API key
            (<code :class="inlineCode">agnt_acct_…</code>).
          </div>
          <h3 class="text-[0.95rem] font-semibold">Example request</h3>
          <pre class="overflow-x-auto rounded-lg border border-border bg-background p-3"><code class="font-mono text-[0.82rem]">{{ projectsCurl }}</code></pre>
          <h3 class="text-[0.95rem] font-semibold">
            Response — <span class="font-mono text-xs font-bold text-green-400">200 OK</span>
          </h3>
          <pre class="overflow-x-auto rounded-lg border border-border bg-background p-3"><code class="font-mono text-[0.82rem]">{{ projectsResponse }}</code></pre>
          <p class="text-muted-foreground">
            SDK:
            <a href="#sdk-list-projects" :class="crossLink">listProjects()</a>
          </p>
        </CardContent>
      </Card>

      <Card id="curl-post-projects" class="scroll-mt-24">
        <CardHeader>
          <CardTitle>POST /projects</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-3 text-sm leading-normal">
          <div class="flex items-center gap-2.5">
            <span class="rounded-md bg-green-600 px-2 py-0.5 text-[0.7rem] font-bold tracking-wide text-white">POST</span>
            <code class="font-mono text-sm">{{ API_BASE }}/projects</code>
          </div>
          <p>Create a new project. The response includes the full project API token — shown once.</p>
          <div class="rounded-lg border border-border bg-background/60 p-3 text-[0.82rem]">
            <strong>Authentication:</strong> account API key
            (<code :class="inlineCode">agnt_acct_…</code>).
          </div>
          <h3 class="text-[0.95rem] font-semibold">Request body</h3>
          <table class="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th class="border-b border-border px-2.5 py-2 text-left font-semibold text-muted-foreground">Field</th>
                <th class="border-b border-border px-2.5 py-2 text-left font-semibold text-muted-foreground">Type</th>
                <th class="border-b border-border px-2.5 py-2 text-left font-semibold text-muted-foreground">Required</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border-b border-border px-2.5 py-2 align-top"><code :class="inlineCode">name</code></td>
                <td class="border-b border-border px-2.5 py-2 align-top">string</td>
                <td class="border-b border-border px-2.5 py-2 align-top">yes</td>
              </tr>
            </tbody>
          </table>
          <h3 class="text-[0.95rem] font-semibold">Example request</h3>
          <pre class="overflow-x-auto rounded-lg border border-border bg-background p-3"><code class="font-mono text-[0.82rem]">{{ createProjectCurl }}</code></pre>
          <h3 class="text-[0.95rem] font-semibold">
            Response — <span class="font-mono text-xs font-bold text-green-400">201 Created</span>
          </h3>
          <pre class="overflow-x-auto rounded-lg border border-border bg-background p-3"><code class="font-mono text-[0.82rem]">{{ createProjectResponse }}</code></pre>
          <p class="text-muted-foreground">
            SDK:
            <a href="#sdk-create-project" :class="crossLink">createProject()</a>
          </p>
        </CardContent>
      </Card>

      <Card id="curl-post-ingest" class="scroll-mt-24">
        <CardHeader>
          <CardTitle>POST /ingest</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-3 text-sm leading-normal">
          <div class="flex items-center gap-2.5">
            <span class="rounded-md bg-green-600 px-2 py-0.5 text-[0.7rem] font-bold tracking-wide text-white">POST</span>
            <code class="font-mono text-sm">{{ API_BASE }}/ingest</code>
          </div>
          <p>Create a single log event in the project the API key belongs to.</p>
          <div class="rounded-lg border border-border bg-background/60 p-3 text-[0.82rem]">
            <strong>Authentication:</strong> project API key
            (<code :class="inlineCode">agnt_…</code>).
          </div>
          <h3 class="text-[0.95rem] font-semibold">Request body</h3>
          <table class="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th class="border-b border-border px-2.5 py-2 text-left font-semibold text-muted-foreground">Field</th>
                <th class="border-b border-border px-2.5 py-2 text-left font-semibold text-muted-foreground">Type</th>
                <th class="border-b border-border px-2.5 py-2 text-left font-semibold text-muted-foreground">Required</th>
                <th class="border-b border-border px-2.5 py-2 text-left font-semibold text-muted-foreground">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border-b border-border px-2.5 py-2 align-top"><code :class="inlineCode">message</code></td>
                <td class="border-b border-border px-2.5 py-2 align-top">string</td>
                <td class="border-b border-border px-2.5 py-2 align-top">yes</td>
                <td class="border-b border-border px-2.5 py-2 align-top">The log line.</td>
              </tr>
              <tr>
                <td class="border-b border-border px-2.5 py-2 align-top"><code :class="inlineCode">level</code></td>
                <td class="border-b border-border px-2.5 py-2 align-top">string</td>
                <td class="border-b border-border px-2.5 py-2 align-top">no</td>
                <td class="border-b border-border px-2.5 py-2 align-top">
                  <code :class="inlineCode">info</code>, <code :class="inlineCode">warn</code>,
                  <code :class="inlineCode">error</code>, <code :class="inlineCode">debug</code>,
                  <code :class="inlineCode">fatal</code>. Defaults to <code :class="inlineCode">info</code>.
                </td>
              </tr>
              <tr>
                <td class="border-b border-border px-2.5 py-2 align-top"><code :class="inlineCode">metadata</code></td>
                <td class="border-b border-border px-2.5 py-2 align-top">object</td>
                <td class="border-b border-border px-2.5 py-2 align-top">no</td>
                <td class="border-b border-border px-2.5 py-2 align-top">Arbitrary structured fields.</td>
              </tr>
              <tr>
                <td class="border-b border-border px-2.5 py-2 align-top"><code :class="inlineCode">logged_at</code></td>
                <td class="border-b border-border px-2.5 py-2 align-top">string (ISO 8601)</td>
                <td class="border-b border-border px-2.5 py-2 align-top">no</td>
                <td class="border-b border-border px-2.5 py-2 align-top">When the event happened. Defaults to server receive time.</td>
              </tr>
            </tbody>
          </table>
          <h3 class="text-[0.95rem] font-semibold">Example request</h3>
          <pre class="overflow-x-auto rounded-lg border border-border bg-background p-3"><code class="font-mono text-[0.82rem]">{{ writeCurl }}</code></pre>
          <h3 class="text-[0.95rem] font-semibold">
            Response — <span class="font-mono text-xs font-bold text-green-400">202 Accepted</span>
          </h3>
          <pre class="overflow-x-auto rounded-lg border border-border bg-background p-3"><code class="font-mono text-[0.82rem]">{{ writeResponse }}</code></pre>
          <p class="text-muted-foreground">
            SDK:
            <a href="#sdk-log" :class="crossLink">Write logs</a>
            (<code :class="inlineCode">client.log.info</code>, etc.)
          </p>
        </CardContent>
      </Card>

      <Card id="curl-get-logs" class="scroll-mt-24">
        <CardHeader>
          <CardTitle>GET /logs</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-3 text-sm leading-normal">
          <div class="flex items-center gap-2.5">
            <span class="rounded-md bg-blue-600 px-2 py-0.5 text-[0.7rem] font-bold tracking-wide text-white">GET</span>
            <code class="font-mono text-sm">{{ API_BASE }}/logs</code>
          </div>
          <p>Read recent logs from the API key's project, newest first.</p>
          <div class="rounded-lg border border-border bg-background/60 p-3 text-[0.82rem]">
            <strong>Authentication:</strong> project API key
            (<code :class="inlineCode">agnt_…</code>).
          </div>
          <h3 class="text-[0.95rem] font-semibold">Query parameters</h3>
          <table class="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th class="border-b border-border px-2.5 py-2 text-left font-semibold text-muted-foreground">Param</th>
                <th class="border-b border-border px-2.5 py-2 text-left font-semibold text-muted-foreground">Default</th>
                <th class="border-b border-border px-2.5 py-2 text-left font-semibold text-muted-foreground">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border-b border-border px-2.5 py-2 align-top"><code :class="inlineCode">limit</code></td>
                <td class="border-b border-border px-2.5 py-2 align-top">15</td>
                <td class="border-b border-border px-2.5 py-2 align-top">How many logs to return. Capped at 100.</td>
              </tr>
              <tr>
                <td class="border-b border-border px-2.5 py-2 align-top"><code :class="inlineCode">offset</code></td>
                <td class="border-b border-border px-2.5 py-2 align-top">0</td>
                <td class="border-b border-border px-2.5 py-2 align-top">Logs to skip for pagination.</td>
              </tr>
            </tbody>
          </table>
          <h3 class="text-[0.95rem] font-semibold">Example request</h3>
          <pre class="overflow-x-auto rounded-lg border border-border bg-background p-3"><code class="font-mono text-[0.82rem]">{{ readCurl }}</code></pre>
          <h3 class="text-[0.95rem] font-semibold">
            Response — <span class="font-mono text-xs font-bold text-green-400">200 OK</span>
          </h3>
          <pre class="overflow-x-auto rounded-lg border border-border bg-background p-3"><code class="font-mono text-[0.82rem]">{{ readResponse }}</code></pre>
          <p class="text-muted-foreground">
            SDK:
            <a href="#sdk-get-logs" :class="crossLink">getLogs()</a>
          </p>
        </CardContent>
      </Card>

      <h2 id="sdk" class="scroll-mt-24 pt-2 text-lg font-semibold">SDK</h2>
      <p class="-mt-3 text-sm text-muted-foreground">
        TypeScript client installed from GitHub. Each method maps to a
        <a href="#curl" :class="crossLink">cURL endpoint</a> above.
      </p>

      <Card id="sdk-install" class="scroll-mt-24">
        <CardHeader>
          <CardTitle>Install</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-3 text-sm leading-normal">
          <p>
            Install <code :class="inlineCode">agentstack-sdk</code> directly from the repo — no npm
            registry required.
          </p>
          <pre class="overflow-x-auto rounded-lg border border-border bg-background p-3"><code class="font-mono text-[0.82rem]">{{ sdkInstall }}</code></pre>
        </CardContent>
      </Card>

      <Card id="sdk-agent-stack" class="scroll-mt-24">
        <CardHeader>
          <CardTitle>Get started</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-3 text-sm leading-normal">
          <p>
            Project-level client. Pass your project API token in the constructor — the SDK does not
            read credentials from environment variables.
          </p>
          <pre class="overflow-x-auto rounded-lg border border-border bg-background p-3"><code class="font-mono text-[0.82rem]">{{ sdkAgentStack }}</code></pre>
        </CardContent>
      </Card>

      <Card id="sdk-log" class="scroll-mt-24">
        <CardHeader>
          <CardTitle>Write logs</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-3 text-sm leading-normal">
          <p>
            Send one log per call via <code :class="inlineCode">client.log</code>. Optional
            <code :class="inlineCode">metadata</code> object on every level.
          </p>
          <pre class="overflow-x-auto rounded-lg border border-border bg-background p-3"><code class="font-mono text-[0.82rem]">{{ sdkLog }}</code></pre>
          <p class="text-muted-foreground">
            HTTP:
            <a href="#curl-post-ingest" :class="crossLink">POST /ingest</a>
          </p>
        </CardContent>
      </Card>

      <Card id="sdk-get-logs" class="scroll-mt-24">
        <CardHeader>
          <CardTitle>getLogs()</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-3 text-sm leading-normal">
          <p>Read logs with optional <code :class="inlineCode">limit</code>, <code :class="inlineCode">offset</code>, <code :class="inlineCode">from</code>, and <code :class="inlineCode">to</code> filters.</p>
          <pre class="overflow-x-auto rounded-lg border border-border bg-background p-3"><code class="font-mono text-[0.82rem]">{{ sdkGetLogs }}</code></pre>
          <p class="text-muted-foreground">
            HTTP:
            <a href="#curl-get-logs" :class="crossLink">GET /logs</a>
          </p>
        </CardContent>
      </Card>

      <Card id="sdk-agent-stack-account" class="scroll-mt-24">
        <CardHeader>
          <CardTitle>AgentStackAccount</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-3 text-sm leading-normal">
          <p>Account-level client for project discovery and creation. Requires an account API key.</p>
          <pre class="overflow-x-auto rounded-lg border border-border bg-background p-3"><code class="font-mono text-[0.82rem]">{{ sdkAccount }}</code></pre>
        </CardContent>
      </Card>

      <Card id="sdk-list-projects" class="scroll-mt-24">
        <CardHeader>
          <CardTitle>listProjects()</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-3 text-sm leading-normal">
          <pre class="overflow-x-auto rounded-lg border border-border bg-background p-3"><code class="font-mono text-[0.82rem]">{{ sdkListProjects }}</code></pre>
          <p class="text-muted-foreground">
            HTTP:
            <a href="#curl-get-projects" :class="crossLink">GET /projects</a>
          </p>
        </CardContent>
      </Card>

      <Card id="sdk-create-project" class="scroll-mt-24">
        <CardHeader>
          <CardTitle>createProject()</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-3 text-sm leading-normal">
          <pre class="overflow-x-auto rounded-lg border border-border bg-background p-3"><code class="font-mono text-[0.82rem]">{{ sdkCreateProject }}</code></pre>
          <p class="text-muted-foreground">
            HTTP:
            <a href="#curl-post-projects" :class="crossLink">POST /projects</a>
          </p>
        </CardContent>
      </Card>
    </main>
  </div>
</template>
