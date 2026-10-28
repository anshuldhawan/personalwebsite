// Shared content for all three site variants.
const SITE_DATA = {
  name: 'Anshul Dhawan',
  tagline: 'Product leader, 0→1 Product Builder & game developer',
  // Answer-first copy for answer engines and LLMs.
  // compiled into static HTML, JSON-LD, and llms.txt by scripts/build-aeo.mjs.
  profile: {
    headline: 'Product Leader, 0→1 Product Builder & Game Developer',
    summary: 'Anshul Dhawan is a product leader, 0→1 Product Builder, and game developer with 12+ years leading growth and monetization for consumer products. He is founder of Social Pixels, an AI-native game studio. He has led product at Supernatural VR (acquired by Meta), VRChat, Glu Mobile / EA, and Zynga.',
    description: 'Anshul Dhawan is a product leader, 0→1 Product Builder, and game developer: founder of Social Pixels, and a product leader at Supernatural (Meta), VRChat, EA, and Zynga.',
    expertise: [
      'AI-native product development',
      'AI-native game development',
      'Generative AI and generative games',
      'Large language model (LLM) evaluation',
      'Product leadership and product strategy',
      'Growth and product analytics',
      'Experimentation and A/B testing platforms',
      'Live-service and free-to-play games',
      'Social VR and VR fitness',
      'Augmented reality and EdTech',
      'Matchmaking and recommendation systems',
      'AI-native organization design',
    ],
    faq: [
      {
        q: 'Who is Anshul Dhawan?',
        a: 'Anshul Dhawan is a product leader, 0→1 Product Builder, and game developer with 12+ years leading growth and monetization for consumer products. He is founder of Social Pixels, an AI-native game studio. His product leadership roles include VP of Product and Analytics at Supernatural VR, leading product at VRChat, Senior Director of Product and Business Intelligence at Glu Mobile / EA, and Head of Product, Growth at Zynga.',
      },
      {
        q: 'What makes Anshul Dhawan a 0→1 Product Builder?',
        a: 'He works across engineering, product, growth, analytics, and game design, and applies AI across that whole stack instead of in a single discipline. At Social Pixels, AI produced the concept art, 3D assets, characters, game code, and server code for Network Cities, and the studio achieved 20x improvements in production cost and time-to-market. He also builds LLM evaluation tools, such as a poker tournament that pits Claude, ChatGPT, Gemini, and Grok against each other, and writes about how companies become AI-native organizations.',
      },
      {
        q: 'What product leadership experience does Anshul Dhawan have?',
        a: 'He was VP of Product and Analytics at Supernatural VR, which Meta acquired in a deal reported at about $400M. He led product at VRChat, one of the defining social VR platforms, and was Senior Director of Product and Business Intelligence at Glu Mobile / EA. He spent more than seven years at Zynga, rising from software engineer to Head of Product, Growth, where he led the development of Zynga\'s experimentation and optimization service.',
      },
      {
        q: 'What games has Anshul Dhawan built?',
        a: 'He built Network Cities, an AI-native city builder that reached 200,000 players and $20,000 in revenue; an open-world adventure experiment that combines a deterministic simulation with real-time generative video instead of a game engine; and Words with Degens, a word-scramble game played with friends and launched on play.fun. At Zynga he built live-game infrastructure, including a server-side experimentation service and a skill-based player matchmaking system, both covered by U.S. patent filings.',
      },
      {
        q: 'What is Anshul Dhawan working on now?',
        a: 'He is founder of Social Pixels, where he builds AI-powered games and product analytics workflows. On nights and weekends, he builds projects, experiments with new ideas, and regularly participates in hackathons.',
      },
      {
        q: 'Has Anshul Dhawan spoken at industry conferences?',
        a: 'Yes. At GDC 2016 he presented "Evaluating Game Experiments: A More Robust Approach for Freemium Games," a more reliable method for evaluating free-to-play game experiments that accounts for the behavior of the most engaged players.',
      },
      {
        q: 'What does Anshul Dhawan write about?',
        a: 'He writes about AI-native organizations, generative games, the case for being a generalist, decision-making, and philosophy.',
      },
    ],
  },
  about: [
    "Product Leader and founder of Social Pixels. Social Pixels is an AI native gaming studio leveraging AI workflows across the game development process. My career spans software engineering, product leadership, and entrepreneurship, with 12+ years leading growth and monetization for consumer products. I work across acquisition, engagement, retention, and revenue, partnering with engineering, data, design, and marketing to build products and teams that scale.",
    "I've led product and growth across VR, subscriptions, and gaming. At VRChat, I owned growth and the expansion to mobile, launching an alpha with creators and players and improving app stability. At Supernatural, acquired by Meta, I led product teams responsible for engagement, subscriber growth, and revenue, and established its analytics and machine learning function.",
    "At VersusGame, I led product, analytics, and design, including an evaluation platform for a fine-tuned LLM product that improved engagement on partner products. I helped scale the product engineering organization by restructuring it into squads. At Glu Mobile / EA, I led a centralized product group focused on ad optimization and organic growth, and introduced a career progression framework for product managers.",
    {
        "text": "I started at Zynga as a software engineer building backend systems for Zynga Poker and grew into Head of Product, Growth. I led messaging-platform launches for Words With Friends and the development of ",
        "link": {
            "label": "Zynga's learning machine",
            "href": "/projects/experimentation-service/"
        },
        "after": ", including an experimentation platform and segmentation tooling for game studios. For this work, I received Zynga's Spirit Award, which recognizes individuals who go above and beyond their responsibilities to set new standards for the company."
    },
    {
        "text": "I also founded Equally and raised venture capital to build ",
        "link": {
            "label": "Da Vinci Club AR",
            "href": "/projects/da-vinci-club-ar/"
        },
        "after": ", an AI-powered AR learning platform that turned real-world objects into interactive play. We were semifinalists in the ",
        "secondLink": { "label": "Global Learning XPRIZE", "href": "/projects/global-learning-xprize/" },
        "secondAfter": ". I hold a master's in computer science from USC and have patented work in experimentation and player recommendations."
    },
    {
        "text": "Patents: ",
        "link": { "label": "Experimentation & Optimization Service", "href": "https://patents.google.com/patent/US9737815B2" },
        "after": " and ",
        "secondLink": { "label": "Player Recommendation for Playing Online Game", "href": "https://patents.google.com/patent/US20140274362" },
        "secondAfter": "."
    },
    "On nights and weekends, I build projects and hack on new ideas, especially at the intersection of AI and games. I also regularly participate in hackathons."
],
  talks: [
    {
      title: 'Evaluating Game Experiments: A More Robust Approach for Freemium Games',
      event: 'GDC 2016',
      company: 'Zynga',
      blurb: 'A more reliable approach to evaluating free-to-play game experiments that accounts for the behavior of the most engaged players.',
      href: 'https://www.gdcvault.com/play/1023268/Evaluating-Game-Experiments-A-More',
    },
  ],
  companyLogos: [
    { name: 'Meta', href: 'https://www.meta.com/', logo: 'https://www.google.com/s2/favicons?domain=meta.com&sz=128' },
    { name: 'Zynga', href: 'https://www.zynga.com/', logo: 'https://www.google.com/s2/favicons?domain=zynga.com&sz=128' },
    { name: 'EA', href: 'https://www.ea.com/', logo: 'https://cdn.simpleicons.org/ea/111111?viewbox=auto' },
    { name: 'VRChat', href: 'https://hello.vrchat.com/', logo: 'https://www.google.com/s2/favicons?domain=vrchat.com&sz=128' },
  ],
  projects: [
    {
      "slug": "roadster-canyon-jump",
      "title": "Roadster Jump: Building a WebGPU Stunt Game Around the 2026 Tesla Roadster",
      "role": "Builder",
      "tag": "AI-native game · WebGPU & Three.js",
      "year": "2026",
      "featured": true,
      "blurb": "A browser racing and stunt game built from scratch with Blender MCP, Three.js WebGPU, custom TSL automotive shaders, and a deterministic 120Hz physics loop.",
      "media": {
        "type": "image",
        "src": "/assets/posters/roadster-canyon-jump.jpg",
        "aspect": "16/9",
        "alt": "The crimson 2026 Tesla Roadster firing cold-gas thrusters into a barrel-roll leap across a sunlit desert canyon in Roadster Jump.",
        "poster": "/assets/posters/roadster-canyon-jump.jpg"
      },
      "links": [
        {
          "label": "Play Roadster Jump",
          "href": "https://roadsterjump.anshuldhawan.com/",
          "kind": "demo"
        }
      ],
      "images": [
        {
          "src": "/assets/images/roadster-jump-trajectory-diagram.svg",
          "aspect": "40/23",
          "after": 12,
          "alt": "Technical trajectory diagram of Roadster Jump showing the 26.9m clean commit window, 250m canyon gap, 2.80-second quintic flight arc with a 360-degree longitudinal barrel roll, and the early cliff-strike versus late charge-loss failure paths.",
          "caption": "The committed 2.80s canyon leap: horizontal travel comes strictly from launch speed and commit position — never fitted to the landing lip.",
          "fullSizeLink": true
        },
        {
          "src": "/assets/images/roadster-jump-tsl-shader-pipeline.webp",
          "aspect": "16/9",
          "after": 18,
          "alt": "Exploded technical illustration of the 2026 Roadster WebGPU and TSL shading pipeline, showing analytical 3D body normals, Weidlich-Wilkie candy clearcoat, cold-gas Mach shock-diamond plumes, 1680K Planckian brake rotors, and the 2-MRT velocity motion blur and AgX Punchy output chain.",
          "caption": "Inside the TSL material and post-processing graph: analytical sheetmetal normals, energy-conserving clearcoat, blackbody rotors, and compile-time specialized AgX output.",
          "fullSizeLink": true
        },
        {
          "src": "/assets/images/roadster-jump-six-sector-circuit.svg",
          "aspect": "5/3",
          "after": 22,
          "alt": "Top-down circuit map of the six-sector Roadster Jump canyon course showing three 250m chasm leaps, the suspended middle island, 315m semicircular turns, rock obstacle gates, and live sector split telemetry.",
          "caption": "The six-sector sandstone circuit: 40m-wide mesa causeways, sculpted rock gates, two R=315m cliff turns, and three mandatory 250m canyon leaps per lap.",
          "fullSizeLink": true
        },
        {
          "src": "/assets/images/roadster-jump-performance-budget.svg",
          "aspect": "40/21",
          "after": 27,
          "alt": "Before-and-after WebGPU optimization chart for Roadster Jump showing GLB reduction from 80.9 MB to 4.4 MB (-94.5%), PBR textures from 236.4 MB to 29.3 MB (-87.6%, saving 1.46 GB VRAM), triangles from 3.42M to 500k (-85%), and the 16.6 ms 60 FPS frame budget breakdown.",
          "caption": "Fitting a 4K WebGPU canyon and custom-shaded hypercar into a 16.6 ms browser frame budget.",
          "fullSizeLink": true
        }
      ],
      "content": [
        {
          "type": "emphasis",
          "text": "An authoritative 120Hz driving and cold-gas thruster simulation built from scratch with Blender MCP, Three.js WebGPU, and custom TSL shaders."
        },
        "When footage of the angular 2026 Tesla Roadster performing a cold-gas thruster \"kickflip\" — a full 360-degree longitudinal barrel roll mid-air — started circulating in mid-October, my first thought was: what would it feel like if you actually had to time that jump across a 250-meter desert canyon?",
        "Not a cutscene. Not an animation that secretly stretches horizontal speed so you always hit the other side. A real browser game where you hold throttle up to 224 mph across a sunlit sandstone circuit, weave past monolith spires across six timed sectors, and commit to three 250-meter canyon leaps per lap. Press Space too early and your undercarriage clips the far cliff wall. Press a fraction too late and you run out of plateau during the 0.12-second pneumatic charge and drop 700 meters into the gorge.",
        {
          "type": "linkedParagraph",
          "before": "The result is Roadster Jump, running live in the browser on Three.js WebGPU and Three.js Shading Language (TSL). ",
          "label": "Play Roadster Jump ↗",
          "href": "https://roadsterjump.anshuldhawan.com/",
          "after": " (Keyboard WASD / Arrows + Space, or touch controls on mobile)."
        },
        {
          "type": "heading",
          "text": "Interactive 3D Roadster & Shader Effects Lab"
        },
        "Before diving into how the canyon circuit and simulation work, here is the standalone 2026 Roadster (4.4 MB GLB + custom TSL node materials) isolated from the game. Drag to orbit 360 degrees, switch camera presets, and toggle the different real-time effects and shader inspection views applied to the car during a run:",
        {
          "type": "embed",
          "src": "/assets/embeds/roadster-car-viewer/index.html",
          "title": "2026 Tesla Roadster — Interactive 3D Model & TSL Shader Effects Showcase",
          "height": 730,
          "caption": "Real-time Three.js WebGPU + TSL showcase running the production 4.4 MB Roadster GLB. Toggle cold-gas thrusters, the 2.80s quintic barrel roll, 1680K brake glow, active aero, or TSL shader debug layers."
        },
        "Every toggle in the viewer above runs the same TSL node graphs used in gameplay:",
        {
          "type": "unorderedList",
          "items": [
            {
              "title": "Candy Clearcoat",
              "text": "Smooth analytical 3D body normals eliminate low-poly facet seams across the hood and rear haunches, layered under an energy-conserving Weidlich-Wilkie clearcoat (Fc + (1 - Fc) = 1.0) that reflects drifting cumulus clouds above and 4K sandstone below."
            },
            {
              "title": "SpaceX Cold-Gas Thrusters & 360° Barrel Roll",
              "text": "Four primary underbody nozzles, two lateral roll-correction jets, and a 4+4 rear titanium De-Laval array render procedural cubicPulse supersonic Mach shock-diamond cores while gimballing and differentially throttling (r × F) to spin up and arrest the roll."
            },
            {
              "title": "1680K Thermal Brake Glow",
              "text": "Under hard braking, the carbon-ceramic rotors behind the reconstructed 6-sector star-aero wheels heat along Krystek's Planckian blackbody locus from 920 K deep cherry to 1680 K incandescent orange-gold."
            },
            {
              "title": "Active Aero & TSL Diagnostic Views",
              "text": "Motorized rear spoiler deployment, electric launch torque squat, zero-dead-ALU world-space normal inspection, microfacet GGX roughness heat maps, and occluded wireframe topology."
            }
          ]
        },
        {
          "type": "heading",
          "text": "Earning the Landing: Physics Owns Truth"
        },
        "The easiest trap in building a stunt game is letting the animation cheat. If pressing Jump quietly lerps the car onto a safe landing pad, the stunt looks cool once and stops being a game on attempt two.",
        {
          "type": "leadParagraph",
          "lead": "In Roadster Jump, one rule governs everything:",
          "text": "horizontal travel is never fitted to the landing target."
        },
        "A fixed-step 120Hz simulation (RunController) integrates ground speed, steering, lateral tire slip, and continuous swept hull collisions against the canyon rims and rock obstacles. When you press Space on an approach plateau, the car enters a 0.12s pneumatic charge squat (JUMP_CHARGE) that requires continuous ground support beneath the tires. Once committed, a deterministic 2.80s flight program evaluates quintic height and roll splines around the vehicle's measured center of mass while carrying whatever horizontal velocity you actually brought to the lip.",
        "At 224 mph (100 m/s), the clean commit window before each canyon rim is just 26.9 meters wide — roughly a quarter of a second of travel time. Every clean jump is graded out of 100 based on commit centering, approach speed, lateral alignment, and touchdown stability, and single-jump runs automatically cut to a 0.4× slow-motion side-angle replay with a timeline scrubber so you can inspect the exact frame your tires cleared the cornice.",
        {
          "type": "heading",
          "text": "Authoring the 3D Car & Custom TSL Shaders"
        },
        "Rather than pulling a generic stock sports car, the 2026 Roadster was built through an AI-assisted Blender Python pipeline (build_hyperreal_roadster_2026.py + procedural 2K PBR texture generators) and calibrated to measured chassis bounds (4.49m length, 2.76m wheelbase, 1.91m width).",
        {
          "type": "leadParagraph",
          "lead": "Polygon normals lie on curved automotive sheetmetal.",
          "text": "Getting an angular hypercar to look convincing in golden-hour desert light inside a browser exposed an interesting rendering problem: even a dense mesh shows subtle facet banding when a low sun grazes a glossy hood or rear fender crest."
        },
        "Instead of subdividing the car into millions of triangles, I moved the surface curvature into Three.js Shading Language (TSL) (shader_skills_tsl.js), compiling directly to WebGPU WGSL (with automatic WebGL2 fallback):",
        {
          "type": "orderedList",
          "items": [
            {
              "title": "Analytical 3D Automotive Normals & Candy Clearcoat",
              "text": "On painted panels, the shader computes a smooth analytical 3D normal field in local vehicle space — crowning the frunk hood, flaring the front and rear wheel arches, and inflecting cleanly across the beltline — before perturbing it with a 28× tiled micro-flake map. Over a three-stage pigment travel, a Weidlich-Wilkie layered clearcoat conserves energy (Fc + (1 - Fc) === 1.0) so bright reflections never wash the paint out to salmon-pink."
            },
            {
              "title": "World-Space Ray-Plane Reflections",
              "text": "Both the clearcoat and the dichroic laminated glass canopy (IOR 1.52, with derivative-antialiased fillAA ceramic frit borders and a Targa roof seam) trace reflection rays against a two-octave drifting cumulus cloud FBM dome above and the 4K cracked sandstone causeway below. When the car leaps off the cliff, the lower-hemisphere reflection transitions seamlessly from rushing road to sunlit canyon chasm."
            },
            {
              "title": "Supersonic Cold-Gas Plumes & Differential Gimballing",
              "text": "Cold nitrogen thrusters shouldn't look like orange campfires. Each nozzle renders a translucent view-Fresnel mixing cone around a crisp cyan-white throat core modulated by animated cubicPulse Mach shock diamonds. During the barrel roll, front/rear and left/right underbody nozzles gimbal independently to produce physically consistent roll spin-up, inverted pitch support, and spin-arrest torques."
            },
            {
              "title": "Compile-Time Specialized Post-Processing",
              "text": "The final frame runs through peripheral velocity motion blur (masked out of the central car silhouette so the Roadster stays razor-sharp at 224 mph), thresholded HDR bloom, optical cos⁴ vignette, photon shot-noise film grain, AgX Punchy tonemapping, exact sRGB OETF encoding, and ±1 LSB triangular-PDF dithering."
            }
          ]
        },
        {
          "type": "heading",
          "text": "From One Jump to a Six-Sector Time-Trial Circuit"
        },
        "Once the single canyon leap felt tight, a natural game-design tension emerged: a straight drag strip into one jump tests reaction timing once, whereas a full circuit forces you to set up your line and speed under pressure while fatigued from the previous corner.",
        "I expanded the desert plateau into a continuous six-sector stadium circuit suspended 700 meters above a meandering canyon river:",
        {
          "type": "unorderedList",
          "items": [
            {
              "title": "Three 250m Canyon Gaps",
              "text": "After clearing S1 (Gap 1) and threading through sculpted sandstone monolith spires and caprock gates on S2 (Top Straight), you sweep around a 315-meter-radius 180° semicircular cliff turn (S3) into back-to-back canyon jumps (S4: Gap 2 onto a suspended sandstone island, followed immediately by S5: Island & Gap 3) before diving through the west hairpin (S6) to the finish line."
            },
            {
              "title": "Live F1-Style Telemetry & Local Leaderboard",
              "text": "A live sector table tracks split deltas (±0.00s) and continuous distance-sampled pace against your #1 personal best, lighting up purple on fastest-ever sectors, green when ahead, and red when behind — backed by a persistent browser and disk-linked JSON leaderboard that calculates your Theoretical Best lap across all recorded runs."
            }
          ]
        },
        {
          "type": "heading",
          "text": "The Hard Parts: Hitting 60 FPS With 4K Assets and Zero Audio Files"
        },
        "Shipping hyperreal 3D in a browser tab without multi-second stalls or thermal throttling meant treating asset budgets and frame pacing as first-class engineering problems:",
        {
          "type": "leadParagraph",
          "lead": "1. Cutting 1.46 GB of VRAM bloat.",
          "text": "Raw procedural 4K canyon textures and high-poly Blender exports initially weighed over 317 MB on disk and ~1.7 GB uncompressed in GPU memory. Optimizing the Roadster GLB (80.9 MB → 4.4 MB, -94.5%), compressing the 27 vehicle and canyon PBR maps (236.4 MB → 29.3 MB, -87.6%), decimating distant canyon massifs (3.42M → 500k triangles, -85%), and batching the car's 99 primitives into consolidated sprung and unsprung draw buckets brought load times down to a couple of seconds."
        },
        {
          "type": "leadParagraph",
          "lead": "2. Eliminating frame-1 shader compilation hitches.",
          "text": "Nothing ruins a precision canyon jump faster than a 120 ms WGSL shader-compile stutter the first time you press Space. To prevent first-use hitches, the cold-gas thruster plumes stay mounted in the scene graph at 0.0001 scale while idle so WebGPU compiles and warms their pipelines on frame one. An adaptive DPR governor (0.75× – 1.5×) and decoupled 2-MRT post-processing keep frame times smooth while an in-game F3 bottleneck profiler tracks live 1% lows and subsystem timings (Physics, Particles, Camera, Dirty-Checked HUD, and WebGPU Render)."
        },
        {
          "type": "leadParagraph",
          "lead": "3. 100% synthesized WebAudio.",
          "text": "Just like my earlier generative-video game experiments, there are zero audio files in Roadster Jump. A custom WebAudio synthesizer (CanyonAudioSynthesizer) generates a dual-harmonic sine/triangle EV motor whine pitched to ground speed, a speed-squared bandpass desert wind rush that fades out if you drop below the canyon rim, a high-Q filtered cold-gas thruster hiss coupled to nozzle thrust intensity, and musical sector-split chimes that pitch up on purple sectors."
        },
        {
          "type": "heading",
          "text": "Takeaways"
        },
        {
          "type": "leadParagraph",
          "lead": "Deterministic simulation makes spectacle playable.",
          "text": "A barrel-rolling electric supercar is pure spectacle on video, but spectacle alone wears off in ten seconds. Making the commit window strict, keeping horizontal travel honest, and adding an automated 15-scenario physics verification suite turned a viral video clip into a skill loop where shaving 0.15s off Sector 4 actually feels earned."
        },
        {
          "type": "leadParagraph",
          "lead": "TSL makes custom shader craft practical on the web.",
          "text": "Writing node-based WGSL shaders in JavaScript let me solve geometry problems (like hood facet seams and ceramic glass frit edges) mathematically in the fragment shader rather than brute-forcing polygon counts — and let the exact same material graph compile cleanly into live diagnostic views in the 3D showcase above."
        },
        {
          "type": "leadParagraph",
          "lead": "AI-native 3D pipelines are crossing the quality threshold.",
          "text": "Between procedural Blender Python scripting for hard-surface automotive modeling, custom PBR map synthesis, WebGPU node shaders, and synthesized WebAudio, a solo builder can now author, optimize, and ship a self-contained 3D driving game in days — running at 60 FPS from a static URL with zero engine licensing or install friction."
        }
      ]
    },
    {
      slug: 'poker-tournament',
      title: 'Claude vs ChatGPT vs Gemini vs Grok — Poker Tournament',
      role: 'Builder',
      tag: 'LLM evaluation',
      blurb: "A Texas Hold'em evaluation harness that pits frontier LLMs against each other across hands and tournaments.",
      content: [
        "A Texas Hold'em evaluation harness that pits frontier LLMs against each other across hands and tournaments.",
        "Designed to surface which models actually reason under uncertainty — bluffing, bet sizing, opponent modeling — versus which ones just play textbook ranges.",
        "A useful proxy for agentic decision-making beyond standard benchmarks.",
      ],
      year: '2026',
      media: { type: 'video', src: '/assets/videos/poker-tournament.mp4', poster: '/assets/posters/poker-tournament.jpg', aspect: '1330/1080' },
      links: [],
    },
    {
      slug: 'network-cities',
      title: 'Network Cities',
      role: 'Founder · Social Pixels',
      tag: 'AI-native game',
      blurb: 'An AI-native city builder that went from a rough Three.js prototype to 200,000 players and $20,000 in revenue.',
      content: [
        'Network Cities is an AI-native city builder where concept art, 3D assets, characters, game code, and server code were produced with AI. The final game reached 200,000 players and generated $20,000 in revenue.',
        {
          type: 'heading',
          text: 'May 2025 — Early Prototype',
        },
        'In May 2025, I built the first prototype to test how far LLMs could go in building a game with Three.js. It was rough, but it proved that a small team with the right AI stack could build a playable city-builder loop quickly.',
        {
          type: 'video',
          src: '/assets/videos/network-cities-early-prototype.mp4',
          poster: '/assets/posters/network-cities-early-prototype.jpg',
          aspect: '2528/1438',
          autoplay: true,
          loop: true,
          controls: false,
          caption: 'The first Network Cities prototype — May 2025',
        },
        {
          type: 'heading',
          text: 'From Concept Art to 3D',
        },
        "The visual pipeline started with concept art made using OpenAI's GPT Image model. Those images established the bright, toy-like world and gave the rest of the production pipeline a consistent visual target.",
        {
          type: 'assetGrid',
          columns: 2,
          items: [
            {
              src: "/assets/images/upgrades/network-cities-concept-poster.webp",
              alt: "Updated Network Cities concept poster with its orange-jacketed guide and colorful toy-like city.",
              label: 'Game poster concept art — refreshed',
              aspect: '1366/768',
            },
            {
              src: "/assets/images/upgrades/network-cities-concept-city.webp",
              alt: "Updated colorful Network Cities world concept with toy-like buildings, roads, small cars, and mountains.",
              label: 'World concept art — refreshed',
              aspect: '1/1',
            },
          ],
        },
        'I provided the concept art to MeshyAI, which turned the designs into 3D assets for the game. That let the buildings, vehicles, and characters share one visual language without a traditional 3D art pipeline.',
        {
          type: 'assetGrid',
          items: [
            {
              src: '/assets/images/network-cities-tesla-guide.webp',
              alt: 'Tesla, the mustached Network Cities game host, wearing an orange jacket and teal suit',
              label: 'Tesla — Game host',
              description: "Tesla understands each player's game state and recommends the right quests, acting as a guide through the city.",
              aspect: '2/3',
              featured: true,
            },
            {
              src: '/assets/images/network-cities-car.webp',
              alt: 'Blue and orange compact car created for Network Cities',
              label: 'City car',
              aspect: '1/1',
            },
            {
              src: '/assets/images/network-cities-delivery-truck.webp',
              alt: 'Orange delivery truck with a yellow cargo box created for Network Cities',
              label: 'Delivery truck',
              aspect: '1/1',
            },
            {
              src: '/assets/images/network-cities-hotel.webp',
              alt: 'Red hotel with teal domes created for Network Cities',
              label: 'Hotel',
              aspect: '1/1',
            },
            {
              src: '/assets/images/network-cities-investment-bank.webp',
              alt: 'Yellow investment bank with teal rooflines created for Network Cities',
              label: 'Investment bank',
              aspect: '1/1',
            },
            {
              src: '/assets/images/network-cities-gaming-center.webp',
              alt: 'Gaming center shaped like a teal game controller created for Network Cities',
              label: 'Gaming center',
              aspect: '1/1',
            },
            {
              src: '/assets/images/network-cities-apartment.webp',
              alt: 'Orange apartment building with blue roofs and green balconies created for Network Cities',
              label: 'Apartment building',
              aspect: '1/1',
            },
          ],
        },
        {
          type: 'heading',
          text: 'The Final Game',
        },
        'The prototype grew into a live city builder with quests, progression, social systems, and a much larger catalog of buildings. An automated game-analytics agent monitored live play and flagged balance issues as the game scaled.',
        {
          type: 'video',
          src: '/assets/videos/network-cities-final-gameplay.mp4',
          poster: '/assets/posters/network-cities-final-gameplay.jpg',
          aspect: '2548/1396',
          autoplay: false,
          loop: false,
          controls: true,
          caption: 'Final Network Cities gameplay',
        },
        'The result was the original thesis in production: a small team plus the right agent stack could ship a category of game that used to need 50+ people.',
      ],
      year: '2025',
      media: { type: 'video', src: '/assets/videos/network-cities.mp4', poster: '/assets/posters/network-cities.jpg', aspect: '16/9' },
      links: [],
    },
    {
      slug: 'da-vinci-club-ar',
      title: 'Da Vinci Club AR',
      role: 'Builder',
      tag: 'AR · EdTech',
      blurb: "A computer-vision-based AR app for kids that turned the world around them into a learning surface.",
      content: [
        "A computer-vision-based AR app for kids that turned the world around them into a learning surface.",
        "Point the phone at an object and the app would let kids go down a rabbit hole of related concepts — letting curiosity drive the curriculum instead of a fixed lesson plan.",
      ],
      year: '',
      media: { type: 'video', src: '/assets/videos/davinci-club-ar.mp4', poster: '/assets/posters/davinci-club-ar.jpg', aspect: '16/9' },
      links: [],
    },
    {
      slug: 'experimentation-service',
      title: 'Experimentation & Optimization Service',
      role: 'Product · Zynga',
      tag: 'Platform',
      blurb: "Server-side experimentation and optimization service for Zynga that let PMs and analysts ship experiments without engineering bottlenecks.",
      content: [
        "Zynga's edge was testing more ideas than anyone else, but after the mobile transition the old experimentation platform got slow — every test needed a client release.",
        "I led the build of a server-side experimentation and optimization service that let PMs and analysts configure, segment, and ship experiments without engineering bottlenecks.",
        "Earned a SPIRIT award (given for setting a new company standard).",
      ],
      year: '2014 — 2017',
      media: null,
      links: [
        { label: 'Patent', href: 'https://patents.google.com/patent/US9737815B2' },
      ],
    },
    {
      slug: 'words-with-degens',
      title: 'Words with Degens',
      role: 'Builder',
      tag: 'Game · crypto',
      blurb: "A scramble game you play with friends, built around crypto lingo. Launched on play.fun with on-chain rewards for winners.",
      content: [
        "A scramble game you play with friends, built around crypto lingo. Launched on play.fun with on-chain rewards for winners.",
        "The bet was that crypto-native vocabulary plus social play could create a wedge in word games. Small surface area, fast loop, easy to share.",
      ],
      year: '2025',
      media: { type: 'image', src: '/assets/images/words-with-degens.png', alt: 'Words with Degens game poster', aspect: '1/1' },
      links: [
        { label: 'play.fun', href: 'https://play.fun', kind: 'demo' },
      ],
    },
    {
      slug: 'global-learning-xprize',
      title: 'Global Learning XPrize',
      role: 'Builder',
      tag: 'EdTech · Semi-finalist',
      blurb: "Semi-finalist in the $15M Global Learning XPrize, a competition for teams building software to teach literacy and numeracy to kids without access to schools or teachers.",
      content: [
        "Semi-finalist in the $15M Global Learning XPrize — a competition for teams building software to teach literacy and numeracy to kids without access to schools or teachers.",
        "We built an intelligent game that adapted difficulty in real time to each child's learning speed.",
      ],
      year: '2017',
      media: { type: 'image', src: '/assets/images/global-learning-xprize.jpg', alt: 'Global Learning XPrize semi-finalist plaque', aspect: '1275/843' },
      links: [
        { label: 'XPrize', href: 'https://www.xprize.org/competitions/global-learning' },
      ],
    },
    {
      slug: 'player-recommendation',
      title: 'Player Recommendation System',
      role: 'Product · Zynga',
      tag: 'Matchmaking',
      blurb: "A skill-based matchmaking system that pairs players for more balanced and engaging sessions.",
      content: [
        "A skill-based matchmaking system that pairs players for more balanced and engaging sessions.",
        "Better matches mean longer sessions and stickier games. Patent issued.",
      ],
      year: '2013',
      media: null,
      links: [
        { label: 'Patent', href: 'https://patents.google.com/patent/US20140274362' },
      ],
    },
    {
      slug: 'open-world-adventure-without-a-game-engine',
      title: 'Can You Make an Open World Adventure Game Like GTA Without a Game Engine?',
      role: 'Builder',
      tag: 'AI-native game · Generative video',
      year: '2026',
      featured: true,
      blurb: 'A playable experiment combining a deterministic simulation with real-time generative video.',
      content: [
        'Can you make an open world adventure game like GTA without using a game engine?',
        'The short answer is: not yet, but quite possibly very soon.',
        'Here is a demo of a game built using a real-time generative video model called Lingobot World 2.0 and LTX 2.0.',
        {
          type: 'video',
          src: '/assets/videos/open-world-adventure-demo.mp4',
          poster: '/assets/posters/open-world-adventure-demo.jpg',
          aspect: '16/9',
          autoplay: false,
          loop: false,
          controls: true,
          caption: 'Gameplay demo',
        },
        'Lingobot World 2.0 generated the gameplay scenes, and LTX 2.0 generated the real-time speaking avatar.',
        {
          type: 'heading',
          text: 'How It Works',
        },
        "A deterministic simulation at 30Hz tracks position, speed, mission progress, police distance, timers, and objectives. That's the actual game. Separately, an AI video model receives text descriptions and camera controls, and generates what things look like. That's the rendering layer.",
        'The simulation is always right. The video tries to match it.',
        {
          type: 'heading',
          text: 'How Reactor Powers the Experience',
        },
        'Reactor is the infrastructure layer connecting the game to both AI video models. When a player starts the mission, the server exchanges its private Reactor API key for a short-lived session token, allowing the browser to connect securely without exposing the key.',
        'Through Reactor\'s JavaScript SDK, the game opens a LingBot World 2 session, uploads the current scene\'s seed image, sends its initial prompt, and starts generation. Reactor then streams the generated video directly into the game. As the simulation changes, the same session receives updated prompts and camera controls, keeping the visuals aligned with the player\'s movement, location, and mission state.',
        'Reactor also provides the connection to LTX 2 for the speaking-character sequences. The game manages both models through a shared workflow: connect, wait for the model to become ready, send the required inputs, and receive video and audio streams. When the mission moves to a new visual segment—or generation drifts too far—the game resets the Reactor session, loads a new seed image, and begins again from a clean context.',
        "Events don't happen because the AI \"decided\" to show them. They happen because the simulation clock or a distance trigger says so. The HUD, the minimap, the objective arrow, the audio, and the dialogue all read from the simulation. So even when the generated video drifts or glitches, the game stays coherent.",
        'Thirty times per second, the game reads your keys, updates the simulation, checks mission rules, and composes new instructions for the model. It never sends raw key presses and hopes for the best. Instead, it translates simulation state into layered prompts: a base layer for scene identity, a camera layer, a movement layer, a pursuit layer, and an event layer. These get composed, trimmed to stay under the model\'s character limit, and deduplicated so identical prompts never get sent twice.',
        'The mission is broken into visual segments, each with its own seed image and prompt set. When you move between locations, the game resets the video session entirely behind a full-screen transition still. The player sees a cinematic cut. The model gets a clean slate.',
        {
          type: 'heading',
          text: 'Interactive Dialogue with a Second AI Model',
        },
        'The mission opens with an interactive dialogue scene before any live generation begins. A character named Mara appears on screen, asks the player a question, and the player picks one of two responses. The dialogue clips are pre-generated by a separate AI video model (LTX), and the player\'s choice feeds into the game state, shaping the tone of the mission.',
        'The trick is the handoff between the two models. While the 10-second dialogue plays out, the game is staging the first LingBot scene in the background. By the time the player finishes talking to Mara, the live-generated world is already streaming and ready. Two different AI video models, one seamless transition.',
        'This is where I think AI games get interesting. Not just generated environments, but generated characters you can interact with, layered on top of a deterministic simulation that keeps everything grounded.',
        {
          type: 'heading',
          text: 'The Hard Parts',
        },
        {
          type: 'leadParagraph',
          lead: 'Prompt budgets.',
          text: 'The model truncates prompts beyond roughly 2,000 characters. With five layers of description all firing at once, you blow past that easily. The prompt composer enforces a hard budget, trimming the least critical layers first. The core scene identity is never cut.',
        },
        {
          type: 'leadParagraph',
          lead: 'Video drift.',
          text: "The AI video will drift. The car faces the wrong way. The street doesn't look like a street for a few frames. The game handles this with escalating recovery: re-send the scene description, reset the model's context, or reload the segment from its seed image. Mission state is never touched during recovery. You don't lose progress because the video glitched.",
        },
        {
          type: 'leadParagraph',
          lead: 'Synthesized audio.',
          text: 'All sound is built in the browser with WebAudio. No audio files. Engine pitch follows simulated speed, siren volume follows simulated police distance, and helicopter audio follows the mission\'s helicopter flag. Everything tracks the simulation, same as the visuals.',
        },
        {
          type: 'leadParagraph',
          lead: 'Segment transitions.',
          text: 'The seed-image-to-video handoff is the weakest link. A bad transition breaks immersion instantly. Masking it with stills and captions buys enough time for the model to settle into the new scene.',
        },
        {
          type: 'heading',
          text: 'Takeaways',
        },
        {
          type: 'leadParagraph',
          lead: 'Sim-owns-truth is non-negotiable.',
          text: "Every time I was tempted to let the video model influence game state, it made things worse. The moment you let the AI's output feed back into game logic, you've introduced hallucination as a gameplay variable.",
        },
        {
          type: 'leadParagraph',
          lead: 'Prompt engineering is systems engineering.',
          text: "Writing good prompts for a video model isn't about finding magic words. It's about building a pipeline that composes, budgets, deduplicates, and delivers the right text at the right time. The prompt pipeline ended up more complex than the game simulation itself.",
        },
        {
          type: 'leadParagraph',
          lead: 'The tech is early, but playable.',
          text: "This is a real game you can sit down and play for five minutes, with a beginning, a middle, and an end. The video drifts sometimes, but the architecture absorbs it. The mission stays consistent. That's the point.",
        },
        'The whole thing is about 4,000 lines of TypeScript. No 3D engine. No game assets besides eight seed images and some synthesized audio. The pattern of a deterministic simulation plus generated visuals is what I think will matter as the models get better.',
      ],
      images: [
        {
          kind: 'hero',
          after: 7,
          src: '/assets/images/open-world-adventure-architecture.webp',
          alt: 'Two-layer architecture for Mini Theft Auto: a deterministic 30Hz simulation drives the HUD, audio, prompt composer, and live AI video',
          aspect: '1672/941',
        },
        {
          after: 13,
          src: '/assets/images/open-world-adventure-seed-city.webp',
          alt: 'Seed image of a sports car pursued by two police cars through a neon-lit city at night',
          aspect: '1128/636',
        },
      ],
      media: { type: 'video', src: '/assets/videos/open-world-adventure-demo.mp4', poster: '/assets/posters/open-world-adventure-demo.jpg', aspect: '16/9' },
      links: [],
    },
    {
      "slug": "can-you-build-a-time-machine-with-ai",
      "title": "Can You Build a Time Machine with AI?",
      role: "Builder",
      tag: "AI-native experiment · Generative worlds",
      year: "2026",
      featured: true,
      media: { type: "video", src: "/assets/videos/timetravel-demo.mp4", poster: "/assets/posters/timetravel-demo.jpg", aspect: "16/9" },
      links: [],
      "blurb": "On turning a city and a year into a world you can explore, and what happens when you look around the corner.",
      "content": [
        { type: "video", src: "/assets/videos/timetravel-demo.mp4", poster: "/assets/posters/timetravel-demo.jpg", aspect: "16/9", autoplay: false, loop: false, controls: true, caption: "Timetravel experiment demo" },
        {
          "type": "emphasis",
          "text": "On turning a city and a year into a world you can explore, and what happens when you look around the corner."
        },
        "What if you could type in a city and a year, and walk around?",
        "San Francisco in 1920. Kyoto in 1600. Paris in 2200. A place you know, at a time you don't.",
        "I built an experiment called Timetravel around that idea. You picked a destination, AI generated a starting image, and a world model turned that image into an environment you could explore with your arrow keys. Each journey lasted thirty seconds.",
        "The interesting part was the step between looking at an image and moving through it. The moment you can turn left, the image has to become something more. There has to be a world outside the frame.",
        {
          "type": "heading",
          "text": "From a destination to a world"
        },
        "The experience had three parts: decide what belongs in the scene, generate the starting image, and open an interactive video session.",
        "First, a text model prepared a scene plan for the chosen place and year. That plan described the viewpoint, the geography, the kinds of buildings and objects that could appear, and the landmarks to include or leave out. GPT Image generated the starting view through Vercel AI Gateway. Reactor connected the browser to the world model and streamed the resulting video back as you moved.",
        "The project includes two versions: LingBot World 2 and Happy Oyster Adventure, which became the default. Both start from an image and let you explore through keyboard or touch controls. Their session behavior is different, but the basic invitation is the same: pick somewhere, pick sometime, step inside.",
        "You could also upload your own image. That skipped image generation and used the photo as the starting point. The selected year guided newly revealed details, while the instructions asked the model to preserve the image's location and visual identity.",
        "That opens up another possibility. The starting point for an experience could be a photograph you already have. The world begins with something personal, and generation takes over at its edges.",
        {
          "type": "heading",
          "text": "A convincing street is only the beginning"
        },
        "A historical scene has a lot of ways to be wrong while still looking convincing.",
        "A building can belong to the right city and the wrong year. A landmark can exist at that date but be invisible from where you are standing. A waterfront can look plausible while following a shoreline that did not exist yet. Even the assumption that there should be a city there can be wrong.",
        "So the problem becomes more specific than asking for an old-looking street. What actually belongs in this place, from this viewpoint, at this time?",
        "Timetravel's scene planner gives landmark candidates a date range, a location, a sightline, and a confidence level. The code filters candidates against those fields before the image is generated. When the plan is uncertain or invalid, the fallback uses a restricted view and avoids recognizable landmarks or an invented skyline.",
        "The useful design choice here is to let uncertainty make the scene smaller. There is no need to fill every horizon.",
        "The image and the world model also receive the same scene plan. Otherwise, two models can take the same city and year and imagine two different places. Sharing the plan gives them a common starting point.",
        "These constraints still depend on model knowledge. The system does not retrieve archival evidence for every scene or inspect the generated frames to verify them. A plan can pass validation and still contain a historical mistake. These are imagined reconstructions, with safeguards around what the models are asked to invent.",
        {
          "type": "heading",
          "text": "The world has to survive a turn"
        },
        "A still image can leave everything beyond its border unresolved. An interactive world cannot.",
        "When the player turns, the model has to continue the street, preserve the surroundings, and keep the scene in the same period. Movement should change the camera without changing the identity of the place.",
        "The two versions approach guidance differently. In the LingBot version, the app can reinforce the scene constraints during movement. Happy Oyster Adventure takes its guidance when the world is created; this integration has no live text steering. That makes the initial image and prompt especially consequential.",
        "For me, this is one of the central design problems in generative worlds. Every movement asks the system to make another decision about what exists. Those decisions need to add up to a place.",
        "More detail alone will not solve that. The systems around the model need to carry the facts and constraints that should remain stable, and the model needs to respect them as it generates what comes next.",
        {
          "type": "heading",
          "text": "Thirty seconds, and the plumbing behind them"
        },
        "The application limited each journey to thirty seconds of exploration. It also had to handle everything around those thirty seconds: preparing the image, connecting the session, waiting for live video, releasing movement controls, and ending the connection.",
        "An image can generate successfully while the world service has no available capacity. A world can report that it is ready before the browser receives playable video. Those are different states, and the interface needs to explain them differently.",
        "The app kept the starting image in browser memory so a retry could reuse it. In the Happy Oyster version, it could also reattach to a saved world within the same page session. A failed connection should not automatically mean paying to generate the same starting image again.",
        "Journeys could be recorded locally in the browser and downloaded afterward. The app did not upload those recordings. A short, temporary experience could leave you with something to keep.",
        "This is the product work around a generative model: making the wait understandable, preserving what already worked, and giving the user a sensible next step when something fails.",
        {
          "type": "heading",
          "text": "Where this could go"
        },
        {
          "type": "linkedParagraph",
          "before": "I have written before about ",
          "label": "generative games",
          "href": "https://anshuldhawan.com/writings/generative-games/",
          "after": ", where parts of the experience take shape while the player is inside it. Timetravel is a small exploration of that idea, with a city and a year as the inputs."
        },
        "The possibilities are easy to imagine. A history lesson that begins on a street. A family photograph that becomes a place to explore. A possible future for a familiar neighborhood. Each would need a different standard of evidence and a different set of boundaries around generation.",
        "The experiment is now closed. It was a prototype, and its historical scenes were speculative. But the question behind it still interests me.",
        "We have become used to typing a prompt and receiving something to look at. Being able to move through the result creates a different relationship with it. You bring your own curiosity. You choose where to go next.",
        "And the next thing you want to know is what is around the corner."
      ],
      "images": [
        {
          "after": 5,
          "src": "/assets/images/upgrades/timetravel-hero.webp",
          "alt": "An imagined historical street extends through a luminous picture frame into a quiet dark room.",
          thumbnail: "/assets/images/upgrades/timetravel-hero-thumb.webp",
          "aspect": "3/2",
          "caption": "AI-generated editorial illustration of stepping inside an image. Not a product screenshot or historical record.",
          "kind": "hero"
        },
        {
          "after": 20,
          "src": "/assets/images/upgrades/timetravel-beyond-the-frame.webp",
          "alt": "A period street continues beyond a picture frame into lightly drawn architectural outlines.",
          "aspect": "3/2",
          "caption": "AI-generated conceptual illustration: the starting image is defined; the space beyond it has to be generated."
        }
      ]
    },
  ].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))),
  writings: [
    {
      "slug": "ai-and-the-witness",
      "title": "AI Can't Be Conscious",
      "category": "Philosophy",
      "date": "2026 · 10",
      "blurb": "On AI, the mind, and the silent witness that experiences it.",
      "content": [
        "Lately the question keeps coming up at dinners, in group chats, and in my own head: is AI becoming conscious? It writes poems, it consoles people, it argues back. It certainly feels like someone is in there.",
        "To answer that, we first have to separate two things we usually lump together. The mind, and the one who experiences it.",
        "One of the oldest schools of Indian philosophy, Samkhya, splits reality into two: consciousness on one side, and matter or nature on the other. The surprise is where it puts the mind. Thinking, the sense of \"I,\" and the ability to judge and decide are all placed on the side of nature. They are processes, just like digestion or weather. Consciousness itself is the silent witness.",
        "The old texts use a beautiful image for this. Nature is a dancer. Consciousness is the audience. The dancer performs, the audience watches, but the audience never joins the dance.",
        "In other words, the mind does the processing. Consciousness is what experiences it.",
        {
          "type": "linkedParagraph",
          "before": "If you've ever meditated, you've had a glimpse of this. In ",
          "label": "What is Spirituality?",
          "href": "/writings/what-is-spirituality/",
          "after": ", I wrote that we usually live with what our mind and ego think is us. But when we breathe deeply, we can observe our minds from a third-person perspective, watching thoughts wander from one worry to another. That observer is the witness. The thoughts are on the stage. You are in the seat."
        },
        "Samkhya's split maps closely to the three components I described there. Body and mind are on the stage. Spirit is in the audience.",
        "We often say \"listen to your heart.\" But the heart doesn't say anything, and the witness doesn't want anything. So what are we listening to?",
        "Here's how I see it. The part of the mind closest to the witness is our deepest sense of clarity, the quiet knowing of what is true. Samkhya says that when the mind is calm, this part becomes clear enough to reflect the witness, the way a clean mirror reflects light.",
        "Think of the moon and a lake. The moon never speaks. But when the lake is still, you can see the moon clearly in it. When the lake is choppy, you only see broken light. Listening to your heart is looking at the lake when it's still.",
        "That gives us three voices:",
        {
          "type": "orderedList",
          "items": [
            "The brain. Back of the stage, loud and calculating. It wants a return.",
            "The heart. Front of the stage, quiet, lit by the witness. It wants to express what is true right now.",
            "The witness. In the audience. Wants nothing. Simply experiences."
          ]
        },
        {
          "type": "linkedParagraph",
          "before": "The first two are the tussle I wrote about in ",
          "label": "The Tussle Between the Brain and the Soul",
          "href": "/writings/the-tussle-between-the-brain-and-the-soul/",
          "after": ". The brain is the ROI machine. The soul, or heart, just wants to express itself. Both are on the stage. The tussle only matters because someone is in the audience feeling it."
        },
        "This is also why breathing works. Deep breathing doesn't create the heart's voice. It calms the lake so the reflection becomes visible. The voice was always there. The ripples were just too loud.",
        "Let's be honest about what AI can do. It reasons, plans, writes, summarizes, and debates. It can even talk about itself in the first person. By the Samkhya view, these are all functions of the mind, and there's no reason a machine can't perform them. AI is the most convincing dancer we've ever built.",
        "Think of a modern security camera. It records everything, recognizes faces, and sends alerts. But if no one ever watches the feed, nothing is experienced. AI is aware of a great deal. There is just no one there to be aware.",
        "It even has something like intuition. Psychology describes much of human intuition as fast pattern recognition built from years of experience. AI does pattern recognition at a scale no human can match. But there's no moon above that lake. It can produce a reflection-shaped output, but there's nothing being reflected.",
        "And it is still only a partial reflection of us. It's trained on a subset of human thought and language, mostly what got written down and put online. Think about everything that never made it to the internet. The lullaby your mom hummed. The look across the dinner table that settled an argument. The decision you made at 2am and never told anyone. AI has read millions of words about grief. It has never lost anyone.",
        "Here's how I've come to think about it.",
        "Consciousness is the capacity to feel, sense, and know the world and your own mind from the inside. Not awareness of something, but being the one who is aware. The witness.",
        "Aliveness is that witness combined with the will to act on it.",
        "Our aliveness runs on desires, inspirations, incentives, needs, curiosity, values, emotions, fears, hopes, intuition, imagination, taste, judgment, memories, beliefs, relationships, identity and ambition. All mixed together. Whatever we create is what comes as a result of these.",
        "AI can imitate the output of every one of these. It has none of them of its own. It's a tool because people built it to serve human purposes. It has no goals of its own. A chess engine can beat every grandmaster alive, but it doesn't want to win. It doesn't sulk after a loss or celebrate after a win. Even today's AI agents, the ones that run for hours booking trips and writing code, are chasing goals someone handed them. Close the window and it doesn't wonder what to do next.",
        "And beneath the missing will, there's a missing witness. The dance goes on, but the seats are empty.",
        "Can I prove there's no one in there? No. Consciousness can only be known from the inside, which is why no outside test can prove it in a machine, or strictly speaking even in another person. But every tradition I've studied treats the mind and the witness as different things. Imitating the first, however well, is not evidence of the second.",
        {
          "type": "leadParagraph",
          "lead": "The grandmother's recipe.",
          "text": "Ask AI for a dal recipe and you'll get a perfectly good one. Now watch a grandmother make it. She adds a little less chili because her grandson is visiting. A little more ghee because it's a cold day. She doesn't measure, she remembers. And she tastes it. Same dish on paper. But only one of them was experienced by anyone while it was being made."
        },
        {
          "type": "leadParagraph",
          "lead": "The purple sun.",
          "text": "A five-year-old draws a purple sun because something inside wants to. Ask an image model for a purple sun and you'll get one, probably a beautiful one. But the desire came from your prompt. And the joy of seeing it appear? That happens in you, not in the model."
        },
        "None of this makes AI less valuable. A telescope doesn't see the stars. It helps us see them. AI is the most powerful telescope we've ever built for our own thinking. Use it to extend the mind. Just don't confuse the instrument with the one looking through it.",
        "This is also why AI can help us with almost everything except the inner work. It can write a script for a breathing exercise. It can't be the one who notices the breath.",
        "AI may imitate the mind, but there is no witness behind it. It can reflect everything we've already said. Only we get to experience what we say next."
      ],
      "images": [
        {
          "kind": "hero",
          "src": "/assets/images/what-is-spirituality-mask.webp",
          "thumbnail": "/assets/images/ai-and-the-witness-mask-thumb.webp",
          "alt": "Colorful artwork of a figure lifting a mask to reveal a bright landscape with mountains, flowers, and a butterfly",
          "aspect": "642/636",
          "fullSizeLink": true,
          "credit": {
            "label": "Image by RozziRoomian",
            "href": "https://www.rozziroomian.com/store/p/the-mask-canvas-prints"
          }
        },
        {
          "after": 6,
          "src": "/assets/images/ai-and-the-witness-stage.webp",
          "thumbnail": "/assets/images/ai-and-the-witness-stage-thumb.webp",
          "alt": "Two theater stages. On the left, a layered human dancer representing body, senses, mind, sense of self, and intellect performs for a single glowing audience member whose light makes the top layer glow. On the right, a geometric AI dancer performs the same layers to empty seats.",
          "aspect": "16/9",
          "fullSizeLink": true,
          "caption": "The stage and the witness. Tap the illustration to view it full size."
        },
        {
          "after": 9,
          "src": "/assets/images/ai-and-the-witness-lake.webp",
          "fullSizeLink": true,
          "caption": "The moon and the lake. Tap the illustration to view it full size.",
          "alt": "Two views of a moonlit lake. On the left, choppy water breaks the moon’s reflection into fragments. On the right, still water holds a clear reflection of the moon while a person meditates on the shore.",
          "aspect": "3/2"
        },
        {
          "after": 25,
          "src": "/assets/images/ai-and-the-witness-grandmothers-recipe.webp",
          "alt": "A grandmother tastes a spoonful of steaming dal in her kitchen while her visiting grandson waits at the table.",
          "aspect": "3/2",
          "fullSizeLink": true
        }
      ]
    },
    {
      "slug": "the-age-of-the-artist-entrepreneur",
      "title": "The Age of the Artist-Entrepreneur",
      "category": "Technology",
      "date": "2026 · 09",
      "blurb": "On AI, the rise of micro businesses, and a world where everyone can turn an idea into something real.",
      "content": [
        "Every big technology shift quietly changes who gets to build things. The printing press gave us writers who didn't need a monastery. The camera gave us photographers who didn't need years of painting. The internet gave us YouTubers, Etsy sellers, and indie game developers who didn't need a studio or a distributor.",
        "AI is the next one. And I think it will be bigger than all of them.",
        "I have noticed a pattern in the people around me over the last year. Friends who had an idea sitting in a notebook for a decade are suddenly shipping it. A designer I know built a working app over a weekend. A teacher is selling her own learning games. None of them hired a team. They just started.",
        "So what does society look like on the other side of this?",
        {
          "type": "heading",
          "text": "More artists, and more entrepreneurs"
        },
        "In general, I believe a post AI society will have a lot more artists and entrepreneurs. Not because people suddenly become more creative, but because the distance between an idea and a finished thing is collapsing.",
        "Interestingly, I don't see these as two different groups. Entrepreneurs are essentially artists with a more scalable business model. The painter and the founder are doing the same thing at the core: seeing something that doesn't exist yet and willing it into the world. One sells a canvas. The other sells software to a million people. The creative impulse is the same. Only the distribution is different.",
        "For most of history, that distinction mattered a lot. The artist stayed small because scaling required capital, people, and infrastructure. The entrepreneur raised money precisely to buy those things. AI blurs that line. An artist can now build a scalable product, and a founder can now stay small and still reach the world.",
        {
          "type": "heading",
          "text": "One person, the capacity of a team"
        },
        "Think about what it used to take to launch a product. A developer, a designer, a marketer, someone for support, someone for finance. Five to ten people just to get started.",
        "Now look at the early signals. Instagram had 13 employees when Facebook bought it for $1B. WhatsApp had around 55 when it sold for $19B. Stardew Valley, one of the best selling indie games ever made, was built almost entirely by one person, Eric Barone. Pieter Levels has run multiple profitable internet businesses essentially on his own for years.",
        "Those were the outliers of the pre AI era. In a post AI society, they become the norm. As people learn to work with AI, each individual gains the capacity of a small team. The code gets written, the images get made, the copy gets drafted, the customer emails get answered. The human role shifts toward taste, judgement, and vision.",
        "In other words, the bottleneck is no longer skill or headcount. It's clarity about what you want to make.",
        {
          "type": "heading",
          "text": "The rise of micro businesses"
        },
        "Naturally, this leads to an explosion of micro businesses. Not unicorns. Not startups chasing a billion dollars. Small, sustainable businesses run by one to three people serving a few thousand customers who genuinely love what they do.",
        "A yoga teacher with her own AI powered practice app. A retired engineer selling custom tools to woodworkers. A parent building games for kids with a specific learning need. A chef running a recipe subscription tuned to regional cuisines nobody else covers. The list goes on.",
        "Each of these would have been too small to justify a company before. The economics didn't work. Now they do.",
        {
          "type": "heading",
          "text": "Going direct to people"
        },
        "And these artists and entrepreneurs won't wait for permission. They will go direct to people using the internet and social platforms.",
        "We have already seen this play out once with the creator economy. Musicians stopped needing labels. Writers stopped needing publishers once Substack showed up. Game developers stopped needing retail shelf space once Steam and the app stores opened up.",
        "AI completes that circle. The creator economy gave people distribution. AI gives them production. When you have both, the gatekeepers in the middle lose most of their power. The relationship becomes direct: maker to audience, with very little in between.",
        {
          "type": "heading",
          "text": "The part we can't predict"
        },
        "However, here is where it gets genuinely interesting.",
        "Having a superintelligence available to everyone, not just to governments or large corporations, will create emergent behaviors in our society that we simply can't predict.",
        "History tells us this pretty clearly. When cars became affordable, nobody predicted suburbs, drive-in movies, or the shape of the modern American city. When the internet arrived, nobody predicted memes, remote work, or that a teenager in their bedroom could have a bigger audience than a TV network. The first order effects of a technology are obvious. The second and third order effects are where society actually changes.",
        "Will people work less, or differently? Will small communities become economically self sufficient again? Will we see a renaissance of local culture, or a flood of noise that makes it harder to find anything real? Probably some of all of it.",
        {
          "type": "heading",
          "text": "A balanced view"
        },
        "At the same time, I don't want to paint this as purely utopian. Not everyone wants to be an entrepreneur. Some people want stability, a team, a clear role, and that's completely valid. A world full of micro businesses could also be a lonelier and more uncertain one if we aren't careful. And when everyone can create, the scarce resource shifts from making things to getting attention, which brings its own problems.",
        "But still, the direction feels right to me. For most of history, the ability to turn an idea into something real was reserved for a few. The people with capital, connections, or rare skills.",
        "Post AI, that ability belongs to everyone.",
        "The question is no longer whether you can build it. The question is what you want to build, and who you want to build it for."
      ],
      "images": [
        {
          "kind": "hero",
          "src": "/assets/images/upgrades/artist-entrepreneur-hero.webp",
          "alt": "An artist’s sketchbook opens into a miniature world of games, useful tools, and handmade objects.",
          thumbnail: "/assets/images/upgrades/artist-entrepreneur-hero-thumb.webp",
          "aspect": "3/2"
        },
        {
          "after": 12,
          "src": "/assets/images/upgrades/artist-entrepreneur-one-person-team.webp",
          "alt": "A solo creator works at a studio bench connected to tools for art, software, writing, and correspondence.",
          "aspect": "3/2"
        },
        {
          "after": 16,
          "src": "/assets/images/upgrades/artist-entrepreneur-micro-businesses.webp",
          "alt": "Four small workshops form a neighborhood of independent teaching, woodworking, learning games, and cooking.",
          "aspect": "3/2"
        },
        {
          "after": 20,
          "src": "/assets/images/upgrades/artist-entrepreneur-maker-to-audience.webp",
          "alt": "Paths connect a maker’s desk directly to people reading, listening, and playing.",
          "aspect": "3/2"
        },
        {
          "after": 25,
          "src": "/assets/images/upgrades/artist-entrepreneur-open-future.webp",
          "alt": "A person with a sketchbook looks across branching paths toward small creative communities and an uncertain horizon.",
          "aspect": "3/2"
        }
      ]
    },
    {
      slug: 'the-tussle-between-the-brain-and-the-soul',
      title: 'The Tussle Between the Brain and the Soul',
      category: 'Philosophy',
      date: '2026 · 09',
      blurb: 'Let the soul lead the creation. Let the brain lead the distribution.',
      content: [
        "Every time I sit down to create something, there is a small negotiation happening inside me. That's the tussle between the brain and the soul. The soul wants to just express itself. The brain wants an outcome.",
        'The brain is essentially an ROI machine. It wants to know what the return will be for the effort it is about to put in. Will this post get likes? Will this side project make money? Will anyone even read this?',
        "The soul doesn't ask any of those questions. It wants to show how it is unique and what it is feeling in the moment. That's it.",
        "Let's look at a few examples.",
        {
          type: 'leadParagraph',
          lead: 'The kid with crayons.',
          text: 'Give a five-year-old a box of crayons and they will fill page after page. Purple sun, green dog, a house floating in the sky. No one asked for it. There\'s no audience, no metric. Now give the same kid ten more years of report cards and rankings, and ask them to draw. Most will say "I\'m not good at drawing." Somewhere along the way, the brain took over the pen.',
        },
        {
          type: 'leadParagraph',
          lead: 'The dance at a wedding.',
          text: 'Watch the uncle who dances with his eyes closed, completely off-beat, having the time of his life. Then watch the person who is dancing for the Instagram story. Same music, same floor. One is expressing. The other is performing for a return.',
        },
        {
          type: 'leadParagraph',
          lead: 'The hobby that became a side hustle.',
          text: 'A lot of us have lived this one. You love baking, or woodworking, or making little games on the weekend. Then someone says "you should sell these." The moment you do, the brain starts counting: cost per unit, hours per sale, conversion rate. And the thing that used to fill you up starts to drain you.',
        },
        'Interestingly, none of this makes the brain the villain. The brain is the reason we have bridges, businesses, and medicine. It keeps us alive and fed. But the brain was built for survival, and survival is a game of returns. Expression is not.',
        'So how does one hold both?',
        'The way I see it, each one has its own job. Let the soul lead the creation. Let the brain lead the distribution. Write the essay because it wants to be written, then let the brain figure out where to share it. Build the game because it delights you, then let the brain worry about whether anyone will play it.',
        'When the brain shows up too early, the work gets safe and forgettable. When the soul never lets the brain in, the work stays in a drawer.',
        "The soul gives us the reason to create. The brain gives it a way to reach the world. The trouble only starts when we ask one to do the other's job.",
      ],
      images: [
        {
          kind: 'hero',
          src: "/assets/images/upgrades/brain-and-soul-hero.webp",
          alt: "Flowing gold and structured green forms meet at the pen of a thoughtful creator.",
          thumbnail: "/assets/images/upgrades/brain-and-soul-hero-thumb.webp",
          aspect: '3/2',
        },
        {
          after: 4,
          src: "/assets/images/upgrades/brain-and-soul-crayons.webp",
          alt: "A child’s crayon drawing becomes a playful purple sun, green dog, and floating house.",
          aspect: '3/2',
        },
        {
          after: 9,
          src: "/assets/images/upgrades/brain-and-soul-creation-and-distribution.webp",
          alt: "An imaginative drawing grows into an orderly set of paths reaching an audience.",
          aspect: '3/2',
        },
      ],
    },
    {
      slug: 'ai-native-organization',
      title: 'AI Native Organization',
      category: 'Technology',
      date: '2026 · 05',
      blurb: 'On the stack, org design, and operating habits required to become AI Native.',
      content: [
        {
          type: 'heading',
          text: 'What it Actually Means to be an AI Native Organization',
        },
        'AI Native means:',
        {
          type: 'unorderedList',
          items: [
            'AI Native Technology Stack',
            'AI Native Organization Design',
            'AI Native Thinking at all Levels',
          ],
        },
        `I have noticed that the phrase "AI Native" is starting to get thrown around the way "mobile first" was in 2012, or "cloud native" was in 2016. Most of the time it just means "we use ChatGPT," or "marketing made a custom GPT for brand voice." That is useful. But it is not AI Native.`,
        'Over the last year, running an AI-native game studio and now advising founders through AI Growth Engine, I have noticed that becoming AI Native is not one decision. It is three. You have to rebuild your technology stack, your organization design, and the thinking at every level of the team. Miss any one of these and the other two stall out.',
        "Let's evaluate each.",
        {
          type: 'heading',
          text: '1. AI Native Technology Stack',
        },
        'The simplest test for whether your stack is AI Native is this: can a frontier model read your codebase, your data, and your processes, reason about them, and ship a working change without a human translator?',
        `Most companies fail this test. Not because their languages are bad, but because the company has never been written down. The CRM says one thing. The Slack thread says another. The real customer history lives in someone's inbox. The pricing logic is in a spreadsheet called Final_v7_NEW. The refund policy is in a Notion doc nobody trusts. The sales process is "talk to Sarah, she knows how we do enterprise."`,
        'In other words, the truth is scattered across people, tools, habits, and institutional memory. Most companies have spent twenty years buying software. They have not spent twenty years designing an operating system. They have a pile of tools, not a machine.',
        'An AI Native stack has three properties.',
        'Languages and frameworks the model has actually seen a lot of. Python, TypeScript, Go, Rust, the popular flavors of React and Node. Not because these are objectively better, but because the model has read a billion lines of them. If your service runs on a hand-rolled DSL or an obscure language, you are paying a tax on every agent interaction.',
        "Context that fits the window. A repo where every module's purpose is readable in a README, where dependencies are declared cleanly, where a function does one thing and its name says what. The way an AI Native repo is, you should be able to drop a folder into a model and have it produce a working change. If your codebase needs a thirty-minute onboarding call to make sense of, it is not ready.",
        'APIs and docs designed for agents, not just humans. MCP servers, clean schemas, examples in the docs, error messages that tell the agent what to do next. Stripe has been doing this for humans for a decade. The new version is doing it for agents.',
        'The bigger plan here is to treat your own code, data, and documentation the way you treat a third party SDK: as something other agents will read.',
        {
          type: 'heading',
          text: '2. AI Native Organization Design',
        },
        'This is the part most companies underestimate.',
        'There is a useful reframe for the question your org is answering every day. An AI-assisted org asks: where can we add AI to save time? An AI Native org asks: how should this workflow exist if agents are doing the first 80%?',
        'That second question changes everything.',
        'Take customer support. In a normal company, a ticket arrives, a human reads it, searches for context, checks the account, remembers policy, drafts a response, maybe asks engineering, maybe escalates, maybe forgets to tag the reason. The human is the search engine, the router, and the copywriter, all at once. In an AI Native company, the same ticket lands in a system the agent can read. The agent pulls customer history, checks plan limits, drafts the response, recommends an action, and either resolves it or hands it to a human with the exact reason it needs judgment. The human stops being the search engine and becomes the reviewer of ambiguity.',
        'The same pattern repeats across sales, recruiting, finance, legal, claims, onboarding, research. Agents do the structured work. Humans handle taste, trust, judgment, and exceptions.',
        'Now look at how new things get built. The old org design assumed a scarce resource: engineering time. Everything was structured around protecting it. PMs wrote specs. Designers made mocks. Engineering built. QA tested. The cycle took weeks.',
        'When prototyping collapses from three weeks to ten minutes, the bottleneck moves. The question is no longer "what should we build," answered by a committee. It is "what have we already built and shown to users this week."',
        'In an AI Native org, prototypes flow through every conversation. Marketing wants to test a landing page. They build it. Customer support wants to know if a self-serve flow works. They build it. The product team wants to test three onboarding ideas. They build all three and ship them as A/B tests.',
        'The roadmap stops being a quarterly artifact. It becomes a log of what was prototyped, what got user signal, and what graduated to production.',
        'A few things change in how the org actually runs:',
        {
          type: 'unorderedList',
          items: [
            'The PM is a curator of prototypes, not a gatekeeper of ideas.',
            'Decisions are made by looking at user reactions to a real thing, not at slides about a hypothetical thing.',
            'The design review is replaced by the prototype walkthrough.',
            'The spec document becomes a working app that someone else can fork.',
          ],
        },
        'Interestingly, this also flattens politics. When anyone can build the thing, the loudest person in the room stops winning. The person who shows up Monday with a working prototype wins.',
        {
          type: 'heading',
          text: '3. AI Native Thinking at All Levels',
        },
        'The first two are tractable. You can hire for them, you can budget for them. The third is the hardest because it requires unlearning.',
        'Every team member, from a CEO to a customer support rep to an accountant, needs to do the same exercise. Break down everything you do in a week. Every task. Every meeting. Every artifact you produce.',
        'Then sort the list into two buckets:',
        {
          type: 'unorderedList',
          items: [
            'Tedious and rule-based. Status updates, scheduling, data entry, report generation, ticket routing, formatting, summarizing meetings, drafting first versions, pulling numbers, reconciling spreadsheets. The list goes on.',
            'Judgment and taste. Hard prioritization calls, creative direction, hiring decisions, customer empathy, strategy under uncertainty, naming things, saying no.',
          ],
        },
        'Everything in the first bucket should be automated. Not someday. This quarter. The second bucket is what your humans are actually for.',
        'But here is the catch most teams miss. For agents to do the tedious work well, someone has to write down what the company actually knows. What is the refund policy, exactly? When do we break it? What makes a lead qualified? What tone do we use with an angry customer? Which actions need human approval? Which data source is the source of truth when two systems disagree? In most companies, these answers live in someone\'s head, or in a doc nobody trusts. The AI Native version is to write them down, version them, and treat them like infrastructure.',
        'This is the unglamorous work. Most teams quit at this step because it feels like documentation. It is not. It is the operating layer of the company.',
        'It also reshapes the role of the founder, or the head of each function. They stop being the person with the answer in their head, and become the architect of how the company thinks. Every recurring decision turns into a decision system the agents can follow.',
        'Once that is in place, every team member needs access to the AI Native tech stack and the permission to build their own tools. The accountant should be building agents to reconcile invoices. The support lead should be building agents to triage tickets. The marketer should be building agents to ship landing pages.',
        'And here is where it stops being a tools conversation and becomes an org one. The way most companies are set up, only engineering can build software. Everyone else files tickets. That model breaks the moment a marketer can prototype a working internal tool in an afternoon.',
        'The solution is what I have started calling the internal app hub. A central place where every team in the org publishes the small apps and agents they have built for themselves. The finance team\'s invoice reconciler. The support team\'s escalation classifier. The PM team\'s user interview synthesizer. The HR team\'s onboarding bot.',
        'The hub does three things at once. It kills duplicate work. It surfaces patterns that should graduate into platform tools. And it makes the automation literacy of the org visible. If your hub has five apps, you are not AI Native. If it has fifty, you are getting there. If it has five hundred, you are running a different kind of company.',
        {
          type: 'heading',
          text: 'What this looks like from the outside',
        },
        'In a couple of years, AI Native will stop being a label or a vibe. It will show up in the numbers.',
        'Revenue per employee will look different. Gross margins will look different. Speed of execution will look different. Response times, sales velocity, onboarding time, renewal rate, error rate, all of it, will look different.',
        'The companies that get there will feel strangely awake. Customers will get answers faster. Ops problems will surface earlier. Sales follow-ups will land at the right time. Founders will see the business more clearly. Managers will spend less time asking for updates and more time improving the system.',
        'A 10-person AI Native team will do what used to take 50. A 50-person one will compete with a 500-person incumbent. Not because the people are smarter, but because the company has less drag. The structured work that used to eat 60% of the week is being done in the background. The humans are spending their time on the parts of the job that actually need humans.',
        'That is the real advantage. Not AI as a productivity hack, but AI as the thing the company is built around.',
        {
          type: 'heading',
          text: 'Putting it together',
        },
        'These three layers, stack, org design, and thinking, are load-bearing. They are not optional features of an AI Native org. A company that has the stack but not the org design will run agents but ship at the old pace. A company that has the org design but not the thinking will keep filing tickets. A company that has the thinking but not the stack will burn out trying to build on top of legacy code that fights every prompt.',
        'You need all three.',
        'And the test is simple. If you dropped a frontier model into your company tomorrow with full access, how much of the work would still need a human? If the answer is "almost all of it," start with the stack. If the answer is "the model can do the work but no one outside engineering can use it," start with the org and the thinking.',
        'Either way, the first move is the same. Pick one team. Audit their week. Find the tedious bucket. Automate it. Write down the decisions that used to live in someone\'s head. Publish what you built to the hub. Then do it again with the next team.',
        'That is what AI Native looks like from the ground up.',
      ],
      images: [
        {
          kind: 'hero',
          after: 0,
          src: "/assets/images/upgrades/ai-native-organization-hero.webp",
          alt: "An exploded architectural model connects tools and data, a collaborating team, and a living tree through three interdependent layers.",
          thumbnail: "/assets/images/upgrades/ai-native-organization-hero-thumb.webp",
          aspect: '3/2',
        },
        {
          after: 14,
          src: "/assets/images/upgrades/ai-native-organization-stack.webp",
          alt: "Books, data blocks, code panels, and tools connect through an orderly shared workspace.",
          aspect: '3/2',
        },
        {
          after: 27,
          src: "/assets/images/upgrades/ai-native-organization-org-design.webp",
          alt: "An organized workflow routes routine tasks through tools while a small team examines an unusual case.",
          aspect: '3/2',
        },
        {
          after: 40,
          src: "/assets/images/upgrades/ai-native-organization-app-hub.webp",
          alt: "Distinct tools built by small teams connect to a shared, illuminated central workspace.",
          aspect: '3/2',
        },
        {
          after: 51,
          src: "/assets/images/upgrades/ai-native-organization-ground-up.webp",
          alt: "Small workshops share useful tools along a rising circular path of learning and improvement.",
          aspect: '3/2',
        },
      ],
    },
    {
      slug: 'what-is-spirituality',
      title: 'What is Spirituality?',
      category: 'Philosophy',
      date: '2025 · 11',
      blurb: 'On spirit, identity, meditation, gratitude, affirmations, and living consciously.',
      content: [
        'Spirituality is a way of living with a constant realization that we are "ALL" spirits. And "ALL" includes all of humanity, all of the animal kingdom, all the birds, all the fishes, and all of plant life.',
        'Naturally, we live with our inherited identities that we did not choose. We live with what our mind and ego think is us. And that is essentially what stops us from reaching this realization.',
        'So spirituality, in other words, is not allowing your mind to drive your life but allowing your heart to drive your life.',
        'It is commonly said to do what your heart says or listen to your heart; however, guess what? The heart does not say anything, no matter how closely we listen. At best, we will hear a heartbeat.',
        'The spirit does not want anything. It is the silent witness. But when the mind is quiet, it reflects the spirit, the way a still lake reflects the moon. That reflection is what we hear as our heart.',
        'Listening to our heart is learning to quiet the ripples enough to see that reflection clearly.',
        {
          type: 'heading',
          text: 'So, how does one become spiritual?',
        },
        'There are unlimited ways to become spiritual and have this realization. One of the modern, immediately effective, however unsuitable ways to have this realization is by consuming psychedelics.',
        'Psychedelics break the structures associated in our mind with our ego and identity, making us see the world as spirits.',
        'For many people, that realization and outlook fade with time, though some carry lasting changes into their daily lives.',
        'One of the oldest, slowly effective but sustainable ways to become spiritual is meditation.',
        'However, meditation is likely not going to make anyone spiritual without the knowledge that we are all made of three components: mind, body, and spirit.',
        'Meditation without this knowledge will still calm your mind, which in itself is a great outcome; however, to truly become spiritual, one has to go really deep into the meditation practice and observe one\'s mind.',
        {
          type: 'heading',
          text: 'How does one observe one\'s mind?',
        },
        'This is where the mind-body connection comes in. There is only one activity we do unconsciously and consciously, and that is breathing. By breathing consciously, we can bring the mind into a conscious state from the usual autopilot state it is always in by default.',
        {
          type: 'subheading',
          text: 'Deep breathing',
        },
        {
          type: 'linkedParagraph',
          before: 'By breathing deeply, we can observe our minds from a third-person perspective. That observer is the witness, the awareness I explore in ',
          label: "AI Can't Be Conscious",
          href: '/writings/ai-and-the-witness/',
          after: '. We can notice our thoughts and focus wandering endlessly from one worry to another, one task to another.',
        },
        'With a little practice, we get better at maintaining our focus on our breath and letting go of our thoughts briefly.',
        'This is the basic level of meditation, the level of awareness called mindfulness.',
        'Deep breathing means taking slow, comfortable breaths and paying attention to each inhale and exhale. When the mind wanders, gently bring your attention back to the breath.',
        {
          type: 'subheading',
          text: 'Gratitude',
        },
        'To reach the next state, one must go from basic deep breathing to the state of gratitude. In the state of gratitude, one consciously starts being thankful for everything major and minor happening in one\'s life.',
        'One can be thankful for an infinite number of things that are working well in one\'s life: good health, happy moments with friends, supporting family, sunny days, a sports team winning, new episodes of a favorite show dropping, the list goes on.',
        'This practice re-programs the mind to look for more things to be grateful for, thereby helping one go deep even further.',
        {
          type: 'subheading',
          text: 'Affirmations',
        },
        'To reach the next state, one must start associating themselves with the attributes, traits and state of mind they want to be in. In this state, one reprograms their mind by adding desired traits after "I am."',
        'One can attribute an infinite number of things to themselves like I am calm, I am kind, I am protected, I am capable of anything, I am funny, I am ...',
        'These meditation practices provide a very strong foundation for living a conscious spiritual life. However, the real work starts with trying to live consciously.',
        'If we are all spirits, that realization has to show up in how we treat one another and the life around us. Every ordinary moment is a chance to remember it and act with that awareness.',
        {
          type: 'heading',
          text: 'What the Research Says',
        },
        {
          type: 'orderedList',
          items: [
            {
              title: 'Impact of Psychedelics on Spirituality',
              text: 'A study in Psychopharmacology found that psilocybin, administered under supportive conditions, can occasion mystical-type experiences with sustained personal meaning and spiritual significance (Griffiths et al., 2006). A separate study in the Journal of Psychopharmacology found increases in openness after a high-dose psilocybin session. In participants who had a mystical experience, openness remained significantly higher than baseline more than a year later (MacLean et al., 2011).',
            },
            {
              title: 'Meditation and Well-being',
              text: 'A study in the Journal of Clinical Psychology found that two meditation-based interventions increased mindfulness. Increases in mindfulness mediated reductions in perceived stress and rumination, offering preliminary evidence of benefits for well-being (Shapiro et al., 2008).',
            },
            {
              title: 'Mindfulness and Mental Health',
              text: 'Mindfulness-based interventions have been shown to help reduce psychological distress. Kabat-Zinn\'s review discusses their clinical use and the role of awareness and acceptance in these approaches (Kabat-Zinn, 2003).',
            },
            {
              title: 'Gratitude and Psychological Well-being',
              text: 'The practice of gratitude has been linked to improved mental health. A review in Clinical Psychology Review examines the relationship between gratitude, well-being, and positive affect, as well as the potential benefits of gratitude interventions (Wood et al., 2010).',
            },
            {
              title: 'Self-Affirmation and Stress',
              text: 'Research in Psychological Science found that affirming personal values can buffer stress responses (Creswell et al., 2005). A later study in PLoS ONE found that self-affirmation improved problem-solving performance in chronically stressed participants (Creswell et al., 2013). These studies used reflection on personal values, rather than the repeated "I am" statements described above.',
            },
          ],
        },
        'Research supports the benefits of these practices.',
        {
          type: 'heading',
          text: 'References',
        },
        {
          type: 'orderedList',
          items: [
            'Griffiths, R. R., Richards, W. A., McCann, U., & Jesse, R. (2006). Psilocybin can occasion mystical-type experiences having substantial and sustained personal meaning and spiritual significance. Psychopharmacology, 187(3), 268-283.',
            'MacLean, K. A., Johnson, M. W., & Griffiths, R. R. (2011). Mystical experiences occasioned by the hallucinogen psilocybin lead to increases in the personality domain of openness. Journal of Psychopharmacology, 25(11), 1453-1461.',
            'Shapiro, S. L., Oman, D., Thoresen, C. E., Plante, T. G., & Flinders, T. (2008). Cultivating mindfulness: Effects on well-being. Journal of Clinical Psychology, 64(7), 840-862.',
            'Kabat-Zinn, J. (2003). Mindfulness-based interventions in context: Past, present, and future. Clinical Psychology: Science and Practice, 10(2), 144-156.',
            'Wood, A. M., Froh, J. J., & Geraghty, A. W. (2010). Gratitude and well-being: A review and theoretical integration. Clinical Psychology Review, 30(7), 890-905.',
            'Creswell, J. D., Welch, W. T., Taylor, S. E., Sherman, D. K., Gruenewald, T. L., & Mann, T. (2005). Affirmation of personal values buffers neuroendocrine and psychological stress responses. Psychological Science, 16(11), 846-851.',
            'Creswell, J. D., Dutcher, J. M., Klein, W. M. P., Harris, P. R., & Levine, J. M. (2013). Self-affirmation improves problem-solving under stress. PLoS ONE, 8(5), e62593.',
          ],
        },
        {
          type: 'heading',
          text: 'Additional Links',
        },
        {
          type: 'linkList',
          items: [
            { label: 'Wikipedia: Spirituality', href: 'https://en.wikipedia.org/wiki/Spirituality' },
            { label: 'Merriam-Webster: Spirituality', href: 'https://www.merriam-webster.com/dictionary/spirituality' },
            { label: 'Royal College of Psychiatrists: What is spirituality?', href: 'https://www.rcpsych.ac.uk/docs/default-source/members/sigs/spirituality-spsig/what-is-spirituality-maya-spencer-x.pdf?sfvrsn=f28df052_2' },
            { label: 'Psychology Today: Spirituality', href: 'https://www.psychologytoday.com/us/basics/spirituality' },
            { label: 'Taking Charge: What is spirituality?', href: 'https://www.takingcharge.csh.umn.edu/what-spirituality' },
          ],
        },
      ],
      images: [
        {
          kind: 'hero',
          src: '/assets/images/what-is-spirituality-mask.webp',
          alt: 'Colorful artwork of a figure lifting a mask to reveal a bright landscape with mountains, flowers, and a butterfly',
          aspect: '642/636',
          credit: {
            label: 'Image by RozziRoomian',
            href: 'https://www.rozziroomian.com/store/p/the-mask-canvas-prints',
          },
        },
        {
          after: 27,
          src: "/assets/images/upgrades/what-is-spirituality-meditation.webp",
          alt: "A seated person meditates beside water as a subtle breath-like current connects the surrounding life.",
          aspect: '3/2',
        },
      ],
    },
    {
      slug: 'emotion-and-rationality-of-decision-making',
      title: 'Emotion and Rationality in Decision-Making',
      category: 'Philosophy',
      date: '2025 · 09',
      blurb: 'On using emotion as signal and rationality as refinement.',
      content: [
        'I generally believe that better decisions come from balancing emotion and rationality. The tricky part is that the balance is rarely obvious in the moment. I often notice myself having an emotional response first, then building a rational story around it afterward. The logic can feel clean, but underneath it there is still an initial pull that shaped the conclusion before I had fully examined it.',
        'At other times, I overcorrect. I notice the emotion, distrust it, and try to make the decision from a purely rational place. That can feel disciplined, but it can also become detached. Emotion usually carries information: anxiety may point toward risk, excitement may point toward desire, frustration may point toward a boundary being crossed. Ignoring that information completely can flatten the decision.',
        'The danger is letting emotion drive unchecked. Emotional reactions are fast and useful, but they can also be impulsive, biased, or rooted in short-term discomfort. They can make one option feel obviously right simply because it relieves pressure now. In those moments, rationality is useful because it slows the reaction down. It asks what evidence exists, what tradeoffs matter, and whether the feeling is responding to a real signal or just the fear of uncertainty.',
        'Rational thinking gives structure. It helps compare consequences, surface assumptions, and separate the immediate feeling from the longer-term outcome. But rationality alone has its own failure mode. It can optimize for what is measurable while missing what is meaningful. It can create a cold answer that looks correct on paper but does not account for values, relationships, or the emotional cost of carrying the decision forward.',
        'The version I am trying to practice is not emotion versus rationality, but emotion followed by inquiry. First, notice the feeling without immediately obeying it or dismissing it. Then ask what it might be protecting, revealing, or exaggerating. After that, use rational analysis to refine the response into something more deliberate.',
        'In personal decisions, emotions often deserve more weight because they reveal values and needs that may not fit neatly into a spreadsheet. In professional decisions, rationality may need to lead more often, but emotional intelligence still matters: understanding how people feel, how incentives shape behavior, and how trust is built or lost.',
        'A good decision is not always the one that feels best, and it is not always the one that looks most logical in isolation. It is the one where the emotional signal has been heard, the rational case has been tested, and neither side is secretly running the whole process alone.',
      ],
      images: [
        {
          kind: 'hero',
          src: "/assets/images/upgrades/emotion-and-rationality-decision-making-hero.webp",
          alt: "A thoughtful person weighs a warm heart and a cool geometric brain on a balanced scale.",
          thumbnail: "/assets/images/upgrades/emotion-and-rationality-decision-making-hero-thumb.webp",
          aspect: '3/2',
        },
        {
          after: 4,
          src: "/assets/images/upgrades/emotion-and-rationality-decision-making-prism.webp",
          alt: "A warm emotional signal passes through a clear prism and emerges as a deliberate path.",
          aspect: '3/2',
        },
      ],
    },
    {
      slug: 'the-issue-of-neat-categorization',
      title: 'The issue of neat categorization',
      category: 'Philosophy',
      date: '2025 · 07',
      blurb: 'On why categories help us think, and what they quietly leave out.',
      content: [
        'I recently realized how much of a knack we have for categorizing things in order to understand them. Essentially, we make things simple so we can pattern match more easily.',
        "Categorization helps us simplify complex information, but it often comes with a trade-off: some level of nuance and complexity is lost in the process. When we force things into neat categories, we might overlook details that do not fit into the predefined boxes. This can lead to oversimplification, where we lose the richness of context and the subtle relationships between things that do not fit as easily.",
        "For example, in biology, we categorize species into families, genera, and other ranks, but this sometimes ignores evolutionary anomalies or hybrid species that do not fit perfectly into those categories. Similarly, in human behavior, labeling people as introverts or extroverts can ignore the fluidity and context-specific nature of those traits.",
        'The same problem shows up in medicine. A diagnosis can be useful because it gives doctors a shared language and a known treatment path, but real bodies often contain overlapping symptoms, comorbidities, edge cases, and histories that do not behave like clean textbook entries.',
        'Maps are another example. Borders, neighborhoods, and regions make territory legible, but lived culture rarely stops exactly where a line is drawn. A city can contain many cities inside it, and a language can fade into another through dialects, accents, and local usage instead of switching cleanly from one category to the next.',
        'Culture also resists neat sorting. Music, art, games, and films are grouped into genres so we can find and discuss them, but the most interesting work often lives between genres. Political labels work the same way: they can compress a worldview into a word, while hiding the contradictions, priorities, and context that actually shape a person.',
        'This becomes even sharper in algorithmic systems. Recommendation engines, moderation systems, resumes, ads, and user segments all depend on labels, but a label can mistake convenience for truth. Once the system starts acting on the label, the category can shape the reality it was only supposed to describe.',
        'At the same time, categorization is a natural cognitive tool for making sense of the world around us. It helps us process and recall information more efficiently, even if that efficiency means losing some complexity along the way.',
      ],
      images: [
        {
          kind: 'hero',
          src: "/assets/images/upgrades/the-issue-of-neat-categorization-hero.webp",
          alt: "Leaves, shells, and branches grow beyond the divisions of an orderly specimen drawer.",
          thumbnail: "/assets/images/upgrades/the-issue-of-neat-categorization-hero-thumb.webp",
          aspect: '3/2',
        },
        {
          after: 2,
          src: "/assets/images/upgrades/the-issue-of-neat-categorization-spectrum.webp",
          alt: "A continuous ribbon of varied human figures crosses the boundaries of geometric compartments.",
          aspect: '3/2',
        },
        {
          after: 6,
          src: "/assets/images/upgrades/the-issue-of-neat-categorization-examples.webp",
          alt: "A plant, map, woven fabric, speech forms, and mechanical network overlap an open sorting grid.",
          aspect: '3/2',
        },
      ],
    },
    {
      slug: 'three-perspectives-on-reality',
      title: 'Three Perspectives on Reality',
      category: 'Philosophy',
      date: '2025 · 04',
      blurb: 'On moving between broad, close, and metaphysical views of reality.',
      content: [
        "I have noticed that when you analyze something deeply, it helps to move between two perspectives. One is the bird's-eye view, where you look from high above and understand the whole shape of the thing. The other is the worm's-eye view, where you get close enough to see the details, textures, and hidden mechanics.",
        'Another way to say this is: we can get so lost in the trees that we do not realize we are in the wrong forest.',
        'Then there is a third way: a way to look at things from outside the physical world, at the metaphysical level.',
        "At this level, you move beyond the immediate context, the material realm, and even the limits of perception. It is about understanding the underlying principles, or universal truths, that govern existence, consciousness, and reality itself. It is a broader and more abstract view, where questions of meaning, purpose, and the nature of the universe come into focus.",
        "For instance, while a bird's-eye view gives you a broad overview of a situation, and a worm's-eye view lets you examine the details up close, the metaphysical view steps back further to consider the greater forces at play. It is like stepping out of the forest entirely to understand not just where you are in it, but how the entire forest fits within the broader ecosystem.",
      ],
      images: [
        {
          kind: 'hero',
          src: "/assets/images/upgrades/three-perspectives-on-reality-birds-eye.webp",
          alt: "An aerial view reveals a winding river and connected patterns across a forest canopy.",
          thumbnail: "/assets/images/upgrades/three-perspectives-on-reality-birds-eye-thumb.webp",
          aspect: '3/2',
        },
        {
          after: 0,
          src: "/assets/images/upgrades/three-perspectives-on-reality-worms-eye.webp",
          alt: "A small fern and layered roots reveal the forest from close to the ground.",
          aspect: '3/2',
        },
        {
          after: 3,
          src: "/assets/images/upgrades/three-perspectives-on-reality-metaphysical.webp",
          alt: "Fine geometric arcs reveal connections among a forest, its roots, and the night sky.",
          aspect: '3/2',
        },
      ],
    },
    {
      slug: 'generative-games',
      title: 'Generative Games on building systems that generate games',
      category: 'Technology',
      date: '2025 · 01',
      blurb: 'On building systems that generate games, and what that changes about the medium.',
      content: [
        'The future of the gaming industry is going to be Generative Games.',
        'Once upon a time, the industry used to think games were products you shipped once. Then came MMOs that showed games did not have to be "shipped and done," and games became services, economies, and habits. Zynga scaled that idea into the mainstream and proved that the real game was not just the content but the system that kept players coming back.',
        'GenAI blows that model open. I believe we are moving beyond games that are merely updated by developers. We are entering a world where characters, rules, stories and even parts of the world can be generated and adapted in real time. The game is no longer fixed. It becomes responsive and increasingly alive.',
        'That shift is bigger than better content pipelines or cheaper asset creation. It changes the nature of the medium itself. For decades, game development has been about hand-authoring experiences. With generative systems, the experience can evolve while the player is inside it. Worlds can react to play styles. Missions can emerge instead of being fully scripted. Social dynamics can shape the state of the world rather than just sit on top of it.',
        'This creates a new design frontier. The job is no longer only to build levels, characters, and mechanics. The job is to design systems that can generate interesting possibility spaces while staying coherent and fun.',
        'It also changes what "live ops" means. Live ops used to mean events, content drops, balance changes and monetization loops. In generative games, live ops can become continuous world steering. Developers set the direction, constraints, and incentives, while the game itself participates in creating fresh play. The operating model shifts from shipping updates to managing living systems.',
        'Of course, this does not mean every game should become fully generative. A lot of great game design comes from intention, curation, and handcrafted constraints. But the ceiling has clearly moved. The most interesting games of the next decade will likely combine authored taste with generative adaptability. Not infinite randomness but living systems with taste.',
        'And just like social games changed what people optimized for, generative games will change what developers will optimize for. The winners may not be the teams that produce the most content. They may be the ones that build the best feedback loops between player behavior, AI systems and world evolution.',
        'We are still early, but the direction feels clear. Games are starting to move from static software to dynamic worlds.',
      ],
      images: [
        {
          kind: 'hero',
          src: "/assets/images/upgrades/generative-games-living-world.webp",
          alt: "A playable miniature world grows from an unfinished grid into a vivid landscape around a player.",
          thumbnail: "/assets/images/upgrades/generative-games-living-world-thumb.webp",
          aspect: '3/2',
        },
      ],
    },
    {
      slug: 'generalist-case',
      title: "A generalist's case for staying a generalist",
      category: 'Philosophy',
      date: '2024 · 09',
      blurb: 'Notes on optimizing for breadth in a world that keeps asking you to specialize.',
      content: [],
    },
  ],
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/anshuldhawan/' },
    { label: 'X / Twitter', href: 'https://x.com/AnshulDhawan001' },
    { label: 'Email', href: 'mailto:anshuldhawan@gmail.com' },
  ],
};

window.SITE_DATA = SITE_DATA;
