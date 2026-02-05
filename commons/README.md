# Symphony Commons

The commons folder serves as a shared location for anything that needs to be shared between multiple projects.

## Compiling types

Type updates should be made in the rust types file, then generated to other languages for consistency.

To do this, use **typeshare-cli**

```bash
cargo install typeshare-cli
```

then compile

```bash
typeshare ./ --lang=typescript --output-file=./types.d.ts
```
