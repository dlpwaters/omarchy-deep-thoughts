# Contributing

This plugin mirrors the human-curated Deep Thought Tabs collection rather than
maintaining a separate generated or user-submitted corpus.

For new thoughts, contribute to the upstream collection first:
https://github.com/TheCodeArtist/deep-thought-tabs

After an upstream change is accepted, update the pinned commit and the vendored
`deepThoughtsArray.js`, preserve the upstream license, run
`node scripts/build-data.mjs`, and include the regenerated `thoughts.json`.

Do not add AI-generated, template-combined, scraped, or unattributed material.
