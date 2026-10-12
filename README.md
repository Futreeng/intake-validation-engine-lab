# Lab: Fix a Legal Intake Validation Engine

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Futreeng/intake-validation-engine-lab)
[![Tests](https://github.com/Futreeng/intake-validation-engine-lab/actions/workflows/test.yml/badge.svg)](https://github.com/Futreeng/intake-validation-engine-lab/actions/workflows/test.yml)

**Estimated time:** 30 to 45 minutes · **Level:** intermediate JavaScript · **Setup:** none (runs in your browser via Codespaces)

## The scenario

You are an engineer on a legal-tech team. Estate planning clients submit an intake form before a consultation. The validator that checks each submission has three problems, and the test suite has already caught them. Your job is to make the tests pass without breaking the cases that already work.

This is a realistic task: real intake systems reject bad data at the door, and the rules (who is an adult, what counts as a usable email, when a spouse is required) are business rules that have to be exact.

## What you will practice

- Reading a failing test suite and working backward to the bug
- Handling strings correctly (empty vs. whitespace-only input)
- Date arithmetic that is correct at the edges (a birthday that falls on today, or tomorrow)
- Writing code that is testable by injecting the current date instead of reading the clock
- Protecting existing behavior: running the full suite after every change

## Start the lab

1. Click **Open in GitHub Codespaces** above and wait for the workspace to load.
2. In the terminal, run:

   ```bash
   npm test
   ```

3. You should see **4 failing tests and 6 passing tests**. That is the starting point. (The red CI badge on this repo is expected: the starter fails on purpose.)
4. Open `src/validator.js` and fix it until all 10 tests pass.

## Your tasks

| # | Task | Tests that check it |
|---|------|---------------------|
| 1 | Reject empty and whitespace-only email addresses | `FAILING TEST 1`, `FAILING TEST 1b` |
| 2 | Require the primary applicant to be at least 18 on the date you are validating | `FAILING TEST 2`, `FAILING TEST 2b` |
| 3 | Keep the spouse-name rule for married applicants working | Guard tests (already pass; do not break them) |

Everything else in the file already works. Read `src/validator.test.js` before you start. It is the spec.

## Rules of the road

- **Do not edit `src/validator.test.js` to make tests pass.** Change the validator, not the spec.
- Keep the function signature `validateIntakePayload(payload, { now })`. The tests pass a fixed `now` so the age checks are deterministic.
- Keep the exact error messages the tests expect.

## Stuck?

Open [`HINTS.md`](HINTS.md). Each task has three levels, from a nudge to the concept. Run `npm run progress` any time for a checklist of which tasks are done.

## Stretch goals (optional)

- **Stricter email check.** Make `not-an-email` and `a@b` fail. Use a simple pattern such as `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, and add a test for it.
- **Bad dates.** `birthDate: 'not-a-date'` currently produces no error. Add a clear error message and a test.
- **Refactor.** Move the age calculation into its own function and unit-test it directly.

## Definition of done

- `npm test` reports 10 passing tests and 0 failing.
- You changed only `src/validator.js` (plus new tests, if you did a stretch goal).
- Your age check still passes when run on a different date, because you used `now`.

---

*Created by FutureEng LLC. Instructor notes are in [`docs/INSTRUCTOR_GUIDE.md`](docs/INSTRUCTOR_GUIDE.md).*
