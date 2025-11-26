---
outline: deep
---

# Geen-herhalingsvensters

Geen-herhalingsvensters helpen je herhaalde triggers binnen een bepaalde tijdspanne te voorkomen.  
Ze zijn handig wanneer een flow meerdere keren snel achter elkaar kan worden geactiveerd, maar je wilt dat alleen de eerste telt.

Een geen-herhalingsvenster creëert een tijdelijke "cooldown" periode.  
Als dezelfde conditie of gebeurtenis opnieuw plaatsvindt tijdens dat venster, zal de kaart **false** retourneren in plaats van te triggeren.

## Hoe het werkt

Wanneer een geen-herhalingsvenster wordt geactiveerd:

1. De eerste trigger gaat normaal door.
2. Een timer start voor de duur die je hebt geconfigureerd.
3. Elke identieke trigger tijdens dit venster wordt geblokkeerd.
4. Wanneer het venster eindigt, wordt de volgende trigger weer toegestaan.

Geen-herhalingsvensters helpen flows te stabiliseren door het volgende te voorkomen:

- Herhaalde bewegingstriggers.
- Snelle toestandswijzigingen.
- Sensorruis.
- Meerdere knopdrukken.
- Wisselende apparaattoestanden.

## Flow kaarten

_TODO_

## Voorbeelden

### **Voorkom bewegingsspam**

Een bewegingssensor wordt meerdere keren geactiveerd terwijl je rondloopt.  
Gebruik een venster van 30 seconden om te voorkomen dat lampen herhaaldelijk worden ingeschakeld.

### **Beperk meldingen**

Als een deursensor snel schakelt, verstuur dan slechts één melding per 10 minuten.

### **Voorkom herhaalde acties in flows**

Vermijd herhaalde schakelingen of commando's wanneer apparaten lawaaierige herhaalde gebeurtenissen verzenden.

## Opmerkingen

- Elke geen-herhalingskaart onderhoudt zijn eigen onafhankelijke timer.
- Het wissen van het venster reset de kaart onmiddellijk.
- Gebruik geen-herhalingsvensters voor elke flow die debouncing of rate-limiting gedrag nodig heeft.
