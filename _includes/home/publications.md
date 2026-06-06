<span class='anchor' id='publications'></span>

# Publications

{% assign publications = site.publications | sort: "date" | reverse %}
{% for post in publications %}
  {% include publication-card.html post=post %}
{% endfor %}
