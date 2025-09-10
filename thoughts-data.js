const thoughtsData = {
    nodes: [
        {
            id: 'root',
            label: 'MIND',
            type: 'root',
            x: null,
            y: null,
            description: 'The central nexus of interconnected thoughts',
            tags: ['origin', 'self']
        },
        {
            id: 'poetry',
            label: 'POETRY',
            type: 'art',
            parent: 'root',
            description: 'Poetic expression and language play',
            tags: ['writing', 'expression', 'language']
        },
        {
            id: 'youtube-depths',
            label: 'YOUTUBE DEPTHS',
            type: 'concept',
            parent: 'root',
            description: 'The primordial ooze of random algorithms in the dark depths of the subconscious',
            tags: ['subconscious', 'algorithms', 'depths', 'primordial']
        },
        {
            id: 'vsauce',
            label: 'VSAUCE',
            type: 'experience',
            parent: 'youtube-depths',
            description: 'Michael here! Educational content from the depths',
            tags: ['education', 'curiosity', 'science']
        },
        {
            id: 'jack-and-dean',
            label: 'JACK AND DEAN',
            type: 'experience',
            parent: 'youtube-depths',
            description: 'British comedy duo from the algorithm depths',
            tags: ['comedy', 'british', 'sketches']
        },
        {
            id: 'athene',
            label: 'ATHENE',
            type: 'thinker',
            parent: 'youtube-depths',
            description: 'Controversial gamer and record breaker with incredible mathematical mind, devoted to saving lives from poverty. Taught the mission of doing the most good possible - that having a valuable mission makes for a valuable life.',
            tags: ['mission', 'mathematics', 'poverty', 'good', 'life-purpose', 'foundational']
        },
        {
            id: 'dd-academy',
            label: 'DD ACADEMY',
            type: 'experience',
            parent: 'athene',
            description: 'Youth educational program disguised as self-development that teaches the importance of open society and democracy through Karl Popper\'s lens.',
            tags: ['education', 'open-society', 'democracy', 'popper']
        },
        {
            id: 'open-society',
            label: 'OPEN SOCIETY',
            type: 'concept',
            parent: 'dd-academy',
            description: 'Karl Popper\'s philosophy: revolutions are bad, nobody knows how the world works, so change it step by step, not all at once, because you cannot know the consequences.',
            tags: ['popper', 'gradual-change', 'epistemology', 'democracy', 'anti-revolution']
        },
        {
            id: 'effective-altruism',
            label: 'EFFECTIVE ALTRUISM',
            type: 'branch',
            parent: 'athene',
            description: 'A community and philosophy that uses evidence and careful reasoning to figure out how to do the most good. Discovered through chance encounter at DD Academy conference. Has guided and influenced my life ever since.',
            tags: ['altruism', 'evidence', 'reasoning', 'movement', 'doing-good', 'life-guiding']
        },
        {
            id: 'ea-tartu',
            label: 'EA TARTU',
            type: 'community',
            parent: 'effective-altruism',
            description: 'Local EA city group joined to organize events and build community around effective giving and impact.',
            tags: ['community', 'tartu', 'organizing', 'events', 'estonia']
        },
        {
            id: 'ea-estonia',
            label: 'EA ESTONIA',
            type: 'experience',
            parent: 'ea-tartu',
            description: 'Joined and led EA Estonia, building it to ~60 members - making it by far the largest EA group per capita in the world. Led until boredom set in, then moved to more cause-specific activities.',
            tags: ['leadership', 'community-building', 'estonia', 'record-breaking', 'per-capita', 'meta-EA']
        },
        {
            id: 'ai-policy-exploration',
            label: 'AI POLICY & ACTIVISM',
            type: 'branch',
            parent: 'ea-estonia',
            description: 'Exploring the AI policy and activism route through various organizations. Didn\'t end up being my jam, though the activist groups are still dear to my heart.',
            tags: ['ai-policy', 'activism', 'exploration', 'not-my-jam']
        },
        {
            id: 'pause-ai',
            label: 'PAUSE AI',
            type: 'experience',
            parent: 'ai-policy-exploration',
            description: 'AI safety activist organization focused on pausing dangerous AI development.',
            tags: ['activism', 'ai-safety', 'pause', 'movement']
        },
        {
            id: 'control-ai',
            label: 'CONTROL AI',
            type: 'experience',
            parent: 'ai-policy-exploration',
            description: 'Little stint in Control AI - targeted interventions for AI safety.',
            tags: ['activism', 'ai-safety', 'intervention', 'brief']
        },
        {
            id: 'ministry-justice',
            label: 'MINISTRY OF JUSTICE',
            type: 'experience',
            parent: 'ai-policy-exploration',
            description: 'Internship at Estonian Ministry of Justice working on AI policy.',
            tags: ['internship', 'estonia', 'government', 'policy']
        },
        {
            id: 'convergence-analysis',
            label: 'CONVERGENCE ANALYSIS',
            type: 'experience',
            parent: 'ai-policy-exploration',
            description: 'Working in convergence analysis to explore AI policy landscape.',
            tags: ['analysis', 'policy', 'research', 'ai-governance']
        },
        {
            id: 'the-garden',
            label: 'THE GARDEN',
            type: 'community',
            parent: 'ai-policy-exploration',
            description: 'Went to The Garden in Portugal to discover communal living. A place of many other "post-EAs" or "post-rationalists" - people with similar paths. https://thegarden.pt/',
            tags: ['portugal', 'communal-living', 'post-EA', 'post-rationalist', 'community']
        },
        {
            id: 'embodiment',
            label: 'EMBODIMENT',
            type: 'concept',
            parent: 'the-garden',
            description: 'Discovering you have a body and feelings. Learning to integrate them, listen to them, be more in tune with them. Acting from sincere passion and joy rather than externally imposed urgency or obligation.',
            tags: ['body', 'feelings', 'integration', 'passion', 'joy', 'authentic-action', 'anti-obligation']
        },
        {
            id: 'casa-tilo',
            label: 'CASA TILO',
            type: 'community',
            parent: 'the-garden',
            description: 'Richard Bartlett\'s coliving retreat space - another cool exploration from The Garden network.',
            tags: ['coliving', 'retreat', 'richard-bartlett', 'to-explore', 'garden-network']
        },
        {
            id: 'kanthaus',
            label: 'KANTHAUS',
            type: 'community',
            parent: 'the-garden',
            description: 'Seems pretty cool - another space in the post-rationalist network to explore.',
            tags: ['community', 'post-rationalist', 'to-explore', 'seems-cool']
        },
        {
            id: 'tpot-scene',
            label: 'TPOT TWITTER SCENE',
            type: 'community',
            parent: 'the-garden',
            description: 'The post-rationalist This Part of Twitter scene with all its workshops, people, and meetups.',
            tags: ['tpot', 'twitter', 'post-rationalist', 'workshops', 'meetups', 'scene']
        },
        {
            id: 'vipassana-retreats',
            label: 'GOENKA VIPASSANA',
            type: 'experience',
            parent: 'embodiment',
            description: 'Vipassana retreats discovering that thoughts are not me, feelings are not me, everything is just tiny vibrations and nothing is really that serious. Serious realization.',
            tags: ['meditation', 'vipassana', 'goenka', 'not-self', 'vibrations', 'perspective', 'retreat']
        },
        {
            id: 'roger-thisdell',
            label: 'ROGER THISDELL',
            type: 'thinker',
            parent: 'vipassana-retreats',
            description: 'Currently following Roger Thisdell\'s "streamlined" guide to enlightenment which focuses on noticing. Trying that approach out.',
            tags: ['enlightenment', 'noticing', 'streamlined', 'current-practice', 'meditation-guide']
        },
        {
            id: 'jungian-thinking',
            label: 'JUNGIAN THINKING',
            type: 'concept',
            parent: 'embodiment',
            description: 'Thinking about vibes and energies as different creatures, beings, or voices (like Internal Family Systems). Understanding how mythology and religious stories help us know ourselves through archetypes - like Mars as archetypal aggression present in all of us.',
            tags: ['jung', 'archetypes', 'internal-family-systems', 'mythology', 'creatures', 'energies', 'mars']
        },
        {
            id: 'mythology-folklore',
            label: 'MYTHS & FOLKLORE',
            type: 'concept',
            parent: 'jungian-thinking',
            description: 'Getting curious about myths, folklore, and religious texts as ways to understand archetypal energies and patterns within ourselves.',
            tags: ['mythology', 'folklore', 'religious-texts', 'archetypes', 'curiosity', 'self-understanding']
        },
        {
            id: 'estonian-folklore',
            label: 'ESTONIAN FOLKLORE',
            type: 'concept',
            parent: 'mythology-folklore',
            description: 'Exploring Estonian and Finno-Ugric folklore and traditions. Currently interested in Estonian runosong (regilaul) - the traditional singing tradition.',
            tags: ['estonia', 'finno-ugric', 'regilaul', 'runosong', 'traditions', 'current-exploration']
        },
        {
            id: 'alternative-politics',
            label: 'ALTERNATIVE POLITICS',
            type: 'concept',
            parent: 'root',
            description: 'Soft interest in communism and alternative political systems. How to solve something more fundamental than just "poverty" - how to fundamentally change people\'s values so they build and keep building a better world for everyone, emotionally and physically.',
            tags: ['politics', 'communism', 'systemic-change', 'values', 'meta-solutions', 'better-world']
        },
        {
            id: 'communist-bookclub',
            label: 'COMMUNIST BOOKCLUB',
            type: 'community',
            parent: 'alternative-politics',
            description: 'Invited by a friend (associated with post-EA folk). Reading and discussing works like Mark Fisher, Yanis Varoufakis, Slavoj Žižek and similar thinkers.',
            tags: ['bookclub', 'mark-fisher', 'varoufakis', 'zizek', 'post-ea-adjacent', 'discussion']
        },
        {
            id: 'ideology-awareness',
            label: 'IDEOLOGY AWARENESS',
            type: 'concept',
            parent: 'communist-bookclub',
            description: 'Žižek\'s way of thinking about ideologies - how we all have one, and it\'s about being aware of your own. The invisible thing that guides the way you do things, be it efficiency or individualism or hedonism.',
            tags: ['zizek', 'ideology', 'awareness', 'invisible-frameworks', 'efficiency', 'individualism', 'hedonism']
        },
        {
            id: 'spiral-hydrogen',
            label: 'SPIRAL HYDROGEN',
            type: 'experience',
            parent: 'root',
            description: 'Estonian startup doing novel hydrogen electrolyzers that are gonna change the world. Where I work now.',
            tags: ['startup', 'hydrogen', 'electrolyzers', 'estonia', 'current-work', 'world-changing']
        }
    ],
    
    connections: []
};

// Color mapping for different node types
const nodeColors = {
    root: '#7eb346',
    branch: '#4a7c2e',
    thinker: '#8fbc8f',
    book: '#6b8e23',
    concept: '#556b2f',
    movement: '#3e2723',
    community: '#5a6b3b',
    experience: '#2e1a17',
    practice: '#4a6741',
    resource: '#3a5f3a',
    organization: '#486b48',
    art: '#6b5d54',
    default: '#4a7c2e'
};