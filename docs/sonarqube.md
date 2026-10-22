# Local SonarQube analysis

The project uses SonarQube Community Build locally at
[localhost:9000](http://localhost:9000/dashboard?id=my-app-expo).
See the [2026-10-11 analysis report](sonarqube-report-2026-10-11.md) for findings.
The [HIGH-impact fix report](sonarqube-high-impact-fixes-2026-10-11.md) records the
first remediation pass. The [MEDIUM-impact fix report](sonarqube-medium-impact-fixes-2026-10-11.md)
records the severity fixes. The [duplication cleanup report](sonarqube-duplication-fixes-2026-10-11.md)
records the duplication pass. The latest session-restoration follow-up below
retains 0.0% duplication and zero open BLOCKER, HIGH and MEDIUM findings.
The Docker container is named `my-app-expo-sonarqube` and publishes its web port
only on `127.0.0.1`. Its data, logs, and extensions use dedicated Docker volumes.
This is a local evaluation instance with an embedded database.

`sonar-project.properties` scans application code, maintained Storybook code,
GitHub workflows, and app/build configuration. Automated tests and their helpers
have been removed. Generated `storybook.requires.ts` is excluded.
Dependencies, native build output, assets, and documentation are outside the
configured source roots. Scanner output and local credentials are Git-ignored.

## Session restoration follow-up — 2026-10-11 UTC

`restoreSession` in `src/services/auth/auth.lifecycle.ts` now returns its session
snapshot once. Matching the session generation gates background refresh, and a
named validity check preserves the treatment of expired or missing expiry dates.
Cached identity remains available while refresh runs; failures keep the existing
toast handling. A regression verifies that a generation change during loading
does not schedule refresh and still returns the original snapshot.

Sonar marks `S3516` and the related negated-comparison finding `S1940` **FIXED**.
All **423 tests** passed, as did lint, typecheck and formatting. The completed
analysis has no new issues, 118 remaining LOW findings and 0.0% duplication.
Compute task `fb052873-f38d-4066-92dc-a1607a410686` completed with **SUCCESS** at
**09:39:25 UTC**; analysis ID `867b26a0-d093-4cf8-882a-b501ad31eaa7`.
The quality gate still fails solely on missing new-code coverage (0.0% against
80%). Evidence is saved under the Git-ignored `.sonarqube-local/restore-session-*`
files. This follow-up adds no native dependency and does not require another build.

## Start and stop

```powershell
docker desktop start
docker start my-app-expo-sonarqube
```

Wait for `http://localhost:9000/api/system/status` to return `UP` before scanning.
Stop the server when finished; the Docker volumes preserve the analysis:

```powershell
docker stop --time 60 my-app-expo-sonarqube
```

The original container was created with the official pinned image:

```powershell
docker run -d --name my-app-expo-sonarqube --stop-timeout 60 --memory 3g -p 127.0.0.1:9000:9000 -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -v my-app-expo-sonarqube-data:/opt/sonarqube/data -v my-app-expo-sonarqube-logs:/opt/sonarqube/logs -v my-app-expo-sonarqube-extensions:/opt/sonarqube/extensions sonarqube:26.9.0.129388-community
```

## Dashboard login and repeat scans

The administrator username is `admin`. Its generated password and the project
analysis token are encrypted with Windows user protection in
`.sonarqube-local/admin-password.dpapi` and `.sonarqube-local/token.dpapi`.
Only the Windows account that created them on this computer can decrypt them.
To display the password for logging into the local dashboard:

```powershell
$sonarPassword = Get-Content .sonarqube-local/admin-password.dpapi | ConvertTo-SecureString
$sonarCredential = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList 'admin', $sonarPassword
$sonarCredential.GetNetworkCredential().Password
```

Run from the project root:

```powershell
npm run typecheck
npm run lint
$env:SONAR_HOST_URL = 'http://localhost:9000'
$token = Get-Content .sonarqube-local/token.dpapi | ConvertTo-SecureString
$sonarCredential = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList 'token', $token
$env:SONAR_TOKEN = $sonarCredential.GetNetworkCredential().Password
try {
  npx --yes @sonar/scan@5.0.1 '-Dsonar.scm.disabled=true' '-Dsonar.qualitygate.wait=true'
} finally {
  Remove-Item Env:SONAR_TOKEN
}
```

For another server, supply its URL through `SONAR_HOST_URL` and its analysis token
through `SONAR_TOKEN`. Override the project key with `-Dsonar.projectKey=...` when
needed. Keep credentials out of committed configuration and command arguments.

The local command disables SCM attribution because the initial scan failed in
Sonar's JGit blame reader with `MissingObjectException`. Native Git can read the
reported blob, so the failure does not establish repository corruption. This
workaround omits blame annotations and automatic author assignment; new code is
identified by analysis dates. Omit `-Dsonar.scm.disabled=true` when scanning a
checkout where blame works. The project configuration leaves SCM enabled by
default.

## Interpretation limits

No instrumented coverage report is configured. Passing tests does not establish
a coverage percentage; any missing or zero SonarQube coverage is not a measured
execution result. If a valid LCOV report is added later, provide its path with
`-Dsonar.javascript.lcov.reportPaths=coverage/lcov.info`.

The project uses TypeScript 6.0.3. Sonar's language documentation lists support
through TypeScript 5.9.3. The analyzer created a TypeScript 6.0.3 program and
successfully analyzed every selected JavaScript/TypeScript file; no parsing errors
were reported. Consider the documentation discrepancy when using newer syntax.
This analysis also does not verify native rendering or device behavior, and
dependency vulnerability analysis was skipped.

References: [official Docker image](https://hub.docker.com/_/sonarqube),
[NPM scanner configuration](https://docs.sonarsource.com/sonarqube-server/analyzing-source-code/scanners/npm/configuring),
[JavaScript/TypeScript support](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/languages/javascript-typescript-css).
