# 🎬 MovieApp

> Aplicativo React Native para descoberta e gerenciamento de filmes, séries e shows de TV

[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020.svg)](https://expo.dev/)
[![License](https://img.shields.io/badge/License-Educational-green.svg)](LICENSE)

## 📖 Visão Geral

**MovieApp** é uma aplicação mobile desenvolvida em React Native com Expo que permite aos usuários explorar, pesquisar e gerenciar suas séries e shows favoritos. Utilizando a **API gratuita do TVMaze**, o aplicativo oferece uma experiência completa **sem necessidade de API key ou limites de requisições**.

### ✨ Funcionalidades Principais

- 🏠 **Exploração** - Navegue por shows populares e em alta
- 🔍 **Busca Inteligente** - Sistema de busca em tempo real
- 🎭 **Filtros Avançados** - Filtre por gênero e década
- ⭐ **Favoritos** - Salve e gerencie seus shows preferidos
- 🎲 **Sorteio Aleatório** - Descubra novos shows aleatoriamente
- 📱 **Multiplataforma** - iOS, Android e Web

## 🛠️ Stack Tecnológico

- **React Native** 0.81.4 - Framework mobile
- **Expo SDK** 54.0.0 - Plataforma de desenvolvimento
- **React Navigation** 7.0.0 - Navegação (Stack + Bottom Tabs)
- **Axios** 1.7.9 - Cliente HTTP
- **AsyncStorage** 2.1.0 - Persistência local
- **TVMaze API** - API gratuita e ilimitada

## 🚀 Começando

### Pré-requisitos

- Node.js 18+ instalado
- Expo Go app no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Instalação Rápida

```bash
# 1. Entre na pasta do projeto
cd MovieApp

# 2. Instale as dependências
npm install

# 3. Inicie o servidor
npm start
```

### 🎯 Executando

**Opção 1 - Usando script (Windows):**
- Dê duplo clique em `start-clean.bat`

**Opção 2 - Via terminal:**
```cmd
npm start -- --clear
```

**Opção 3 - No celular:**
1. Abra o Expo Go
2. Escaneie o QR Code
3. Aguarde carregar

## 📂 Estrutura do Projeto

```
MovieApp/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── MovieCard.js     # Card de show
│   │   ├── SearchBar.js     # Barra de busca
│   │   ├── FilterChip.js    # Chip de filtro
│   │   ├── LoadingSpinner.js
│   │   ├── ErrorMessage.js
│   │   └── EmptyState.js
│   ├── screens/             # Telas principais
│   │   ├── HomeScreen.js    # Lista de shows
│   │   ├── DetailsScreen.js # Detalhes
│   │   ├── FavoritesScreen.js
│   │   └── RandomScreen.js  # Sorteio
│   ├── navigation/
│   │   └── AppNavigator.js  # Navegação
│   ├── context/
│   │   └── FavoritesContext.js
│   ├── services/
│   │   └── movieService.js  # API
│   └── config/
│       ├── api.js
│       └── theme.js
├── assets/
├── App.js
├── package.json
└── start-clean.bat
```

## � Tema e Cores

```javascript
Primária: #e94560  // Rosa/Vermelho
Fundo: #1a1a2e     // Azul Escuro
Cards: #16213e     // Azul Card
Texto: #ffffff     // Branco
Accent: #ffd700    // Dourado
```

## 📡 API - TVMaze

### Por que TVMaze?
✅ Totalmente gratuita  
✅ Sem API key necessária  
✅ Sem limites de requisições  
✅ Dados completos de séries

### Estrutura de Dados
```javascript
{
  name: "Breaking Bad",
  rating: { average: 9.3 },
  genres: ["Drama", "Crime"],
  premiered: "2008-01-20",
  image: { medium: "url...", original: "url..." },
  summary: "<p>Sinopse...</p>",
  network: { name: "AMC" }
}
```

## 🔧 Correções Recentes

### ✅ Erro: Cannot read property 'bold' of undefined
**Solução**: Configuração completa de fontes no React Navigation

### ✅ Erro: Cannot read property 'toUpperCase' of undefined  
**Solução**: Validação de propriedades antes de acessar

### ✅ Adaptação para TVMaze API
**Solução**: Conversão completa da estrutura TMDB para TVMaze

**Detalhes**: Ver `DOCUMENTACAO_TECNICA.md`

## 🐛 Solução de Problemas

### App não inicia?
```bash
npm start -- --clear
```

### Erro de permissão no PowerShell?
Execute como Administrador:
```powershell
Set-ExecutionPolicy RemoteSigned
```
Depois use `start-clean.bat`

### Imagens não carregam?
- Verifique conexão com internet
- Aguarde alguns segundos
- Tente pull-to-refresh

### Favoritos não salvam?
- Verifique permissões do app
- Reinicie o aplicativo

## 📚 Documentação

- 📋 **GUIA_APRESENTACAO.md** - Guia para apresentação do projeto
- 📖 **DOCUMENTACAO_TECNICA.md** - Documentação técnica completa

## 🎯 Próximas Melhorias

- [ ] Cache de imagens offline
- [ ] Tela de temporadas e episódios
- [ ] Filtros avançados adicionais
- [ ] Animações de transição
- [ ] Modo claro/escuro
- [ ] Compartilhamento social

## 👨‍� Desenvolvimento

- **Versão**: 1.0.0
- **Última atualização**: 12/10/2025
- **Status**: ✅ Funcional
- **Expo SDK**: 54.0.0

---

<div align="center">

**Desenvolvido com ❤️ usando React Native + Expo**

🎬 Divirta-se descobrindo novas séries!

</div>
