# Instructor Guide: Intake Validation Engine Lab

This guide is for facilitators, reviewers, and anyone adapting the lab. Learners should not need it.

## Learning goals

By the end of the lab, a learner can:

1. **Debug from a failing spec.** Read a test suite, map each failure to a cause, and fix the cause without editing the spec.
2. **Handle input edge cases.** Distinguish a missing value, an empty string, and a whitespace-only string.
3. **Reason about dates at boundaries.** Compute age correctly on a birthday, the day before, and the day after.
4. **Make time testable.** Inject `now` rather than calling the clock inside business logic.
5. **Protect existing behavior.** Run the full suite after each change and treat guard tests as requirements.

## How the lab is built

The lab uses a *bug-hunt* format. The learner gets a working project with known defects and a spec that already exposes them. This keeps the first 5 minutes productive: the learner runs `npm test`, sees red, and has a concrete target. There is no blank-page problem.

Design choices:

- **Failing tests are the spec.** Test names say what should happen, and the error messages match what the product would show a user.
- **Guard tests are part of the spec.** Three tests already pass. They stop a learner from "fixing" the age check by breaking the spouse rule, and they teach that a green suite is a regression signal, not only a finish line.
- **Fixed clock in tests.** `NOW` is a constant, so the boundary tests give the same answer on every machine and every day. Learners see why this matters the first time a date-dependent test goes flaky.
- **Boundary tests come in pairs.** "Turns 18 today" passes and "turns 18 tomorrow" fails. A solution that uses `>` instead of `>=`, or ignores the month and day, fails one of them.
- **Progressive hints.** Three hint levels per task in `HINTS.md`. They move from direction to mechanism, so learners who need a nudge do not get the answer.
- **Stretch goals** extend the lab for fast finishers without changing the core path.

## Expected timing

| Phase | Time |
|-------|------|
| Read README, run `npm test`, read the spec | 5 min |
| Task 1: email | 5 to 10 min |
| Task 2: age | 10 to 20 min |
| Task 3: verify guard tests, run suite | 2 min |
| Stretch goal (optional) | 10 min |

## Reference solution (summary)

Keep the reference implementation in a separate branch or private repository, not in the learner-facing `main`. The approach:

- **Email:** trim the value, check that it is a string, and match it against a simple pattern. Checking `'email' in payload` alone is the bug.
- **Age:** compute whole years between `birthDate` and `now`, then subtract one if the birthday has not yet occurred this year. Compare month, then day. Use UTC accessors so results do not depend on the host's time zone.
- **Spouse rule:** unchanged.
- **Signature:** `validateIntakePayload(payload, { now = new Date() } = {})`, so production callers need no change.

The reference passes all 10 tests. The starter fails exactly the four learner targets (`FAILING TEST 1`, `1b`, `2`, `2b`) and passes the six guard and boundary tests.

## Common mistakes and how to coach them

| Symptom | Likely cause | Coaching question |
|---------|--------------|-------------------|
| Whitespace email still passes | Checked for `''` but not `'   '` | "What does `.trim()` do to `'   '`?" |
| Birthday-today test fails | Year subtraction only, no month/day check | "Would someone born in October be 18 on October 12 if they haven't turned 18 yet?" |
| Tomorrow test passes when it should fail | Off-by-one with `<` vs `<=`, or check missing | "Which side of 18 is the boundary on?" |
| Age test flips depending on the machine | Used `new Date()` inside the function | "Where should the 'today' value come from in a testable design?" |
| Tests pass locally, fail in CI | Time zone: `new Date('1985-06-15')` parses as UTC, local methods shift the day | "Which getter did you use, and does it match how the date was parsed?" |
| Learner edited `validator.test.js` | Wanted green fast | "The spec is the contract. What would a product owner say if the rule changed?" |

## Rubric

| Level | Criteria |
|-------|----------|
| **Complete** | All 10 tests pass. No test edited. Age check uses `now`. Email handles whitespace. Code is readable and the learner can explain why each change is needed. |
| **Solid** | All targets pass. One minor gap, such as the age check using local date methods or a hard-coded year. Learner can explain the change after a prompt. |
| **Partial** | Some targets pass. Learner edits tests to match behavior, or breaks a guard test. Good instinct, needs work on boundaries. |
| **Not yet** | Most targets fail. Learner needs a walkthrough of how the tests map to the code. Re-run with pair support. |

## Extending the lab

- Add a fourth task with its own failing tests (for example, a phone number format or a state of residence rule). Keep the same structure: failing test, guard test, hint.
- Add a test for a leap-day birthday (February 29). This is a good stretch task because the "birthday has passed" rule needs care.
- Swap the domain while keeping the skills. The same pattern works for insurance, benefits, or onboarding intake.

## Maintenance

- Keep `NOW` in the tests at a fixed date. If you change it, recompute the boundary birthdates (they are derived from `NOW`, so they update automatically).
- If Node or Vitest versions change, confirm the devcontainer image and `npm test` still run in a fresh Codespace.
- Keep the README and this guide in sync when tasks or test names change.
