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
        
        // Ethics branches
        {
            id: 'utilitarianism',
            label: 'UTILITARIANISM',
            type: 'concept',
            parent: 'root',
            description: 'The greatest good for the greatest number',
            tags: ['ethics', 'bentham', 'mill']
        },
        {
            id: 'consequentialism',
            label: 'CONSEQUENTIALISM',
            type: 'concept',
            parent: 'root',
            description: 'Judging actions by their outcomes and consequences',
            tags: ['ethics', 'outcomes', 'results']
        },
        {
            id: 'ea',
            label: 'EFFECTIVE ALTRUISM',
            type: 'movement',
            parent: 'root',
            description: 'Using evidence and careful reasoning to figure out the best ways of improving the world. Organized EA Tartu and EA Estonia from 2018 to 2023.',
            tags: ['altruism', 'evidence', 'impact', 'estonia']
        },
        {
            id: 'singer',
            label: 'PETER SINGER',
            type: 'thinker',
            parent: 'ea',
            description: 'Practical ethics, animal liberation, effective giving',
            tags: ['ethics', 'animals', 'poverty']
        },
        {
            id: 'macaskill',
            label: 'WILL MACASKILL',
            type: 'thinker',
            parent: 'ea',
            description: 'Longtermism, doing good better, moral philosophy',
            tags: ['longtermism', 'careers', 'impact']
        },
        {
            id: 'doing-good-better',
            label: 'DOING GOOD BETTER',
            type: 'book',
            parent: 'macaskill',
            description: 'William MacAskill\'s introduction to effective altruism',
            tags: ['introduction', 'careers', 'charity']
        },
        {
            id: 'ord',
            label: 'TOBY ORD',
            type: 'thinker',
            parent: 'ea',
            description: 'Existential risk, the precipice, long-term future of humanity',
            tags: ['x-risk', 'future', 'catastrophe']
        },
        {
            id: 'precipice',
            label: 'THE PRECIPICE',
            type: 'book',
            parent: 'ord',
            description: 'Toby Ord\'s book on existential risk and humanity\'s future',
            tags: ['x-risk', 'future', 'catastrophe']
        },
        
        // Longtermism branch
        {
            id: 'longtermism',
            label: 'LONGTERMISM',
            type: 'concept',
            parent: 'ea',
            description: 'Prioritizing the long-term future of humanity and sentient life',
            tags: ['future', 'x-risk', 'generations']
        },
        {
            id: 'ai-safety',
            label: 'AI SAFETY',
            type: 'concept',
            parent: 'longtermism',
            description: 'Ensuring advanced AI systems are aligned with human values',
            tags: ['alignment', 'x-risk', 'AGI']
        },
        {
            id: 'bostrom',
            label: 'NICK BOSTROM',
            type: 'thinker',
            parent: 'longtermism',
            description: 'Existential risk, superintelligence, simulation hypothesis',
            tags: ['x-risk', 'superintelligence', 'philosophy']
        },
        {
            id: 'superintelligence',
            label: 'SUPERINTELLIGENCE',
            type: 'book',
            parent: 'ai-safety',
            description: 'Paths, dangers, strategies for artificial general intelligence',
            tags: ['AGI', 'x-risk', 'control']
        },
        {
            id: 'alignment-problem',
            label: 'ALIGNMENT PROBLEM',
            type: 'concept',
            parent: 'ai-safety',
            description: 'The challenge of ensuring AI systems pursue intended goals',
            tags: ['alignment', 'control', 'values']
        },
        
        // Rationality branch
        {
            id: 'rationality',
            label: 'RATIONALITY',
            type: 'branch',
            parent: 'ea',
            description: 'The art of thinking clearly and making better decisions',
            tags: ['thinking', 'biases', 'reasoning']
        },
        {
            id: 'lesswrong',
            label: 'LESSWRONG',
            type: 'community',
            parent: 'rationality',
            description: 'Online forum for rationality, AI safety, and clear thinking',
            tags: ['community', 'blog', 'discussion']
        },
        {
            id: 'yudkowsky',
            label: 'YUDKOWSKY SEQUENCES',
            type: 'book',
            parent: 'rationality',
            description: 'Foundational essays on rationality, probability, and AI',
            tags: ['sequences', 'bayes', 'thinking']
        },
        {
            id: 'cfar',
            label: 'CFAR WORKSHOP',
            type: 'experience',
            parent: 'rationality',
            description: 'Center for Applied Rationality workshop attendance',
            tags: ['workshop', 'techniques', 'practice']
        },
        {
            id: 'post-rat',
            label: 'POST-RATIONALITY',
            type: 'concept',
            parent: 'rationality',
            description: 'TPOT scene, vibes-based epistemology, embodied cognition',
            tags: ['tpot', 'twitter', 'vibes', 'meta-rationality']
        },
        {
            id: 'practical-dharma',
            label: 'PRACTICAL DHARMA',
            type: 'concept',
            parent: 'post-rat',
            description: 'Modern, pragmatic approach to meditation and awakening',
            tags: ['dharma', 'awakening', 'pragmatic']
        },
        {
            id: 'phenomenology',
            label: 'PHENOMENOLOGY OF EXPERIENCE',
            type: 'concept',
            parent: 'post-rat',
            description: 'Direct investigation of conscious experience and qualia',
            tags: ['consciousness', 'experience', 'qualia', 'phenomenology']
        },
        
        // CFAR leads to cognitive science insights
        {
            id: 'kahneman',
            label: 'THINKING FAST AND SLOW',
            type: 'book',
            parent: 'cfar',
            description: 'Dual process theory, cognitive biases, behavioral economics',
            tags: ['psychology', 'biases', 'decisions']
        },
        {
            id: 's1-s2',
            label: 'SYSTEM 1 VS SYSTEM 2',
            type: 'concept',
            parent: 'cfar',
            description: 'Fast intuitive vs slow deliberative thinking',
            tags: ['cognition', 'thinking', 'dual-process']
        },
        {
            id: 'intuition',
            label: 'INTUITION',
            type: 'concept',
            parent: 's1-s2',
            description: 'Learning to use intuition for decision making and information processing',
            tags: ['gut-feeling', 'heuristics', 'tacit-knowledge']
        },
        
        // Work Experience - under AI Safety
        {
            id: 'control-ai',
            label: 'CONTROL AI',
            type: 'experience',
            parent: 'ai-safety',
            description: 'Activism-type targeted interventions to increase AI safety',
            tags: ['activism', 'ai-safety', 'intervention']
        },
        {
            id: 'pause-ai',
            label: 'PAUSE AI',
            type: 'experience',
            parent: 'ai-safety',
            description: 'Protests and volunteer movement to increase AI safety',
            tags: ['protests', 'movement', 'ai-safety']
        },
        {
            id: 'moj-estonia',
            label: 'MINISTRY OF JUSTICE',
            type: 'experience',
            parent: 'ai-safety',
            description: 'Internship working on EU AI Act implementation in Estonia',
            tags: ['policy', 'EU', 'regulation', 'estonia']
        },
        {
            id: 'convergence',
            label: 'CONVERGENCE ANALYSIS',
            type: 'experience',
            parent: 'ai-safety',
            description: 'Research assistant working on high-level AI policy strategy (until May 2024)',
            tags: ['research', 'policy', 'strategy', 'ai-governance']
        },
        
        // Vibes and Inner Work
        {
            id: 'emotions',
            label: 'VIBES',
            type: 'concept',
            parent: 'root',
            description: 'Listening to emotions more, being conscious of vibes',
            tags: ['feelings', 'intuition', 'awareness']
        },
        {
            id: 'jung',
            label: 'JUNGIAN THINKING',
            type: 'concept',
            parent: 'emotions',
            description: 'Archetypes, myths, stories as metaphors for the subconscious',
            tags: ['archetypes', 'unconscious', 'mythology']
        },
        {
            id: 'maps-of-meaning',
            label: 'MAPS OF MEANING',
            type: 'book',
            parent: 'jung',
            description: 'Peterson\'s lecture series on Jungian interpretation of stories and myths',
            tags: ['peterson', 'mythology', 'psychology', 'meaning']
        },
        {
            id: 'biblical-stories',
            label: 'BIBLICAL STORIES',
            type: 'book',
            parent: 'jung',
            description: 'Peterson\'s biblical series analyzing stories through Jungian lens',
            tags: ['peterson', 'bible', 'stories', 'psychology']
        },
        {
            id: 'dreams',
            label: 'DREAMS',
            type: 'concept',
            parent: 'emotions',
            description: 'Interest in dreams, lucid dreaming experiments',
            tags: ['lucid-dreaming', 'unconscious', 'exploration']
        },
        {
            id: 'the-garden',
            label: 'THE GARDEN',
            type: 'community',
            parent: 'emotions',
            description: 'Post-rat adjacent in-person community of tech-y hippies in Portugal - https://in.thegarden.pt/',
            tags: ['community', 'portugal', 'post-rat', 'hippies']
        },
        {
            id: 'music',
            label: 'MUSIC',
            type: 'art',
            parent: 'emotions',
            description: 'Musical exploration and expression',
            tags: ['expression', 'creativity', 'sound']
        },
        {
            id: 'poetry',
            label: 'POETRY',
            type: 'art',
            parent: 'emotions',
            description: 'Poetic expression and language play',
            tags: ['writing', 'expression', 'language']
        },
        
        // Meditation branch
        {
            id: 'meditation',
            label: 'MEDITATION',
            type: 'branch',
            parent: 'root',
            description: 'Contemplative practices and phenomenological exploration',
            tags: ['mindfulness', 'contemplation', 'practice']
        },
        {
            id: 'concentration',
            label: 'CONCENTRATION',
            type: 'practice',
            parent: 'meditation',
            description: 'Concentration practices, focus training',
            tags: ['samatha', 'focus', 'stability']
        },
        {
            id: 'waking-up',
            label: 'WAKING UP',
            type: 'resource',
            parent: 'meditation',
            description: 'Sam Harris\' Waking Up app',
            tags: ['app', 'guided', 'secular']
        },
        {
            id: 'vipassana',
            label: 'VIPASSANA',
            type: 'experience',
            parent: 'meditation',
            description: 'Goenka Vipassana courses (2020, 2023, 2024)',
            tags: ['retreat', 'goenka', 'insight']
        },
        {
            id: 'theravada',
            label: 'ESTONIAN SANGHA',
            type: 'community',
            parent: 'meditation',
            description: 'Estonian Theravada Sangha - https://www.sangha.ee/',
            tags: ['buddhism', 'community', 'estonia', 'sangha']
        },
        {
            id: 'burbea',
            label: 'ROB BURBEA',
            type: 'thinker',
            parent: 'practical-dharma',
            description: 'Emptiness, imaginal practice, seeing through views',
            tags: ['emptiness', 'imaginal', 'dharma']
        },
        {
            id: 'seeing-that-frees',
            label: 'SEEING THAT FREES',
            type: 'book',
            parent: 'practical-dharma',
            description: 'Rob Burbea\'s book on emptiness and liberation',
            tags: ['emptiness', 'liberation', 'practice']
        },
        {
            id: 'tmi',
            label: 'MIND ILLUMINATED',
            type: 'book',
            parent: 'practical-dharma',
            description: 'The Mind Illuminated - systematic meditation guide',
            tags: ['culadasa', 'stages', 'systematic']
        },
        {
            id: 'qri',
            label: 'QUALIA RESEARCH',
            type: 'organization',
            parent: 'phenomenology',
            description: 'Qualia Research Institute - consciousness research',
            tags: ['consciousness', 'phenomenology', 'valence']
        },
        {
            id: 'thisdell',
            label: 'ROGER THISDELL',
            type: 'thinker',
            parent: 'practical-dharma',
            description: 'Very transparent phenomenological descriptions',
            tags: ['phenomenology', 'clarity', 'maps']
        },
        {
            id: 'noting',
            label: 'NOTING PRACTICE',
            type: 'practice',
            parent: 'meditation',
            description: 'Noting and noticing, arising and passing of phenomena',
            tags: ['vipassana', 'awareness', 'impermanence']
        }
    ],
    
    connections: [
        // EA connections
        { from: 'utilitarianism', to: 'ea', strength: 0.9 },
        { from: 'consequentialism', to: 'ea', strength: 0.9 },
        { from: 'singer', to: 'utilitarianism', strength: 0.8 },
        { from: 'macaskill', to: 'ord', strength: 0.7 },
        
        // Longtermism and AI Safety connections
        { from: 'ea', to: 'longtermism', strength: 0.9 },
        { from: 'longtermism', to: 'ai-safety', strength: 0.9 },
        { from: 'bostrom', to: 'superintelligence', strength: 0.9 },
        { from: 'bostrom', to: 'ai-safety', strength: 0.8 },
        { from: 'macaskill', to: 'longtermism', strength: 0.9 },
        { from: 'ord', to: 'longtermism', strength: 0.8 },
        
        // Rationality connections
        { from: 'rationality', to: 'lesswrong', strength: 0.9 },
        { from: 'rationality', to: 'yudkowsky', strength: 0.9 },
        { from: 'rationality', to: 'cfar', strength: 0.8 },
        { from: 'yudkowsky', to: 'lesswrong', strength: 0.9 },
        
        // Rationality to AI Safety
        { from: 'rationality', to: 'ai-safety', strength: 0.8 },
        { from: 'lesswrong', to: 'ai-safety', strength: 0.8 },
        { from: 'yudkowsky', to: 'ai-safety', strength: 0.9 },
        
        // Cognitive Science connections
        { from: 'kahneman', to: 's1-s2', strength: 0.9 },
        { from: 'kahneman', to: 'rationality', strength: 0.8 },
        { from: 's1-s2', to: 'rationality', strength: 0.7 },
        { from: 's1-s2', to: 'cfar', strength: 0.8 },
        { from: 'kahneman', to: 'cfar', strength: 0.7 },
        { from: 's1-s2', to: 'intuition', strength: 0.9 },
        { from: 'intuition', to: 'cfar', strength: 0.7 },
        
        // Work experience connections
        { from: 'control-ai', to: 'pause-ai', strength: 0.7 },
        { from: 'moj-estonia', to: 'convergence', strength: 0.6 },
        
        // Vibes connections
        { from: 's1-s2', to: 'emotions', strength: 0.7 },
        { from: 'intuition', to: 'emotions', strength: 0.8 },
        { from: 'emotions', to: 'jung', strength: 0.9 },
        { from: 'emotions', to: 'dreams', strength: 0.8 },
        { from: 'jung', to: 'dreams', strength: 0.7 },
        { from: 'post-rat', to: 'the-garden', strength: 0.7 },
        { from: 'the-garden', to: 'emotions', strength: 0.8 },
        
        // Meditation connections
        { from: 'meditation', to: 'concentration', strength: 0.9 },
        { from: 'meditation', to: 'waking-up', strength: 0.7 },
        { from: 'meditation', to: 'vipassana', strength: 0.9 },
        { from: 'vipassana', to: 'theravada', strength: 0.7 },
        { from: 'meditation', to: 'noting', strength: 0.8 },
        { from: 'vipassana', to: 'noting', strength: 0.9 },
        
        // Practical Dharma connections
        { from: 'practical-dharma', to: 'burbea', strength: 0.9 },
        { from: 'practical-dharma', to: 'tmi', strength: 0.9 },
        { from: 'practical-dharma', to: 'thisdell', strength: 0.8 },
        { from: 'practical-dharma', to: 'seeing-that-frees', strength: 0.9 },
        { from: 'burbea', to: 'seeing-that-frees', strength: 0.9 },
        { from: 'burbea', to: 'thisdell', strength: 0.6 },
        { from: 'concentration', to: 'tmi', strength: 0.7 },
        { from: 'practical-dharma', to: 'meditation', strength: 0.7 },
        
        // Phenomenology connections
        { from: 'phenomenology', to: 'qri', strength: 0.9 },
        { from: 'qri', to: 'thisdell', strength: 0.7 },
        
        // Cross-connections
        { from: 'emotions', to: 'meditation', strength: 0.7 },
        { from: 'meditation', to: 'intuition', strength: 0.6 },
        { from: 'post-rat', to: 'emotions', strength: 0.8 },
        { from: 'post-rat', to: 'intuition', strength: 0.7 },
        { from: 'phenomenology', to: 'meditation', strength: 0.6 }
    ]
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