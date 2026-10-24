# Pediscribe website

The public website for Pediscribe, a private health diary for parents. Plain HTML, CSS and a little JavaScript: no framework, no build step, no cookies, no analytics, no outside requests.

## Pages

| Page | File |
| --- | --- |
| Home | `index.html` |
| Privacy policy | `privacy.html` (word for word the app's privacy notice, plus a "This website" section) |
| Help and questions | `help.html` (the app's questions and answers) |
| Getting reminders on time | `reminders.html` (battery settings, phone by phone) |
| Sources and disclaimer | `sources.html` |
| Not found | `404.html` |

## Keep in step with the app

The privacy policy, the questions and the sources repeat the app's own wording. When the app's privacy notice (`lib/privacy/privacy_page.dart`), questions (`lib/about/faq_page.dart`) or sources (`lib/about/sources_page.dart`) change, change these pages the same day, including the version and date at the foot of the privacy policy.

## Preview on this computer

```
npx serve@14.2.4 -l 4321 .
```

Then open http://localhost:4321.

## Hosting on Vercel

Import this repository in Vercel as a new project: framework preset **Other**, no build command, output directory `.` (the root). `vercel.json` adds clean addresses (`/privacy`) and strict security headers.

Leave Vercel Web Analytics and Speed Insights **off**: the privacy policy says this website has no analytics.

## Credits

Plus Jakarta Sans (SIL Open Font License, `assets/fonts/OFL.txt`). Material Design Icons by Google (Apache License 2.0, `assets/ICONS-LICENSE.txt`). The app pictures show a made-up sample child.
