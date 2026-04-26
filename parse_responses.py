"""
Parse CHS jsPsych response JSON files for all four pilot experiments
and write cleaned long-format CSV files (one row per question trial).

Response field:
  - 0 → left_label  (distal / character-name / yes)
  - 1 → right_label (proximal / character-name / no)
"""

import json, csv, os

BASE = os.path.dirname(os.path.abspath(__file__))

FILES = {
    'exp1':       os.path.join(BASE, 'pilot1_exp1.json'),
    'exp2':       os.path.join(BASE, 'children_pilot1_psych_verb_exp2',
                               'Join-Adventures-with-Amy--Ben--and-other-friends-_all-responses-identifiable.json'),
    'exp3':       os.path.join(BASE, 'children_pilot1_psych_verb_exp3',
                               'Join-Adventures-with-Robots-and-Clowns-_all-responses-identifiable.json'),
    'punishment': os.path.join(BASE, 'children_pilot1_exp1mats_with_punish',
                               'Join-Friends-on-a-Wondrous-Adventure-_all-responses-identifiable.json'),
}

COLUMNS = [
    'experiment',
    'response_id',
    'participant_hashed_id',
    'child_hashed_id',
    'date_created',
    'completed',
    'is_preview',
    'child_age_rounded',
    'child_gender',
    'condition',
    'phase',               # warmup | test
    'scenario',            # warmup | scenario_1 | scenario_2
    'scenario_object',     # e.g. balloon, drum, physical_shock, scared, fence_scenario_girl_bike
    'video',               # full video name (without .mp4)
    'question_type',       # e.g. pop_caused, lexical, caused, break, should_punish …
    'response',            # actual label: distal | proximal | bird | cat | yes | no …
    'rt_ms',
]


# ── warmup label override for exp1-3 ─────────────────────────────────────────
# The data was collected when warmup used distal/proximal figure images, storing
# left_label="distal" / right_label="proximal".  The design intent was bird/cat
# and pig/fish, so we remap using the known left→right assignment.
WARMUP_LABELS = {
    'warmup_part1_bird_question': ('bird', 'cat'),
    'warmup_part1_fish_question': ('pig',  'fish'),
}


# ── helper: derive question_type from video name ──────────────────────────────

def question_type_from_video(video, exp):
    """
    exp1:       'balloon_pop_caused'          → 'pop_caused'
    exp2/exp3:  'physical_shock_lexical'      → 'lexical'
    """
    if exp == 'exp1':
        return video.split('_', 1)[1] if '_' in video else video
    # exp2 / exp3: last token
    return video.rsplit('_', 1)[-1]


# ── helper: derive scenario_object from video name ───────────────────────────

def scenario_object_from_video(video, exp, question_type):
    """
    exp1:       'balloon_pop_caused'                          → 'balloon'
    exp2/3:     'physical_shock_lexical'                      → 'physical_shock'
    punishment: 'fence_scenario_girl_bike_break_question'     → 'fence_scenario_girl_bike'
    """
    if exp == 'exp1':
        return video.split('_')[0]
    if exp in ('exp2', 'exp3'):
        return video.rsplit('_', 1)[0]
    if exp == 'punishment':
        # Strip  _{question_type}_question  suffix
        suffix = f'_{question_type}_question'
        if video.endswith(suffix):
            return video[:-len(suffix)]
        # Handle cause vs caused mismatch in some filenames
        for alt in ('_cause_question', '_caused_question'):
            if video.endswith(alt):
                return video[:-len(alt)]
    return video


# ── main parsing loop ─────────────────────────────────────────────────────────

rows = []

for exp, fpath in FILES.items():
    with open(fpath, encoding='utf-8') as f:
        data = json.load(f)

    for entry in data:
        resp  = entry.get('response', {})
        child = entry.get('child', {})

        meta = {
            'experiment':           exp,
            'response_id':          resp.get('id', ''),
            'participant_hashed_id': entry.get('participant', {}).get('hashed_id', ''),
            'child_hashed_id':      child.get('hashed_id', ''),
            'date_created':         str(resp.get('date_created', ''))[:10],
            'completed':            resp.get('completed', ''),
            'is_preview':           resp.get('is_preview', ''),
            'child_age_rounded':    child.get('age_rounded', ''),
            'child_gender':         child.get('gender', ''),
        }

        for trial in entry.get('exp_data', []):
            # Only keep question trials that have choice buttons
            if 'left_label' not in trial or 'right_label' not in trial:
                continue
            if 'scenario' not in trial:
                continue

            scenario    = trial['scenario']
            phase       = 'warmup' if scenario == 'warmup' else 'test'
            condition   = trial.get('condition', '')
            video       = trial.get('video', '')
            left_label  = trial.get('left_label', '')
            right_label = trial.get('right_label', '')
            resp_idx    = trial.get('response')
            rt          = trial.get('rt', '')

            # For exp1-3 warmup the stored labels are "distal"/"proximal" due to
            # an older code version; override with the correct image labels.
            if phase == 'warmup' and exp in ('exp1', 'exp2', 'exp3'):
                if video in WARMUP_LABELS:
                    left_label, right_label = WARMUP_LABELS[video]

            # Actual response label
            if resp_idx == 0:
                response_label = left_label
            elif resp_idx == 1:
                response_label = right_label
            else:
                response_label = ''

            # Question type
            qt_field = trial.get('question_type', '')
            if qt_field and qt_field != 'warmup':
                question_type = qt_field          # punishment study has this field
            elif qt_field == 'warmup':
                question_type = 'warmup'
            else:
                question_type = question_type_from_video(video, exp)

            # Scenario object
            if phase == 'warmup':
                scen_obj = 'warmup'
            else:
                scen_obj = scenario_object_from_video(video, exp, question_type)

            rows.append({
                **meta,
                'condition':      condition,
                'phase':          phase,
                'scenario':       scenario,
                'scenario_object': scen_obj,
                'video':          video,
                'question_type':  question_type,
                'response':       response_label,
                'rt_ms':          rt,
            })

# ── write combined CSV ────────────────────────────────────────────────────────

out_all = os.path.join(BASE, 'pilot1_all_responses.csv')
with open(out_all, 'w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, fieldnames=COLUMNS)
    w.writeheader()
    w.writerows(rows)

# ── write per-experiment CSVs ─────────────────────────────────────────────────

for exp in FILES:
    exp_rows = [r for r in rows if r['experiment'] == exp]
    out_path = os.path.join(BASE, f'pilot1_{exp}_responses.csv')
    with open(out_path, 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=COLUMNS)
        w.writeheader()
        w.writerows(exp_rows)
    print(f'{exp}: {len(exp_rows)} rows  →  {os.path.basename(out_path)}')

print(f'\nCombined: {len(rows)} rows  →  pilot1_all_responses.csv')
