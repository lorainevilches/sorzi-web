# Sorzi Engine 🎲

> Engine robusta de geração e simulação de jogos para loterias da Caixa Econômica Federal.

![Sorzi Engine Cover](./public/images/idv.png)

## Sobre o Projeto

O **Sorzi Engine** é uma aplicação web de alta performance desenvolvida para gerar combinações numéricas criptograficamente seguras para jogos de loteria (Mega Sena, Quina, Lotofácil, etc.). O projeto se destaca pela experiência de usuário (UX) fluida, animações de estado complexas e uma arquitetura limpa e escalável.

🔗 **Demo:** [Acesse o projeto online](https://sorzi-engine.vercel.app) _(Substitua pelo seu link real)_

### Principais Funcionalidades

- **Múltiplas Loterias:** Suporte nativo para Mega Sena, Quina, Lotofácil, Lotomania, Dupla Sena e +Milionária.
- **Segurança Criptográfica:** Geração de números aleatórios utilizando `crypto.getRandomValues()` em vez de `Math.random()`, garantindo entropia real e distribuição uniforme.
- **Configuração Dinâmica:** Ajuste flexível de quantidade de dezenas (ex: jogar com 7, 8... 15 números) e quantidade de jogos simultâneos.
- **Engine States:** Transições de layout suaves entre o estado de configuração ("Idle") e resultados ("Generated") utilizando Framer Motion.
- **Design Responsivo:** Interface adaptada para Mobile, Tablet e Desktop com Tailwind CSS.

## Tecnologias

- **[Next.js 14](https://nextjs.org/)** (App Router) - Framework React.
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática rigorosa.
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilização moderna e utilitária.
- **[Framer Motion](https://www.framer.com/motion/)** - Orquestração de animações e transições de layout (`layout prop`).
- **[Lucide React](https://lucide.dev/)** - Ícones leves e consistentes.

## Arquitetura e Lógica

### Estrutura de Diretórios

O projeto segue uma estrutura modular, separando lógica de negócio, interface e configurações.

````bash
src/
├── app/
│   ├── page.tsx           # Controller principal (Gerencia estados, Lifted State e Renderização condicional)
│   └── layout.tsx         # Layout global e fontes
├── components/
│   ├── GameGenerator.tsx  # Componente "Dumb" de UI (Recebe props e emite eventos)
│   └── Background.tsx     # Fundo animado (Carregamento dinâmico via ssr: false)
├── config/
│   └── lotteries.ts       # Regras de Negócio: Definição de ranges, mínimos/máximos e metadados de cada loteria.
└── lib/
    └── generator.ts       # Core Lógico: Algoritmos de geração de números (CSPRNG).

---

### O Algoritmo de Geração (`generator.ts`)

Ao contrário de geradores comuns que usam `Math.random()` (que não é seguro para aplicações de sorteio real), o Sorzi Engine implementa um algoritmo **CSPRNG** (*Cryptographically Secure Pseudo-Random Number Generator*).

* **Uniformidade:** Utilizamos *Rejection Sampling* para evitar o "modulo bias", garantindo que todos os números tenham exatamente a mesma probabilidade de serem sorteados.
* **Unicidade:** Validação via `Set<number>` para garantir que não existam números repetidos dentro do mesmo jogo.
* **Ordenação:** Entrega os resultados sempre ordenados de forma ascendente para facilitar a leitura visual.

---

## Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/SEU_USUARIO/sorzi-engine.git](https://github.com/SEU_USUARIO/sorzi-engine.git)
   cd sorzi-engine
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Rode o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.**

---

## Design System

O projeto utiliza uma paleta escura ("Dark Mode" nativo) baseada na escala **Zinc** do Tailwind, com uma cor de destaque (_Accent_) configurável.

- **Background:** Zinc 950/900
- **Surface/Panels:** Zinc 900 com bordas sutis (Zinc 800)
- **Text:** Zinc 100 (Primary), Zinc 400 (Secondary)
- **Accent:** Verde Neon (Customizável via CSS Variables)

---
````
