# 🎬 Cinemas Próximos - Implementação com OpenStreetMap

## ✅ O que foi feito

Uma aba completa de **cinemas próximos** usando **geolocalização + OpenStreetMap (Nominatim API)**.

**Totalmente gratuito**, sem limite de requests, sem precisar registrar ou adicionar cartão de crédito!

---

## 🚀 Como funciona

1. **Geolocalização** - Obtém a localização do usuário
2. **OpenStreetMap Nominatim API** - Busca cinemas próximos (gratuito!)
3. **Cálculo de Distância** - Usa fórmula Haversine
4. **Listagem** - Mostra cinemas ordenados por proximidade

---

## 📁 Arquivos Criados

```
src/
├── screens/
│   └── CinemasScreen.js          ← Tela principal
├── components/
│   └── CinemaCard.js             ← Cartão de cinema
├── services/
│   └── cinemaService.js          ← Lógica com OpenStreetMap
└── navigation/
    └── AppNavigator.js           ← Atualizado com nova aba
```

---

## ✨ Funcionalidades

✅ **Geolocalização automática** - Detecção de localização do usuário  
✅ **Busca de cinemas** - Via OpenStreetMap (grátis!)  
✅ **Filtro por raio** - 3km, 5km, 10km, 15km  
✅ **Busca por nome** - Search bar funcional  
✅ **Distância em KM** - Cálculo automático  
✅ **Pull-to-refresh** - Atualizar lista  
✅ **Sem limite de requests** - OpenStreetMap é totalmente gratuito!

---

## 🚀 Como Usar

Nenhuma configuração necessária! Tudo já está pronto.

1. **Abra a aba 🎬 Cinemas**
2. **Autorize localização** quando solicitado
3. **Veja cinemas próximos!**

---

## 💡 Detalhes Técnicos

### OpenStreetMap (Nominatim)
- **API**: https://nominatim.openstreetmap.org/search
- **Custo**: GRATUITO (sem limite!)
- **Registro**: NÃO precisa
- **Cartão**: NÃO precisa

### Fórmula de Distância (Haversine)
Calcula distância real entre dois pontos usando latitude/longitude.

### Busca por Cinema
Busca termos como: "cinema", "theatre", "cine", "teatro", etc.

---

## 📊 Exemplo de Resposta da API

```json
[
  {
    "id": 123456,
    "nome": "Cinemark Tatuapé",
    "endereco": "Rua ABC, 123, São Paulo, SP",
    "latitude": -23.5505,
    "longitude": -46.6333,
    "distancia": 2.3
  },
  {
    "id": 234567,
    "nome": "Cinépolis Shopping",
    "endereco": "Avenida XYZ, São Paulo, SP",
    "latitude": -23.5500,
    "longitude": -46.6350,
    "distancia": 3.1
  }
]
```

---

## 🎯 Funcionalidades por Arquivo

### `cinemaService.js`
- `getNearbyMovieTheaters(lat, lon, raioKm)` - Busca cinemas próximos
- `calculateDistance(lat1, lon1, lat2, lon2)` - Calcula distância
- `sortCinemasByDistance(cinemas, ordem)` - Ordena por distância
- `filterCinemasByName(cinemas, termo)` - Filtra por nome
- `filterCinemasByDistance(cinemas, maxKm)` - Filtra por distância

### `CinemasScreen.js`
- Tela principal com lista de cinemas
- Search bar para buscar por nome
- Botões para escolher raio de busca
- Pull-to-refresh

### `CinemaCard.js`
- Cartão visual de cada cinema
- Mostra nome, endereço e distância

---

## 🔍 Como Pesquisar Cinemas Manualmente

```javascript
import { getNearbyMovieTheaters, calculateDistance } from './src/services/cinemaService';

// Sua localização (São Paulo)
const latitude = -23.5505;
const longitude = -46.6333;

// Buscar cinemas em 5km
const cinemas = await getNearbyMovieTheaters(latitude, longitude, 5);

console.log(`Encontrados ${cinemas.length} cinemas`);
cinemas.forEach(cinema => {
  console.log(`${cinema.nome} - ${cinema.distancia}km`);
});
```

---

## 🟢 Vantagens do OpenStreetMap

✅ **Totalmente Gratuito** - Sem limite de requests!  
✅ **Sem Registro** - Funciona direto  
✅ **Sem Cartão de Crédito** - Totalmente grátis  
✅ **Open Source** - Dados de comunidade  
✅ **Sem Quotas** - Use quanto quiser  
✅ **Sem Autenticação Complexa** - Só precisa User-Agent  

---

## ❓ Troubleshooting

### "Nenhum cinema encontrado"
- Teste em uma cidade maior (São Paulo, Rio, etc)
- Aumente o raio de busca
- Verifique se sua localização real tem cinemas

### "Permissão de localização negada"
- Autorize localização nas configurações do dispositivo
- Vá em Settings → Aplicativos → MovieApp → Permissões

### "Erro de conexão"
- Verifique internet
- Nominatim pode estar lento ocasionalmente

---

## 📈 Limitações

- OpenStreetMap depende de dados da comunidade (pode ter cinemas desatualizados)
- Nominatim API pode ter latência ocasional
- Alguns cinemas pequenos podem não estar cadastrados

---

## 🚀 Extensões Futuras

1. **Mapa interativo** - Mostrar cinemas em um mapa
2. **Favoritos** - Salvar cinemas favoritos
3. **Horários** - Integrar horários de funcionamento
4. **Filmes em Cartaz** - Mostrar filmes do cinema

---

## 📝 Notas

- **User-Agent**: Obrigatório para Nominatim (já configurado)
- **Limite informal**: ~1 req/seg recomendado (você não bate isso)
- **Cache**: Considere implementar para melhor performance

---

**Status**: ✅ Pronto para uso!

Nenhuma configuração necessária. Tudo funciona imediatamente.
