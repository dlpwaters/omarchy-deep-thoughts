# Contributing

This plugin mirrors pinned human-curated source collections rather than
maintaining a separate generated or user-submitted corpus.

For new thoughts, contribute to one of the upstream collections first:

- https://github.com/JKirchartz/fortunes
- https://github.com/TheCodeArtist/deep-thought-tabs

After an upstream change is accepted, update the pinned commit and vendored
source file, preserve the upstream license and attribution, run
`node scripts/build-data.mjs`, and include the regenerated `thoughts.json`.

Do not add AI-generated, template-combined, scraped, or unattributed material.
