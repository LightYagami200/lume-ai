# Lume

> Conversational AI, made modular, magical, and super cute! 🌙✨

Build magical conversational AI apps with **Lume**: a TypeScript library for plug-and-play LLMs, histories, vector DBs, and genes (personalities).

---

## 📚 Table of Contents

- [Features](#features)
- [Super Quickstart](#super-quickstart)
- [LLMs](#llms)
- [History](#history)
- [Vector DBs](#vector-dbs)
- [Genes (Personalities)](#genes-personalities)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)
- [License](#license)

---

## ✨ Features

- **Modular LLMs:** OpenAI & Anthropic out of the box
- **Flexible History:** In-memory or Redis
- **Vector DBs:** Vectra (local) or Pinecone (cloud)
- **Customizable Genes:** Friendly or Custom personalities
- **Taggable Sessions:** Keep user sessions/context separate
- **TypeScript First:** Fully typed, super safe, and modern

---

## ⚡ Super Quickstart

```ts
import { Lume } from 'lume-ai'
import { OpenAI } from 'lume-ai/llms'

const lume = new Lume({ llm: new OpenAI('YOUR_OPENAI_KEY') })
const response = await lume.chat('Hello!')
console.log(response)
```

---

## 🤖 LLMs

Lume supports multiple LLM providers. Just pick your favorite!

| Plugin    | Import Path  | Required Params |
| --------- | ------------ | --------------- |
| OpenAI    | lume-ai/llms | apiKey: string  |
| Anthropic | lume-ai/llms | apiKey: string  |

### OpenAI Params

| Param       | Type   | Default       | Description            |
| ----------- | ------ | ------------- | ---------------------- |
| apiKey      | string | —             | Your OpenAI API key    |
| model       | string | 'gpt-4o-mini' | Model name             |
| temperature | number | 0.5           | Sampling temperature   |
| maxTokens   | number | 1000          | Max tokens in response |
| topP        | number | 1             | Nucleus sampling       |

### Anthropic Params

| Param       | Type   | Default                    | Description            |
| ----------- | ------ | -------------------------- | ---------------------- |
| apiKey      | string | —                          | Your Anthropic API key |
| model       | string | 'claude-3-5-sonnet-latest' | Model name             |
| temperature | number | 0.5                        | Sampling temperature   |
| maxTokens   | number | 1000                       | Max tokens in response |
| topP        | number | 1                          | Nucleus sampling       |

---

## 🗃️ History

Store chat history in-memory (for dev) or Redis (for scale).

| Plugin | Import Path       | Required Params  |
| ------ | ----------------- | ---------------- |
| Memory | lume-ai/histories | —                |
| Redis  | lume-ai/histories | redisUrl?:string |

### Redis Params

| Param    | Type   | Default   | Description          |
| -------- | ------ | --------- | -------------------- |
| redisUrl | string | localhost | Redis connection URL |

---

## 🧠 Vector DBs

Add context and memory with vector search! Use local or cloud.

| Plugin   | Import Path        | Required Params                                      |
| -------- | ------------------ | ---------------------------------------------------- |
| Vectra   | lume-ai/vector-dbs | path: string                                         |
| Pinecone | lume-ai/vector-dbs | apiKey: string, indexName: string, namespace: string |

### Vectra Params

| Param | Type   | Description               |
| ----- | ------ | ------------------------- |
| path  | string | Filesystem path for index |

### Pinecone Params

| Param     | Type   | Description         |
| --------- | ------ | ------------------- |
| apiKey    | string | Pinecone API key    |
| indexName | string | Pinecone index name |
| namespace | string | Pinecone namespace  |

---

## 🎭 Genes (Personalities)

Change your AI's vibe! Choose a friendly assistant or roll your own.

| Plugin   | Import Path   | Params (all optional)                                               |
| -------- | ------------- | ------------------------------------------------------------------- |
| Friendly | lume-ai/genes | name, gender, sassiness, memoryLength, cheerfulness, model          |
| Custom   | lume-ai/genes | systemPrompt, model, maxHistory, topK, temperature, maxTokens, topP |

### Friendly Params

| Param        | Type                      | Default   | Description                    |
| ------------ | ------------------------- | --------- | ------------------------------ |
| name         | string                    | 'Lume'    | Assistant's name               |
| gender       | 'male'\|'female'          | 'female'  | Gender                         |
| sassiness    | number                    | 3         | 0-10, how sassy?               |
| memoryLength | 'short'\|'medium'\|'long' | 'medium'  | How much history to remember   |
| cheerfulness | number                    | 8         | 0-10, how cheerful?            |
| model        | string                    | undefined | Model name (overrides default) |

### Custom Params

| Param        | Type   | Default   | Description            |
| ------------ | ------ | --------- | ---------------------- |
| systemPrompt | string | see code  | System prompt template |
| model        | string | undefined | Model name             |
| maxHistory   | number | 5         | Max history turns      |
| topK         | number | 5         | Top-k sampling         |
| temperature  | number | 0.5       | Sampling temperature   |
| maxTokens    | number | 1000      | Max tokens in response |
| topP         | number | 1         | Nucleus sampling       |

---

## 🧪 Usage Examples

### Use OpenAI with Memory

```ts
import { Lume } from 'lume-ai'
import { OpenAI } from 'lume-ai/llms'
import { Memory } from 'lume-ai/histories'

const lume = new Lume({
  llm: new OpenAI('YOUR_OPENAI_KEY'),
  history: new Memory(),
})
```

### Use Anthropic with Redis

```ts
import { Lume } from 'lume-ai'
import { Anthropic } from 'lume-ai/llms'
import { Redis } from 'lume-ai/histories'

const lume = new Lume({
  llm: new Anthropic('YOUR_ANTHROPIC_KEY'),
  history: new Redis('redis://localhost:6379'),
})
```

### Add Vector DB (Vectra)

```ts
import { Vectra } from 'lume-ai/vector-dbs'
const lume = new Lume({
  llm: new OpenAI('YOUR_OPENAI_KEY'),
  vectorDB: new Vectra('./my-index'),
})
```

### Change Personality (Gene)

```ts
import { Friendly } from 'lume-ai/genes'
const lume = new Lume({
  llm: new OpenAI('YOUR_OPENAI_KEY'),
  gene: new Friendly({ name: 'Luna', sassiness: 8 }),
})
```

---

## 🛠️ API Reference

### Lume

```ts
new Lume({ llm, history, vectorDB, gene })
```

- `llm`: Required. An LLM instance (OpenAI, Anthropic, etc)
- `history`: Optional. A history plugin (Memory, Redis)
- `vectorDB`: Optional. A vector DB plugin (Vectra, Pinecone)
- `gene`: Optional. A gene/personality (Friendly, Custom)

#### Methods

- `chat(text: string, options?: { tags?: string[] })`: Promise<string>
- `chatStream(text: string, options?: { tags?: string[] })`: AsyncGenerator<string>

---

## 📝 License

MIT — Use, share, and make something awesome!

---
