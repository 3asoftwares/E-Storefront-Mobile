# Jenkins CI/CD Setup for 3A Storefront Mobile

This document provides comprehensive instructions for setting up Jenkins CI/CD pipeline for the 3A Storefront Mobile application, including automated testing, building, and deployment.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Jenkins Installation](#jenkins-installation)
4. [Jenkins Configuration](#jenkins-configuration)
5. [Pipeline Architecture](#pipeline-architecture)
6. [Jenkinsfile Explanation](#jenkinsfile-explanation)
7. [EAS Build Integration](#eas-build-integration)
8. [Environment Variables](#environment-variables)
9. [Notifications](#notifications)
10. [Troubleshooting](#troubleshooting)
11. [Best Practices](#best-practices)

---

## Overview

### What is CI/CD?

**Continuous Integration (CI)**: Automatically build and test code changes whenever developers push to the repository.

**Continuous Deployment (CD)**: Automatically deploy tested code to staging/production environments.

### Why Jenkins for Mobile Apps?

| Benefit | Description |
|---------|-------------|
| **Self-Hosted** | Full control over build environment and data |
| **Customizable** | Highly configurable pipelines |
| **Plugin Ecosystem** | 1800+ plugins for various integrations |
| **Free & Open Source** | No licensing costs |
| **Scalable** | Distributed builds across multiple agents |

### Pipeline Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        CI/CD PIPELINE FLOW                                │
└──────────────────────────────────────────────────────────────────────────┘

  Git Push          Build & Test           Deploy              Notify
     │                   │                   │                   │
     ▼                   ▼                   ▼                   ▼
┌─────────┐  ┌───────────────────────┐  ┌─────────┐  ┌───────────────────┐
│ GitHub  │  │      Jenkins          │  │   EAS   │  │  Slack/Email      │
│ Webhook │─►│  ┌─────────────────┐  │─►│  Build  │─►│  Notification     │
│         │  │  │ Checkout        │  │  │  Cloud  │  │                   │
└─────────┘  │  │ Install Deps    │  │  └─────────┘  └───────────────────┘
             │  │ Lint + TypeCheck│  │
             │  │ Run Tests       │  │
             │  │ Build App       │  │
             │  └─────────────────┘  │
             └───────────────────────┘
```

---

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| **Jenkins** | 2.400+ | CI/CD server |
| **Node.js** | 18.x LTS | JavaScript runtime |
| **Git** | 2.40+ | Version control |
| **Java JDK** | 11 or 17 | Jenkins runtime |

### Required Accounts

| Account | Purpose |
|---------|---------|
| **Expo Account** | EAS Build access |
| **GitHub/GitLab** | Source code repository |
| **Slack** (optional) | Notifications |

### Required Jenkins Plugins

| Plugin | Purpose |
|--------|---------|
| **NodeJS Plugin** | Node.js environment management |
| **Git Plugin** | Git integration |
| **Pipeline Plugin** | Jenkinsfile support |
| **HTML Publisher** | Coverage reports |
| **JUnit Plugin** | Test result parsing |
| **Credentials Plugin** | Secure credential storage |
| **Slack Notification** (optional) | Slack integration |

---

## Jenkins Installation

### Windows Installation

```powershell
# 1. Download Jenkins Windows Installer
# https://www.jenkins.io/download/

# 2. Run the installer and follow prompts

# 3. Access Jenkins at http://localhost:8080

# 4. Get initial admin password
Get-Content "C:\ProgramData\Jenkins\.jenkins\secrets\initialAdminPassword"
```

### Docker Installation (Recommended)

```bash
# Create Docker volume for persistence
docker volume create jenkins_home

# Run Jenkins container
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts

# Get initial admin password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### Linux Installation

```bash
# Ubuntu/Debian
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt-get update
sudo apt-get install jenkins

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

---

## Jenkins Configuration

### Step 1: Install Required Plugins

1. Navigate to **Manage Jenkins** → **Manage Plugins**
2. Go to **Available** tab
3. Search and install:
   - NodeJS Plugin
   - Git Plugin
   - Pipeline
   - HTML Publisher Plugin
   - JUnit Plugin
   - Slack Notification Plugin (optional)

### Step 2: Configure Node.js

1. Navigate to **Manage Jenkins** → **Global Tool Configuration**
2. Scroll to **NodeJS**
3. Click **Add NodeJS**
4. Configure:
   ```
   Name: NodeJS 18
   Version: NodeJS 18.18.0
   Global npm packages: eas-cli
   ```

### Step 3: Configure Credentials

1. Navigate to **Manage Jenkins** → **Manage Credentials**
2. Click on **Jenkins** → **Global credentials** → **Add Credentials**

#### Expo Token

```
Kind: Secret text
Scope: Global
Secret: <your-expo-token>
ID: expo-token
Description: Expo/EAS CLI authentication token
```

**How to get Expo token:**
```bash
# Login to Expo
npx expo login

# Generate token
npx expo token:create
```

#### GitHub Credentials (if private repo)

```
Kind: Username with password
Username: <github-username>
Password: <personal-access-token>
ID: github-credentials
```

### Step 4: Create Pipeline Job

1. Click **New Item**
2. Enter name: `3A-Storefront-Mobile`
3. Select **Pipeline**
4. Click **OK**

#### Configure Pipeline

```groovy
// Pipeline Configuration
Definition: Pipeline script from SCM
SCM: Git
Repository URL: https://github.com/your-org/E-Storefront-Mobile.git
Credentials: github-credentials
Branch: */main
Script Path: Jenkinsfile
```

#### Build Triggers

```
☑ GitHub hook trigger for GITScm polling
☑ Poll SCM: H/5 * * * * (every 5 minutes)
```

---

## Pipeline Architecture

### Pipeline Stages

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         JENKINS PIPELINE STAGES                           │
└──────────────────────────────────────────────────────────────────────────┘

Stage 1: CHECKOUT
├── Clone repository
├── Get commit info
└── Set environment variables

Stage 2: SETUP
├── Install Node.js dependencies (npm ci)
├── Install EAS CLI globally
└── Create build directories

Stage 3: CODE QUALITY (Parallel)
├── TypeScript Check (npm run typecheck)
├── ESLint (npm run lint)
└── Security Audit (npm audit)

Stage 4: TEST
├── Run Jest tests with coverage
├── Generate JUnit XML report
└── Generate coverage HTML report

Stage 5: BUILD (Conditional)
├── EAS Build for Android (APK/AAB)
├── EAS Build for iOS (IPA)
└── Download build artifacts

Stage 6: DEPLOY (Conditional)
├── EAS Update (OTA updates)
└── Store submission (production)

Stage 7: NOTIFY
├── Slack notification
├── Email notification
└── Update build status
```

### Branch Strategy

| Branch | Trigger | Actions |
|--------|---------|---------|
| `feature/*` | Push | Lint, TypeCheck, Test |
| `develop` | Push | Lint, TypeCheck, Test, Preview Build |
| `main` | Push | Full pipeline + Production Build |
| `release/*` | Push | Full pipeline + Store Submission |

---

## Jenkinsfile Explanation

### Complete Jenkinsfile

```groovy
pipeline {
    agent any
    
    // ═══════════════════════════════════════════════════════════════
    // ENVIRONMENT VARIABLES
    // ═══════════════════════════════════════════════════════════════
    environment {
        NODE_VERSION = '18'
        EXPO_TOKEN = credentials('expo-token')
        APP_ENV = 'production'
        EAS_NO_VCS = '1'  // Disable VCS checks for CI
    }
    
    // ═══════════════════════════════════════════════════════════════
    // PIPELINE OPTIONS
    // ═══════════════════════════════════════════════════════════════
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))  // Keep last 10 builds
        timeout(time: 60, unit: 'MINUTES')              // 60 min timeout
        disableConcurrentBuilds()                        // No parallel builds
        timestamps()                                     // Add timestamps to logs
    }
    
    // ═══════════════════════════════════════════════════════════════
    // TOOLS
    // ═══════════════════════════════════════════════════════════════
    tools {
        nodejs 'NodeJS 18'  // Use configured Node.js installation
    }
    
    // ═══════════════════════════════════════════════════════════════
    // STAGES
    // ═══════════════════════════════════════════════════════════════
    stages {
        
        // ───────────────────────────────────────────────────────────
        // Stage 1: CHECKOUT
        // ───────────────────────────────────────────────────────────
        stage('Checkout') {
            steps {
                checkout scm
                
                script {
                    // Get short commit hash for build identification
                    if (isUnix()) {
                        env.GIT_COMMIT_SHORT = sh(
                            script: 'git rev-parse --short HEAD',
                            returnStdout: true
                        ).trim()
                        env.GIT_BRANCH_NAME = sh(
                            script: 'git rev-parse --abbrev-ref HEAD',
                            returnStdout: true
                        ).trim()
                    } else {
                        env.GIT_COMMIT_SHORT = bat(
                            script: '@git rev-parse --short HEAD',
                            returnStdout: true
                        ).trim().split('\n')[-1]
                        env.GIT_BRANCH_NAME = bat(
                            script: '@git rev-parse --abbrev-ref HEAD',
                            returnStdout: true
                        ).trim().split('\n')[-1]
                    }
                }
                
                echo "Building commit: ${env.GIT_COMMIT_SHORT}"
                echo "Branch: ${env.GIT_BRANCH_NAME}"
            }
        }
        
        // ───────────────────────────────────────────────────────────
        // Stage 2: SETUP
        // ───────────────────────────────────────────────────────────
        stage('Setup') {
            steps {
                script {
                    if (isUnix()) {
                        sh '''
                            echo "Node version: $(node --version)"
                            echo "NPM version: $(npm --version)"
                            npm ci
                            npm install -g eas-cli
                            mkdir -p builds
                        '''
                    } else {
                        bat '''
                            echo Node version:
                            node --version
                            echo NPM version:
                            npm --version
                            npm ci
                            npm install -g eas-cli
                            if not exist builds mkdir builds
                        '''
                    }
                }
            }
        }
        
        // ───────────────────────────────────────────────────────────
        // Stage 3: CODE QUALITY (Parallel execution)
        // ───────────────────────────────────────────────────────────
        stage('Code Quality') {
            parallel {
                stage('TypeScript Check') {
                    steps {
                        script {
                            if (isUnix()) {
                                sh 'npm run typecheck'
                            } else {
                                bat 'npm run typecheck'
                            }
                        }
                    }
                }
                
                stage('ESLint') {
                    steps {
                        script {
                            if (isUnix()) {
                                sh 'npm run lint'
                            } else {
                                bat 'npm run lint'
                            }
                        }
                    }
                }
                
                stage('Security Audit') {
                    steps {
                        script {
                            if (isUnix()) {
                                sh 'npm audit --audit-level=high || true'
                            } else {
                                bat 'npm audit --audit-level=high || exit 0'
                            }
                        }
                    }
                }
            }
        }
        
        // ───────────────────────────────────────────────────────────
        // Stage 4: TEST
        // ───────────────────────────────────────────────────────────
        stage('Test') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm test -- --coverage --ci'
                    } else {
                        bat 'npm test -- --coverage --ci'
                    }
                }
            }
            post {
                always {
                    // Publish JUnit test results
                    junit allowEmptyResults: true, 
                          testResults: 'test-results/junit.xml'
                    
                    // Publish HTML coverage report
                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
        
        // ───────────────────────────────────────────────────────────
        // Stage 5: BUILD (Only on main/develop branches)
        // ───────────────────────────────────────────────────────────
        stage('Build') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                    branch 'release/*'
                }
            }
            parallel {
                stage('Build Android') {
                    steps {
                        script {
                            def profile = env.BRANCH_NAME == 'main' ? 'production' : 'preview'
                            
                            if (isUnix()) {
                                sh """
                                    eas build --platform android \
                                              --profile ${profile} \
                                              --non-interactive
                                """
                            } else {
                                bat """
                                    eas build --platform android ^
                                              --profile ${profile} ^
                                              --non-interactive
                                """
                            }
                        }
                    }
                }
                
                stage('Build iOS') {
                    steps {
                        script {
                            def profile = env.BRANCH_NAME == 'main' ? 'production' : 'preview'
                            
                            if (isUnix()) {
                                sh """
                                    eas build --platform ios \
                                              --profile ${profile} \
                                              --non-interactive
                                """
                            } else {
                                bat """
                                    eas build --platform ios ^
                                              --profile ${profile} ^
                                              --non-interactive
                                """
                            }
                        }
                    }
                }
            }
        }
        
        // ───────────────────────────────────────────────────────────
        // Stage 6: DEPLOY (Only on main branch)
        // ───────────────────────────────────────────────────────────
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                script {
                    if (isUnix()) {
                        sh 'eas update --branch production --message "Jenkins build ${BUILD_NUMBER}"'
                    } else {
                        bat 'eas update --branch production --message "Jenkins build %BUILD_NUMBER%"'
                    }
                }
            }
        }
    }
    
    // ═══════════════════════════════════════════════════════════════
    // POST-BUILD ACTIONS
    // ═══════════════════════════════════════════════════════════════
    post {
        success {
            echo '✅ Build succeeded!'
            
            // Slack notification (if configured)
            // slackSend(
            //     color: 'good',
            //     message: "✅ Build #${BUILD_NUMBER} succeeded for ${env.GIT_BRANCH_NAME}"
            // )
        }
        
        failure {
            echo '❌ Build failed!'
            
            // slackSend(
            //     color: 'danger',
            //     message: "❌ Build #${BUILD_NUMBER} failed for ${env.GIT_BRANCH_NAME}"
            // )
        }
        
        always {
            // Clean workspace
            cleanWs()
        }
    }
}
```

---

## EAS Build Integration

### EAS Configuration (eas.json)

```json
{
  "cli": {
    "version": ">= 5.0.0",
    "appVersionSource": "local"
  },
  "build": {
    "base": {
      "node": "18.18.0",
      "env": {
        "EXPO_PUBLIC_APP_ENV": "production"
      }
    },
    "development": {
      "extends": "base",
      "developmentClient": true,
      "distribution": "internal",
      "channel": "development",
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleDebug"
      },
      "ios": {
        "simulator": true
      },
      "env": {
        "EXPO_PUBLIC_APP_ENV": "development"
      }
    },
    "preview": {
      "extends": "base",
      "distribution": "internal",
      "channel": "preview",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "resourceClass": "m-medium"
      },
      "env": {
        "EXPO_PUBLIC_APP_ENV": "staging"
      }
    },
    "production": {
      "extends": "base",
      "distribution": "store",
      "channel": "production",
      "autoIncrement": true,
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "resourceClass": "m-medium",
        "autoIncrement": "buildNumber"
      },
      "env": {
        "EXPO_PUBLIC_APP_ENV": "production",
        "EXPO_PUBLIC_ENABLE_ANALYTICS": "true",
        "EXPO_PUBLIC_ENABLE_CRASH_REPORTING": "true"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      },
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890"
      }
    }
  }
}
```

### EAS Build Commands Reference

```bash
# Development build (with dev client)
eas build --profile development --platform all

# Preview build (internal testing)
eas build --profile preview --platform all

# Production build (store release)
eas build --profile production --platform all

# Non-interactive mode (for CI)
eas build --profile preview --platform android --non-interactive

# Build with message
eas build --profile preview --message "Build from Jenkins #123"

# List recent builds
eas build:list

# View build details
eas build:view <build-id>

# Download build artifact
eas build:download --build <build-id> --output ./builds/
```

---

## Environment Variables

### Jenkins Environment Variables

| Variable | Description | How to Set |
|----------|-------------|------------|
| `EXPO_TOKEN` | EAS authentication | Credentials plugin |
| `NODE_VERSION` | Node.js version | Jenkinsfile |
| `APP_ENV` | App environment | Jenkinsfile |
| `EAS_NO_VCS` | Disable VCS check | Jenkinsfile |

### Expo Environment Variables

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_APP_ENV` | App environment (dev/staging/prod) |
| `EXPO_PUBLIC_GRAPHQL_URL` | GraphQL endpoint |
| `EXPO_PUBLIC_ENABLE_ANALYTICS` | Enable analytics |
| `EXPO_PUBLIC_SENTRY_DSN` | Sentry DSN |

### Setting Environment in EAS

```json
// eas.json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_APP_ENV": "production",
        "EXPO_PUBLIC_GRAPHQL_URL": "https://api.production.com/graphql",
        "EXPO_PUBLIC_ENABLE_ANALYTICS": "true"
      }
    }
  }
}
```

---

## Notifications

### Slack Integration

#### 1. Install Slack Plugin

```
Manage Jenkins → Manage Plugins → Available → Slack Notification Plugin
```

#### 2. Configure Slack

```
Manage Jenkins → Configure System → Slack

Workspace: your-workspace
Credential: slack-token (Bot token)
Default channel: #builds
```

#### 3. Add to Jenkinsfile

```groovy
post {
    success {
        slackSend(
            color: 'good',
            channel: '#mobile-builds',
            message: """
                ✅ *Build Succeeded*
                *Job:* ${env.JOB_NAME}
                *Build:* #${env.BUILD_NUMBER}
                *Branch:* ${env.GIT_BRANCH_NAME}
                *Commit:* ${env.GIT_COMMIT_SHORT}
                <${env.BUILD_URL}|View Build>
            """
        )
    }
    
    failure {
        slackSend(
            color: 'danger',
            channel: '#mobile-builds',
            message: """
                ❌ *Build Failed*
                *Job:* ${env.JOB_NAME}
                *Build:* #${env.BUILD_NUMBER}
                *Branch:* ${env.GIT_BRANCH_NAME}
                <${env.BUILD_URL}|View Build>
            """
        )
    }
}
```

### Email Notifications

```groovy
post {
    failure {
        emailext(
            subject: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: """
                Build failed for ${env.JOB_NAME}
                
                Branch: ${env.GIT_BRANCH_NAME}
                Commit: ${env.GIT_COMMIT_SHORT}
                
                Check console output at: ${env.BUILD_URL}
            """,
            recipientProviders: [
                [$class: 'DevelopersRecipientProvider'],
                [$class: 'RequesterRecipientProvider']
            ]
        )
    }
}
```

---

## Troubleshooting

### Common Issues

#### 1. Node.js Not Found

**Error:** `node: command not found`

**Solution:**
```groovy
// Ensure NodeJS tool is configured
tools {
    nodejs 'NodeJS 18'
}

// Or use full path
environment {
    PATH = "/usr/local/bin:${env.PATH}"
}
```

#### 2. EAS Authentication Failed

**Error:** `Not logged in`

**Solution:**
```groovy
// Ensure EXPO_TOKEN is set
environment {
    EXPO_TOKEN = credentials('expo-token')
}

// Verify token
sh 'eas whoami'
```

#### 3. Build Timeout

**Error:** `Build timed out`

**Solution:**
```groovy
options {
    timeout(time: 90, unit: 'MINUTES')  // Increase timeout
}
```

#### 4. npm ci Fails

**Error:** `npm ERR! code ENOENT`

**Solution:**
```groovy
// Ensure package-lock.json exists
sh 'npm install'  // Generate package-lock.json first

// Or use npm install instead
sh 'npm install'
```

#### 5. Permission Denied

**Error:** `EACCES: permission denied`

**Solution:**
```bash
# Fix npm permissions
sudo chown -R jenkins:jenkins /var/lib/jenkins/.npm
sudo chown -R jenkins:jenkins /var/lib/jenkins/workspace
```

### Debug Commands

```groovy
// Print environment
sh 'printenv'

// Check Node.js
sh 'which node && node --version'

// Check npm
sh 'npm --version && npm config list'

// Check EAS
sh 'eas whoami'

// List files
sh 'ls -la'
```

---

## Best Practices

### 1. Pipeline Organization

```groovy
// Use stages for logical grouping
stages {
    stage('Build') { ... }
    stage('Test') { ... }
    stage('Deploy') { ... }
}

// Use parallel for independent tasks
parallel {
    stage('Lint') { ... }
    stage('TypeCheck') { ... }
}
```

### 2. Fail Fast

```groovy
options {
    skipStagesAfterUnstable()  // Skip remaining stages if test fails
}
```

### 3. Cache Dependencies

```groovy
// Use npm ci for faster, reproducible builds
sh 'npm ci'

// Cache node_modules (if using Docker)
volumes: [
    'npm-cache:/root/.npm'
]
```

### 4. Secure Credentials

```groovy
// Never print secrets
environment {
    EXPO_TOKEN = credentials('expo-token')  // Masked in logs
}

// Use withCredentials for temporary access
withCredentials([string(credentialsId: 'api-key', variable: 'API_KEY')]) {
    sh 'deploy.sh $API_KEY'
}
```

### 5. Clean Workspace

```groovy
post {
    always {
        cleanWs()  // Remove workspace after build
    }
}
```

### 6. Version Artifacts

```groovy
// Tag builds with commit hash
def buildVersion = "${BUILD_NUMBER}-${GIT_COMMIT_SHORT}"

// Archive artifacts
archiveArtifacts artifacts: 'builds/*.apk', fingerprint: true
```

### 7. Branch-Specific Behavior

```groovy
when {
    anyOf {
        branch 'main'
        branch 'release/*'
    }
}
```

---

## Quick Reference

### Jenkins CLI Commands

```bash
# Restart Jenkins
sudo systemctl restart jenkins

# Check Jenkins status
sudo systemctl status jenkins

# View Jenkins logs
sudo journalctl -u jenkins -f

# Jenkins CLI
java -jar jenkins-cli.jar -s http://localhost:8080/ help
```

### Useful Jenkinsfile Snippets

```groovy
// Conditional execution
when {
    expression { env.BRANCH_NAME ==~ /release\/.*/ }
}

// Input/approval
input message: 'Deploy to production?'

// Retry on failure
retry(3) {
    sh 'npm test'
}

// Archive artifacts
archiveArtifacts artifacts: '**/build/*.apk'

// Stash/unstash files
stash name: 'build', includes: 'build/**'
unstash 'build'
```

---

## Pipeline Visualization

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    JENKINS PIPELINE DASHBOARD                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Build #42  [main]  ████████████████████████████████░░  85%            │
│                                                                         │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐           │
│  │Checkout│─►│ Setup  │─►│Quality │─►│  Test  │─►│ Build  │           │
│  │  ✅    │  │  ✅    │  │  ✅    │  │  ✅    │  │  🔄    │           │
│  │  3s    │  │  45s   │  │  12s   │  │  2m    │  │  10m   │           │
│  └────────┘  └────────┘  └────────┘  └────────┘  └────────┘           │
│                                                                         │
│  Recent Builds:                                                         │
│  ├── #42 [main]     🔄 In Progress  (10 min ago)                       │
│  ├── #41 [main]     ✅ Success      (2 hours ago)                      │
│  ├── #40 [develop]  ✅ Success      (5 hours ago)                      │
│  ├── #39 [feature]  ❌ Failed       (1 day ago)                        │
│  └── #38 [main]     ✅ Success      (2 days ago)                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

*Last updated: January 2026*
