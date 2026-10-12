// Prints a checklist of the lab tasks so learners can see progress at a glance.
// Run with: npm run progress
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';

const RESULTS = '.lab-results.json';

const TASKS = [
  { name: 'Task 1', goal: 'Empty and whitespace emails are rejected', match: /email/i },
  { name: 'Task 2', goal: 'Applicants under 18 are rejected', match: /\b18\b|under 18/i },
  { name: 'Task 3', goal: 'Spouse rules still hold for married applicants', match: /spouse/i }
];

// Vitest exits non-zero while tests fail, which is expected here, so we ignore the exit code
// and read the results file it writes.
spawnSync(process.execPath, ['node_modules/vitest/vitest.mjs', 'run', '--reporter=json', `--outputFile=${RESULTS}`], {
  stdio: 'ignore'
});

if (!existsSync(RESULTS)) {
  console.error('Could not read test results. Run "npm install" first, then try again.');
  process.exit(1);
}

const { testResults } = JSON.parse(readFileSync(RESULTS, 'utf8'));
rmSync(RESULTS, { force: true });

const tests = testResults.flatMap((file) => file.assertionResults);

console.log('\nIntake Validation Lab: progress\n');

let allDone = true;
for (const task of TASKS) {
  const matching = tests.filter((t) => task.match.test(t.title));
  const passed = matching.filter((t) => t.status === 'passed').length;
  const done = matching.length > 0 && passed === matching.length;
  allDone &&= done;
  const mark = done ? '[x]' : '[ ]';
  console.log(`  ${mark} ${task.name}: ${task.goal} (${passed}/${matching.length} checks)`);
}

console.log(allDone ? '\nAll three tasks complete. Nice work.\n' : '\nKeep going. Open HINTS.md if you are stuck.\n');
