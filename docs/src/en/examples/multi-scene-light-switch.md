# Multi-Scene Light Switch

FlowBits step sequences and timers make it easy to create a smart light switch that cycles through scenes with quick presses, but turns off after a pause. This creates an intuitive user experience: tap quickly to browse scenes, wait a moment and tap again to turn off.

This example shows how to set up a Philips Hue Wall Switch Module that cycles through different lighting presets in your living room.

## What you'll get

A wall switch that behaves intelligently:

- **Lights off** → First press turns on the first scene
- **Lights on + quick press (within 3 seconds)** → Cycles to the next scene
- **Lights on + press after 3 seconds** → Turns lights off

The available scenes are:

0. **Off** — All lights off
1. **Bright** — Full brightness for activities
2. **Relaxed** — Warm, dimmed lighting for the evening
3. **Movie** — Very dim ambient light

## Requirements

- A Philips Hue Wall Switch Module (or similar smart wall switch)
- Smart lights in the room
- Scenes configured in your Philips Hue app

## How it works

The logic uses a timer to track whether the button was pressed recently:

1. When the button is pressed and lights are **off**, go to step 1 and start a 3-second timer.
2. When the button is pressed and the timer is **running** (quick press), cycle to the next scene and restart the timer.
3. When the button is pressed and the timer is **not running** (after cooldown), turn off the lights.

## Flow

### Step 1: Press when lights are off

When the lights are off (sequence is at step 0), turn them on to the first scene.

<FlowCards>
    <FlowCard type="trigger" id="a1" app="Hue Wall Switch - Living room" color="#F4AF2E" logo="/assets/logos/hue.svg">Button <strong>1</strong> pressed</FlowCard>
    <FlowCard type="condition" id="a2" connect-to-id="a1">Sequence <strong>Living room switch</strong> equals <strong>0</strong></FlowCard>
    <FlowCard type="action" id="a3" connect-to-id="a2">Set sequence <strong>Living room switch</strong> to <strong>1</strong></FlowCard>
    <FlowCard type="action" id="a4" connect-to-id="a2">Start timer <strong>Living room switch</strong> with <strong>3</strong> <strong>seconds</strong></FlowCard>
</FlowCards>

### Step 2: Quick press to cycle scenes

When the lights are on and the timer is still running (pressed within 3 seconds), cycle to the next scene.

<FlowCards>
    <FlowCard type="trigger" id="b1" app="Hue Wall Switch - Living room" color="#F4AF2E" logo="/assets/logos/hue.svg">Button <strong>1</strong> pressed</FlowCard>
    <FlowCard type="condition" id="b2" connect-to-id="b1">Timer <strong>Living room switch</strong> is running</FlowCard>
    <FlowCard type="action" id="b3" connect-to-id="b2">Next step in <strong>Living room switch</strong> ( <strong>1</strong> &ndash; <strong>3</strong> )</FlowCard>
    <FlowCard type="action" id="b4" connect-to-id="b2">Start timer <strong>Living room switch</strong> with <strong>3</strong> <strong>seconds</strong></FlowCard>
</FlowCards>

### Step 3: Press after cooldown to turn off

When the lights are on and the timer has finished (pressed after 3 seconds), turn the lights off.

<FlowCards>
    <FlowCard type="trigger" id="c1" app="Hue Wall Switch - Living room" color="#F4AF2E" logo="/assets/logos/hue.svg">Button <strong>1</strong> pressed</FlowCard>
    <FlowCard type="condition" id="c2" connect-to-id="c1">Timer <strong>Living room switch</strong> is finished</FlowCard>
    <FlowCard type="action" id="c3" connect-to-id="c2">Set sequence <strong>Living room switch</strong> to <strong>0</strong></FlowCard>
</FlowCards>

### Step 4: React to sequence changes

Now set up flows that react when the sequence reaches each step.

**Turn off lights (step 0):**

<FlowCards>
    <FlowCard type="trigger" id="d1">Sequence <strong>Living room switch</strong> reaches <strong>0</strong></FlowCard>
    <FlowCard type="action" id="d2" connect-to-id="d1" app="Philips Hue" color="#F4AF2E" logo="/assets/logos/hue.svg">Turn all lights off in <strong>Living room</strong></FlowCard>
</FlowCards>

**Activate Bright scene (step 1):**

<FlowCards>
    <FlowCard type="trigger" id="e1">Sequence <strong>Living room switch</strong> reaches <strong>1</strong></FlowCard>
    <FlowCard type="action" id="e2" connect-to-id="e1" app="Philips Hue" color="#F4AF2E" logo="/assets/logos/hue.svg">Activate the <strong>Living room bright</strong> scene</FlowCard>
</FlowCards>

**Activate Relaxed scene (step 2):**

<FlowCards>
    <FlowCard type="trigger" id="f1">Sequence <strong>Living room switch</strong> reaches <strong>2</strong></FlowCard>
    <FlowCard type="action" id="f2" connect-to-id="f1" app="Philips Hue" color="#F4AF2E" logo="/assets/logos/hue.svg">Activate the <strong>Living room relaxed</strong> scene</FlowCard>
</FlowCards>

**Activate Movie scene (step 3):**

<FlowCards>
    <FlowCard type="trigger" id="g1">Sequence <strong>Living room switch</strong> reaches <strong>3</strong></FlowCard>
    <FlowCard type="action" id="g2" connect-to-id="g1" app="Philips Hue" color="#F4AF2E" logo="/assets/logos/hue.svg">Activate the <strong>Living room movie</strong> scene</FlowCard>
</FlowCards>

## Tips

- **Adjust the cooldown** — Change the 3-second timer to suit your preference. A shorter time requires quicker presses, while a longer time gives you more time to decide.

- **Use button 2 for instant off** — If your wall switch has a second button, use it to turn off the lights immediately:

<FlowCards>
    <FlowCard type="trigger" id="h1" app="Hue Wall Switch - Living room" color="#F4AF2E" logo="/assets/logos/hue.svg">Button <strong>2</strong> pressed</FlowCard>
    <FlowCard type="action" id="h2" connect-to-id="h1">Set sequence <strong>Living room switch</strong> to <strong>0</strong></FlowCard>
    <FlowCard type="action" id="h3" connect-to-id="h1">Stop timer <strong>Living room switch</strong></FlowCard>
</FlowCards>

- **Reset when leaving** — Reset the sequence when you leave home to ensure lights start from "off":

<FlowCards>
    <FlowCard type="trigger" id="i1"><strong>Away</strong> is activated</FlowCard>
    <FlowCard type="action" id="i2" connect-to-id="i1">Set sequence <strong>Living room switch</strong> to <strong>0</strong></FlowCard>
    <FlowCard type="action" id="i3" connect-to-id="i1">Stop timer <strong>Living room switch</strong></FlowCard>
</FlowCards>

## Used FlowBits features

- [Step sequences](/guide/step-sequences)
- [Timers](/guide/timers)
