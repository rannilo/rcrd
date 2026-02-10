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
        color: 'rgba(100, 230, 140, 0.4)',
        x: 74,
        y: 30,
        size: 180,
        description: '',
        links: []
    },
    {
        id: 'meditation',
        name: 'Meditation',
        color: 'rgba(255, 220, 140, 0.45)',
        x: 62,
        y: 62,
        size: 300,
        description: '',
        links: []
    },
    {
        id: 'post-capitalism',
        name: 'Post-capitalism',
        color: 'rgba(255, 140, 180, 0.5)',
        x: 48,
        y: 20,
        size: 200,
        description: 'Curious about exploring different ways we could set up society such that it\'s beneficial for all beings.',
        links: []
    },
    {
        id: 'embodiment',
        name: 'Embodiment Practices',
        color: 'rgba(200, 160, 120, 0.45)',
        x: 50,
        y: 85,
        size: 180,
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
        x: 33,
        y: 21,
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
        x: 36,
        y: 27,
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
        id: 'eagx-prague',
        name: 'EAGxPrague',
        type: 'event',
        x: 17,
        y: 38,
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
        x: 15,
        y: 34,
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
        x: 42,
        y: 32,
        size: 9,
        color: '#a8d4ff',
        labelPosition: 'left',
        description: 'Attended a workshop by the Center for Applied Rationality near San Francisco.',
        image: null,
        links: [
            { text: 'rationality.org', url: 'https://rationality.org/' }
        ]
    },
    {
        id: 'peter-singer',
        name: 'Peter Singer',
        type: 'person',
        x: 29,
        y: 32,
        size: 10,
        color: '#a8d4ff',
        labelPosition: 'left',
        description: 'Moral philosopher. One of the intellectual roots of effective altruism. Author of Animal Liberation.',
        image: null,
        links: []
    },

    // ═══════════════════════════════════════════════════════════
    // AI Safety cloud (inside EA)
    // ═══════════════════════════════════════════════════════════
    {
        id: 'eliezer-yudkowsky',
        name: 'Eliezer Yudkowsky',
        type: 'person',
        x: 25,
        y: 51,
        size: 10,
        color: '#e0aaff',
        labelPosition: 'left',
        description: 'AI alignment researcher, writer, co-founder of MIRI. Loud about the risks.',
        image: null,
        links: [
            { text: '𝕏', url: 'https://x.com/ESYudkowsky' }
        ]
    },
    {
        id: 'convergence-analysis',
        name: 'Convergence Analysis',
        type: 'organization',
        x: 26,
        y: 59,
        size: 8,
        color: '#e0aaff',
        description: 'An AI safety company building safer AI systems.',
        image: null,
        links: [
            { text: 'convergenceanalysis.org', url: 'https://convergenceanalysis.org/' }
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // Intersection of EA & TPOT
    // ═══════════════════════════════════════════════════════════
    {
        id: 'kiezburn',
        name: 'KiezBurn',
        type: 'event',
        x: 57,
        y: 26,
        size: 9,
        color: '#ffb08a',
        labelPosition: 'bottom',
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
        y: 31,
        size: 10,
        color: '#ffb08a',
        labelPosition: 'bottom',
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
        name: 'Carl Jung',
        type: 'concept',
        x: 69,
        y: 46,
        size: 9,
        color: '#8ce0a0',
        description: 'Anything related to archetypes, dreams, the subconscious, shadow, myths, folklore, including religious stories is interesting. It relates to the quest of understanding yourself, developing yourself, and understanding others and humans as a whole.',
        image: null,
        links: []
    },
    {
        id: 'runosongs',
        name: 'Runosongs',
        type: 'tradition',
        x: 88,
        y: 16,
        size: 8,
        color: '#8ce0a0',
        description: 'An unusual way of singing that turns common ideologies on their head. Songs are repetitive, cyclical, long—the lead singer sings and everyone else repeats. Instead of "pop star admiration" you get collective breathing, until you almost meld into the collective voice.',
        image: null,
        links: [
            { text: 'see example', url: 'https://arhiiv.err.ee/video/vaata/folklooriansambel-hellero' }
        ]
    },
    {
        id: 'mythology',
        name: 'Mythology',
        type: 'concept',
        x: 77,
        y: 21,
        size: 8,
        color: '#8ce0a0',
        description: 'The stories cultures tell to make sense of the world. Creation, destruction, transformation—the same patterns everywhere.',
        image: null,
        links: []
    },
    {
        id: 'fairy-tales',
        name: 'Fairy Tales',
        type: 'concept',
        x: 80,
        y: 30,
        size: 7,
        color: '#8ce0a0',
        labelPosition: 'bottom',
        description: 'Not just for children. Encoded wisdom about navigating the dark forest, facing the shadow, and finding your way home.',
        image: null,
        links: []
    },

    // ═══════════════════════════════════════════════════════════
    // Meditation cloud
    // ═══════════════════════════════════════════════════════════
    {
        id: 'vipassana',
        name: 'Vipassanā',
        type: 'practice',
        x: 63,
        y: 79,
        size: 11,
        color: '#ffe4a0',
        description: 'Insight meditation. Attended several S. N. Goenka retreats—10-day silent courses of rigorous self-observation. Intense and transformative.',
        image: null,
        links: [
            { text: 'dhamma.org', url: 'https://www.dhamma.org/en-US/index' }
        ]
    },
    {
        id: 'jhanas',
        name: 'Jhānas',
        type: 'practice',
        x: 66,
        y: 66,
        size: 9,
        color: '#ffe4a0',
        description: 'Deep meditative absorption states. Concentration deepens through stages of rapture, bliss, contentment, and equanimity. A technology for exploring the nature of mind.',
        image: null,
        links: []
    },
    {
        id: 'brahma-viharas',
        name: 'Brahmavihāras',
        type: 'practice',
        x: 71,
        y: 74,
        size: 8,
        color: '#ffe4a0',
        description: 'The four sublime abodes—mettā (loving-kindness), karuṇā (compassion), muditā (sympathetic joy), and upekkhā (equanimity). Heart practices.',
        image: null,
        links: []
    },
    {
        id: 'rob-burbea',
        name: 'Rob Burbea',
        type: 'teacher',
        x: 58,
        y: 69,
        size: 9,
        color: '#ffe4a0',
        description: 'A beloved meditation teacher who explored the jhānas, soulmaking, and the imaginal in dharma practice. Taught at Gaia House.',
        image: null,
        links: [
            { text: 'robburbea.com', url: 'https://www.robburbea.com/' }
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // Intersection of TPOT & Meditation
    // ═══════════════════════════════════════════════════════════
    {
        id: 'qri',
        name: 'QRI',
        type: 'organization',
        x: 49,
        y: 57,
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
        x: 71,
        y: 57,
        size: 7,
        color: '#ffd0a0',
        description: 'A meditation technique where you note your experience, either verbally in your head or nonverbally. Helps discern more and more subtle experiences.',
        image: null,
        links: []
    },

    // ═══════════════════════════════════════════════════════════
    // Post-capitalism cloud (near TPOT)
    // ═══════════════════════════════════════════════════════════
    {
        id: 'mark-fisher',
        name: 'Mark Fisher',
        type: 'person',
        x: 48,
        y: 13,
        size: 10,
        color: '#ffb8d0',
        description: 'Cultural theorist and writer. Explored hauntology, the eerie, and the failures of neoliberalism. Author of Capitalist Realism.',
        image: null,
        links: []
    },
    {
        id: 'postcapitalist-desire',
        name: 'Postcapitalist Desire',
        type: 'book',
        x: 45,
        y: 6,
        size: 8,
        color: '#ffb8d0',
        description: 'Posthumous collection of Mark Fisher\'s lectures on what lies beyond capitalism.',
        image: null,
        links: []
    },
    {
        id: 'dhammic-socialism',
        name: 'Dhammic Socialism',
        type: 'book',
        x: 57,
        y: 5,
        size: 7,
        color: '#ffb8d0',
        description: 'Buddhadasa Bhikkhu\'s vision of a society guided by dhamma—nature, truth, duty—rather than greed.',
        image: null,
        links: []
    },

    // ═══════════════════════════════════════════════════════════
    // Embodiment Practices cloud (near Meditation)
    // ═══════════════════════════════════════════════════════════
    {
        id: 'jiu-jitsu',
        name: 'Jiu-jitsu',
        type: 'practice',
        x: 43,
        y: 77,
        size: 9,
        color: '#d4c4a0',
        description: 'The gentle art. Learning to move, grapple, and be fully present in the body.',
        image: null,
        links: []
    },
    {
        id: 'qigong',
        name: 'Qigong',
        type: 'practice',
        x: 55,
        y: 78,
        size: 8,
        color: '#d4c4a0',
        labelPosition: 'bottom',
        description: 'Ancient Chinese movement practice. Cultivating and balancing life energy through slow, intentional forms.',
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
        y: 72,
        size: 9,
        description: 'Self-explanatory. I wanna dive into retreats for 2 years and see what happens.',
        links: []
    },

    // ═══════════════════════════════════════════════════════════
    // Meditation (close to intersection)
    // ═══════════════════════════════════════════════════════════
    {
        id: 'curiosity-gaia-house',
        name: 'Gaia House',
        type: 'curiosity',
        x: 60,
        y: 66,
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
        x: 62,
        y: 54,
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
        x: 54,
        y: 38,
        size: 8,
        description: 'A co-living / event space with post-rationalist / TPOT roots.',
        links: []
    },
    {
        id: 'curiosity-vibecamp',
        name: 'Vibecamp',
        type: 'curiosity',
        x: 58,
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
        x: 44,
        y: 42,
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
        x: 60,
        y: 56,
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
        x: 88,
        y: 24,
        size: 8,
        description: 'This has been explained to me as a borderline religious experience, if done correctly.',
        links: [
            { text: 'watch', url: 'https://www.youtube.com/watch?v=8Yq9Fej3xGo' }
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // TPOT / Burning Man overlap
    // ═══════════════════════════════════════════════════════════
    {
        id: 'curiosity-nowhere',
        name: 'Nowhere',
        type: 'event',
        x: 56,
        y: 42,
        size: 8,
        description: 'A Burning Man event in Spain.',
        links: [
            { text: 'goingnowhere.org', url: 'https://www.goingnowhere.org/' }
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // Meditation curiosity
    // ═══════════════════════════════════════════════════════════
    {
        id: 'curiosity-suan-mokh',
        name: 'Suan Mokh',
        type: 'curiosity',
        x: 66,
        y: 76,
        size: 8,
        description: 'A forest monastery in southern Thailand founded by Buddhadasa Bhikkhu. Runs 10-day silent retreats.',
        links: [
            { text: 'suanmokkh.org', url: 'https://www.suanmokkh.org/' }
        ]
    },
    {
        id: 'curiosity-new-social-face-buddhism',
        name: 'The New Social Face of Buddhism',
        type: 'book',
        x: 50,
        y: 68,
        size: 7,
        description: 'By Ken Jones. Exploring engaged Buddhism and its relationship to social change.',
        links: []
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
 * BLACK HOLE — Hidden portal to manifesto
 */
const blackHole = {
    x: 46,
    y: 50,
    size: 16
};


/**
 * CONFIGURATION
 */
const config = {
    // How often falling stars appear (in ms)
    fallingStarInterval: 150000,

    // Variance in falling star timing (random ± this value in ms)
    fallingStarVariance: 90000,

    // Number of ambient particles
    particleCount: 80,

    // Universe size - use viewport dimensions
    universeWidth: null,  // Set dynamically
    universeHeight: null  // Set dynamically
};
