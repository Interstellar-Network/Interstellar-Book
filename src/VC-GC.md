
# Visual Cryptography for Transaction Validation Screen
Garbled Circuit & Visual Cryptography Display

## Garbled Circuits output frames

![Visual Cryptography Technical Overview](./fig/Visual-Cryptography-Technical-Overview.png)

Those frames superspose on retinal eyes leveraging persistence of vision

## Visual Cryptography

![VC demo](./fig/Visual_crypto_animation_demo.gif)

## Main principles

We use a pre-computed One-Time Garbled Circuit to generate and output Visual Cryptography Shares at 60–120 frames/second on the device framebuffer.

Those visual cryptography shares do not superpose on the device screen but only in the user's eye. Thanks to the human Persistence of Vision ability: your eye and brain retain a visual impression for about 1/30 of a second (the exact time depends on the brightness of the image). 

## Security consideration

The garbled circuit execution will manage the display of consecutive random frames. The result is that the execution of the circuit will not leak any secret information (passwords, on-time  codes or pin pad/keyboard topologies) securely embeded in the circuit. 

This ensures that an attacker won't be able to obtain this secret information

- during the garbled circuit execution
- neither with a simple screenshot, thanks to visual cryptography and persistence of vision

As a consequence, it prevent the attacker to build and execute a fake User Interface quickly enough during the display session.
This scheme can resist current banking trojans with overlay capabilities but not targeted attacks.

However, it makes a fake UI attack, complexe and resource intensive enough to enable us to detect it during the transaction validation session. 

This is the way we aim at resisting potential targeted attacks. Thanks to our proof of history of legitimate computation scheme, (roadmap/research in progress), based on a specific reusable Garbled Circuit evaluation.


## Explanation

> We started by implementing a working solution that outputs visual cryptography shares. We then realized that it was a bit disturbing for the user and that a pure visual cryptography scheme is not crucial for our overall security model. We then decided to provide a more friendly solution for the user that is also more efficient especially regarding Garbled Circuit size.

Although our circuits display screens at a pixel level to manage any type of images, fonts types, characters sizes and more. We decided to switch on a slightly different solution.

Let's go back to an old fashioned displays to explain it.

![GatesSegment](./fig/GatesSegmentBlack.png)

The Garbled Circuit can randomly output each:

- segments/sub segments
- any group of pixels
- or even single pixel

of a frame with a probability of 1/n ( n > 2)

### Display example

![walletdemo](./fig/Wallet-Superposition-Black-Background-Demo.png)

### Simulations

To fine tune the design of our circuits and provide realistic look and feel of the solution, we designed the following
[Transaction validation screen simulations](https://simu.interstellar.gg) based on [PsychoJS library -  PsychoPy (github.com)](https://github.com/psychopy/psychojs) and [PsychoPy neuroscience/psychophysic tools](https://www.psychopy.org/)

### Future plans

At a later stage, we aim at reusing our pixel based visual cryptography implementation and/or [segment-based visual cryptography](https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.84.7421&rep=rep1&type=pdf) to increase the complexity level of potential attacks and enable video recording proof scheme without disturbing the smooth user experience. 

### Research Lead

Research lead is to leverage SRAM framebuffer speed 10-30x vs. DRAM to force the attacker to miss frames with a saturated GPU command queue filled with decoy and VC frames on high frequency displays.