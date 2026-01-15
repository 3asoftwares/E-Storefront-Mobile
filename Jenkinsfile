pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        EXPO_TOKEN = credentials('expo-token')
        APP_ENV = 'production'
        EAS_NO_VCS = '1'
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 60, unit: 'MINUTES')
        disableConcurrentBuilds()
        timestamps()
    }
    
    tools {
        nodejs 'NodeJS 18'
    }
    
    stages {
        // ============================================
        // Stage 1: Checkout & Setup
        // ============================================
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = bat(script: '@git rev-parse --short HEAD', returnStdout: true).trim().split('\n')[-1]
                    env.GIT_BRANCH_NAME = bat(script: '@git rev-parse --abbrev-ref HEAD', returnStdout: true).trim().split('\n')[-1]
                }
            }
        }
        
        stage('Setup') {
            steps {
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
        
        // ============================================
        // Stage 2: Code Quality
        // ============================================
        stage('Code Quality') {
            parallel {
                stage('TypeScript Check') {
                    steps {
                        bat 'npm run typecheck'
                    }
                }
                
                stage('ESLint') {
                    steps {
                        bat 'npm run lint'
                    }
                }
                
                stage('Security Audit') {
                    steps {
                        bat 'npm audit --audit-level=high || exit 0'
                    }
                }
            }
        }
        
        // ============================================
        // Stage 3: Testing
        // ============================================
        stage('Test') {
            steps {
                bat 'npm test -- --coverage --ci'
            }
            post {
                always {
                    // Publish test results
                    junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
                    
                    // Publish coverage report
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
        
        // ============================================
        // Stage 4: Expo Link Check
        // ============================================
        stage('Link') {
            steps {
                bat '''
                    echo Checking Expo linking configuration...
                    npx expo-doctor@latest || exit 0
                '''
            }
        }
        
        // ============================================
        // Stage 5: Web Build
        // ============================================
        stage('Web Build') {
            steps {
                bat '''
                    echo Building web application...
                    npm run web:build
                '''
            }
            post {
                success {
                    archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
                    echo 'Web build completed successfully!'
                }
            }
        }
        
        // ============================================
        // Stage 6: Build Preview (Feature/Develop branches)
        // ============================================
        stage('Build Preview') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'feature/*'
                    changeRequest()
                }
            }
            stages {
                stage('Build Android Preview') {
                    steps {
                        withCredentials([string(credentialsId: 'expo-token', variable: 'EXPO_TOKEN')]) {
                            bat 'eas build --platform android --profile preview --non-interactive --no-wait'
                        }
                    }
                }
                
                stage('Build iOS Preview') {
                    when {
                        branch 'develop'
                    }
                    steps {
                        withCredentials([string(credentialsId: 'expo-token', variable: 'EXPO_TOKEN')]) {
                            bat 'eas build --platform ios --profile preview --non-interactive --no-wait'
                        }
                    }
                }
            }
        }
        
        // ============================================
        // Stage 7: Build Production APK/IPA (Main branch / Tags)
        // ============================================
        stage('Build Production') {
            when {
                anyOf {
                    branch 'main'
                    buildingTag()
                }
            }
            stages {
                stage('Build Android APK') {
                    steps {
                        withCredentials([string(credentialsId: 'expo-token', variable: 'EXPO_TOKEN')]) {
                            bat '''
                                echo Building Android APK...
                                eas build --platform android --profile preview --non-interactive
                            '''
                        }
                    }
                    post {
                        success {
                            archiveArtifacts artifacts: 'builds/*.apk', allowEmptyArchive: true
                            echo 'Android APK build completed!'
                        }
                    }
                }
                
                stage('Build iOS IPA') {
                    steps {
                        withCredentials([string(credentialsId: 'expo-token', variable: 'EXPO_TOKEN')]) {
                            bat '''
                                echo Building iOS IPA...
                                eas build --platform ios --profile preview --non-interactive
                            '''
                        }
                    }
                    post {
                        success {
                            archiveArtifacts artifacts: 'builds/*.ipa', allowEmptyArchive: true
                            echo 'iOS IPA build completed!'
                        }
                    }
                }
            }
            post {
                success {
                    echo "Build artifacts available at: ${env.BUILD_URL}artifact/"
                }
            }
        }
        
        // ============================================
        // Stage 8: OTA Update (Hotfixes)
        // ============================================
        stage('OTA Update') {
            when {
                branch 'hotfix/*'
            }
            steps {
                input message: 'Publish OTA update?', ok: 'Publish'
                withCredentials([string(credentialsId: 'expo-token', variable: 'EXPO_TOKEN')]) {
                    bat "eas update --branch production --message \"Hotfix: ${env.GIT_COMMIT_SHORT}\""
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        
        success {
            script {
                if (env.BRANCH_NAME == 'main' || env.TAG_NAME) {
                    echo "Build successful! Branch: ${env.GIT_BRANCH_NAME}, Commit: ${env.GIT_COMMIT_SHORT}"
                }
            }
        }
        
        failure {
            echo "Build failed! Branch: ${env.GIT_BRANCH_NAME}, Commit: ${env.GIT_COMMIT_SHORT}"
        }
        
        unstable {
            echo "Build is unstable. Check test results and code quality reports."
        }
    }
}
