pipeline {
    agent any

    environment {
        DB_HOST = 'localhost'
        DB_NAME = 'wordify_db'
    }

    stages {
        stage('Conectar a PostgreSQL') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'postgresql-credentials', usernameVariable: 'DB_USER', passwordVariable: 'DB_PASSWORD')]) {
                    sh '''
                        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1;"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Conexión a PostgreSQL exitosa.'
        }
        failure {
            echo 'Error en la conexión a PostgreSQL.'
        }
    }
}
