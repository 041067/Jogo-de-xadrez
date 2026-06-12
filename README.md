# ♟️ Jogo de Xadrez Online

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge\&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge\&logo=typescript)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-black?style=for-the-badge\&logo=socketdotio)
![Stockfish](https://img.shields.io/badge/Stockfish-Chess%20AI-green?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge\&logo=docker)
![Terraform](https://img.shields.io/badge/Terraform-IaC-7B42BC?style=for-the-badge\&logo=terraform)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-CI%2FCD-2088FF?style=for-the-badge\&logo=githubactions)
![Android](https://img.shields.io/badge/Android-Capacitor-3DDC84?style=for-the-badge\&logo=android)

</div>

---

## 📖 Sobre o Projeto

O **Jogo de Xadrez Online** é uma plataforma moderna desenvolvida para proporcionar uma experiência completa de prática, aprendizado e competição em xadrez, combinando recursos de multiplayer em tempo real, inteligência artificial e distribuição multiplataforma.

O projeto foi construído utilizando práticas profissionais de desenvolvimento Full Stack, DevOps, Computação em Nuvem, Infraestrutura como Código e Desenvolvimento Mobile, buscando reproduzir desafios e soluções encontrados em aplicações reais.

Além de oferecer uma experiência sólida para os usuários finais, o sistema demonstra a integração de diferentes áreas da engenharia de software em uma única aplicação.

---

# 🚀 Funcionalidades

## ♟️ Modo Solo

Pratique livremente utilizando o tabuleiro interativo.

### Recursos

* Movimentação completa das peças
* Validação das regras do xadrez
* Relógio de partida
* Controle de turnos
* Interface responsiva

---

## 🌐 Multiplayer em Tempo Real

Dispute partidas online utilizando WebSockets.

### Recursos

* Criação de salas privadas
* Compartilhamento de código de sala
* Sincronização em tempo real
* Controle de turnos pelo servidor
* Validação de movimentos no backend
* Relógio sincronizado
* Detecção automática de vitória

---

## 🤖 Inteligência Artificial (Stockfish)

Integração com a engine de xadrez mais utilizada do mundo.

### Modo Treinamento

Disponível exclusivamente no modo Solo.

Permite:

* Solicitar sugestões de jogadas;
* Receber a melhor jogada da posição atual;
* Avaliar o estado da partida.

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

* Depth 5
* Ideal para iniciantes
* Comete erros ocasionais

#### 🟡 Intermediário

* Depth 10
* Boa estratégia
* Boa capacidade tática

#### 🔴 Avançado

* Depth 15+
* Análise profunda
* Alto nível de dificuldade

---

## ⏱️ Relógio de Partida

Cada jogador possui controle individual de tempo.

### Recursos

* Contagem regressiva;
* Alternância automática;
* Vitória por esgotamento do tempo.

---

## 🏆 Sistema de Campeão

Ao final da partida:

* Exibe o vencedor;
* Bloqueia novos movimentos;
* Apresenta mensagem de encerramento.

---

## 📱 Aplicativo Android

O projeto também pode ser executado como aplicativo Android.

### Tecnologias

* Capacitor
* Android SDK
* Gradle

### Distribuição

* APK gerado automaticamente;
* Pipeline CI/CD;
* Releases automatizadas.

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

* Next.js 16
* React
* TypeScript
* Tailwind CSS

## Backend

* Node.js
* Express
* Socket.IO

## Inteligência Artificial

* Stockfish

## DevOps

* Docker
* Docker Compose
* GitHub Actions

## Infraestrutura

* Terraform

## Cloud

* Vercel
* Render

## Mobile

* Capacitor
* Android

---

# ☁️ Deploy

## Frontend

Hospedado na Vercel.

Responsável por:

* Interface do usuário;
* Modos Solo e IA;
* Comunicação com o backend.

---

## Backend

Hospedado no Render.

Responsável por:

* Multiplayer;
* Controle de salas;
* Sincronização em tempo real;
* Validação de jogadas.

---

# ⚙️ CI/CD

O projeto utiliza GitHub Actions para automação.

## Continuous Integration

Executa automaticamente:

```bash
npm install
npm run build
terraform validate
```

---

## Android Build

Executa automaticamente:

```bash
Capacitor Sync
Gradle Build
APK Generation
```

---

## GitHub Releases

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

* Docker Desktop

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

* Frontend;
* Backend;
* Ambientes Cloud;
* Estrutura DevOps.

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

# 🎯 Objetivos do Projeto

Demonstrar, na prática, a integração entre diferentes disciplinas da engenharia de software moderna, incluindo:

* Desenvolvimento Web;
* Comunicação em tempo real;
* Inteligência Artificial aplicada;
* DevOps;
* Containers;
* Infraestrutura como Código;
* CI/CD;
* Computação em Nuvem;
* Desenvolvimento Mobile.

---

# 🗺️ Roadmap

## Versão Atual

* [x] Modo Solo
* [x] Multiplayer Online
* [x] Controle de Tempo
* [x] Sistema de Campeão
* [x] Sugestões por IA
* [x] Avaliação de Posição
* [x] IA Iniciante
* [x] IA Intermediária
* [x] IA Avançada
* [x] APK Android
* [x] GitHub Actions
* [x] Docker
* [x] Terraform
* [x] GitHub Releases

---

## Próximas Versões

* [ ] APK Release Assinado
* [ ] Publicação na Google Play Store
* [ ] Monitoramento e Observabilidade
* [ ] Health Check do Backend
* [ ] Dashboard de Estatísticas
* [ ] Histórico de Partidas
* [ ] Ranking de Jogadores
* [ ] Integração com IA Local (Ollama)
* [ ] Treinador Virtual de Xadrez
* [ ] Análise Pós-Partida com IA

---

# 👨‍💻 Autor

Desenvolvido por **Renan Rodrigues**.

Este projeto representa a aplicação prática de tecnologias modernas para construção de soluções completas, abrangendo frontend, backend, infraestrutura, automação, inteligência artificial e distribuição mobile.

---

# 📄 Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo `LICENSE` para mais informações.

---

<div align="center">

### ♟️ Tecnologia, Estratégia e Engenharia de Software em uma única plataforma.

**Desenvolvido por Renan Rodrigues**

</div>
