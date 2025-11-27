---
outline: deep
---

# No-Repeat Windows

No-repeat windows help you prevent repeated triggers within a defined time span.  
They are useful when a flow might fire multiple times in quick succession, but you only want the first one to count.

A no-repeat window creates a temporary “cooldown” period.  
If the same condition or event happens again during that window, the card will return **false** instead of triggering.

## How it works

When a no-repeat window is activated:

1. The first trigger passes through normally.
2. A timer starts for the duration you configured.
3. Any identical trigger during this window is blocked.
4. When the window ends, the next trigger is allowed again.

No-repeat windows help stabilize flows by preventing:

- Repeated motion triggers.
- Rapid state changes.
- Sensor noise.
- Multiple button presses.
- Flapping device states.

## Flow cards

These flow cards allow you to check, or clear a no-repeat window, helping you prevent repeated executions within a defined time span.

### Actions

<FlowCards>
    <FlowCardExplainer content="This lets you clear a no-repeat window, the next trigger will be allowed.">
        <FlowCard type="action">Reset no-repeat window for <strong>Toilet lights</strong></FlowCard>
    </FlowCardExplainer>
</FlowCards>

### Conditions

<FlowCards>
    <FlowCardExplainer content="Checks if the no-repeat window allows the next trigger.">
        <FlowCard type="condition">No repeat of <strong>Toilet lights</strong> within <strong>30</strong> <strong>seconds</strong></FlowCard>
    </FlowCardExplainer>
</FlowCards>

## Examples

### **Prevent motion spam**

A motion sensor fires multiple times while you walk around.  
Use a 30-second window to avoid repeatedly turning on lights.

### **Limit notifications**

If a door sensor toggles rapidly, send only one notification every 10 minutes.

### **Prevent repeated actions in flows**

Avoid repeated toggles or commands when devices send noisy repeated events.

## Notes

- Each no-repeat card maintains its own independent timer.
- Clearing the window resets the card immediately.
- Use no-repeat windows for any flow that needs debouncing or rate-limiting behavior.
