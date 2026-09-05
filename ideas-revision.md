# Weather CLI Review

- **Colors:** there are none; need to define cyan (menu), yellow (temp), green/red (ok/error).
- **AGENTS.md:** it says `index.ts` is a stub, but the app already works — it needs updating.
- **Cities:** geocoding only returns 1 result; ambiguous names may fail.
- **Tests:** none exist; it would be good to at least test storage and the APIs with mocks.
- **Binary:** it compiles fine; check that `./weather` saves data in `~/.config/weather-cli/`.
- **Scalability:** how easy will it be to expand with new features?
- **Loading:** is there a loading state for async tasks?
