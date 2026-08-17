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

The bundled collection contains 10,490 unique human-written entries:

- 463 unique Jack Handey quotations
- 9,909 attributed Reddit r/Showerthoughts submissions
- 118 additional entries from the Deep Thought Tabs collection

The source files come from the Unlicense-licensed
[JKirchartz/fortunes](https://github.com/JKirchartz/fortunes) repository and the
BSD-licensed [Deep Thought Tabs](https://github.com/TheCodeArtist/deep-thought-tabs)
repository. Both are pinned to exact commits and vendored under `sources/`, so
the build is reproducible and the plugin remains fully offline.

The build mechanically parses and deduplicates those collections. It does not
generate, rewrite, or template-combine any entry. Reddit usernames and source
dates are retained where the upstream collection provides them.

The Reddit collection is broad and includes occasional adult, crude, political,
or dark humor.

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

Plugin code is MIT licensed. Vendored repository files retain their respective
upstream Unlicense and BSD 3-Clause terms. Quoted text remains attributable to
Jack Handey or the named Reddit submitter; see `DATA-LICENSE` for the complete
provenance and rights notice.
