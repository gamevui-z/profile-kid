# Child account preview

Public route: /profile-kid/kid/ (GitHub Pages directory redirect supports /kid).

Independent static profile for Mây Nhỏ, age 6: remaining daily play time, read-only parent policy, 00+ category cards, username and display name. No sensitive parent details or password exposed. Four manually selected preview states cover ready, almost exhausted, exhausted and rest period. Closed states hide game actions. Cards open an honest placeholder; no actual game or backend connection. Sign-out only changes this local preview UI; it is not authentication. No persistence, requests, external scripts, fonts or CDN.

Validation: Edge at 320/390/768/1440px, screenshots inspected; state transitions, remaining time, game action visibility, dialog Escape/focus return, sign-out/return, read-only settings, no external requests or runtime errors. Existing parent source untouched.


## Discovery upgrade — 2026-10-24
- Accentless search combines with category and favorites filters. Favorites and last viewed card are in-memory only. Empty results offer filter reset.
- Favorite state synchronizes between cards and detail dialog; hidden focused cards return focus to the filter.
- Colors and wording distinguish approaching limit, exhausted time and rest. Locked states hide discovery controls, recent card and game actions. Parent policy stays read-only.
- Navigation anchors, clearer hierarchy, larger art panels, consistent buttons and compact mobile game rows.
- Edge validation: 320/390/768/1440px, search, intersecting filters, favorites, empty/reset state, recent reopening, locked states, dialog keyboard/focus, logout and no extra network requests.


## Profile-only scope — 2026-10-27
Removed game discovery, search, favorites, recent cards, game dialog and scenario switcher from the child profile. Removed related links, CSS and event handlers. Profile keeps time summary, read-only parent rules, identity and local sign-out interaction. A compact footer retains the unsynchronized-data notice. Game discovery belongs on the game site, not this profile. Tests now check absence of removed features, valid anchors, 320–1440px layout, policy help, focus and sign-out.

