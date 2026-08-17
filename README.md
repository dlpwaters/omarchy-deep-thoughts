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

The bundled collection is a pinned snapshot of the human-curated
[Deep Thought Tabs](https://github.com/TheCodeArtist/deep-thought-tabs) corpus.
It is built around funny, absurd, mock-profound observations and contains no
AI-generated or template-combined entries.

The upstream source is pinned to commit
`82bdab83d4b8b63901b575d92e86b2b976b741c8` and vendored under
`sources/deep-thought-tabs/` so the build is reproducible and works offline.

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

Plugin code is MIT licensed. The vendored Deep Thought Tabs source and the
mechanically converted collection retain the upstream BSD 3-Clause license;
see `DATA-LICENSE` and `sources/deep-thought-tabs/LICENSE`.
