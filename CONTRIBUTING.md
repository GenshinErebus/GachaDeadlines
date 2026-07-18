# Contributing to GachaDeadlines

Thank you for wanting to help keep GachaDeadlines updated! To maintain a clean and functional platform, please follow these guidelines when adding or modifying event data.

## Event Data Structure

All events must follow the exact JSON object schema structure. When submitting a Pull Request, ensure your new events strictly match this format:

```json
[
    {
        "id": "gi_002",
        "name": "Sunny Summer Fontinalia",
        "endDate": "2026-08-11T02:00:00Z"
    }
]
```

### Data Fields Specification

* **`id`**: Unique string identifier. Use the game shorthand prefix followed by a zero-padded three-digit number (e.g., `gi_009` for Genshin Impact, `hsr_012` for Honkai: Star Rail).
* **`name`**: The official in-game event title as a string. Double-check for correct spelling and capitalization.
* **`endDate`**: The exact expiration time formatted in **ISO 8601 UTC** format (`YYYY-MM-DDTHH:mm:ssZ`). Always use UTC time (`Z`) to ensure the countdown functions correctly across all user time zones.

## How to Submit Changes

1. **Fork the Repository**: Create your own copy of the project.
2. **Add the Event**: Insert the new event object at the end of the appropriate game events array.
3. **Validate Your Code**: Ensure the file syntax remains unbroken (watch out for missing commas between objects).
4. **Open a Pull Request**: Submit your changes with a clear title (e.g., `feat: add Sunny Summer Fontinalia event data`).

*Note: Your Pull Request will be squashed and reviewed before merging to maintain a clean repository history.*
