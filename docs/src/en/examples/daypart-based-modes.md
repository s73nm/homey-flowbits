# Daypart-Based Modes

FlowBits modes are perfect for creating a daypart system that automatically adjusts your home throughout the day. By combining modes with time-based triggers, your home can seamlessly transition between morning, day, evening, and night settings.

This example shows how to set up automatic mode changes based on the time of day, with different schedules for weekdays and weekends, plus integration with presence detection for sleep tracking.

## What you'll get

Your home will automatically switch between four daypart modes:

- **Morning** — Wake-up lighting and routines
- **Day** — Normal daytime settings
- **Evening** — Cozy atmosphere when the sun sets
- **Night** — Minimal lighting and quiet hours

The transitions happen at different times on weekdays versus weekends, so you can sleep in on Saturday without your morning routine kicking in at 6:30. Plus, the system can respond to when you actually wake up or go to sleep.

## Requirements

- The **Date & Time** app installed on Homey
- The **Presence** app installed on Homey (optional, for sleep-based triggers)
- Lights or other devices you want to automate based on the current daypart

## Schedule overview

| Mode    | Weekdays | Weekends |
|---------|----------|----------|
| Morning | 06:30    | 09:00    |
| Day     | 09:00    | 11:00    |
| Evening | Sunset   | Sunset   |
| Night   | 23:00    | 00:00    |

## Flow

### Morning mode

**Weekday morning:**

<FlowCards>
    <FlowCard type="trigger" id="a1" app="Date & Time" color="#f3282f" ffgo="/assets/logos/date-time.svg">The time is <strong>06:30</strong></FlowCard>
    <FlowCard type="condition" id="a2" connect-to-id="a1" app="Date & Time" color="#f3282f" ffgo="/assets/logos/date-time.svg">Today is a weekday</FlowCard>
    <FlowCard type="action" id="a3" connect-to-id="a2">Activate <strong>Morning</strong></FlowCard>
</FlowCards>

**Weekend morning:**

<FlowCards>
    <FlowCard type="trigger" id="b1" app="Date & Time" color="#f3282f" logo="/assets/logos/date-time.svg">The time is <strong>09:00</strong></FlowCard>
    <FlowCard type="condition" id="b2" connect-to-id="b1" app="Date & Time" color="#f3282f" logo="/assets/logos/date-time.svg">Today is a weekend day</FlowCard>
    <FlowCard type="action" id="b3" connect-to-id="b2">Activate <strong>Morning</strong></FlowCard>
</FlowCards>

**When the first person wakes up:**

<FlowCards>
    <FlowCard type="trigger" id="b4" app="Presence" color="#b9df49" logo="/assets/logos/presence.svg">The first person woke up</FlowCard>
    <FlowCard type="action" id="b5" connect-to-id="b4">Activate <strong>Morning</strong></FlowCard>
</FlowCards>

### Day mode

**Weekday daytime:**

<FlowCards>
    <FlowCard type="trigger" id="c1" app="Date & Time" color="#f3282f" logo="/assets/logos/date-time.svg">The time is <strong>09:00</strong></FlowCard>
    <FlowCard type="condition" id="c2" connect-to-id="c1" app="Date & Time" color="#f3282f" logo="/assets/logos/date-time.svg">Today is a weekday</FlowCard>
    <FlowCard type="action" id="c3" connect-to-id="c2">Activate <strong>Day</strong></FlowCard>
</FlowCards>

**Weekend daytime:**

<FlowCards>
    <FlowCard type="trigger" id="d1" app="Date & Time" color="#f3282f" logo="/assets/logos/date-time.svg">The time is <strong>11:00</strong></FlowCard>
    <FlowCard type="condition" id="d2" connect-to-id="d1" app="Date & Time" color="#f3282f" logo="/assets/logos/date-time.svg">Today is a weekend day</FlowCard>
    <FlowCard type="action" id="d3" connect-to-id="d2">Activate <strong>Day</strong></FlowCard>
</FlowCards>

### Evening mode

Evening mode uses sunset timing, so it automatically adjusts throughout the year.

<FlowCards>
    <FlowCard type="trigger" id="e1" app="Date & Time" color="#f3282f" logo="/assets/logos/date-time.svg">The sun is setting in <strong>0</strong> minutes</FlowCard>
    <FlowCard type="action" id="e2" connect-to-id="e1">Activate <strong>Evening</strong></FlowCard>
</FlowCards>

::: tip
You can trigger evening mode before sunset by increasing the minutes. For example, "The sun is setting in **30** minutes" gives you a head start on cozy lighting.
:::

### Night mode

**Weekday night:**

