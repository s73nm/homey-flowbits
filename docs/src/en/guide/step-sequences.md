---
outline: deep
---

# Step Sequences (Cycles)

Step sequences let you cycle through a predefined set of numbered steps in a fixed order. They are ideal when you want a flow to move from one state to the next each time it runs, without managing variables or additional logic.

A step sequence always moves forward. When the final step is reached, it automatically wraps back to the first step.

## How it works

A step sequence is identified by a custom name you choose. Each sequence has a minimum value, a maximum value, and the current active step.
Whenever you trigger the “next step” card, the sequence increments by one.
If the sequence reaches the maximum value, the next increment returns it to the minimum value.

**This makes step sequences useful for situations like:**

- Cycling through lighting modes (1 → 2 → 3 → 1 → …)
- Selecting predefined home modes
- Rotating between custom presets
- Triggering different actions on each step
- Managing multi-state flows without needing variables

## Flow cards

_TODO_

## Examples

### Cycle through lighting scenes

Each time a button is pressed:

- 1 → warm white
- 2 → dimmed
- 3 → colorful
- Then back to 1 again.

### Switch between automation modes

Press the same button repeatedly to toggle between:

- 1 = Normal
- 2 = Focus
- 3 = Relax

### Daily state progression

Use a scheduler to move through:

- 1 = Morning
- 2 = Afternoon
- 3 = Evening
- 4 = Night
- Loops back to Morning automatically.

## Notes

- Step sequences are stateless from the flow card’s perspective; FlowBits stores their values internally.
- Multiple flows can interact with the same named sequence.
- Named sequences are persistent and survive Homey reboots.
