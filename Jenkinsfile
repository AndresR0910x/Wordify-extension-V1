pipeline {
    agent any

    environment {
        DB_HOST = 'localhost'
        DB_USER = 'postgres'
        DB_PASSWORD = 'andres'
        DB_NAME = 'wordify_db'
    }

    stages {
        stage('Conectar a PostgreSQL') {
            steps {
                script {
                    bat """
                    set PGPASSWORD=%DB_PASSWORD%
                    psql -h %DB_HOST% -U %DB_USER% -d %DB_NAME% -c "SELECT 1;"
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Conexión exitosa a PostgreSQL ✅'
        }
        failure {
            echo 'Error en la conexión a PostgreSQL ❌'
        }
    }
}
