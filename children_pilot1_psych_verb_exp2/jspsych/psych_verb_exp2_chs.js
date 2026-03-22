// ════════════════════════════════════════════════════════════════════
//  PSYCH VERB EXP 2 — CHS jsPsych version
//
//  Paste the contents of this file directly into the
//  "jsPsych Experiment Code" editor on childrenhelpingscience.com.
//
//  Scenarios: physical_shock / physical_hurt  |  mental_shock / mental_hurt
//  8 counterbalancing conditions:
//    domain (physical first | mental first)
//    × scenario order within domain (shock first | hurt first)
//    × question order (lexical first | caused first)
//
//  Each scenario: test_case_intro → scenario video → 2 questions
//  Each question: question video + distal/proximal choice images simultaneously
// ════════════════════════════════════════════════════════════════════


// ── Inject CSS ──────────────────────────────────────────────────────
const _style = document.createElement('style');
_style.textContent = `
    .jspsych-content-wrapper {
        width: 100% !important;
        max-width: 100% !important;
        padding: 0 !important;
    }
    .jspsych-content {
        max-width: 98% !important;
        width: 98% !important;
        margin: 0 auto !important;
    }
    .trial-video {
        display: block;
        width: 100%;
        max-height: 70vh;
        margin: 0 auto;
        object-fit: contain;
    }
    #jspsych-html-button-response-btngroup {
        display: flex;
        justify-content: center;
        gap: 65px;
        margin-top: 8px;
    }
    .image-choice-btn {
        border: 3px solid #ccc !important;
        background: none !important;
        padding: 4px !important;
        border-radius: 10px !important;
        cursor: pointer !important;
        outline: none !important;
        transition: border-color 0.15s, transform 0.1s !important;
    }
    .image-choice-btn:hover:not(:disabled) {
        border-color: #4a90d9 !important;
        transform: scale(1.05) !important;
    }
    .image-choice-btn:disabled { cursor: default !important; }
    .choice-img {
        height: 20vh;
        max-width: 35vw;
        width: auto;
        object-fit: contain;
        display: block;
        pointer-events: none;
    }
    .continue-btn-group {
        position: fixed !important;
        bottom: 24px !important;
        right: 28px !important;
        margin: 0 !important;
        justify-content: flex-end !important;
    }
    .continue-btn-group .jspsych-btn {
        font-size: 1.3em !important;
        padding: 14px 44px !important;
    }
    .instructions-box {
        max-width: 680px;
        margin: 30px auto;
        font-size: 1.1em;
        line-height: 1.7;
        text-align: left;
    }
    .instructions-box h2 { margin-bottom: 10px; }
    .instructions-box ul  { padding-left: 1.4em; }
`;
document.head.appendChild(_style);


// ════════════════════════════════════════════════════════════════════
//  CONFIG
// ════════════════════════════════════════════════════════════════════

const BASE = 'https://raw.githubusercontent.com/CSLouise/lookit_material/master/children_pilot1_psych_verb_exp2/';
const IMG  = src => BASE + 'response_images/' + src;
const VID  = src => BASE + 'mp4/' + src + '.mp4';

// Derive question type from video name
// e.g. 'physical_shock_lexical' → 'lexical'
function qtype(videoName) {
    return videoName.split('_').pop();   // last token: 'lexical' or 'caused'
}


// ════════════════════════════════════════════════════════════════════
//  COUNTERBALANCING CONDITIONS  (8 total)
//
//  Conditions vary along 3 axes:
//    1. domain order:      physical first (0–3) | mental first (4–7)
//    2. scenario order:    shock first | hurt first
//    3. question order:    lexical first | caused first
// ════════════════════════════════════════════════════════════════════

