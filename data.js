/* ═══════════════════════════════════════════════════════════════
   RCRD — Data Layer
   All content for the universe lives here
   ═══════════════════════════════════════════════════════════════ */

/**
 * GAS CLOUDS — Represent clusters/categories
 * 
 * Properties:
 * - id: unique identifier
 * - name: display label
 * - color: CSS color (use rgba for transparency)
 * - x, y: position as percentage of viewport (0-100)
 * - size: diameter in pixels
 * - blur: optional custom blur amount
 */
const gasClouds = [
    {
        id: 'effective-altruism',
        name: 'Effective Altruism',
        color: 'rgba(100, 140, 255, 0.5)',
        x: 35,
        y: 40,
        size: 420,
        description: 'A global movement and philosophy dedicated to finding the most effective ways to help others, guided by evidence and rigorous reasoning. Rooted in utilitarian and consequentialist ethics, it emerged from philosophers and economists at Oxford and beyond. Today it spans a worldwide community working on animal welfare, global health, AI safety, pandemic prevention, and more.',
        links: [
            { text: 'effectivealtruism.org', url: 'https://effectivealtruism.org' }
        ]
    },
    {
        id: 'ai-safety',
        name: 'AI Safety',
        color: 'rgba(180, 100, 255, 0.45)',
        x: 30,
        y: 54,
        size: 220,
        description: '',
        links: []
    },
    {
        id: 'tpot',
        name: 'TPOT',
        color: 'rgba(255, 140, 100, 0.45)',
        x: 56,
        y: 44,
        size: 380,
        description: '"This Part of Twitter"—a loose collective huddled around shared interests in the mind, development of the psyche, and just vibes. Some overlap with rationalist (CFAR, LessWrong) or effective altruist communities, but much more than that.',
        links: [
            { text: '𝕏', url: 'https://x.com/_virtual_vapor' }
        ]
    },
    {
        id: 'folklore',
        name: 'Folklore',
        color: 'rgba(180, 255, 180, 0.3)',
        x: 74,
        y: 30,
        size: 90,
        description: '',
        links: []
    },
    {
        id: 'meditation',
        name: 'Meditation',
        color: 'rgba(255, 220, 140, 0.45)',
        x: 62,
        y: 68,
        size: 300,
        description: '',
        links: []
    }
];


/**
 * STARS — Specific things (people, places, organizations, etc.)
 * 
 * Properties:
 * - id: unique identifier
 * - name: display name
 * - type: category label (person, place, organization, project, etc.)
 * - x, y: position as percentage (0-100)
 * - size: diameter in pixels (4-16 recommended)
 * - color: optional custom color
 * - description: text shown in modal
 * - image: optional image URL
 * - links: optional array of { text, url }
 */
