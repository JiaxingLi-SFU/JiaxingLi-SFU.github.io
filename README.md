# Jiaxing Li — Personal Homepage

Personal academic homepage, built with [Jekyll](https://jekyllrb.com/) and hosted on GitHub Pages.

Site address once GitHub Pages is enabled: <https://jiaxingli-sfu.github.io/JiaxingLi_Personal_Page/>

## Editing content

| What | Where |
| --- | --- |
| Name, photo, title, email, profile links | `_config.yml` → `author` |
| About text and research interests | `index.md` |
| News | `_data/news.yml` (newest first) |
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

Then open <http://localhost:4000/JiaxingLi_Personal_Page/>.

## Publishing

In the repository on GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, then choose `main` and `/ (root)`.
GitHub Pages works on public repositories with any plan; a private repository needs GitHub Pro (included in the GitHub Student Developer Pack).

## Structure

- `_layouts/` — page templates (`home` for the homepage, `publication` for paper pages)
- `_includes/` — header, footer, publication list items, icons
- `assets/css/style.css` — all styles, including the dark theme
- `assets/js/site.js` — dark mode toggle, BibTeX copy, active section highlight
- `assets/fonts/` — self-hosted Inter and Source Serif 4 fonts

Third-party fonts and icons are listed in `THIRD_PARTY_NOTICES.md`.
