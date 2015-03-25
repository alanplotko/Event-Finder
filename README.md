# About Event Finder

Event Finder is a simple Chrome Extension that enables users to search for events happening in their area.

Event Finder allows you to provide specifics for your location to find events happening near you. There is also an option to search for events happening in the next weekend. Event Finder uses the Eventbrite API as its source of data and indicates upcoming events.

## Installation

Install the Chrome Extension via the Chrome Web Store [here](https://chrome.google.com/webstore/detail/event-finder/mlkogpglpcnafcgpphiffhcfemdpkpep). It will be updated to the newest stable version on the Chrome Web Store.

## Usage

Input your location information and submit the form!

Address and range must be submitted together - this is a requirement for the Eventbrite Search API. I plan on making that more apparent (aside from just reporting an error message after the first failed attempt). You can mix and match when choosing what information to provide and then submit. There are notifications if you exit out of the extension popup to let you know when the search is complete.

## Contributing

Fork it and submit a pull request! =)

## Quick Changelog

Check [CHANGELOG.md](https://github.com/alanplotko/Event-Finder/blob/master/CHANGELOG.md) (and commits, if you'd like) for full details! I'll use this format: "vMAJOR.MINOR.PATCH [Purpose]: main point".

Some examples for "[Purpose]": stable for a new stable release, bugfix for any patches, feature for a new feature, and alpha/beta for bigger features and their respective stages.

- v1.0.1 [Bugfix]: fixes bad requests to Eventbrite API
- v1.0.0 [Stable]: initial release

## License

MIT License. Feel free to read it on the repository at [LICENSE](https://github.com/alanplotko/Event-Finder/blob/master/LICENSE).
