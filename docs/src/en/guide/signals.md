# Signals

Signals let different parts of your system communicate through lightweight, one-time messages.  
Where flags store *state*, signals represent *events* — short-lived pulses that indicate something just happened.

A signal does not stay active.  
It fires once, can be listened to anywhere, and then disappears immediately.

## How it works

Signals act as simple, stateless notifications:

1. A signal is emitted.
2. Any flow waiting for that signal fires instantly.
3. The signal is cleared right away.
4. Future flows will not see the signal unless it is emitted again.

This makes signals ideal for one-off actions that do not reflect ongoing state.

## Why use Signals?

Signals help coordinate flows without storing values or managing timers.  
Examples include:

- “Doorbell pressed”.
- “Washing machine finished”.
- “A scene was activated”.
- “Someone arrived home”.
- “A mode change was manually triggered”.

Use signals whenever you want to broadcast that *something happened* without maintaining a long-lasting state.

## Flow cards

These flow cards allow you to send and listen for lightweight signals, making it easy to orchestrate communication between flows.

### Actions

<FlowCards>
    <FlowCard type="action">Send signal <strong>Hall lights on/off</strong></FlowCard>
</FlowCards>

### Triggers

<FlowCards>
    <FlowCard type="trigger">Receive signal <strong>Hall lights on/off</strong></FlowCard>
</FlowCards>

## Examples

### **Doorbell press**

Emit a `doorbell` signal when the doorbell is detected, and trigger multiple flows (notifications, lights, camera snapshots) from it.

### **Scene activations**

Use a signal to notify multiple flows simultaneously when a scene button is pressed.

### **Device finish events**

Emit `laundry_done` when your smart plug detects low power, then trigger reminders, lights, or routines.

## Notes

- Signals do not store state — they exist for a moment and then vanish.
- Multiple flows can listen for the same signal.
- If no flow is listening, the signal is simply ignored.
