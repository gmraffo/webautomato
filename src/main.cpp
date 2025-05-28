#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <DNSServer.h>
#include <SPIFFS.h>
#include <Preferences.h>

Preferences preferences;
AsyncWebServer server(80);
DNSServer dnsServer;

bool isConfigured = false;
const byte DNS_PORT = 53;

// Optional: respond to common captive portal routes
void setupCaptivePortalRoutes() {
  const char * captiveRoutes[] = {
    "/generate_204", "/hotspot-detect.html", "/ncsi.txt",
    "/redirect", "/connecttest.txt", "/fwlink"
  };
  for (auto route : captiveRoutes) {
    server.on(route, HTTP_GET, [](AsyncWebServerRequest *request){
      request->redirect("/");
    });
  }
}

void startAccessPoint() {
  WiFi.softAP("AuTomato", "estudante");
  dnsServer.start(DNS_PORT, "*", WiFi.softAPIP());

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/index.html", "text/html");
  });
  server.on("/js/wifi.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/js/wifi.js", "text/javascript");
  });
  server.on("/save-wifi", HTTP_POST, [](AsyncWebServerRequest *request){
    if (request->hasParam("ssid", true) && request->hasParam("password", true)) {
      String ssid = request->getParam("ssid", true)->value();
      String password = request->getParam("password", true)->value();

      preferences.begin("wifi", false);
      preferences.putString("ssid", ssid);
      preferences.putString("password", password);
      preferences.end();

      request->send(200, "text/plain", "Salvo");
      delay(1000); // Wait for response to be sent
      ESP.restart();
    } else {
      request->send(400, "text/plain", "Erro");
    }
  });

  server.serveStatic("/", SPIFFS, "/").setDefaultFile("index.html");

  server.onNotFound([](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/index.html", "text/html");
  });

  setupCaptivePortalRoutes();

  server.begin();
}

void startStationMode() {
  preferences.begin("wifi", true);
  String ssid = preferences.getString("ssid", "");
  String password = preferences.getString("password", "");
  preferences.end();

  WiFi.begin(ssid.c_str(), password.c_str());

  Serial.print("Conectando a ");
  Serial.println(ssid);

  unsigned long startAttemptTime = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 15000) {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConectado com sucesso!");
    server.serveStatic("/", SPIFFS, "/").setDefaultFile("pre-questionario.html");
    server.onNotFound([](AsyncWebServerRequest *request){
      request->send(SPIFFS, "/pre-questionario.html", "text/html");
    });
    server.begin();
  } else {
    Serial.println("Falha na conexão. Voltando para AP.");
    startAccessPoint();
  }
}

void setup() {
  Serial.begin(115200);
  if (!SPIFFS.begin(true)) {
    Serial.println("Erro ao montar SPIFFS");
    return;
  }

  preferences.begin("wifi", true);
  isConfigured = preferences.isKey("ssid") && preferences.isKey("password");
  preferences.end();

  if (isConfigured) {
    startStationMode();
  } else {
    startAccessPoint();
  }
}

void loop() {
  if (!isConfigured) {
    dnsServer.processNextRequest();
  }
}