<div align="center">

# 🎬 MovieApp

### Descubra, Favorite e Sorteie Filmes e Séries

[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TVMaze API](https://img.shields.io/badge/TVMaze-API-e94560?style=for-the-badge)](https://www.tvmaze.com/api)

---

**Aplicação mobile multiplataforma para exploração e gerenciamento de filmes e séries**

[Funcionalidades](#-funcionalidades) •
[Instalação](#-instalação) •
[Stack](#️-tecnologias) •
[Documentação](#-documentação)

</div>

---

## 📖 Sobre o Projeto

O **MovieApp** é uma aplicação React Native desenvolvida com Expo que oferece uma experiência completa de descoberta e organização de séries e filmes. Integrado com a API gratuita do TVMaze, o app permite explorar um vasto catálogo de conteúdo audiovisual sem necessidade de autenticação ou limites de uso.

### 🎯 Objetivo

Proporcionar uma plataforma intuitiva e elegante para:
- Descobrir novos shows baseados em preferências
- Organizar conteúdos favoritos
- Explorar detalhes completos de séries
- Sortear shows aleatoriamente para assistir

---

## ✨ Funcionalidades

### 🏠 Exploração de Conteúdo
- **Catálogo Completo**: Navegue por shows populares e em alta
- **Paginação Infinita**: Carregamento automático de mais conteúdo
- **Pull to Refresh**: Atualize os dados com um gesto

### 🔍 Sistema de Busca
- **Busca em Tempo Real**: Encontre shows enquanto digita
- **Debounce Inteligente**: Otimização de requisições à API
- **Resultados Instantâneos**: Feedback visual imediato

### 🎭 Filtros Avançados
- **Por Gênero**: Drama, Comédia, Ação, Ficção Científica e mais
- **Por Década**: 1970s até 2020s
- **Combinação de Filtros**: Refine sua busca

### ⭐ Gerenciamento de Favoritos
- **Adicionar/Remover**: Gerencie sua lista pessoal
- **Persistência Local**: Dados salvos mesmo offline
- **Sincronização Automática**: Estado global compartilhado

### 🎲 Sorteio Aleatório
- **Dois Modos de Seleção**:
  - Busca manual por nome
  - Filtros automáticos (gênero + década)
- **Lista Personalizada**: Monte sua própria lista de sorteio
- **Gerenciamento Flexível**: Adicione e remova séries e filmes livremente
- **Prevenção de Duplicatas**: Sistema inteligente de validação

### 📱 Interface Responsiva
- **Tema Dark**: Design moderno e confortável
- **Animações Suaves**: Transições fluidas
- **Feedback Visual**: Estados claros de loading e erro
- **Compatibilidade**: iOS, Android e Web

---

## 🛠️ Tecnologias

### Core
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| React Native | 0.81.4 | Framework mobile |
| Expo SDK | 54.0.0 | Plataforma de desenvolvimento |
| React | 19.1.0 | Biblioteca UI |

### Navegação
| Biblioteca | Versão | Uso |
|------------|--------|-----|
| @react-navigation/native | 7.0.0 | Sistema de navegação |
| @react-navigation/stack | 7.0.0 | Stack Navigator |
| @react-navigation/bottom-tabs | 7.0.0 | Tab Navigator |

### Estado e Dados
| Biblioteca | Versão | Função |
|------------|--------|--------|
| AsyncStorage | 2.1.0 | Persistência local |
| Context API | Nativa | Gerenciamento de estado |

### Rede e API
| Biblioteca | Versão | Propósito |
|------------|--------|----------|
| Axios | 1.7.9 | Cliente HTTP |
| TVMaze API | - | Fonte de dados |

---

## 🚀 Instalação

### Pré-requisitos

```bash
Node.js >= 18.0.0
npm >= 9.0.0
Expo Go App (iOS/Android)
```

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/menezeslivia/MovieApp.git
cd MovieApp
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm start
```

4. **Execute no dispositivo**
   - Abra o **Expo Go** no seu smartphone
   - Escaneie o **QR Code** exibido no terminal
   - Aguarde o carregamento do aplicativo

### Scripts Disponíveis

```bash
npm start          # Inicia o servidor Expo
npm run android    # Abre no emulador Android
npm run ios        # Abre no simulador iOS (macOS apenas)
npm run web        # Abre no navegador
```

---

## 📂 Estrutura do Projeto

```
MovieApp/
├── 📱 src/
│   ├── 🧩 components/       # Componentes reutilizáveis
│   │   ├── MovieCard.js     # Card de exibição de conteudo
│   │   ├── SearchBar.js     # Barra de busca
│   │   ├── FilterChip.js    # Chip de filtro
│   │   ├── LoadingSpinner.js # Indicador de carregamento
│   │   ├── ErrorMessage.js   # Mensagem de erro
│   │   └── EmptyState.js     # Estado vazio
│   │
│   ├── 📄 screens/          # Telas da aplicação
│   │   ├── HomeScreen.js    # Lista de conteudos
│   │   ├── DetailsScreen.js # Detalhes do conteudo
│   │   ├── FavoritesScreen.js # Lista de favoritos
│   │   └── RandomScreen.js   # Sorteio aleatório
│   │
│   ├── 🧭 navigation/
│   │   └── AppNavigator.js  # Configuração de rotas
│   │
│   ├── 🔄 context/
│   │   └── FavoritesContext.js # Estado global de favoritos
│   │
│   ├── 🌐 services/
│   │   └── movieService.js  # Integração com API
│   │
│   └── ⚙️ config/
│       ├── api.js           # Configurações da API
│       └── theme.js         # Tema e cores
│
├── 🎨 assets/               # Recursos estáticos
├── 📱 App.js                # Componente raiz
└── 📦 package.json          # Dependências
```

### Arquitetura em Camadas

```
┌─────────────────────────┐
│   Presentation Layer    │  ← Screens & Components
├─────────────────────────┤
│   Navigation Layer      │  ← React Navigation
├─────────────────────────┤
│   Business Logic Layer  │  ← Context API & Hooks
├─────────────────────────┤
│   Service Layer         │  ← API Client (Axios)
├─────────────────────────┤
│   Data Layer            │  ← AsyncStorage
└─────────────────────────┘
```

---

## 🎨 Design System

### Paleta de Cores

```javascript
{
  primary: '#e94560',      // Rosa/Vermelho vibrante
  background: '#1a1a2e',   // Azul escuro profundo
  card: '#16213e',         // Azul médio para cards
  text: '#ffffff',         // Branco para texto
  textSecondary: '#ccc',   // Cinza claro
  accent: '#ffd700',       // Dourado para destaques
  success: '#4caf50',      // Verde
  error: '#f44336'         // Vermelho
}
```

### Tipografia

```javascript
{
  fontSizes: {
    small: 12,
    medium: 14,
    large: 16,
    xlarge: 18,
    xxlarge: 22
  },
  fontWeights: {
    regular: '400',
    medium: '500',
    bold: '700',
    heavy: '800'
  }
}
```

---

## 🌐 API - TVMaze

### Endpoints Utilizados

| Endpoint | Descrição | Exemplo |
|----------|-----------|---------|
| `/shows` | Lista todos os shows | `GET /shows` |
| `/search/shows` | Busca por nome | `GET /search/shows?q=breaking` |
| `/shows/:id` | Detalhes do show | `GET /shows/169` |

### Estrutura de Resposta

```json
{
  "id": 169,
  "name": "Breaking Bad",
  "language": "English",
  "genres": ["Drama", "Crime", "Thriller"],
  "status": "Ended",
  "premiered": "2008-01-20",
  "rating": {
    "average": 9.3
  },
  "image": {
    "medium": "https://...",
    "original": "https://..."
  },
  "summary": "<p>Walter White...</p>",
  "network": {
    "name": "AMC"
  }
}
```

### Vantagens do TVMaze

- ✅ **Gratuito**: Sem custo de uso
- ✅ **Sem API Key**: Não requer autenticação
- ✅ **Sem Limites**: Requisições ilimitadas
- ✅ **Completo**: Dados detalhados de séries
- ✅ **Confiável**: API estável e bem documentada

---

## 🔐 Gerenciamento de Estado

### Context API - Favoritos

```javascript
const FavoritesContext = createContext();

// Provider disponibiliza estado global
<FavoritesProvider>
  <App />
</FavoritesProvider>

// Consumo em qualquer componente
const { favorites, addFavorite, removeFavorite } = useFavorites();
```

### AsyncStorage - Persistência

```javascript
// Salvar
await AsyncStorage.setItem(
  '@movieapp:favorites', 
  JSON.stringify(favorites)
);

// Carregar
const stored = await AsyncStorage.getItem('@movieapp:favorites');
const favorites = JSON.parse(stored);
```

---

## 📱 Telas e Navegação

### Stack Navigator

```
MainStack
├── MainTabs (Tab Navigator)
│   ├── Home      (Exploração)
│   ├── Random    (Sorteio)
│   └── Favorites (Favoritos)
└── Details (Modal Stack)
```

### Bottom Tabs

| Tab | Ícone | Função |
|-----|-------|--------|
| Home | 🏠 | Explorar shows |
| Sortear | 🎲 | Sortear aleatoriamente |
| Favoritos | ⭐ | Gerenciar favoritos |

---

## 🎯 Funcionalidades Detalhadas

### 1. Tela Home

**Recursos**:
- Lista de shows populares
- Alternância para "Em Alta"
- Paginação infinita (scroll)
- Pull-to-refresh
- Busca integrada
- Navegação para detalhes

**Tecnologias**:
- FlatList para performance
- useState para controle de estado
- useEffect para carregamento de dados
- Debounce na busca (500ms)

### 2. Tela de Detalhes

**Informações Exibidas**:
- Poster e backdrop em alta resolução
- Nome e ano de estreia
- Avaliação (rating)
- Gêneros traduzidos
- Sinopse completa
- Rede de transmissão
- Status (em exibição/finalizado)
- Botão de favoritar

**Recursos**:
- ScrollView para conteúdo extenso
- Integração com Context de favoritos
- Navegação de volta suave

### 3. Tela de Favoritos

**Funcionalidades**:
- Lista de todos os favoritos
- Remoção individual
- Botão de limpar todos
- Persistência local
- Estado vazio amigável
- Navegação para detalhes

**Persistência**:
- Dados salvos em AsyncStorage
- Sincronização automática
- Funciona offline

### 4. Tela de Sorteio

**Modos de Uso**:

**A) Busca Manual**:
1. Digite nome do show
2. Veja resultados (até 20)
3. Adicione à lista com botão `+`
4. Repita para múltiplos shows

**B) Filtros Automáticos**:
1. Selecione gênero
2. Selecione década
3. Adicione até 10 shows automaticamente
4. Sistema filtra por avaliação > 5

**Gerenciamento**:
- Visualizar lista completa
- Remover shows individuais
- Limpar lista inteira
- Contador de shows

**Sorteio**:
- Botão flutuante sempre visível
- Modal animado com resultado
- Opção de sortear novamente
- Navegação para detalhes

---

## 📚 Documentação Adicional

| Documento | Descrição |
|-----------|-----------|
| `DOCUMENTACAO_TECNICA.md` | Documentação técnica completa |
| `GUIA_APRESENTACAO.md` | Guia para apresentação do projeto |
| `ATUALIZACAO_SORTEIO.md` | Detalhes da funcionalidade de sorteio |

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é de uso educacional.

---

## 👥 Autores

**Lívia Menezes**
- GitHub: [@menezeslivia](https://github.com/menezeslivia)

---

## 🙏 Agradecimentos

- [TVMaze](https://www.tvmaze.com/api) pela API gratuita e completa
- [Expo](https://expo.dev/) pela excelente plataforma de desenvolvimento
- [React Navigation](https://reactnavigation.org/) pela solução de navegação
- Comunidade React Native pelo suporte contínuo

---

<div align="center">

### 🎬 Desenvolvido com ❤️ usando React Native + Expo


[![Download Expo Go](https://img.shields.io/badge/Download-Expo%20Go-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/client)

</div>
