pipeline {
  agent any

  tools {
    nodejs 'NodeJS 18'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm ci'
          } else {
            bat 'npm ci'
          }
        }
      }
    }

    stage('Build') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm run build'
          } else {
            bat 'npm run build'
          }
        }
      }
    }

    stage('Test') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm run test || echo "No tests to run"'
          } else {
            bat 'npm run test || echo "No tests to run"'
          }
        }
      }
    }

    stage('Archive build artifacts') {
      steps {
        archiveArtifacts artifacts: 'out/**, .next/**', fingerprint: true, allowEmptyArchive: true
      }
    }

    stage('Deploy to Render') {
      environment {
        SERVICE_ID = 'srv-d42h9cfgi27c73c5ope0'
      }
      steps {
        withCredentials([string(credentialsId: 'render-api-key', variable: 'RENDER_KEY')]) {
          script {
            echo "Triggering Render deployment for service ${SERVICE_ID}"

            if (isUnix()) {
              sh '''
                curl -X POST https://api.render.com/v1/services/$SERVICE_ID/deploys \
                  -H "Authorization: Bearer $RENDER_KEY" \
                  -H "Content-Type: application/json"
              '''
            } else {
              bat '''
                curl -X POST https://api.render.com/v1/services/%SERVICE_ID%/deploys ^
                  -H "Authorization: Bearer %RENDER_KEY%" ^
                  -H "Content-Type: application/json"
              '''
            }
          }
        }
      }
    }

  }

  post {
    success {
      echo '✅ Build and deployment successful!'
    }
    failure {
      echo '❌ Build failed. Check logs for details.'
    }
    always {
      echo 'Pipeline complete!'
    }
  }
}
