# Sliders

Sliders let you work with adjustable numeric values inside your flows.  
They behave like virtual dials: users can drag the slider in the UI, and flows can read or update its value at any time.

A slider always holds a single number between **0 and 100**.  
This fixed range keeps sliders predictable and easy to use for percentages, intensities, or any normalized value.

## How it works

Sliders can be controlled both from the user interface and from flow cards.  
When the value changes, a flow card triggers so you can respond to that update.

## Key Features

- User-driven numeric input.
- Flow-driven updates.
- Optional real-time updates during sliding.
- Consistent 0–100 range for all sliders.
- Suitable for fine-tuned control.

## Flow Cards

_TODO_

## Examples

### **Brightness control**

Let a user pick a brightness level with a slider; flows apply that percentage to one or more devices.

### **Thermostat offset or scaling**

While a thermostat might use actual temperatures, a slider can control offsets, intensities, or automation weighting.

### **General percentages**

Use sliders for fan speed, transition duration scaling, media volume, or any percentage-based setting.

## Notes

- Sliders always use a 0–100 range.
- Sliders hold the value; flows remain stateless.
- You can create any number of sliders, each identified by name.
- Step size controls how precise the user input can be.
