# Changelog
All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](http://semver.org/).

## [Planned] 1.1.0 / Unreleased
- Clearly convey requirement of range, if submitting address
  - Allow for choice between mi. and km.
- Reduce number of chrome.storage requests and clean up JavaScript code
  - Explore methods of compressing data to switch from local to sync (sync has less space than local, but keeps data available alongside the user's account)
- Introduce tabs for specific searches
- Create settings page outside the extension's popup
- Further explore Eventbrite Search API for feature ideas
- Further explore labeling events
- Show "upcoming badge" if event is within 1 week instead of 2 days

## 1.0.1 / 2015-03-25
- [BUGFIX] Fix bad requests to Eventbrite API

## 1.0.0 / 2015-03-24
- [RELEASE] First stable release of Event Finder
- [FEATURE] Notifications alert user when search is done if popup is exited
- [FEATURE] Filter events by weekend
- [ENHANCEMENT] Indicate whether events are happening soon based on the current and event dates (currently 2 days apart)
