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

## Controls

- Click the brain icon: open with a new thought
- Another thought / Space / Enter: advance
- Copy / C: copy the thought and attribution
- Escape: close

## Collection

The bundled collection contains more than a thousand original modern thoughts:
deadpan observations, shower-thought logic, mundane surrealism, literal-minded
reversals, and mock profundity. It covers technology, home life, food, work,
language, time, the body, animals, and everyday existence.

Mitch Hedberg, Jack Handey, and Reddit's Showerthoughts community were researched
only for broad comic traits. Their jokes and posts are not reproduced. See
`research-sources.json` for the source index and provenance policy.

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

Plugin code is MIT licensed. The original bundled thought collection is
released under CC0 1.0 so it can be remixed and redistributed freely.
