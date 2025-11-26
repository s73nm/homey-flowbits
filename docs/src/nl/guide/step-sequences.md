---
outline: deep
---

# Stappenreeksen (Cycli)

Stappenreeksen laten je doorlopen door een vooraf gedefinieerde set genummerde stappen in een vaste volgorde. Ze zijn ideaal wanneer je wilt dat een flow van de ene staat naar de volgende gaat telkens wanneer deze wordt uitgevoerd, zonder variabelen of extra logica te beheren.

Een stappenreeks gaat altijd vooruit. Wanneer de laatste stap is bereikt, keert deze automatisch terug naar de eerste stap.

## Hoe het werkt

Een stappenreeks wordt geïdentificeerd door een aangepaste naam die je kiest. Elke reeks heeft een minimumwaarde, een maximumwaarde en de huidige actieve stap.
Wanneer je de "volgende stap" kaart activeert, verhoogt de reeks met één.
Als de reeks de maximumwaarde bereikt, keert de volgende verhoging terug naar de minimumwaarde.

**Dit maakt stappenreeksen nuttig voor situaties zoals:**

- Doorlopen van verlichtingsmodi (1 → 2 → 3 → 1 → …)
- Selecteren van vooraf gedefinieerde thuismodi
- Afwisselen tussen aangepaste voorinstellingen
- Verschillende acties activeren bij elke stap
- Beheren van multi-state flows zonder variabelen nodig te hebben

## Flow kaarten

_TODO_

## Voorbeelden

### Doorloop verlichtingsscènes

Telkens wanneer een knop wordt ingedrukt:

- 1 → warm wit
- 2 → gedimd
- 3 → kleurrijk
- Daarna weer terug naar 1.

### Schakelen tussen automatiseringsmodi

Druk herhaaldelijk op dezelfde knop om te schakelen tussen:

- 1 = Normaal
- 2 = Focus
- 3 = Ontspanning

### Dagelijkse statusprogressie

Gebruik een planner om door te lopen:

- 1 = Ochtend
- 2 = Middag
- 3 = Avond
- 4 = Nacht
- Keert automatisch terug naar Ochtend.

## Opmerkingen

- Stappenreeksen zijn staatloos vanuit het perspectief van de flow kaart; FlowBits slaat hun waarden intern op.
- Meerdere flows kunnen interactie hebben met dezelfde benoemde reeks.
- Benoemde reeksen zijn persistent en overleven Homey herstart.