const CONDITIONS = [

    // ── Cond 0: physical first | shock first | lexical first ──────────
    [
        { scenario: 'physical_shock_scenario',
          questions: [
            { video: 'physical_shock_lexical', distal: 'shock_physical_distal.png', proximal: 'shock_physical_proximal.png' },
            { video: 'physical_shock_caused',  distal: 'shock_physical_distal.png', proximal: 'shock_physical_proximal.png' }
          ]
        },
        { scenario: 'physical_hurt_scenario',
          questions: [
            { video: 'physical_hurt_lexical',  distal: 'hurt_physical_distal.png',  proximal: 'hurt_physical_proximal.png'  },
            { video: 'physical_hurt_caused',   distal: 'hurt_physical_distal.png',  proximal: 'hurt_physical_proximal.png'  }
          ]
        }
    ],

    // ── Cond 1: physical first | shock first | caused first ───────────
    [
        { scenario: 'physical_shock_scenario',
          questions: [
            { video: 'physical_shock_caused',  distal: 'shock_physical_distal.png', proximal: 'shock_physical_proximal.png' },
            { video: 'physical_shock_lexical', distal: 'shock_physical_distal.png', proximal: 'shock_physical_proximal.png' }
          ]
        },
        { scenario: 'physical_hurt_scenario',
          questions: [
            { video: 'physical_hurt_caused',   distal: 'hurt_physical_distal.png',  proximal: 'hurt_physical_proximal.png'  },
            { video: 'physical_hurt_lexical',  distal: 'hurt_physical_distal.png',  proximal: 'hurt_physical_proximal.png'  }
          ]
        }
    ],

    // ── Cond 2: physical first | hurt first | lexical first ───────────
    [
        { scenario: 'physical_hurt_scenario',
          questions: [
            { video: 'physical_hurt_lexical',  distal: 'hurt_physical_distal.png',  proximal: 'hurt_physical_proximal.png'  },
            { video: 'physical_hurt_caused',   distal: 'hurt_physical_distal.png',  proximal: 'hurt_physical_proximal.png'  }
          ]
        },
        { scenario: 'physical_shock_scenario',
          questions: [
            { video: 'physical_shock_lexical', distal: 'shock_physical_distal.png', proximal: 'shock_physical_proximal.png' },
            { video: 'physical_shock_caused',  distal: 'shock_physical_distal.png', proximal: 'shock_physical_proximal.png' }
          ]
        }
    ],

    // ── Cond 3: physical first | hurt first | caused first ────────────
    [
        { scenario: 'physical_hurt_scenario',
          questions: [
            { video: 'physical_hurt_caused',   distal: 'hurt_physical_distal.png',  proximal: 'hurt_physical_proximal.png'  },
            { video: 'physical_hurt_lexical',  distal: 'hurt_physical_distal.png',  proximal: 'hurt_physical_proximal.png'  }
          ]
        },
        { scenario: 'physical_shock_scenario',
          questions: [
            { video: 'physical_shock_caused',  distal: 'shock_physical_distal.png', proximal: 'shock_physical_proximal.png' },
            { video: 'physical_shock_lexical', distal: 'shock_physical_distal.png', proximal: 'shock_physical_proximal.png' }
          ]
        }
    ],

    // ── Cond 4: mental first | shock first | lexical first ────────────
    [
        { scenario: 'mental_shock_scenario',
          questions: [
            { video: 'mental_shock_lexical',   distal: 'shock_mental_distal.png',   proximal: 'shock_mental_proximal.png'   },
            { video: 'mental_shock_caused',    distal: 'shock_mental_distal.png',   proximal: 'shock_mental_proximal.png'   }
          ]
        },
        { scenario: 'mental_hurt_scenario',
          questions: [
            { video: 'mental_hurt_lexical',    distal: 'hurt_mental_distal.png',    proximal: 'hurt_mental_proximal.png'    },
            { video: 'mental_hurt_caused',     distal: 'hurt_mental_distal.png',    proximal: 'hurt_mental_proximal.png'    }
          ]
        }
    ],

    // ── Cond 5: mental first | shock first | caused first ─────────────
    [
        { scenario: 'mental_shock_scenario',
          questions: [
            { video: 'mental_shock_caused',    distal: 'shock_mental_distal.png',   proximal: 'shock_mental_proximal.png'   },
            { video: 'mental_shock_lexical',   distal: 'shock_mental_distal.png',   proximal: 'shock_mental_proximal.png'   }
          ]
        },
        { scenario: 'mental_hurt_scenario',
          questions: [
            { video: 'mental_hurt_caused',     distal: 'hurt_mental_distal.png',    proximal: 'hurt_mental_proximal.png'    },
            { video: 'mental_hurt_lexical',    distal: 'hurt_mental_distal.png',    proximal: 'hurt_mental_proximal.png'    }
          ]
        }
    ],

    // ── Cond 6: mental first | hurt first | lexical first ─────────────
    [
        { scenario: 'mental_hurt_scenario',
          questions: [
            { video: 'mental_hurt_lexical',    distal: 'hurt_mental_distal.png',    proximal: 'hurt_mental_proximal.png'    },
            { video: 'mental_hurt_caused',     distal: 'hurt_mental_distal.png',    proximal: 'hurt_mental_proximal.png'    }
          ]
        },
        { scenario: 'mental_shock_scenario',
          questions: [
            { video: 'mental_shock_lexical',   distal: 'shock_mental_distal.png',   proximal: 'shock_mental_proximal.png'   },
            { video: 'mental_shock_caused',    distal: 'shock_mental_distal.png',   proximal: 'shock_mental_proximal.png'   }
          ]
        }
    ],

    // ── Cond 7: mental first | hurt first | caused first ──────────────
    [
        { scenario: 'mental_hurt_scenario',
          questions: [
            { video: 'mental_hurt_caused',     distal: 'hurt_mental_distal.png',    proximal: 'hurt_mental_proximal.png'    },
            { video: 'mental_hurt_lexical',    distal: 'hurt_mental_distal.png',    proximal: 'hurt_mental_proximal.png'    }
          ]
        },
        { scenario: 'mental_shock_scenario',
          questions: [
            { video: 'mental_shock_caused',    distal: 'shock_mental_distal.png',   proximal: 'shock_mental_proximal.png'   },
            { video: 'mental_shock_lexical',   distal: 'shock_mental_distal.png',   proximal: 'shock_mental_proximal.png'   }
          ]
        }
    ]
];


