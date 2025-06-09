# AuTomato 🍅

AuTomato é um sistema integrado que une hardware (ESP32 + motor NEMA 17) e software (site online) para promover o foco nos estudos utilizando a técnica Pomodoro. Ele funciona por meio de um fluxo interativo:

## 🌐 Acesso ao Site

A página de conexão e início do Pomodoro está disponível em:

👉 **https://gmraffo.github.io/webautomato/**

---

## ⚙️ O que o código faz

### 1. **Interface Web Responsiva**
- Permite ao usuário:
  - Conectar-se a uma rede Wi-Fi
  - Iniciar um Pomodoro com tempo personalizado
  - Acompanhar um cronômetro em tempo real
  - Ser redirecionado automaticamente ao final do Pomodoro para uma tela de encerramento

### 2. **Integração com ESP32**
- O site envia os dados da rede Wi-Fi (SSID e senha) para o ESP32 via POST `/connect`
- Após conectado, o ESP32 pode ser controlado remotamente para:
  - Iniciar um motor NEMA 17 (girando enquanto o Pomodoro roda)
  - Exibir o tempo restante em uma tela TFT conectada ao hardware
  - Interromper a contagem com um botão de emergência

### 3. **Firebase**
- Utiliza Firebase Realtime Database para manter sincronização entre web e ESP32 (nos modos online)
- O tempo do Pomodoro pode ser armazenado e lido pelo ESP32 em tempo real

