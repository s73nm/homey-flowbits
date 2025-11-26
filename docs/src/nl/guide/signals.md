# Signalen

Signalen laten verschillende delen van je systeem communiceren via lichtgewicht, eenmalige berichten.  
Waar vlaggen *status* opslaan, vertegenwoordigen signalen *gebeurtenissen* — kortstondige impulsen die aangeven dat er zojuist iets is gebeurd.

Een signaal blijft niet actief.  
Het wordt één keer afgegeven, kan overal worden ontvangen en verdwijnt dan direct.

## Hoe het werkt

Signalen fungeren als eenvoudige, staatloze meldingen:

1. Een signaal wordt uitgezonden.
2. Elke flow die op dat signaal wacht, wordt direct geactiveerd.
3. Het signaal wordt meteen gewist.
4. Toekomstige flows zullen het signaal niet zien tenzij het opnieuw wordt uitgezonden.

Dit maakt signalen ideaal voor eenmalige acties die geen voortdurende status weerspiegelen.

## Waarom Signalen gebruiken?

Signalen helpen flows te coördineren zonder waarden op te slaan of timers te beheren.  
Voorbeelden zijn onder andere:

- "Deurbel ingedrukt".
- "Wasmachine klaar".
- "Een scène is geactiveerd".
- "Iemand is thuisgekomen".
- "Een moduswijziging is handmatig geactiveerd".

Gebruik signalen wanneer je wilt uitdragen dat *er iets is gebeurd* zonder een langdurige status bij te houden.

## Flow kaarten

_TODO_

## Voorbeelden

### **Deurbel indrukken**

Zend een `doorbell` signaal uit wanneer de deurbel wordt gedetecteerd, en activeer meerdere flows (meldingen, lampen, camera-snapshots) hiervan.

### **Scène-activeringen**

Gebruik een signaal om meerdere flows tegelijkertijd te informeren wanneer een scèneknop wordt ingedrukt.

### **Apparaat klaar gebeurtenissen**

Zend `laundry_done` uit wanneer je slimme stekker laag verbruik detecteert, en activeer vervolgens herinneringen, lampen of routines.

## Opmerkingen

- Signalen slaan geen status op — ze bestaan even en verdwijnen dan.
- Meerdere flows kunnen naar hetzelfde signaal luisteren.
- Als geen enkele flow luistert, wordt het signaal simpelweg genegeerd.
