# Child account preview

Public route: /profile-kid/kid/ (GitHub Pages directory redirect supports /kid).

Independent static profile for Mây Nhỏ, age 6: remaining daily play time, read-only parent policy, 00+ category cards, username and display name. No sensitive parent details or password exposed. Four manually selected preview states cover ready, almost exhausted, exhausted and rest period. Closed states hide game actions. Cards open an honest placeholder; no actual game or backend connection. Sign-out only changes this local preview UI; it is not authentication. No persistence, requests, external scripts, fonts or CDN.

Validation: Edge at 320/390/768/1440px, screenshots inspected; state transitions, remaining time, game action visibility, dialog Escape/focus return, sign-out/return, read-only settings, no external requests or runtime errors. Existing parent source untouched.

