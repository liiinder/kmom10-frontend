# Frontend Project

Valde att utgå med Vue som bas för frontend.

Använder axios för att ansluta till API'et då det har fungerat bra tidigare och jag tycker det känns lite enklare att läsa jämfört mot t.ex. fetch.

För att printa ut grafen så har jag valt att använda mig av vue-chartjs som i stort sett är chart-js men det ger lite enklare koppling till vue som en färdig component.
Provde en del andra extensions som var mer fokuserade på vue men dessa var så dåligt dokumenterade att jag aldrig riktigt fick ihop det.

Som tidigare kursmoment används vue-router för routerfunktionen samt vuex för att kunna spara till ett globalt state.

För realtime har Socket.io använts. På deras sida så hävdar dom att det är den snabbaste och mest pålitliga realtidsmotoren. 
Så till klienten körs paketet Socket.io-client för att ansluta till vår server.

Istället för att ha en dedikerad registreringssida så valde jag att bara lägga till det som val på login sidan.
Detta för att förenkla för användare att registrera sig och när man sedan är registrerad så får man skriva in sitt namn, födelsedatum på profil sidan.
Har även använt mig av redirects i projektet som jag tidigare inte använt. Detta gör att när man loggar in så redirectar jag till profil sidan.
Samt om man är inloggad på sidan och JWT'n timear ut så har jag en redirect om man försöker göra något så "loggas" man ut och skickas till login sidan.


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

