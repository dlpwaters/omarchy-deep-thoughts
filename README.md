# Omarchy Deep Thoughts

A brain icon for the Omarchy bar. Open it for a random satirical thought, then
click **Another thought** (or press Space/Enter) to keep going.

The plugin uses a persistent shuffle bag: every included thought appears once
before the collection reshuffles. It makes no network requests at runtime and
runs no background service.

## Install

```bash
omarchy plugin add https://github.com/dlpwaters/omarchy-deep-thoughts.git --enable --yes
```

## Remove

```bash
omarchy plugin remove dlpwaters.deep-thoughts
```

## Controls

- Click the brain icon: open with a new thought
- Another thought / Space / Enter: advance
- Copy / C: copy the thought and attribution
- Escape: close

## Collection

The bundled collection contains 709 short, public-domain satirical definitions
from Ambrose Bierce's *The Devil's Dictionary*, sourced from
[Project Gutenberg eBook 972](https://www.gutenberg.org/ebooks/972). Long verse
passages and dated identity-targeted entries are excluded.

The Jack Handey material in the local source catalog is metadata-only and is
not redistributed as text in this public plugin.

Rebuild the bundled data with:

```bash
node scripts/build-data.mjs
```

Runtime requirements (`jq`, `shuf`, `flock`, and `wl-copy`) are part of a
standard Omarchy installation.

## Privacy and storage

The plugin writes only its remaining shuffled indices under
`$XDG_CACHE_HOME/omarchy-deep-thoughts/` (normally `~/.cache`). It has no
telemetry, account, daemon, or privileged component.

## License

Plugin code is MIT licensed. The bundled Bierce text is public domain in the
United States; its transcription source is Project Gutenberg.
