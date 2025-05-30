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

- **Modular LLMs:** OpenAI, Anthropic & Gemini out of the box
- **Flexible History:** In-memory, Redis, or SQLite
- **Vector DBs:** Vectra (local), Pinecone (cloud), or Qdrant (cloud)
- **Customizable Genes:** Friendly, Professional, Flirty, or Custom personalities
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
| Gemini    | lume-ai/llms | apiKey: string  |

### OpenAI Params

| Param  | Type   | Default | Description         |
| ------ | ------ | ------- | ------------------- |
| apiKey | string | —       | Your OpenAI API key |

### Anthropic Params

| Param  | Type   | Default | Description            |
| ------ | ------ | ------- | ---------------------- |
| apiKey | string | —       | Your Anthropic API key |

### Gemini Params

| Param  | Type   | Default | Description         |
| ------ | ------ | ------- | ------------------- |
| apiKey | string | —       | Your Gemini API key |

---

## 🗃️ History

Store chat history in-memory (for dev), Redis (for scale), or SQLite (for local persistence).

| Plugin | Import Path       | Required Params  |
| ------ | ----------------- | ---------------- |
| Memory | lume-ai/histories | —                |
| Redis  | lume-ai/histories | redisUrl?:string |
| SQLite | lume-ai/histories | dbPath?:string   |

### Redis Params

| Param    | Type   | Default   | Description          |
| -------- | ------ | --------- | -------------------- |
| redisUrl | string | localhost | Redis connection URL |

### SQLite Params

| Param  | Type   | Default   | Description                |
| ------ | ------ | --------- | -------------------------- |
| dbPath | string | memory.db | SQLite DB file path (opt.) |

---

## 🧠 Vector DBs

Add context and memory with vector search! Use local or cloud.

| Plugin   | Import Path        | Required Params                                      |
| -------- | ------------------ | ---------------------------------------------------- |
| Vectra   | lume-ai/vector-dbs | path: string                                         |
| Pinecone | lume-ai/vector-dbs | apiKey: string, indexName: string, namespace: string |
| Qdrant   | lume-ai/vector-dbs | apiKey: string, collectionName: string, url: string  |

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

### Qdrant Params

| Param          | Type   | Description            |
| -------------- | ------ | ---------------------- |
| apiKey         | string | Qdrant API key         |
| collectionName | string | Qdrant collection name |
| url            | string | Qdrant server URL      |

---

## 🎭 Genes (Personalities)

Change your AI's vibe! Choose a friendly, professional, flirty assistant or roll your own.

| Plugin       | Import Path   | Params (all optional)                                               |
| ------------ | ------------- | ------------------------------------------------------------------- |
| Friendly     | lume-ai/genes | name, gender, sassiness, memoryLength, cheerfulness, model          |
| Professional | lume-ai/genes | name, expertise, formality, memoryLength, model                     |
| Flirty       | lume-ai/genes | name, gender, flirtiness, memoryLength, model                       |
| Custom       | lume-ai/genes | systemPrompt, model, maxHistory, topK, temperature, maxTokens, topP |

### Friendly Params

| Param        | Type                      | Default   | Description                    |
| ------------ | ------------------------- | --------- | ------------------------------ |
| name         | string                    | 'Lume'    | Assistant's name               |
| gender       | 'male'\|'female'          | 'female'  | Gender                         |
| sassiness    | number                    | 3         | 0-10, how sassy?               |
| memoryLength | 'short'\|'medium'\|'long' | 'medium'  | How much history to remember   |
| cheerfulness | number                    | 8         | 0-10, how cheerful?            |
| model        | string                    | undefined | Model name (overrides default) |

### Professional Params

| Param        | Type                                                   | Default    | Description                    |
| ------------ | ------------------------------------------------------ | ---------- | ------------------------------ |
| name         | string                                                 | 'Lume Pro' | Assistant's name               |
| expertise    | 'general'\|'technical'\|'business'\|'legal'\|'medical' | 'general'  | Area of expertise              |
| formality    | number                                                 | 8          | 0-10, how formal?              |
| memoryLength | 'short'\|'medium'\|'long'                              | 'medium'   | How much history to remember   |
| model        | string                                                 | undefined  | Model name (overrides default) |

### Flirty Params

| Param        | Type                          | Default   | Description                    |
| ------------ | ----------------------------- | --------- | ------------------------------ |
| name         | string                        | 'Lume'    | Assistant's name               |
| gender       | 'male'\|'female'\|'nonbinary' | 'female'  | Gender                         |
| flirtiness   | number                        | 7         | 0-10, how flirty?              |
| memoryLength | 'short'\|'medium'\|'long'     | 'medium'  | How much history to remember   |
| model        | string                        | undefined | Model name (overrides default) |

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

### Use Gemini with SQLite

```ts
import { Lume } from 'lume-ai'
import { Gemini } from 'lume-ai/llms'
import { SQLite } from 'lume-ai/histories'

const lume = new Lume({
  llm: new Gemini('YOUR_GEMINI_KEY'),
  history: new SQLite('./my-history.db'),
})
```

### Use Qdrant Vector DB

```ts
import { Qdrant } from 'lume-ai/vector-dbs'
const lume = new Lume({
  llm: new OpenAI('YOUR_OPENAI_KEY'),
  vectorDB: new Qdrant({
    apiKey: 'YOUR_QDRANT_KEY',
    collectionName: 'my-collection',
    url: 'https://qdrant.example.com',
  }),
})
```

### Change Personality (Professional or Flirty)

```ts
import { Professional, Flirty } from 'lume-ai/genes'
const lumePro = new Lume({
  llm: new OpenAI('YOUR_OPENAI_KEY'),
  gene: new Professional({
    name: 'Luna Pro',
    expertise: 'technical',
    formality: 10,
  }),
})
const lumeFlirty = new Lume({
  llm: new OpenAI('YOUR_OPENAI_KEY'),
  gene: new Flirty({ name: 'Luna', flirtiness: 10 }),
})
```

---

## 🛠️ API Reference

### Lume

```ts
new Lume({ llm, history, vectorDB, gene })
```

- `llm`: Required. An LLM instance (OpenAI, Anthropic, etc)
- `history`: Optional. A history plugin (Memory, Redis, SQLite)
- `vectorDB`: Optional. A vector DB plugin (Vectra, Pinecone, Qdrant)
- `gene`: Optional. A gene/personality (Friendly, Professional, Flirty, Custom)

#### Methods

- `chat(text: string, options?: { tags?: string[] }): Promise<string>`
