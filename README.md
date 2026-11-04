# Jiaxing Li — Personal Homepage

Personal academic homepage, built with [Jekyll](https://jekyllrb.com/) and hosted on GitHub Pages.

Live site: <https://jiaxingli-sfu.github.io/>

## Editing content

| What | Where |
| --- | --- |
| Name, photo, title, advisor, email, profile links | `_config.yml` → `author` |
| About text and research interests | `index.md` |
| Research themes (the three cards) | `_data/research.yml` |
| Experience | `_data/experience.yml` (section is hidden while the file is missing or empty) |
| Education | `_data/education.yml` |
| Publications | one Markdown file per paper in `_publications/` |
| Paper figures and slides | `resources/` |

### Adding a publication

Create `_publications/YYYY-MM-DD-short-name.md`. The homepage groups papers by the year of `date` and lists the newest first.

```yaml
---
title: "Paper Title"
permalink: /publication/short-name/
date: 2026-08-05
venue: "Full Venue Name (ABBR)"
venue_short: "ABBR"            # shown on the badge, e.g. "IJCAI"
short_name: "SYSTEM"           # short name used in the research cards
note: "Oral"                   # optional
authors: "**Jiaxing Li**, Co-Author, and Advisor"
excerpt: "One-sentence summary."
image: "/resources/short-name.png"   # optional figure
image_alt: "What the figure shows"
paperurl: "https://..."        # optional links: paperurl, pdfurl, arxivurl,
arxivurl: "https://arxiv.org/abs/..."  # slidesurl, doiurl, dblpurl, venueurl
abstract: >-
  Optional abstract, shown on the paper's own page.
bibtex: |
  @inproceedings{key,
    title = {...},
  }
---
```

## Local preview

Requires Ruby and Bundler.

```bash
bundle install
bundle exec jekyll serve
```

Then open <http://localhost:4000/>.

## Publishing

GitHub Pages builds and publishes the site from the `main` branch (**Settings → Pages → Deploy from a branch → `main` / `(root)`**). Every push to `main` updates the live site within a minute or two.

## Structure

- `_layouts/` — page templates (`home` for the homepage, `publication` for paper pages)
- `_includes/` — header, footer, publication list items, icons
- `assets/css/style.css` — all styles, including the dark theme
- `assets/js/site.js` — dark mode toggle, mobile menu, publication filter, BibTeX dialog
- `assets/fonts/` — self-hosted Inter and Source Serif 4 fonts

Third-party fonts and icons are listed in `THIRD_PARTY_NOTICES.md`.
