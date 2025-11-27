# Automatic Hall Lighting

FlowBits makes it easy to implement automatic hall lighting in your home. By combining a few different flow cards, you can easily create a system that responds to motion and modes.
This example uses Philips Hue lights, but any smart lighting device should work.

## What you'll get

Your hall lights will turn on with a dimmed state when a mode is activated and turn on to full brightness when motion is detected. The lights will go back to dimmed state when motion stops long enough.

## Requirements

- A motion sensor.
- Smart lights.
- A [Mode](/guide/modes) for when the lights should turn on. This example will use **Evening**.
- Scenes configured in your Hue app.
  - Hall dimmed &mdash; _This scene will be activated when **Evening** is activated. A good start will be a scene where all lights are dimmed to 5%._
  - Hall bright &mdash; _This scene will be activated when motion is detected._

## Flow

### Step 1

The lights should turn on to a dimmed state when **Evening** is activated.

<FlowCards>
    <FlowCard type="trigger" id="a1"><strong>Evening</strong> is activated</FlowCard>
    <FlowCard type="action" id="a2" connect-to-id="a1" app="Philips Hue" color="#F4AF2E" logo="/assets/logos/hue.svg">Activate the <strong>Hall dimmed</strong> scene</FlowCard>
</FlowCards>

### Step 2

The lights should turn off when **Evening** is deactivated.

<FlowCards>
    <FlowCard type="trigger" id="b1"><strong>Evening</strong> is deactivated</FlowCard>
    <FlowCard type="action" id="b2" connect-to-id="b1" app="Philips Hue" color="#F4AF2E" logo="/assets/logos/hue.svg">Turn all lights off in <strong>Hall</strong></FlowCard>
</FlowCards>

### Step 3

When motion is detected, the lights should turn on to full brightness.

<FlowCards>
    <FlowCard type="trigger" id="c1" app="Motion sensor - Hall" color="#F4AF2E" logo="/assets/logos/hue.svg">The motion alarm turned on</FlowCard>
    <FlowCard type="condition" id="c2" connect-to-id="c1"><strong>Evening</strong> is active</FlowCard>
    <FlowCard type="action" id="c3" connect-to-id="c2">Stop timer <strong>Hall Motion</strong></FlowCard>
    <FlowCard type="action" id="c4" connect-to-id="c2" app="Philips Hue" color="#F4AF2E" logo="/assets/logos/hue.svg">Activate the <strong>Hall bright</strong> scene</FlowCard>
</FlowCards>

### Step 4

When motion stops for a while, the lights should go back to dimmed state.

<FlowCards>
    <FlowCard type="trigger" id="d1" app="Motion sensor - Hall" color="#F4AF2E" logo="/assets/logos/hue.svg">The motion alarm turned off</FlowCard>
    <FlowCard type="condition" id="d2" connect-to-id="d1"><strong>Evening</strong> is active</FlowCard>
    <FlowCard type="action" id="d3" connect-to-id="d2">Start timer <strong>Hall Motion</strong> with <strong>3</strong> <strong>seconds</strong></FlowCard>
</FlowCards>

<FlowCards>
    <FlowCard type="trigger" id="e1">Timer <strong>Hall Motion</strong> finished</FlowCard>
    <FlowCard type="action" id="e2" connect-to-id="e1" app="Philips Hue" color="#F4AF2E" logo="/assets/logos/hue.svg">Activate the <strong>Hall dimmed</strong> scene</FlowCard>
</FlowCards>

## Used FlowBits features

- [Modes](/guide/modes)
- [Timers](/guide/timers)
