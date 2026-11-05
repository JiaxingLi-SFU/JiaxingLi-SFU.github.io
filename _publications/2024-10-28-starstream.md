---
title: "StarStream: Live Video Analytics over Space Networking"
collection: publications
permalink: /publication/starstream/
excerpt: "Live video analytics over modern low Earth orbit satellite networking."
date: 2024-10-28
venue: "ACM Multimedia"
authors: "Miao Zhang, **Jiaxing Li**, Haoyuan Zhao, Linfeng Shen, and Jiangchuan Liu"
paperurl: "https://doi.org/10.1145/3664647.3680785"
pdfurl: "https://miaozhang8.github.io/assets/pdf/MM-2024-StarStream.pdf"
slidesurl: "https://miaozhang8.github.io/assets/pdf/mm_24_starstream_slides.pdf"
arxivurl: "https://arxiv.org/abs/2508.14222"
doiurl: "https://doi.org/10.1145/3664647.3680785"
dblpurl: "https://dblp.org/rec/conf/mm/ZhangLZSL24"
image: "/resources/starstream.png"
citation: "Miao Zhang, Jiaxing Li, Haoyuan Zhao, Linfeng Shen, and Jiangchuan Liu. StarStream: Live Video Analytics over Space Networking. ACM Multimedia, 2024, pp. 7909-7917."
image_alt: "StarStream figure"
venue_short: "ACM MM"
short_name: "StarStream"
abstract: >-
  Streaming videos from resource-constrained front-end devices over networks to resource-rich cloud servers has long been a common practice for surveillance and analytics. Most existing live video analytics (LVA) systems, however, have been built over terrestrial networks, limiting their applications during natural disasters and in remote areas that desperately call for real-time visual data delivery and scene analysis. With the recent advent of space networking, in particular, Low Earth Orbit (LEO) satellite constellations such as Starlink, high-speed truly global Internet access is becoming available and affordable. This paper examines the challenges and potentials of LVA over modern LEO satellite networking (LSN). Using Starlink as the testbed, we have carried out extensive in-the-wild measurements to gain insights into its achievable performance for LVA. The results reveal that the uplink bottleneck in today's LSN, together with the volatile network conditions, can significantly affect the service quality of LVA and necessitate prompt adaptation. We accordingly develop StarStream, a novel LSN-adaptive streaming framework for LVA. At its core, StarStream is empowered by a Transformer-based network performance predictor tailored for LSN and a content-aware configuration optimizer. We discuss a series of key design and implementation issues of StarStream and demonstrate its effectiveness and superiority through trace-driven experiments with real-world network and video processing data.
bibtex: |
  @inproceedings{zhang2024starstream,
    title     = {{StarStream}: Live Video Analytics over Space Networking},
    author    = {Zhang, Miao and Li, Jiaxing and Zhao, Haoyuan and Shen, Linfeng and Liu, Jiangchuan},
    booktitle = {Proceedings of the 32nd ACM International Conference on Multimedia},
    pages     = {7909--7917},
    year      = {2024},
    doi       = {10.1145/3664647.3680785}
  }
---