const stars = [
    // ═══════════════════════════════════════════════════════════
    // Effective Altruism cloud (label at ~35, 40)
    // ═══════════════════════════════════════════════════════════
    {
        id: 'ea-estonia',
        name: 'EA Estonia',
        type: 'organization',
        x: 30,
        y: 30,
        size: 12,
        color: '#a8d4ff',
        labelPosition: 'left',
        description: 'Built and led the local effective altruism community for 4 years. Connected many people, helped some go on to do impactful work—including starting an animal welfare charity and joining a leading AI safety organisation. Learned a great deal about running an organisation, managing volunteers, strategic thinking, and reasoning about impact. Fun times. This was my first real taste of generalist organisation-building, and I loved it.',
        image: null,
        links: [
            { text: 'efektiivnealtruism.org', url: 'https://efektiivnealtruism.org' }
        ]
    },
    {
        id: 'anneta-targalt',
        name: 'Anneta Targalt',
        type: 'organization',
        x: 32,
        y: 33,
        size: 8,
        labelPosition: 'left',
        color: '#a8d4ff',
        description: 'A website, inspired by Effektiv Spenden, Ge Effektivt and others, where Estonians can donate to global evidence-based charities and receive tax deductions. Through it we have raised almost €300,000 so far.',
        image: null,
        links: [
            { text: 'annetatargalt.ee', url: 'https://annetatargalt.ee' }
        ]
    },
    {
        id: 'prague',
        name: 'Prague',
        type: 'place',
        x: 42,
        y: 35,
        size: 11,
        color: '#fff9f0',
        description: '',
        image: null,
        links: []
    },
    {
        id: 'eagx-prague',
        name: 'EAGxPrague',
        type: 'event',
        x: 24,
        y: 47,
        size: 6,
        color: '#c4b5fd',
        labelPosition: 'left',
        description: 'Helped organize a conference of 400 people to bring together the effective altruism community.',
        image: null,
        links: []
    },
    {
        id: 'eagx-nordics',
        name: 'EAGxNordics',
        type: 'event',
        x: 26,
        y: 44,
        size: 6,
        color: '#c4b5fd',
        labelPosition: 'left',
        description: 'Helped organize a conference of 600 people to bring together the effective altruism community.',
        image: null,
        links: []
    },
    {
        id: 'cfar',
        name: 'CFAR',
        type: 'organization',
        x: 36,
        y: 45,
        size: 9,
        color: '#a8d4ff',
        labelPosition: 'left',
        description: 'Attended a workshop by the Center for Applied Rationality near San Francisco.',
        image: null,
        links: [
            { text: 'rationality.org', url: 'https://rationality.org/' }
        ]
    },
    
    // ═══════════════════════════════════════════════════════════
    // AI Safety cloud (inside EA)
    // ═══════════════════════════════════════════════════════════
    {
        id: 'jum',
        name: 'JuM',
        type: 'organization',
        x: 22,
        y: 56,
        size: 9,
        color: '#e0aaff',
        description: 'Did an internship at the Estonian Ministry of Justice working on local and EU AI safety policy. Fun times! Though I learned I\'m not the type to do this full-time.',
        image: null,
        links: []
    },
    {
        id: 'london',
        name: 'London',
        type: 'place',
        x: 32,
        y: 56,
        size: 10,
        color: '#fff9f0',
        description: '',
        image: null,
        links: []
    },
    {
        id: 'blackpool',
        name: 'Blackpool',
        type: 'place',
        x: 28,
        y: 60,
        size: 8,
        color: '#fff9f0',
        description: 'Home of CEEALAR, the "EA Hotel"—a wild concept where you can live and eat for free as long as you\'re doing impactful work. I stayed here for a few months and had great encounters with PauseAI.',
        image: null,
        links: [
            { text: 'ceealar.org', url: 'https://www.ceealar.org/' }
        ]
    },
    
    // ═══════════════════════════════════════════════════════════
    // Intersection of EA & TPOT
    // ═══════════════════════════════════════════════════════════
    {
        id: 'berlin',
        name: 'Berlin',
        type: 'place',
        x: 46,
        y: 42,
        size: 12,
        color: '#ffd89b',
        description: 'The gateway between rationalism and post-rationalism.',
        image: null,
        links: []
    },
    {
        id: 'kiezburn',
        name: 'KiezBurn',
        type: 'event',
        x: 52,
        y: 40,
        size: 9,
        color: '#ffb08a',
        description: 'A Burning Man type event in Germany.',
        image: null,
        links: [
            { text: 'kiezburn.org', url: 'https://mmm.kiezburn.org/' }
        ]
    },
    
    // ═══════════════════════════════════════════════════════════
    // TPOT cloud
    // ═══════════════════════════════════════════════════════════
    {
        id: 'the-garden',
        name: 'The Garden',
        type: 'place',
        x: 60,
        y: 36,
        size: 10,
        color: '#ffb08a',
        description: 'A magical forest you sometimes get lost in while walking around northern Portugal. Inhabited by fairies and forest elves who give you tea and tell you stories. You will miss them.',
        image: null,
        links: [
            { text: 'thegarden.pt', url: 'https://thegarden.pt/' }
        ]
    },
    
    // ═══════════════════════════════════════════════════════════
    // Folklore cloud & overlap with TPOT
    // ═══════════════════════════════════════════════════════════
    {
        id: 'jung',
        name: 'Jung',
        type: 'concept',
        x: 68,
        y: 36,
        size: 9,
        color: '#b8e6b8',
        description: 'Anything related to archetypes, dreams, the subconscious, shadow, myths, folklore, including religious stories is interesting. It relates to the quest of understanding yourself, developing yourself, and understanding others and humans as a whole.',
        image: null,
        links: []
    },
    {
        id: 'runosongs',
        name: 'Runosongs',
        type: 'tradition',
        x: 78,
        y: 22,
        size: 8,
        color: '#b8e6b8',
        description: 'An unusual way of singing that turns common ideologies on their head. Songs are repetitive, cyclical, long—the lead singer sings and everyone else repeats. Instead of "pop star admiration" you get collective breathing, until you almost meld into the collective voice.',
        image: null,
        links: [
            { text: 'see example', url: 'https://arhiiv.err.ee/video/vaata/folklooriansambel-hellero' }
        ]
    },
    
    // ═══════════════════════════════════════════════════════════
    // Meditation cloud
    // ═══════════════════════════════════════════════════════════
    {
        id: 'goenka',
        name: 'Goenka',
        type: 'teacher',
        x: 70,
        y: 78,
        size: 13,
        color: '#ffe4a0',
        description: 'Widely available Vipassana training courses. Note: Intense.',
        image: null,
        links: [
            { text: 'dhamma.org', url: 'https://www.dhamma.org/en-US/index' }
        ]
    },
    {
        id: 'theravada',
        name: 'Theravada',
        type: 'tradition',
        x: 56,
        y: 76,
        size: 10,
        color: '#ffe4a0',
        description: 'A Buddhist lineage with a presence in Estonia.',
        image: null,
        links: [
            { text: 'sangha.ee', url: 'https://sangha.ee/' }
        ]
    },
    
    // ═══════════════════════════════════════════════════════════
    // Intersection of TPOT & Meditation
    // ═══════════════════════════════════════════════════════════
    {
        id: 'tmi',
        name: 'TMI',
        type: 'book',
        x: 56,
        y: 58,
        size: 7,
        color: '#ffd0a0',
        description: 'The Mind Illuminated by Culadasa—a pragmatic, step-by-step guide for concentration practice. Followed it for a while.',
        image: null,
        links: []
    },
    {
        id: 'mctb',
        name: 'MCTB',
        type: 'book',
        x: 68,
        y: 56,
        size: 10,
        color: '#ffd0a0',
        description: 'Mastering the Core Teachings of the Buddha by arahant Daniel M. Ingram—an "unusually hardcore" dharma book.',
        image: null,
        links: [
            { text: 'Scott Alexander\'s review', url: 'https://slatestarcodex.com/2017/09/18/book-review-mastering-the-core-teachings-of-the-buddha/' }
        ]
    },
    {
        id: 'qri',
        name: 'QRI',
        type: 'organization',
        x: 66,
        y: 48,
        size: 7,
        color: '#ffd0a0',
        description: 'Qualia Research Institute—a research organisation investigating psychedelics, consciousness and meditation. Building a new science of consciousness. Fully endorse.',
        image: null,
        links: [
            { text: 'qri.org', url: 'https://qri.org/' }
        ]
    },
    {
        id: 'noting',
        name: 'Noting',
        type: 'practice',
        x: 60,
        y: 60,
        size: 7,
        color: '#ffd0a0',
        description: 'A meditation technique where you note your experience, either verbally in your head or nonverbally. Helps discern more and more subtle experiences.',
        image: null,
        links: []
    }
];


