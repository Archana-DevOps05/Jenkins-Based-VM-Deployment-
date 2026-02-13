pipeline {
    agent any

    environment {
        APP_HOST = "ec2-98-93-65-85.compute-1.amazonaws.com"
        APP_DIR = "Jenkins_Based_VM_Deployment"
        BRANCH = "master"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: "${BRANCH}", url: 'https://github.com/Archana-DevOps05/Jenkins-Based-VM-Deployment-.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Deploy to VM') {
            steps {
                withCredentials([file(credentialsId: 'ec2-pem', variable: 'KEY')]) {
                    sh """
                    chmod 400 \$KEY

                    ssh -o StrictHostKeyChecking=no -i \$KEY ubuntu@\$APP_HOST '
                        cd ~/$APP_DIR &&
                        pm2 stop app || true &&
                        git pull origin $BRANCH &&
                        npm install &&
                        pm2 start app.js --name app --update-env &&
                        pm2 save
                    '
                    """
                }
            }
        }

        stage('Wait for App Start') {
            steps {
                sh 'sleep 5'
            }
        }

        stage('Validate Deployment') {
            steps {
                script {

                    def deployedVersion = sh(
                        script: "curl -s http://$APP_HOST:3000/version | sed -E 's/.*\"version\":\"([^\"]+)\".*/\\1/'",
                        returnStdout: true
                    ).trim()

                    def repoVersion = sh(
                        script: "cat version.txt",
                        returnStdout: true
                    ).trim()

                    echo "Deployed Version: ${deployedVersion}"
                    echo "Repo Version: ${repoVersion}"

                    if (deployedVersion != repoVersion) {
                        error "Deployment Failed ❌ Version mismatch"
                    } else {
                        echo "Deployment Successful ✅"
                    }
                }
            }
        }
    }
}
