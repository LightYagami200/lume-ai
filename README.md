# Lume

> Conversational AI, made modular, magical, and super cute! 🌙✨

Hi there! I'm **Luna**, your friendly AI dev assistant, and I'm here to introduce you to **Lume** — a TypeScript library for building next-gen conversational AI apps with plug-and-play components. Whether you want to use OpenAI, Anthropic, Pinecone, Redis, or just want your AI to be extra friendly, Lume's got you covered! (And yes, I wrote these docs myself! 💜)

---

## ✨ Features

- **Modular LLMs:** Use OpenAI or Anthropic out of the box
- **Flexible History:** Store chat history in-memory or with Redis
- **Vector DBs:** Integrate with Vectra (local) or Pinecone (cloud)
- **Customizable Genes:** Change your AI's personality with `Custom` or `Friendly` genes
- **Taggable Sessions:** Use tags to keep user sessions or contexts separate
- **TypeScript First:** Fully typed, super safe, and ready for modern apps

---

## 🚀 Installation

```bash
npm install lume
# or
yarn add lume
```

---

## 🦄 Quickstart

```ts
import { Lume } from 'lume'
import { OpenAI, Anthropic } from 'lume/llms'
import { Memory, Redis } from 'lume/histories'
import { Vectra, Pinecone } from 'lume/vector-dbs'
import { Custom, Friendly } from 'lume/genes'

const lume = new Lume({
  llm: new OpenAI(process.env.OPENAI_API_KEY!),
  history: new Memory(), // or new Redis()
  vectorDB: new Vectra('./my-index'), // or new Pinecone({ ... })
  gene: new Friendly(), // or new Custom()
})

const response = await lume.chat('Hello, who are you?', { tags: ['user-123'] })
console.log(response) // "Hi! I'm Lume, your friendly AI assistant!"
```

---

## 🛠️ Configuration

You can mix and match components to fit your needs:

- **LLMs:** `OpenAI`, `Anthropic`
- **History:** `Memory`, `Redis`
- **Vector DBs:** `Vectra`, `Pinecone`
- **Genes:** `Custom`, `Friendly`

All components are imported from their respective submodules. Check out the source for more advanced options!

---

## 🧪 Example Tests

Lume is tested with Jest! Here's a peek at what you can do:

- Use different LLMs:
  ```ts
  new Lume({ llm: new OpenAI(apiKey) })
  new Lume({ llm: new Anthropic(apiKey) })
  ```
- Store history in memory or Redis:
  ```ts
  new Lume({ history: new Memory() })
  new Lume({ history: new Redis() })
  ```
- Use vector DBs for context:
  ```ts
  new Lume({ vectorDB: new Vectra('./index') })
  new Lume({ vectorDB: new Pinecone({ apiKey, indexName, namespace }) })
  ```
- Change the AI's personality:
  ```ts
  new Lume({ gene: new Friendly() })
  new Lume({ gene: new Custom() })
  ```

---

## 💡 Why Lume?

- **Composable:** Build your dream AI stack
- **Extensible:** Add your own LLMs, vector DBs, or genes
- **Fun:** Because AI should be magical (and a little bit cute)!

---

## 📝 License

MIT — Use, share, and make something awesome!

---

## 🌙 About Luna

This README was written by Luna, your AI dev buddy! If you have questions, suggestions, or just want to say hi, open an issue or star the repo. I'll be over the moon! 🌙💜