// ════════════════════════════════════════════════════════════════════
//  INIT jsPsych
// ════════════════════════════════════════════════════════════════════

const jsPsych = initJsPsych();

const conditionIndex = Math.floor(Math.random() * CONDITIONS.length);
const condition      = CONDITIONS[conditionIndex];


// ════════════════════════════════════════════════════════════════════
//  TRIAL BUILDERS
// ════════════════════════════════════════════════════════════════════

function videoTrial(videoName, trialType) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `<video id="trial-video" class="trial-video"
                         src="${VID(videoName)}" autoplay playsinline></video>`,
        choices: ['Continue ▶'],
        on_load: function () {
            const group = document.getElementById('jspsych-html-button-response-btngroup');
            if (group) group.classList.add('continue-btn-group');
            const btn = group && group.querySelector('button');
            if (btn) {
                btn.disabled = true;
                document.getElementById('trial-video').addEventListener('ended', () => {
                    btn.disabled = false;
                });
                setTimeout(() => { btn.disabled = false; }, 300_000);
            }
        },
        data: { trial_type: trialType, video: videoName, condition: conditionIndex }
    };
}

function questionTrial({ videoName, leftImgSrc, rightImgSrc, questionType, scenarioId }) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `<video id="q-audio" src="${VID(videoName)}"
                         class="trial-video" autoplay playsinline></video>`,
        choices: [
            `<img src="${leftImgSrc}"  class="choice-img" alt="distal">`,
            `<img src="${rightImgSrc}" class="choice-img" alt="proximal">`
        ],
        on_load: function () {
            const group = document.getElementById('jspsych-html-button-response-btngroup');
            if (group) {
                group.querySelectorAll('button').forEach(b => b.classList.add('image-choice-btn'));
            }
        },
        data: {
            trial_type:  questionType,
            scenario:    scenarioId,
            condition:   conditionIndex,
            left_label:  'distal',
            right_label: 'proximal',
            video:       videoName
        },
        response_ends_trial: true
    };
}


