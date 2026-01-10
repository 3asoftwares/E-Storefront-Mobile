# Jenkins CI/CD Setup for E-Storefront Mobile

## Prerequisites

### Required Jenkins Plugins
Install these plugins from **Manage Jenkins > Plugins > Available**:

1. **NodeJS Plugin** - For Node.js environment
2. **Pipeline** - For Jenkinsfile support
3. **Git Plugin** - For SCM checkout
4. **Credentials Plugin** - For secret management
5. **HTML Publisher Plugin** - For coverage reports
6. **JUnit Plugin** - For test result reports
7. **Warnings Next Generation Plugin** - For ESLint reports
8. **Pipeline Utility Steps** - For additional pipeline utilities

### Node.js Configuration
1. Go to **Manage Jenkins > Tools**
2. Under **NodeJS installations**, click **Add NodeJS**
3. Configure:
   - Name: `18`
   - Version: `NodeJS 18.x`
   - Check "Install automatically"

## Required Credentials

### 1. Expo Token
1. Go to **Manage Jenkins > Credentials > System > Global credentials**
2. Click **Add Credentials**
3. Configure:
   - Kind: `Secret text`
   - Scope: `Global`
   - Secret: `<your-expo-token>`
   - ID: `expo-token`
   - Description: `Expo EAS Build Token`

To get your Expo token:
```bash
npx expo login
npx expo whoami
# Go to https://expo.dev/settings/access-tokens and create a token
```

### 2. (Optional) Slack Notifications
If you want Slack notifications:
1. Install **Slack Notification Plugin**
2. Add credentials:
   - Kind: `Secret text`
   - ID: `slack-token`
   - Secret: Your Slack Bot Token

## Pipeline Configuration

### Create Pipeline Job
1. Go to **Dashboard > New Item**
2. Enter name: `E-Storefront-Mobile`
3. Select **Multibranch Pipeline**
4. Click **OK**

### Configure Branch Sources
1. Under **Branch Sources**, click **Add source > Git**
2. Configure:
   - Project Repository: `<your-git-repo-url>`
   - Credentials: Add Git credentials if needed
   - Behaviors: 
     - Discover branches
     - Discover tags

### Build Configuration
1. Under **Build Configuration**:
   - Mode: `by Jenkinsfile`
   - Script Path: `Jenkinsfile`

### Scan Repository Triggers
1. Enable **Scan Multibranch Pipeline Triggers**
2. Set interval: `1 minute` (or use webhooks)

## Webhook Configuration (Recommended)

### For GitHub
1. Go to your GitHub repo > Settings > Webhooks
2. Add webhook:
   - Payload URL: `https://<jenkins-url>/github-webhook/`
   - Content type: `application/json`
   - Events: `Push`, `Pull Request`

### For GitLab
1. Go to your GitLab repo > Settings > Webhooks
2. Add webhook:
   - URL: `https://<jenkins-url>/project/E-Storefront-Mobile`
   - Triggers: `Push events`, `Merge request events`, `Tag push events`

### For Bitbucket
1. Go to your Bitbucket repo > Repository settings > Webhooks
2. Add webhook:
   - URL: `https://<jenkins-url>/bitbucket-hook/`
   - Triggers: Repository push

## Pipeline Stages

| Stage | Trigger | Description |
|-------|---------|-------------|
| Checkout | All | Clone repository |
| Setup | All | Install dependencies |
| TypeScript Check | All | Validate TypeScript |
| ESLint | All | Code linting |
| Security Audit | All | npm audit |
| Test | All | Run Jest tests with coverage |
| Build Preview | develop, feature/*, PRs | Build APK for testing |
| Build Production | main, tags | Build AAB/IPA for stores |
| Submit to Stores | Tags only | Manual approval to deploy |
| OTA Update | hotfix/* | Push over-the-air updates |

## Environment Variables

Set these in **Manage Jenkins > System > Global properties > Environment variables**:

| Variable | Description | Example |
|----------|-------------|---------|
| `ANDROID_HOME` | Android SDK path | `/opt/android-sdk` |
| `JAVA_HOME` | Java installation | `/usr/lib/jvm/java-11` |

## Agent Requirements

Your Jenkins agent needs:
- Node.js 18+
- npm 9+
- Git
- jq (for JSON parsing)

### Docker Agent Alternative
You can use a Docker agent:

```groovy
agent {
    docker {
        image 'node:18'
        args '-u root'
    }
}
```

## Troubleshooting

### Common Issues

1. **"eas: command not found"**
   - Ensure `npm install -g eas-cli` runs in Setup stage
   - Add `/usr/local/bin` to PATH

2. **"EXPO_TOKEN not set"**
   - Check credentials are configured correctly
   - Verify credential ID matches: `expo-token`

3. **"Permission denied"**
   - Ensure Jenkins user has write access to workspace
   - For Docker: use `-u root` or proper volume permissions

4. **"Build timeout"**
   - EAS builds can take 20-40 minutes
   - Increase timeout in pipeline options

### Viewing Logs
- Build logs: Click on build number > Console Output
- Test results: Click on build number > Test Result
- Coverage: Click on build number > Coverage Report

## Security Best Practices

1. **Never hardcode secrets** - Always use Jenkins credentials
2. **Use credential binding** - `withCredentials()` block
3. **Limit access** - Use role-based access control
4. **Audit logs** - Enable audit logging in Jenkins
5. **HTTPS only** - Configure Jenkins with SSL certificate

## Notifications (Optional)

Add to `post` block in Jenkinsfile:

```groovy
post {
    success {
        slackSend(
            channel: '#mobile-builds',
            color: 'good',
            message: "Build Successful: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
        )
    }
    failure {
        slackSend(
            channel: '#mobile-builds',
            color: 'danger',
            message: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
        )
    }
}
```

## Support

For issues with:
- **Expo/EAS**: https://docs.expo.dev/
- **Jenkins**: https://www.jenkins.io/doc/
- **This pipeline**: Check the Jenkinsfile comments
