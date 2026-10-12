# Hints

Each task has three levels. Try a level, rerun `npm test`, and only move to the next level if you are still stuck. Level 3 names the concept, not the code.

## Task 1: Empty and whitespace emails

**Level 1.** Look at the first error check in `validateIntakePayload`. What does `'email' in payload` tell you? Does it tell you the value is useful?

**Level 2.** A value can exist and still be unusable. Think about what the value looks like when a form field is left blank or filled with spaces.

**Level 3.** Normalize the value to a string, trim it, and check that something is left. Then check the result, not just the key.

## Task 2: Applicants must be 18 or older

**Level 1.** The validator receives a second argument (`{ now }`) so tests can pick the date. Use it instead of the current date.

**Level 2.** Compare years first, then subtract one if the birthday has not happened yet in the current year. Think about what "turns 18 today" means.

**Level 3.** Compare the month and day of the birth date with the month and day of `now`. Whether the birthday has already passed decides whether to subtract one year. Watch out for timezones: compare dates as calendar dates, not as timestamps.

## Task 3: Spouse rules

Task 3 already works. The tests protect it so you do not break it while editing.

**Level 1.** Read the spouse check and the two spouse tests. What must stay true when `maritalStatus` is `Single`?

**Level 2.** Only married applicants need a spouse name. Make sure your changes to Task 1 and Task 2 did not add a rule that applies to everyone.

**Level 3.** If a Task 3 test fails after your change, the cause is almost always a check you added outside its `if`.

## Still stuck?

- Read the failing assertion message. It shows the value that was received, which often points straight at the bug.
- Run one test at a time with `npx vitest run -t "18"`.
- Ask a teammate to explain the test you are stuck on in their own words. Explaining the expected behavior often reveals the missing rule.