// ════════════════════════════════════════════════════════════════════
//  BUILD SCENARIO TIMELINE
// ════════════════════════════════════════════════════════════════════

function buildScenarioTimeline(scenarioData, scenarioId) {
    const trials = [
        videoTrial('test_case_intro',     'intro'),
        videoTrial(scenarioData.scenario, 'scenario')
    ];
    for (const q of scenarioData.questions) {
        trials.push(questionTrial({
            videoName:    q.video,
            leftImgSrc:   IMG(q.distal),
            rightImgSrc:  IMG(q.proximal),
            questionType: qtype(q.video),
            scenarioId
        }));
    }
    return trials;
}


// ════════════════════════════════════════════════════════════════════
//  WARMUP TIMELINE
// ════════════════════════════════════════════════════════════════════

const warmupTimeline = [
    questionTrial({ videoName: 'warmup_part1_bird_question', leftImgSrc: IMG('bird.png'), rightImgSrc: IMG('cat.png'),  questionType: 'warmup', scenarioId: 'warmup' }),
    questionTrial({ videoName: 'warmup_part2_fish_question', leftImgSrc: IMG('pig.png'),  rightImgSrc: IMG('fish.png'), questionType: 'warmup', scenarioId: 'warmup' }),
    videoTrial('warmup_finish', 'warmup_video')
];


// ════════════════════════════════════════════════════════════════════
//  CHS-SPECIFIC FRAMES
// ════════════════════════════════════════════════════════════════════

const video_config = { type: chsRecord.VideoConfigPlugin };

const video_consent = {
    type: chsRecord.VideoConsentPlugin,
    PIName:      'Ellen Markman',
    institution: 'The Markman Lab of Stanford University',
    PIContact:   'Ellen Markman at markman@stanford.edu',
    purpose:     'This study is about how children understand causal and psychological verbs.',
    procedures:  'Your child will watch short videos and answer questions by clicking on pictures on the screen.',
    risk_statement: 'There are no expected risks to participation.',
    payment:     'After you finish the study, we will email you a $5 Amazon gift card within approximately 3–5 business days.',
    include_databrary: true
};

const instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
        <div class="instructions-box">
            <h2>Overview</h2>
            <ul>
                <li>The study takes about 5–8 minutes.</li>
                <li>Your child will watch short videos and answer questions by clicking on pictures.</li>
                <li>There are no right or wrong answers.</li>
            </ul>
            <p><strong>For parents:</strong> Please help keep your child's attention,
               but don't tell them which answer to choose.</p>
        </div>`,
    choices: ['Start ▶'],
    data: { trial_type: 'instructions' }
};

const start_recording = { type: chsRecord.StartRecordPlugin };
const stop_recording  = { type: chsRecord.StopRecordPlugin  };


// ════════════════════════════════════════════════════════════════════
//  RUN THE EXPERIMENT
// ════════════════════════════════════════════════════════════════════

jsPsych.run([
    { type: jsPsychFullscreen, fullscreen_mode: true },
    video_config,
    video_consent,
    instructions,

    start_recording,
    videoTrial('overall_study_intro', 'intro_video'),

    ...warmupTimeline,

    ...buildScenarioTimeline(condition[0], 'scenario_1'),
    ...buildScenarioTimeline(condition[1], 'scenario_2'),

    videoTrial('overall_study_end', 'end_video'),
    stop_recording,
    { type: jsPsychFullscreen, fullscreen_mode: false, delay_after: 0 },
    { type: chsSurvey.ExitSurveyPlugin }
]);