/**
 * CURIOSITY STARS — Things you want to investigate
 * Only visible when curiosity mode is toggled on
 * Same structure as regular stars
 */
const curiosityStars = [
    // ═══════════════════════════════════════════════════════════
    // Meditation cloud (purely inside)
    // ═══════════════════════════════════════════════════════════
    {
        id: 'curiosity-monasteries',
        name: 'Monasteries in East-Asia',
        type: 'curiosity',
        x: 70,
        y: 78,
        size: 9,
        description: 'Self-explanatory. I wanna dive into retreats for 2 years and see what happens.',
        links: []
    },
    
    // ═══════════════════════════════════════════════════════════
    // Meditation (close to intersection)
    // ═══════════════════════════════════════════════════════════
    {
        id: 'curiosity-rob-burbea',
        name: 'Rob Burbea lineage',
        type: 'curiosity',
        x: 50,
        y: 66,
        size: 8,
        description: 'Late meditation teacher. Has an in-person and online presence.',
        links: [
            { text: 'hermesamara.org', url: 'https://hermesamara.org/' }
        ]
    },
    {
        id: 'curiosity-gaia-house',
        name: 'Gaia House',
        type: 'curiosity',
        x: 60,
        y: 72,
        size: 8,
        description: 'A meditation retreat center.',
        links: [
            { text: 'gaiahouse.co.uk', url: 'https://gaiahouse.co.uk/' }
        ]
    },
    
    // ═══════════════════════════════════════════════════════════
    // TPOT / Meditation intersection
    // ═══════════════════════════════════════════════════════════
    {
        id: 'curiosity-dharma-overground',
        name: 'Dharma Overground',
        type: 'forum',
        x: 60,
        y: 58,
        size: 8,
        description: 'A forum for analytical-minded meditators.',
        links: [
            { text: 'dharmaoverground.org', url: 'https://www.dharmaoverground.org/' }
        ]
    },
    
    // ═══════════════════════════════════════════════════════════
    // TPOT cloud
    // ═══════════════════════════════════════════════════════════
    {
        id: 'curiosity-casa-tilo',
        name: 'Casa Tilo',
        type: 'curiosity',
        x: 52,
        y: 38,
        size: 8,
        description: 'A co-living / event space with post-rationalist / TPOT roots.',
        links: []
    },
    {
        id: 'curiosity-vibecamp',
        name: 'Vibecamp',
        type: 'curiosity',
        x: 56,
        y: 34,
        size: 9,
        description: 'A gathering of TPOT people.',
        links: [
            { text: 'vibe.camp', url: 'https://vibe.camp/' }
        ]
    },
    {
        id: 'curiosity-fight-wise',
        name: 'Fight Wise',
        type: 'curiosity',
        x: 50,
        y: 48,
        size: 7,
        description: 'An online training program to learn to speak your truth, hold your ground and ask what you need.',
        links: [
            { text: 'thehum.org', url: 'https://www.thehum.org/courses-and-events/fight-wise%3A-find-your-backbone' }
        ]
    },
    {
        id: 'curiosity-ubud',
        name: 'Ubud',
        type: 'place',
        x: 64,
        y: 40,
        size: 8,
        description: 'Seems densely packed with STUFF.',
        links: []
    },
    {
        id: 'curiosity-coliving',
        name: 'Other co-living spaces',
        type: 'curiosity',
        x: 52,
        y: 52,
        size: 7,
        description: 'I\'ve heard there are some great places in Portugal and Spain.',
        links: []
    },
    
    // ═══════════════════════════════════════════════════════════
    // Folklore cloud
    // ═══════════════════════════════════════════════════════════
    {
        id: 'curiosity-smoke-saunas',
        name: 'Smoke saunas',
        type: 'curiosity',
        x: 78,
        y: 26,
        size: 8,
        description: 'This has been explained to me as a borderline religious experience, if done correctly.',
        links: [
            { text: 'watch', url: 'https://www.youtube.com/watch?v=8Yq9Fej3xGo' }
        ]
    }
];


