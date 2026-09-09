# Contributing to GachaDeadlines

Thank you for wanting to help keep GachaDeadlines updated! To maintain a clean and functional platform, please follow these guidelines when adding or modifying event data.

## Event Data Structure

All events live in the `eventDatabase` object in [`script.js`](script.js). Each game has three event categories, marked with comments in the file:

| Type | Purpose | Styling |
|---|---|---|
| Regular events | Limited-time events, sign-ins, endgame cycles | Standard green card |
| Trials | Test runs / showcases | Standard, grouped under `// Trial` |
| Banners | Limited character & weapon banners | **Golden border** (see below) |

### Event Object Schema

Every event must strictly match this format:

```js
{
    id: "gi_009",                      // Game prefix + zero-padded number
    name: "Event Display Name",
    endDate: "2026-11-03T14:00:00Z"   // ISO 8601, always UTC ("Z")
}
```

| Field | Format | Example |
|---|---|---|
| `id` | `<game-prefix>_<3-digit number>` | `gi_009`, `hsr_012`, `zzz_020` |
| `name` | Free text (Unicode incl. emojis allowed) | |
| `endDate` | `YYYY-MM-DDTHH:mm:ssZ` — **always end with `Z` (UTC)** | `2026-09-22T14:00:00Z` |

**Game ID prefixes:** `gi_` (Genshin), `hsr_`, `zzz_`, `ark_` (Endfield), `dna_`, `nte_`, `msd_` (MONGIL), `rev_` (Reverse: 1999), `wuwa_`.

### ID Rules ⚠️

- **IDs must be unique across the entire file, not just within a game.** The countdown system resolves events by ID globally — duplicated IDs will cause broken timers.
- Never reuse an ID for a new event. Increment the highest existing number for that game (e.g. if `gi_014` exists, the next event is `gi_015`).

### Banner Cards Require a CSS Entry 🎨

New character/weapon banner IDs must be added **in both places**, or they won't render as golden banner cards:

1. `script.js` — add the event object under the `// Banner` section
2. `style.css` — add the ID to the golden banner selector list, **and** to the corresponding `body.light-mode` selector list

### Maintenance Windows

Maintenance entries use their own schema and are placed in the game's `maintenance` array:

```js
{
    id: "gi_maint_001",              // <game>_maint_<number>
    startDate: "2026-09-22T22:00:00Z",
    endDate: "2026-09-23T03:00:00Z",
    region: "eu"                     // optional — omit if the window applies to all regions
}
```

All times must be in UTC (`Z`). Region-specific values are handled by the `serverResets` table and are maintained by the repository owner only.

### Daily Reset Times

The per-region daily reset times (`serverResets`) are only changed by the maintainer, e.g. when a game officially changes its reset schedule. Don't open PRs for these unless a reset time officially changed.

## How to Submit Changes

1. **Fork** the repository and create a branch
2. Update only the relevant event entries in `script.js`
3. Use a clear commit message, e.g.:

   ```
   feat: add Sunny Summer Fontinalia event data
   ```

4. Open your Pull Request against `main`

Use conventional commit prefixes where possible: `feat:` (new events/data), `fix:` (corrected end dates), `docs:` (guideline updates).

*Note: Your Pull Request will be squashed and reviewed before merging to maintain a clean repository history.*

## Scope Limitations

- ✅ Accepted: event data updates, corrections of `endDate` values, new events/banners for the **9 predefined games**
- ❌ Not accepted: adding new games, refactors of the countdown logic, or changes to styling/theme files (unless discussed in an issue first)
