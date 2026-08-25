# Mobile

> Aplicativo mobile do Projeto Mobo para controle do sistema de colheita automatizada de lichia.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![React Native](https://img.shields.io/badge/React%20Native-0.79-61DAFB?logo=react)
![Expo](https://img.shields.io/badge/Expo-53-000020?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript)

---

## 📋 Sobre

O **Mobo Mobile** é o aplicativo mobile do Projeto Mobo, desenvolvido para dispositivos Android e iOS.

A aplicação permite acompanhar informações do sistema, visualizar dados da produção, monitorar dispositivos e interagir com os recursos disponibilizados pela API do Mobo.

---

## ✨ Funcionalidades

- 🔐 Autenticação e gerenciamento de sessão
- 👤 Gerenciamento de usuários
- 🤖 Controle e monitoramento do braço mecânico
- 🖼️ Visualização de imagens
- 📱 Interface adaptada para dispositivos móveis

---

## 🛠️ Tecnologias

- **React Native** — desenvolvimento da aplicação mobile
- **Expo** — plataforma e ferramentas para desenvolvimento React Native
- **TypeScript** — tipagem estática
- **Axios** — comunicação com a API
- **Expo Router** — gerenciamento de rotas e navegação
- **ESLint** — análise de código
- **Prettier** — formatação de código
- **Vitest** — testes automatizados

---

## 🏗️ Arquitetura

```text
mobile/
├── app/
├── assets/
├── components/
├── config/
├── .easignore
├── .gitignore
├── app.json
├── eas.json
├── LICENSE
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

Antes de começar, instale:

- [Node.js](https://nodejs.org/) v20 LTS ou superior
- [Git](https://git-scm.com/)
- [Expo Go](https://expo.dev/go/) no dispositivo, caso utilize um dispositivo físico

### 1. Clonar o Repositório

```bash
git clone https://github.com/CW-Mobo/mobile.git
cd mobile
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Executar o Mobile

```bash
npx expo start
```

> ⚠️ A API precisa estar em execução para que todas as funcionalidades do Mobile funcionem corretamente.

> 💡 O Mobile está configurado para consumir a API do Mobo. Caso a URL ou porta da API seja alterada, ajuste a configuração correspondente no aplicativo.

Após iniciar, você pode:

- Escanear o QR Code com o aplicativo **Expo Go** no celular
- Pressionar `a` para abrir no emulador Android
- Pressionar `i` para abrir no simulador iOS

---

## 📱 Desenvolvimento

Para executar diretamente em uma plataforma específica:

```bash
npx expo start --android
```

```bash
npx expo start --ios
```

> A execução no iOS requer um ambiente compatível com o desenvolvimento para a plataforma.

---

## 🌐 Deploy

> 📱 A distribuição para Android e iOS será disponibilizada posteriormente.

---

## 📄 Licença

Este projeto está sob a licença MIT.

Consulte o arquivo LICENSE para mais informações.
