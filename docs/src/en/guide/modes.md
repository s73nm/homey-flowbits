---
outline: deep
---

# Modes

Modes let you define named states that describe how your home should behave.  
A mode is a label such as *Home*, *Away*, *Night*, or *Party*, and flows can set or react to the current mode.

Modes are ideal for representing broad household situations that influence multiple automations at once.

## How it works

Only one mode can be active at a time.  
Switching to a new mode immediately replaces the previous one.

Modes are useful for:

- Adjusting lighting, heating, or notifications based on context
- Creating consistent behavior across different rooms
- Simplifying complex logic by grouping conditions under a single name
- Making your automations easier to understand and maintain

Modes are not tied to any specific device. They represent the state of your home as a whole.

## Flow cards

These flow cards let you manage modes directly from your flows, enabling you to activate, deactivate, toggle, or check any mode.

### Actions

<FlowCards>
    <FlowCard type="action">Activate <strong>Morning</strong></FlowCard>
    <FlowCard type="action">Deactivate <strong>Night</strong></FlowCard>
    <FlowCard type="action">Reactivate <strong>Dinner</strong></FlowCard>
    <FlowCard type="action">Toggle <strong>Evening</strong></FlowCard>
</FlowCards>

### Conditions

<FlowCards>
    <FlowCard type="condition"><strong>Night</strong> is active</FlowCard>
</FlowCards>

### Triggers

<FlowCards>
    <FlowCard type="trigger"><strong>Partytime</strong> is activated</FlowCard>
    <FlowCard type="trigger"><strong>Vacation</strong> changed</FlowCard>
    <FlowCard type="trigger"><strong>Clearning</strong> is deactivated</FlowCard>
</FlowCards>

## Examples

### **Home / Away**

Switch to *Away* when everyone leaves the house.  
Flows can react by lowering heating, turning off lights, and arming alarms.

### **Night**

Switch to *Night* to dim lights, lock doors automatically, or silence notifications.

### **Party**

Activate *Party* mode for special lighting scenes or extended music playback.

## Notes

- Modes are mutually exclusive: only one can be active at any time.
- Flows can both change modes and react to them.
- Use clear names to keep your automation logic readable.