<FlowCards>
    <FlowCard type="trigger" id="f1" app="Date & Time" color="#f3282f" logo="/assets/logos/date-time.svg">The time is <strong>23:00</strong></FlowCard>
    <FlowCard type="condition" id="f2" connect-to-id="f1" app="Date & Time" color="#f3282f" logo="/assets/logos/date-time.svg">Today is a weekday</FlowCard>
    <FlowCard type="action" id="f3" connect-to-id="f2">Activate <strong>Night</strong></FlowCard>
</FlowCards>

**Weekend night:**

<FlowCards>
    <FlowCard type="trigger" id="g1" app="Date & Time" color="#f3282f" logo="/assets/logos/date-time.svg">The time is <strong>00:00</strong></FlowCard>
    <FlowCard type="condition" id="g2" connect-to-id="g1" app="Date & Time" color="#f3282f" logo="/assets/logos/date-time.svg">Today is a weekend day</FlowCard>
    <FlowCard type="action" id="g3" connect-to-id="g2">Activate <strong>Night</strong></FlowCard>
</FlowCards>

**When the last person goes to sleep:**

<FlowCards>
    <FlowCard type="trigger" id="g4" app="Presence" color="#b9df49" logo="/assets/logos/presence.svg">The last person went to sleep</FlowCard>
    <FlowCard type="action" id="g5" connect-to-id="g4">Activate <strong>Night</strong></FlowCard>
</FlowCards>

## Reacting to mode changes

Once your daypart modes are set up, create flows that react to them. This keeps your automations organized—change the schedule in one place, and all your lighting and routines follow.

**Morning lighting:**

<FlowCards>
    <FlowCard type="trigger" id="h1"><strong>Morning</strong> is activated</FlowCard>
    <FlowCard type="action" id="h2" connect-to-id="h1" app="Philips Hue" color="#F4AF2E" logo="/assets/logos/hue.svg">Activate the <strong>Bedroom Energize</strong> scene</FlowCard>
    <FlowCard type="action" id="h3" connect-to-id="h1" app="Philips Hue" color="#F4AF2E" logo="/assets/logos/hue.svg">Activate the <strong>Kitchen Bright</strong> scene</FlowCard>
</FlowCards>

**Evening lighting:**

<FlowCards>
    <FlowCard type="trigger" id="i1"><strong>Evening</strong> is activated</FlowCard>
    <FlowCard type="action" id="i2" connect-to-id="i1" app="Philips Hue" color="#F4AF2E" logo="/assets/logos/hue.svg">Activate the <strong>Living room Relax</strong> scene</FlowCard>
    <FlowCard type="action" id="i3" connect-to-id="i1" app="Philips Hue" color="#F4AF2E" logo="/assets/logos/hue.svg">Activate the <strong>Kitchen Dimmed</strong> scene</FlowCard>
</FlowCards>

**Night settings:**

<FlowCards>
    <FlowCard type="trigger" id="j1"><strong>Night</strong> is activated</FlowCard>
    <FlowCard type="action" id="j2" connect-to-id="j1" app="Philips Hue" color="#F4AF2E" logo="/assets/logos/hue.svg">Turn all lights off in <strong>Living room</strong></FlowCard>
    <FlowCard type="action" id="j3" connect-to-id="j1" app="Philips Hue" color="#F4AF2E" logo="/assets/logos/hue.svg">Activate the <strong>Bedroom Nightlight</strong> scene</FlowCard>
</FlowCards>

## Tips

- **Check the current mode in other flows** — Use the condition card to make flows behave differently based on the time of day:

<FlowCards>
    <FlowCard type="trigger" id="k1" app="Motion sensor - Hall" color="#F4AF2E" logo="/assets/logos/hue.svg">The motion alarm turned on</FlowCard>
    <FlowCard type="condition" id="k2" connect-to-id="k1"><strong>Night</strong> is active</FlowCard>
    <FlowCard type="action" id="k3" connect-to-id="k2" app="Philips Hue" color="#F4AF2E" logo="/assets/logos/hue.svg">Activate the <strong>Hall Nightlight</strong> scene</FlowCard>
</FlowCards>

- **Add more dayparts** — Consider adding modes like **Dinner** or **Late Evening** for finer control over your routines.

- **Manual override** — You can always manually activate a mode from a flow or widget, temporarily overriding the schedule until the next automatic transition.

- **Combine time and presence** — The Presence app triggers work alongside the scheduled times. If someone wakes up before the scheduled morning time, Morning mode activates immediately. The scheduled trigger still runs but has no effect since the mode is already active.

## Used FlowBits features

- [Modes](/guide/modes)