/**
 * FALLING STARS — Ephemeral messages/poems
 * These appear randomly and fade away
 * 
 * Properties:
 * - id: unique identifier
 * - text: the message or poem (can include line breaks with \n)
 * - duration: how long it stays readable in ms (default 8000)
 */
const fallingStars = [
    {
        id: 'poem-estonian-1',
        text: 'sinu jaoks kerkivad mäed\nja sinu jaoks voolavad ojad\nsinule naeravad lilled\nsinule laulavad luiged\n\nlase siis ka mul\nvormuda mägede järgi\nmoodusatada ehataeva kui sina hõikad\nrõõmust või ängist\nmurest või hirmust\n\net sind õhtuhämaruses kuulata\njääda seisma metsa veerel\nsulle tagasi ümiseda\n\net sina puude kohinat kuuleksid\nja tunneksid tõesti kuidas\nsinu jaoks kajavad mäed\nja vulisevad ojad',
        translation: 'for you the mountains rise\nand for you the streams flow\nto you the flowers smile\nto you the swans sing\n\nso let me too\nbe shaped by the mountains\nbecome the evening sky when you call out\nfrom joy or anguish\nfrom worry or fear\n\nto listen to you in the dusk\nto stand still at the edge of the forest\nto hum back to you\n\nso you would hear the rustling of trees\nand truly feel how\nfor you the mountains echo\nand the streams murmur',
        duration: 25000,
        first: true
    },
    {
        id: 'poem-estonian-2',
        text: 'iga mehe unistus on ununeda unustusse\n\nkinni panna silmad, tunda pehmet mulda\ntunda kuidas ussid ihu nosivad\nsiseorganeid ahnitsevad\n\ntead su elu õnnestunud kui leiad end kõdunemas\nnäed habrast keha kesk kevadisi kaseoksi\ntunned kuidas sipelgad su ninasõõrmeid silitavad\nmutid uusi teid rajavad\n\niga mees ihkab plahvatavalt karjatada\nnäidata hetkeks et ta on olemas\nja siis lahtuda hommikusse kastesse',
        translation: 'every man\'s dream is to sink into oblivion\n\nto close the eyes, to feel the soft soil\nto feel how worms nibble the flesh\ndevour the organs\n\nyou know your life succeeded when you find yourself decaying\nseeing a fragile body among spring birch branches\nfeeling how ants caress your nostrils\nmoles paving new paths\n\nevery man yearns to scream explosively\nto show for a moment that he exists\nand then dissolve into the morning dew',
        duration: 20000
    },
    {
        id: 'poem-estonian-3',
        text: 'mis on inimene\n\nkas plahvatus mis õhku paiskab\n    siidpehmet aroomi\n\nvõi komistus mis kukkudes jõuab veel\n    metsa hõigata läbilõikavat ulgu\n    \net siis kuuskedelt tagasi kajades\n      taevasse hajuda',
        translation: 'what is a human\n\nan explosion that flings into the air\n    silk-soft aroma\n\nor a stumble that while falling still manages\n    to howl a piercing cry into the forest\n    \nonly to then echo back from the spruces\n      and dissolve into the sky',
        duration: 15000
    },
    {
        id: 'poem-estonian-4',
        text: 'tuhmhalli pilvkatte all\nmööda läbivettinud poripruune murumättaid\nüle argipäevatolmust tahmunud vesiste kõnniteede\n\nsinu naeratuses\nõitsevad erkkollased nartsissid',
        translation: 'under the dull grey cloud cover\nalong the soaked mud-brown grass mounds\nover wet sidewalks stained with weekday dust\n\nin your smile\nbright yellow daffodils bloom',
        duration: 12000
    },
    {
        id: 'poem-estonian-5',
        text: 'laulmata laul on kõige puhtam laul\nargisus pole veel rikkunud ta rahu\n\nlaulmata laul on kõige hurmavam laul\ntema teadmatuse koopaid täidab kujutlusvõime meri\n\nta kumiseb aukartusest,\nolles ümbritsetud õrna tähendusrikkuse looriga\n\nsoojad pisarad voolavad ta allikast\nnagu kustunud leek, mille embus veel viivleb',
        translation: 'the unsung song is the purest song\nthe mundane has not yet disturbed its peace\n\nthe unsung song is the most enchanting song\nthe sea of imagination fills its caves of unknowing\n\nit hums with reverence,\nsurrounded by a veil of tender significance\n\nwarm tears flow from its spring\nlike an extinguished flame whose embrace still lingers',
        duration: 18000
    },
    {
        id: 'poem-estonian-6',
        text: 'tulen vargsi\nräsin su talu tormina\njättes maha räämas pilpad\nja hinge matvad neitsid\n\nmina olengi see\nkes ei vaata tagasi oma eluvalikuile\nkes paneb päikseprillid ette,\ntaamal tavad kokku varisemas\n\nolen iseenda jumal\noma saatuse kuningas\nja elutee pühak',
        translation: 'i come stealthily\nravage your farm like a storm\nleaving behind tattered clouds\nand soul-burying maidens\n\ni am the one\nwho doesn\'t look back at life choices\nwho puts on sunglasses,\nwhile heavens collapse behind\n\ni am my own god\nking of my fate\nand saint of my life\'s path',
        duration: 15000
    }
];


/**
 * CONFIGURATION
 */
const config = {
    // How often falling stars appear (in ms)
    fallingStarInterval: 60000,
    
    // Variance in falling star timing (random ± this value in ms)
    fallingStarVariance: 40000,
    
    // Number of ambient particles
    particleCount: 80,
    
    // Universe size - use viewport dimensions
    universeWidth: null,  // Set dynamically
    universeHeight: null  // Set dynamically
};


