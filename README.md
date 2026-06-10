# ♟️ Jogo de Xadrez Online — SESI Brotas & SENAI Jaú

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-black?style=for-the-badge&logo=socketdotio)
![Stockfish](https://img.shields.io/badge/Stockfish-Chess%20AI-green?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker)
![Terraform](https://img.shields.io/badge/Terraform-IaC-7B42BC?style=for-the-badge&logo=terraform)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-CI%2FCD-2088FF?style=for-the-badge&logo=githubactions)
![Android](https://img.shields.io/badge/Android-Capacitor-3DDC84?style=for-the-badge&logo=android)

</div>

---

## 📖 Sobre o Projeto

O **Jogo de Xadrez Online** é um projeto integrador desenvolvido em parceria entre o **SESI Brotas** e o **SENAI Jaú**, com o objetivo de unir tecnologia, estratégia e desenvolvimento de software moderno em uma plataforma completa para ensino, treinamento e competição de xadrez.

O projeto foi concebido utilizando práticas profissionais de desenvolvimento Full Stack, DevOps, Computação em Nuvem, Infraestrutura como Código e Inteligência Artificial, proporcionando uma experiência próxima à encontrada em aplicações corporativas modernas.

Além do aspecto educacional, o sistema serve como laboratório prático para aplicação de conceitos de:

- Desenvolvimento Web
- Programação em Tempo Real
- Inteligência Artificial
- Computação em Nuvem
- DevOps
- Mobile Development
- Infraestrutura como Código

---

# 🚀 Funcionalidades

## ♟️ Modo Solo

Pratique livremente utilizando o tabuleiro interativo.

### Recursos

- Movimentação completa das peças
- Validação das regras do xadrez
- Relógio de partida
- Controle de turnos
- Interface responsiva

---

## 🌐 Multiplayer em Tempo Real

Dispute partidas online utilizando WebSockets.

### Recursos

- Criação de salas privadas
- Compartilhamento de código de sala
- Sincronização em tempo real
- Controle de turnos pelo servidor
- Validação de movimentos no backend
- Relógio sincronizado
- Detecção de vitória

---

## 🤖 Inteligência Artificial (Stockfish)

O projeto integra a engine de xadrez mais utilizada do mundo.

### Modo Treinamento

Disponível exclusivamente no modo Solo.

Permite:

- Solicitar sugestões de jogadas
- Receber a melhor jogada da posição atual
- Avaliar a posição do tabuleiro

Exemplo:

```text
💡 Sugestão:
Cavalo para F3

📊 Avaliação:
+1.3
Vantagem das Brancas
```

---

## 🧠 Jogar Contra IA

Modo dedicado para partidas contra o computador.

### Níveis disponíveis

#### 🟢 Iniciante

- Depth 5
- Comete erros
- Ideal para iniciantes

#### 🟡 Intermediário

- Depth 10
- Boa estratégia
- Boa tática

#### 🔴 Avançado

- Depth 15+
- Análise profunda
- Difícil de derrotar

---

## ⏱️ Relógio de Partida

Cada jogador possui controle de tempo individual.

### Recursos

- Contagem regressiva
- Alternância automática
- Vitória por tempo

---

## 🏆 Sistema de Campeão

Ao final da partida:

- Exibe vencedor
- Bloqueia novos movimentos
- Exibe mensagem de resultado

---

## 📱 Aplicativo Android

O projeto também pode ser executado como aplicativo Android.

### Tecnologias

- Capacitor
- Android SDK
- Gradle

### Distribuição

- APK gerado automaticamente
- Pipeline CI/CD
- Releases automatizadas

---

# 🏗️ Arquitetura

```text
                    ┌─────────────────────┐
                    │      Android        │
                    │     Capacitor       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Frontend       │
                    │      Next.js        │
                    │       Vercel        │
                    └──────────┬──────────┘
                               │
                               │ Socket.IO
                               ▼
                    ┌─────────────────────┐
                    │      Backend        │
                    │ Express + Socket.IO │
                    │       Render        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Stockfish      │
                    │    Chess Engine     │
                    └─────────────────────┘
```

---

# 🛠️ Tecnologias Utilizadas

## Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS

## Backend

- Node.js
- Express
- Socket.IO

## Inteligência Artificial

- Stockfish

## DevOps

- Docker
- Docker Compose
- GitHub Actions

## Infraestrutura

- Terraform

## Cloud

- Vercel
- Render

## Mobile

- Capacitor
- Android

---

# ☁️ Deploy

## Frontend

Hospedado na Vercel.

Responsável por:

- Interface do usuário
- Modo Solo
- Integração com IA
- Comunicação WebSocket

---

## Backend

Hospedado no Render.

Responsável por:

- Multiplayer
- Controle de salas
- Sincronização
- Validação de jogadas

---

# ⚙️ CI/CD

O projeto utiliza GitHub Actions para automação.

## Pipelines

### Continuous Integration

Executa automaticamente:

```bash
npm install
npm run build
terraform validate
```

---

### Android Build

Executa automaticamente:

```bash
Capacitor Sync
Gradle Build
APK Generation
```

---

### GitHub Releases

A cada atualização:

```text
Push
 ↓
Build APK
 ↓
Release Automática
 ↓
Disponibilização para Download
```

---

# 🐳 Executando com Docker

## Pré-requisitos

- Docker Desktop

---

## Executar aplicação

```bash
docker compose up --build
```

Frontend:

```text
http://localhost:3001
```

Backend:

```text
http://localhost:4000
```

---

## Encerrar containers

```bash
docker compose down
```

---

# 🏗️ Infraestrutura como Código

O projeto utiliza Terraform para documentação e gerenciamento da infraestrutura.

### Recursos contemplados

- Frontend
- Backend
- Ambientes Cloud
- Estrutura DevOps

---

# 📱 Build Android Local

Gerar APK:

```bash
cd android
./gradlew assembleDebug
```

APK gerado em:

```text
android/app/build/outputs/apk/debug
```

---

# 🎯 Objetivos Educacionais

Este projeto foi desenvolvido para demonstrar, na prática, conceitos de:

- Programação Web Moderna
- Arquiteturas Cloud Native
- WebSockets
- DevOps
- Docker
- Terraform
- CI/CD
- Inteligência Artificial
- Desenvolvimento Mobile
- Integração Frontend e Backend

---

# 🗺️ Roadmap

## Versão Atual

- [x] Modo Solo
- [x] Multiplayer Online
- [x] Controle de Tempo
- [x] Sistema de Campeão
- [x] Sugestões por IA
- [x] Avaliação de Posição
- [x] IA Iniciante
- [x] IA Intermediária
- [x] IA Avançada
- [x] APK Android
- [x] GitHub Actions
- [x] Docker
- [x] Terraform
- [x] GitHub Releases

---

## Próximas Versões

- [ ] APK Release Assinado
- [ ] Publicação na Google Play Store
- [ ] Monitoramento e Observabilidade
- [ ] Health Check do Backend
- [ ] Dashboard de Estatísticas
- [ ] Histórico de Partidas
- [ ] Ranking de Jogadores
- [ ] Integração com IA Local (Ollama)
- [ ] Treinador Virtual de Xadrez
- [ ] Análise Pós-Partida com IA

---

# 👨‍💻 Desenvolvimento

Projeto Integrador desenvolvido em parceria entre:

### 🏫 SENAI Jaú

Formação técnica e desenvolvimento de software.

### 🏫 SESI Brotas

Aplicação educacional e validação do projeto.

---

# 📄 Licença

Projeto desenvolvido para fins educacionais, acadêmicos e demonstração tecnológica.

---

<div align="center">

### ♟️ Tecnologia, Estratégia e Inovação em uma única plataforma.

**SESI Brotas • SENAI Jaú**

</div>