![alt text](./assets/AngryFrogLogo_Title_Right.png)

# Log viewer - CHANGELOG

## 1.2.0

### Added
* Added shortcut to open dev tools in electron app even when built
* Changed search from single text to or combinable texts via '||'
* Added changelog
* Import/Export of profiles

### Fixed
* Changed groupSameMsg flag declaration from false to undefined. This way it can be dertemined if the flag is really set on a new filter. Otherwise the advanced filtering always resets the grouping to false.
* Added local storage service for electron since the capacitor storage implementation does not work correctly in electron builds
* Fixed storing of last selected profile

## 1.1.0

### Added
* Added filter option to group messages by message, level and meta information if there is no other message in between
* Added reset button to filter options to restore filtering

### Fixed
* Fixed reset of filters on load of new file (Message filters were still applied)

## 1.0.0

### Added
* Added Visualization of log files with basic statistics and color coding
* JSON parser
* Ability to define multiple profiles for log file format configurations
* Filtering messages by text, log levels, timestamps and search
* Responsive layout
