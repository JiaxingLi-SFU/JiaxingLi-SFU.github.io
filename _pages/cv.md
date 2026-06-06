---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

Education
======
- Ph.D. Student, School of Computing Science, Simon Fraser University, 2023.09 - present
- Undergraduate, School of Computing Science, Simon Fraser University, 2020.01 - 2023.08

Publications
======
  <ul>{% for post in site.publications reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
