# Garbled Circuit Overview

## Basic Garbled Circuit structure overview
A garbled circuit is a cryptographic obfuscation technique and a cryptographic algorithm that ensures computation privacy i.e. manages the protection of a boolean circuit that can be executed without leaking information. Neither the semantics of boolean operators (AND, OR, XOR, etc.) that make up the circuit nor the semantics of inputs and outputs of the circuit will be revealed to the attackers through reverse-engineering or brute force attacks.


![GC](./fig/Garbled_Circuit.jpg)


- Inputs and outputs are Garbled Values i.e. 128 bits token indistinguishable from random with a secret semantic value of 0 or 1 only known by the nodes
- Each boolean operator is implemented in the circuit by an encrypted truth table, decrypted by its respective Garbled Values inputs.





[Foundation of Garbled Circuits, Viet Tung Hoang, B.S.](https://www.cs.fsu.edu/~tvhoang/thesis.pdf)
