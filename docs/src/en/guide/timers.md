---
outline: deep
---

# Timers

Timers let you delay actions, schedule follow-ups, and build flows that react to time passing rather than immediate events.  
They are simple, self-contained countdowns that start, expire, and reset without storing additional data.

A timer always has two states: **running** or **not running**.  
When it reaches zero, it fires a flow card once and then stops automatically.

## How it works

Timers operate independently of other features:

1. You start a timer with a chosen duration.
2. The timer counts down in the background.
3. When it finishes, it emits a single “timer finished” event.
4. The timer turns off until you start it again.

Timers can also be stopped or cleared at any moment.

## Why use Timers?

Timers are useful whenever you need delayed automation or cooldown periods.  
Common uses include:

- Turn off a light after a delay.
- Run a reminder 10 minutes after an event.
- Create cooldowns between two actions.
- Trigger follow-up steps in routines.
- Auto-reset modes or flags after a while.

Timers help keep flows clean by centralizing timing logic.

## Flow Cards

_TODO_

## Examples

### **Light auto-off**

Start a `kitchen_light` timer for 5 minutes when motion is detected.  
When the timer expires, turn the light off.

### **Cooldown period**

After turning on the heating, start a `heating_cooldown` timer for 30 minutes.  
During this period, block additional heating changes.

### **Follow-up reminder**

Emit a reminder 10 minutes after someone arrives home by starting an `arrival_delay` timer and listening for its expiration.

## Notes

- Timers are stateless aside from their running/paused state.
- You can create as many timers as you need, each identified by name.
- Starting a timer again resets the countdown.
- Only the expiration event triggers a flow — not each passing second.  
