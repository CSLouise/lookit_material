// ════════════════════════════════════════════════════════════════════
//  PUNISHMENT STUDY — CHS jsPsych version
//
//  Paste the contents of this file directly into the
//  "jsPsych Experiment Code" editor on childrenhelpingscience.com.
//
//  CHS automatically loads all standard jsPsych v8 plugins and these
//  custom packages:
//    chsRecord  — VideoConfigPlugin, VideoConsentPlugin,
//                 StartRecordPlugin, StopRecordPlugin, TrialRecordExtension
//    chsSurvey  — ExitSurveyPlugin
// ════════════════════════════════════════════════════════════════════


// ── Inject CSS (CHS provides the HTML page; we inject styles at runtime) ──
const _style = document.createElement('style');
_style.textContent = `
    /* Override jsPsych content width to use more of the screen */
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

    /* All full-screen videos (scenario, intro, warmup, question) */
    .trial-video {
        display: block;
        width: 100%;
        max-height:70vh;
        margin: 0 auto;
        object-fit: contain;
    }

    /* Choice buttons row */
    #jspsych-html-button-response-btngroup {
        display: flex;
        justify-content: center;
        gap: 65px;
        margin-top: 8px;
    }

    /* Image choice buttons (applied via on_load in questionTrial) */
    .image-choice-btn {
        border: 3px solid #ccc !important;
        background: none !important;
        padding: 4px !important;
        border-radius: 10px !important;
        cursor: pointer !important;
        outline: none !important;
        transition: border-color 0.15s, transform 0.1s !important;
        /* Fixed uniform size so all buttons are the same box */
        width: 22vh !important;
        height: 22vh !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
    }
    .image-choice-btn:hover:not(:disabled) {
        border-color: #4a90d9 !important;
        transform: scale(1.05) !important;
    }
    .image-choice-btn:disabled { cursor: default !important; }
    .choice-img {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        object-fit: contain;
        display: block;
        pointer-events: none;
    }

    /* Continue button: larger, fixed to bottom-right corner */
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

    /* Instructions */
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

const BASE = 'https://cdn.jsdelivr.net/gh/CSLouise/lookit_material@master/children_pilot1_exp1mats_with_punish/';
const IMG  = src => BASE + 'img/' + src;
const VID  = src => BASE + 'mp4/' + src + '.mp4';

// Extract a short label from an image filename for data logging
// e.g. 'boy_bike_case_suzy.png' → 'suzy',  'yes.png' → 'yes'
function lbl(src) {
    return src.replace(/.*\//, '').replace('.png', '').split('_').pop();
}


// ════════════════════════════════════════════════════════════════════
//  COUNTERBALANCING CONDITIONS
//
//  4 conditions: gender_order (1 or 2) × question_order
//                (break/crack first  OR  caused first)
//
//  Each condition defines 2 scenarios, each with 5 questions:
//    Q1/Q2: break|crack vs caused  (order varies by condition)
//    Q3:    fault
//    Q4:    should_punish  →  yes.png (left) / no.png (right)
//    Q5:    who_punish     →  shown ONLY if Q4 answer = "yes" (response 0)
// ════════════════════════════════════════════════════════════════════

const CONDITIONS = [

    // ── Condition 0: gender_order1, break/crack first ─────────────────
    [
        {   // Scenario 1 – boy on bike (fence)
            intro:    'test_case_intro',
            scenario: 'fence_scenario_boy_bike',
            questions: [
                { video: 'fence_scenario_boy_bike_break_question',         img: 'gender_order1/fence_scenario_boy_bike_break_question.png',         left: 'boy_bike_case_andy.png',  right: 'boy_bike_case_suzy.png',  type: 'break'         },
                { video: 'fence_scenario_boy_bike_caused_question',        img: 'gender_order1/fence_scenario_boy_bike_caused_question.png',        left: 'boy_bike_case_andy.png',  right: 'boy_bike_case_suzy.png',  type: 'caused'        },
                { video: 'fence_scenario_boy_bike_fault_question',         img: 'gender_order1/fence_scenario_boy_bike_fault_question.png',         left: 'boy_bike_case_andy.png',  right: 'boy_bike_case_suzy.png',  type: 'fault'         },
                { video: 'fence_scenario_boy_bike_should_punish_question', img: 'gender_order1/fence_scenario_boy_bike_should_punish_question.png', left: 'yes.png',                 right: 'no.png',                  type: 'should_punish' },
                { video: 'fence_scenario_boy_bike_who_punish_question',    img: 'gender_order1/fence_scenario_boy_bike_who_punish_question.png',    left: 'boy_bike_case_andy.png',  right: 'boy_bike_case_suzy.png',  type: 'who_punish'    }
            ]
        },
        {   // Scenario 2 – girl on chair (mirror)
            intro:    'test_case_intro',
            scenario: 'mirror_scenario_girl_chair',
            questions: [
                { video: 'mirror_scenario_girl_chair_crack_question',         img: 'gender_order1/mirror_scenario_girl_chair_crack_question.png',         left: 'girl_chair_case_sophia.png', right: 'girl_chair_case_bobby.png', type: 'crack'         },
                { video: 'mirror_scenario_girl_chair_caused_question',        img: 'gender_order1/mirror_scenario_girl_chair_caused_question.png',        left: 'girl_chair_case_sophia.png', right: 'girl_chair_case_bobby.png', type: 'caused'        },
                { video: 'mirror_scenario_girl_chair_fault_question',         img: 'gender_order1/mirror_scenario_girl_chair_fault_question.png',         left: 'girl_chair_case_sophia.png', right: 'girl_chair_case_bobby.png', type: 'fault'         },
                { video: 'mirror_scenario_girl_chair_should_punish_question', img: 'gender_order1/mirror_scenario_girl_chair_should_punish_question.png', left: 'yes.png',                    right: 'no.png',                    type: 'should_punish' },
                { video: 'mirror_scenario_girl_chair_who_punish_question',    img: 'gender_order1/mirror_scenario_girl_chair_who_punish_question.png',    left: 'girl_chair_case_sophia.png', right: 'girl_chair_case_bobby.png', type: 'who_punish'    }
            ]
        }
    ],

    // ── Condition 1: gender_order1, caused first ───────────────────────
    [
        {
            intro:    'test_case_intro',
            scenario: 'fence_scenario_boy_bike',
            questions: [
                { video: 'fence_scenario_boy_bike_caused_question',        img: 'gender_order1/fence_scenario_boy_bike_caused_question.png',        left: 'boy_bike_case_andy.png',  right: 'boy_bike_case_suzy.png',  type: 'caused'        },
                { video: 'fence_scenario_boy_bike_break_question',         img: 'gender_order1/fence_scenario_boy_bike_break_question.png',         left: 'boy_bike_case_andy.png',  right: 'boy_bike_case_suzy.png',  type: 'break'         },
                { video: 'fence_scenario_boy_bike_fault_question',         img: 'gender_order1/fence_scenario_boy_bike_fault_question.png',         left: 'boy_bike_case_andy.png',  right: 'boy_bike_case_suzy.png',  type: 'fault'         },
                { video: 'fence_scenario_boy_bike_should_punish_question', img: 'gender_order1/fence_scenario_boy_bike_should_punish_question.png', left: 'yes.png',                 right: 'no.png',                  type: 'should_punish' },
                { video: 'fence_scenario_boy_bike_who_punish_question',    img: 'gender_order1/fence_scenario_boy_bike_who_punish_question.png',    left: 'boy_bike_case_andy.png',  right: 'boy_bike_case_suzy.png',  type: 'who_punish'    }
            ]
        },
        {
            intro:    'test_case_intro',
            scenario: 'mirror_scenario_girl_chair',
            questions: [
                { video: 'mirror_scenario_girl_chair_caused_question',        img: 'gender_order1/mirror_scenario_girl_chair_caused_question.png',        left: 'girl_chair_case_sophia.png', right: 'girl_chair_case_bobby.png', type: 'caused'        },
                { video: 'mirror_scenario_girl_chair_crack_question',         img: 'gender_order1/mirror_scenario_girl_chair_crack_question.png',         left: 'girl_chair_case_sophia.png', right: 'girl_chair_case_bobby.png', type: 'crack'         },
                { video: 'mirror_scenario_girl_chair_fault_question',         img: 'gender_order1/mirror_scenario_girl_chair_fault_question.png',         left: 'girl_chair_case_sophia.png', right: 'girl_chair_case_bobby.png', type: 'fault'         },
                { video: 'mirror_scenario_girl_chair_should_punish_question', img: 'gender_order1/mirror_scenario_girl_chair_should_punish_question.png', left: 'yes.png',                    right: 'no.png',                    type: 'should_punish' },
                { video: 'mirror_scenario_girl_chair_who_punish_question',    img: 'gender_order1/mirror_scenario_girl_chair_who_punish_question.png',    left: 'girl_chair_case_sophia.png', right: 'girl_chair_case_bobby.png', type: 'who_punish'    }
            ]
        }
    ],

    // ── Condition 2: gender_order2, break/crack first ─────────────────
    // NOTE: for girl_bike fence, video = 'fence_scenario_girl_bike_cause_question'
    //       (no 'd') but the .png = 'fence_scenario_girl_bike_caused_question.png' (with 'd').
    [
        {
            intro:    'test_case_intro',
            scenario: 'fence_scenario_girl_bike',
            questions: [
                { video: 'fence_scenario_girl_bike_break_question',         img: 'gender_order2/fence_scenario_girl_bike_break_question.png',         left: 'girl_bike_case_suzy.png', right: 'girl_bike_case_andy.png', type: 'break'         },
                { video: 'fence_scenario_girl_bike_cause_question',         img: 'gender_order2/fence_scenario_girl_bike_caused_question.png',        left: 'girl_bike_case_suzy.png', right: 'girl_bike_case_andy.png', type: 'caused'        },
                { video: 'fence_scenario_girl_bike_fault_question',         img: 'gender_order2/fence_scenario_girl_bike_fault_question.png',         left: 'girl_bike_case_suzy.png', right: 'girl_bike_case_andy.png', type: 'fault'         },
                { video: 'fence_scenario_girl_bike_should_punish_question', img: 'gender_order2/fence_scenario_girl_bike_should_punish_question.png', left: 'yes.png',                 right: 'no.png',                  type: 'should_punish' },
                { video: 'fence_scenario_girl_bike_who_punish_question',    img: 'gender_order2/fence_scenario_girl_bike_who_punish_question.png',    left: 'girl_bike_case_suzy.png', right: 'girl_bike_case_andy.png', type: 'who_punish'    }
            ]
        },
        {
            intro:    'test_case_intro',
            scenario: 'mirror_scenario_boy_chair',
            questions: [
                { video: 'mirror_scenario_boy_chair_crack_question',         img: 'gender_order2/mirror_scenario_boy_chair_crack_question.png',         left: 'boy_chair_case_bobby.png',  right: 'boy_chair_case_sophia.png', type: 'crack'         },
                { video: 'mirror_scenario_boy_chair_cause_question',         img: 'gender_order2/mirror_scenario_boy_chair_cause_question.png',         left: 'boy_chair_case_bobby.png',  right: 'boy_chair_case_sophia.png', type: 'caused'        },
                { video: 'mirror_scenario_boy_chair_fault_question',         img: 'gender_order2/mirror_scenario_boy_chair_fault_question.png',         left: 'boy_chair_case_bobby.png',  right: 'boy_chair_case_sophia.png', type: 'fault'         },
                { video: 'mirror_scenario_boy_chair_should_punish_question', img: 'gender_order2/mirror_scenario_boy_chair_should_punish_question.png', left: 'yes.png',                   right: 'no.png',                   type: 'should_punish' },
                { video: 'mirror_scenario_boy_chair_who_punish_question',    img: 'gender_order2/mirror_scenario_boy_chair_who_punish_question.png',    left: 'boy_chair_case_bobby.png',  right: 'boy_chair_case_sophia.png', type: 'who_punish'    }
            ]
        }
    ],

    // ── Condition 3: gender_order2, caused first ───────────────────────
    [
        {
            intro:    'test_case_intro',
            scenario: 'fence_scenario_girl_bike',
            questions: [
                { video: 'fence_scenario_girl_bike_cause_question',         img: 'gender_order2/fence_scenario_girl_bike_caused_question.png',        left: 'girl_bike_case_suzy.png', right: 'girl_bike_case_andy.png', type: 'caused'        },
                { video: 'fence_scenario_girl_bike_break_question',         img: 'gender_order2/fence_scenario_girl_bike_break_question.png',         left: 'girl_bike_case_suzy.png', right: 'girl_bike_case_andy.png', type: 'break'         },
                { video: 'fence_scenario_girl_bike_fault_question',         img: 'gender_order2/fence_scenario_girl_bike_fault_question.png',         left: 'girl_bike_case_suzy.png', right: 'girl_bike_case_andy.png', type: 'fault'         },
                { video: 'fence_scenario_girl_bike_should_punish_question', img: 'gender_order2/fence_scenario_girl_bike_should_punish_question.png', left: 'yes.png',                 right: 'no.png',                  type: 'should_punish' },
                { video: 'fence_scenario_girl_bike_who_punish_question',    img: 'gender_order2/fence_scenario_girl_bike_who_punish_question.png',    left: 'girl_bike_case_suzy.png', right: 'girl_bike_case_andy.png', type: 'who_punish'    }
            ]
        },
        {
            intro:    'test_case_intro',
            scenario: 'mirror_scenario_boy_chair',
            questions: [
                { video: 'mirror_scenario_boy_chair_cause_question',         img: 'gender_order2/mirror_scenario_boy_chair_cause_question.png',         left: 'boy_chair_case_bobby.png',  right: 'boy_chair_case_sophia.png', type: 'caused'        },
                { video: 'mirror_scenario_boy_chair_crack_question',         img: 'gender_order2/mirror_scenario_boy_chair_crack_question.png',         left: 'boy_chair_case_bobby.png',  right: 'boy_chair_case_sophia.png', type: 'crack'         },
                { video: 'mirror_scenario_boy_chair_fault_question',         img: 'gender_order2/mirror_scenario_boy_chair_fault_question.png',         left: 'boy_chair_case_bobby.png',  right: 'boy_chair_case_sophia.png', type: 'fault'         },
                { video: 'mirror_scenario_boy_chair_should_punish_question', img: 'gender_order2/mirror_scenario_boy_chair_should_punish_question.png', left: 'yes.png',                   right: 'no.png',                   type: 'should_punish' },
                { video: 'mirror_scenario_boy_chair_who_punish_question',    img: 'gender_order2/mirror_scenario_boy_chair_who_punish_question.png',    left: 'boy_chair_case_bobby.png',  right: 'boy_chair_case_sophia.png', type: 'who_punish'    }
            ]
        }
    ]
];


// ════════════════════════════════════════════════════════════════════
//  INIT jsPsych
//  (CHS has already pre-wrapped initJsPsych to route data to its servers)
// ════════════════════════════════════════════════════════════════════

const jsPsych = initJsPsych();

// Randomly assign one of the 4 counterbalancing conditions
const conditionIndex = Math.floor(Math.random() * CONDITIONS.length);
const condition      = CONDITIONS[conditionIndex];


// ════════════════════════════════════════════════════════════════════
//  TRIAL BUILDERS
// ════════════════════════════════════════════════════════════════════

/**
 * videoTrial – plays a fullscreen video; the Continue button stays
 * disabled until the video finishes, so the experimenter controls pacing.
 */
function videoTrial(videoName, trialType) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `<video id="trial-video" class="trial-video"
                         src="${VID(videoName)}" autoplay playsinline></video>`,
        choices: ['Next'],
        on_load: function () {
            const group = document.getElementById('jspsych-html-button-response-btngroup');
            if (group) group.classList.add('continue-btn-group');
            const btn = group && group.querySelector('button');
            if (btn) {
                btn.disabled = true;
                document.getElementById('trial-video').addEventListener('ended', () => {
                    btn.disabled = false;
                });
                // Safety: enable after 5 min if the ended event never fires
                setTimeout(() => { btn.disabled = false; }, 300_000);
            }
        },
        data: { trial_type: trialType, video: videoName, condition: conditionIndex }
    };
}

/**
 * questionTrial – the key improvement over Lookit:
 *   1. Question image appears immediately at the top of the screen.
 *   2. Question audio plays in the background (invisible video element).
 *   3. After audio finishes, the two choice images fade in as clickable buttons.
 *
 * Response saved to data: 0 = left button, 1 = right button.
 */
function questionTrial({ videoName, leftImgSrc, rightImgSrc, questionType, scenarioId }) {
    const leftLabel  = lbl(leftImgSrc);
    const rightLabel = lbl(rightImgSrc);

    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `<video id="q-audio" src="${VID(videoName)}"
                         class="trial-video" autoplay playsinline></video>`,
        choices: [
            `<img src="${leftImgSrc}"  class="choice-img" alt="${leftLabel}">`,
            `<img src="${rightImgSrc}" class="choice-img" alt="${rightLabel}">`
        ],
        on_load: function () {
            const group = document.getElementById('jspsych-html-button-response-btngroup');
            if (group) {
                group.querySelectorAll('button').forEach(b => b.classList.add('image-choice-btn'));
            }
        },
        data: {
            question_type: questionType,
            scenario:      scenarioId,
            condition:     conditionIndex,
            left_label:    leftLabel,
            right_label:   rightLabel,
            video:         videoName
        },
        response_ends_trial: true
    };
}


// ════════════════════════════════════════════════════════════════════
//  BUILD SCENARIO TIMELINE
// ════════════════════════════════════════════════════════════════════

function buildScenarioTimeline(scenarioData, scenarioId) {
    const trials = [];

    // 1. Intro video + scenario video (experimenter clicks Continue each time)
    trials.push(videoTrial(scenarioData.intro,    'intro'));
    trials.push(videoTrial(scenarioData.scenario, 'scenario'));

    // 2. Q1, Q2, Q3 — always shown
    for (let i = 0; i < 3; i++) {
        const q = scenarioData.questions[i];
        trials.push(questionTrial({
            videoName:      q.video,
            questionImgSrc: IMG(q.img),
            leftImgSrc:     IMG(q.left),
            rightImgSrc:    IMG(q.right),
            questionType:   q.type,
            scenarioId
        }));
    }

    // 3. Q4 — should punish? (left = yes, right = no)
    const q4 = scenarioData.questions[3];
    trials.push(questionTrial({
        videoName:      q4.video,
        questionImgSrc: IMG(q4.img),
        leftImgSrc:     IMG(q4.left),
        rightImgSrc:    IMG(q4.right),
        questionType:   'should_punish',
        scenarioId
    }));

    // 4. Q5 — who should be punished?
    //    Shown ONLY if the child answered "yes" to Q4 (response index 0 = left button).
    const q5 = scenarioData.questions[4];
    trials.push({
        timeline: [questionTrial({
            videoName:      q5.video,
            questionImgSrc: IMG(q5.img),
            leftImgSrc:     IMG(q5.left),
            rightImgSrc:    IMG(q5.right),
            questionType:   'who_punish',
            scenarioId
        })],
        conditional_function: function () {
            const sp = jsPsych.data.get()
                .filter({ question_type: 'should_punish', scenario: scenarioId })
                .last(1).values()[0];
            return sp && sp.response === 0; // 0 = left = "yes"
        }
    });

    return trials;
}


// ════════════════════════════════════════════════════════════════════
//  WARMUP TIMELINE
// ════════════════════════════════════════════════════════════════════

/**
 * warmupQuestionTrial – like questionTrial but buttons are hidden until
 * the video finishes playing, then fade in.
 */
function warmupQuestionTrial({ videoName, leftImgSrc, rightImgSrc }) {
    const leftLabel  = lbl(leftImgSrc);
    const rightLabel = lbl(rightImgSrc);
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `<video id="q-audio" src="${VID(videoName)}"
                         class="trial-video" autoplay playsinline></video>`,
        choices: [
            `<img src="${leftImgSrc}"  class="choice-img" alt="${leftLabel}">`,
            `<img src="${rightImgSrc}" class="choice-img" alt="${rightLabel}">`
        ],
        on_load: function () {
            const group = document.getElementById('jspsych-html-button-response-btngroup');
            if (group) {
                group.querySelectorAll('button').forEach(b => {
                    b.classList.add('image-choice-btn');
                    b.disabled = true;
                    b.style.opacity = '0';
                    b.style.transition = 'opacity 0.3s';
                });
                const reveal = () => {
                    group.querySelectorAll('button').forEach(b => {
                        b.disabled = false;
                        b.style.opacity = '1';
                    });
                };
                document.getElementById('q-audio').addEventListener('ended', reveal);
                setTimeout(reveal, 300_000); // safety fallback
            }
        },
        data: {
            question_type: 'warmup',
            scenario:      'warmup',
            condition:     conditionIndex,
            left_label:    leftLabel,
            right_label:   rightLabel,
            video:         videoName
        },
        response_ends_trial: true
    };
}

const warmupTimeline = [
    // Warmup questions: choice buttons appear after the video finishes
    warmupQuestionTrial({ videoName: 'warmup_part1_bird_question', leftImgSrc: IMG('bird.png'), rightImgSrc: IMG('cat.png')  }),
    warmupQuestionTrial({ videoName: 'warmup_part1_fish_question', leftImgSrc: IMG('pig.png'),  rightImgSrc: IMG('fish.png') }),
    warmupQuestionTrial({ videoName: 'warmup_part2_yes_question',  leftImgSrc: IMG('yes.png'),  rightImgSrc: IMG('no.png')   }),
    warmupQuestionTrial({ videoName: 'warmup_part2_no_question',   leftImgSrc: IMG('yes.png'),  rightImgSrc: IMG('no.png')   }),
    // Warmup finish: video only, no choices
    videoTrial('warmup_finish', 'warmup_video')
];


// ════════════════════════════════════════════════════════════════════
//  CHS-SPECIFIC FRAMES
//  (These replace the Lookit EFP frames for webcam config, consent,
//   recording, and exit survey.)
// ════════════════════════════════════════════════════════════════════

const video_config = {
    type: chsRecord.VideoConfigPlugin
    // locale: 'zh'  // uncomment to change language
};

const video_consent = {
    type: chsRecord.VideoConsentPlugin,
    PIName:      'Ellen Markman',
    institution: 'The Markman Lab of Stanford University',
    PIContact:   'Ellen Markman at markman@stanford.edu',
    purpose:     'This study is about how children use causal verbs in language and how they think about causation and responsibility.',
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
                <li>The study takes about 8–10 minutes.</li>
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
    // ── Setup ──
    { type: jsPsychFullscreen, fullscreen_mode: true },
    video_config,
    video_consent,
    instructions,

    // ── Start recording ──
    start_recording,

    // ── Study introduction ──
    videoTrial('overall_study_intro', 'intro_video'),

    // ── Warmup ──
    ...warmupTimeline,

    // ── Stop and restart recording between scenarios (mirrors original Lookit structure) ──
    stop_recording,
    start_recording,

    // ── Main experiment: Scenario 1 ──
    ...buildScenarioTimeline(condition[0], 'scenario_1'),

    // ── Stop and restart recording between scenarios ──
    stop_recording,
    start_recording,

    // ── Main experiment: Scenario 2 ──
    ...buildScenarioTimeline(condition[1], 'scenario_2'),

    // ── End ──
    stop_recording,
    videoTrial('overall_study_end', 'end_video'),
    { type: jsPsychFullscreen, fullscreen_mode: false, delay_after: 0 },
    { type: chsSurvey.ExitSurveyPlugin }
]);
