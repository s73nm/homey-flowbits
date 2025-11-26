---
outline: deep
---

# Timers

Timers stellen je in staat om acties uit te stellen, vervolgacties te plannen en flows te bouwen die reageren op verstrijkende tijd in plaats van directe gebeurtenissen.  
Het zijn eenvoudige, op zichzelf staande aftellingen die starten, verlopen en resetten zonder aanvullende gegevens op te slaan.

Een timer heeft altijd twee toestanden: **actief** of **niet actief**.  
Wanneer deze nul bereikt, activeert het eenmalig een flow card en stopt vervolgens automatisch.

## Hoe het werkt

Timers werken onafhankelijk van andere functies:

1. Je start een timer met een gekozen duur.
2. De timer telt af op de achtergrond.
3. Wanneer deze klaar is, geeft het een enkele "timer voltooid" gebeurtenis af.
4. De timer schakelt uit totdat je deze opnieuw start.

Timers kunnen ook op elk moment gestopt of gewist worden.

## Waarom Timers gebruiken?

Timers zijn nuttig wanneer je vertraagde automatisering of afkoelperiodes nodig hebt.  
Veelvoorkomende toepassingen zijn:

- Een lamp uitschakelen na een vertraging.
- Een herinnering uitvoeren 10 minuten na een gebeurtenis.
- Afkoelperiodes creëren tussen twee acties.
- Vervolgstappen in routines activeren.
- Standen of flags automatisch resetten na een tijdje.

Timers helpen flows overzichtelijk te houden door timinglogica te centraliseren.

## Flow kaarten

_TODO_

## Voorbeelden

### **Lamp automatisch uitschakelen**

Start een `kitchen_light` timer voor 5 minuten wanneer beweging wordt gedetecteerd.  
Wanneer de timer verloopt, schakel de lamp uit.

### **Afkoelperiode**

Na het inschakelen van de verwarming, start een `heating_cooldown` timer voor 30 minuten.  
Blokkeer tijdens deze periode aanvullende verwarmingswijzigingen.

### **Vervolgherinnering**

Geef een herinnering 10 minuten nadat iemand thuiskomt door een `arrival_delay` timer te starten en te luisteren naar het verlopen ervan.

## Opmerkingen

- Timers zijn staatloos afgezien van hun actieve/gepauzeerde status.
- Je kunt zoveel timers aanmaken als je nodig hebt, elk geïdentificeerd met een naam.
- Een timer opnieuw starten reset de aftelling.
- Alleen de verloop gebeurtenis activeert een flow — niet elke seconde die voorbijgaat.  
