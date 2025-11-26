---
outline: deep
---

# Flags

Flags are simple boolean markers that represent a certain state in your home.  
A flag is always either **on** (true) or **off** (false), and you can get, set, or toggle it from any flow.

Typical examples include:

- A **vacation** flag.
- A **guest mode** flag.
- A **quiet hours** flag.
- A **heating override** flag.

Flags make it easy to model small pieces of household state without needing variables or complex logic.

## How it works

A flag is a named state indicator.  
You set it to reflect the situation in your home, and your flows can react accordingly.

Flags are ideal for:

- Marking whether a situation is active.
- Representing temporary household states.
- Coordinating behavior across multiple flows.
- Providing a single source of truth for simple on/off conditions.

## Flow cards

_TODO_

## Examples

### **Vacation mode**

Turn the “vacation” flag on when you leave home.  
Other flows can react by adjusting heating, disabling routines, or activating security automations.

### **Guest mode**

Use a “guest_mode” flag to temporarily override automations like motion lighting or door alerts.

### **Quiet hours**

Enable a “quiet_hours” flag at night to reduce notifications or dim lights.

## Notes

- Flags are global and can be used in any flow.
- Flags persist across reboots.
- Use descriptive names to keep your system organized.
