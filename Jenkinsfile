pipeline {
    agent any

    environment {
        DB_CREDENTIALS = credentials('postgresql-credentials') 
        DB_HOST = 'localhost'
        DB_NAME = 'wordify_db'
        SQLALCHEMY_DATABASE_URL = "postgresql://${DB_CREDENTIALS_USR}:${DB_CREDENTIALS_PSW}@${DB_HOST}/${DB_NAME}"
        VENV_PATH = 'venv'
    }

    stages {
        stage('Clonar repositorio') {
            steps {
                git branch: 'main', url: 'https://github.com/AndresR0910x/Wordify-extension-V1.git'
            }
        }

        stage('Configurar backend') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'python -m venv ${VENV_PATH}'
                        sh 'source ${VENV_PATH}/bin/activate && pip install -r requirements.txt'
                    } else {
                        bat 'python -m venv ${VENV_PATH}'
                        bat '${VENV_PATH}\\Scripts\\activate && pip install -r requirements.txt'
                    }
                }
            }
        }

        stage('Configurar PostgreSQL y migraciones') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'sudo systemctl start postgresql'
                        sh 'sed -i "s|sqlalchemy.url = .*|sqlalchemy.url = ${SQLALCHEMY_DATABASE_URL}|" backend/alembic.ini'
                    } else {
                        bat 'net start postgresql-x64-13'
                        bat 'powershell -Command "(Get-Content backend/alembic.ini) -replace \'sqlalchemy.url = .*\', \'sqlalchemy.url = ${SQLALCHEMY_DATABASE_URL}\' | Set-Content backend/alembic.ini"'
                    }
                }
                sh '''
                    source ${VENV_PATH}/bin/activate
                    alembic upgrade head
                '''
            }
        }

        stage('Pruebas del backend') {
            steps {
                script {
                    if (isUnix()) {
                        sh '''
                            source ${VENV_PATH}/bin/activate
                            export TEST_DATABASE_URL="postgresql://${DB_CREDENTIALS_USR}:${DB_CREDENTIALS_PSW}@${DB_HOST}/test_wordify_db"
                            pytest backend/tests/ --db-url=$TEST_DATABASE_URL
                        '''
                    } else {
                        bat '''
                            ${VENV_PATH}\\Scripts\\activate
                            set TEST_DATABASE_URL=postgresql://${DB_CREDENTIALS_USR}:${DB_CREDENTIALS_PSW}@${DB_HOST}/test_wordify_db
                            pytest backend/tests/ --db-url=%TEST_DATABASE_URL%
                        '''
                    }
                }
            }
        }

        stage('Verificar frontend') {
            steps {
                sh 'echo "El frontend es estático (HTML, JS, CSS). No se requiere construcción."'
            }
        }

        stage('Desplegar aplicación') {
            steps {
                sh 'echo "Desplegando la aplicación..."'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completado con éxito.'
        }
        failure {
            echo 'Pipeline fallido.'
        }
    }
}
