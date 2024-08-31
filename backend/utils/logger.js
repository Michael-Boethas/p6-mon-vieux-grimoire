import winston from 'winston'
import dotenv from 'dotenv'

dotenv.config()


const developmentFormat = winston.format.combine(
  winston.format.colorize(), // Logs en couleurs dans la console
  winston.format.printf(({ level, message, stack }) => {
    let formattedLog = `\n# ${level}` // Format structuré manuellement
    // Inclusion du stack trace
    if (stack) {
      formattedLog += ':'
      formattedLog += '\n\n= = = = = = = = = = = = = = = = = = = = = = = = =\n'
      formattedLog += `${stack}`
      formattedLog += '\n= = = = = = = = = = = = = = = = = = = = = = = = =\n\n'
    } else {
      formattedLog += ` - ${message} #`
    }
    return formattedLog
  })
)

const productionFormat = winston.format.combine(
  winston.format.timestamp(), // Ajout d'un timestamp à chaque log
  winston.format.errors({ stack: true }), // Stack trace des erreurs
  winston.format.json() // Logs structurés au format JSON
)

// Enregistrement dans la console
const consoleTransport = new winston.transports.Console()
// Enregistrement des erreurs dans error.log
const errorFileTransport = new winston.transports.File({
  filename: 'error.log',
  level: 'error'  // Niveau d'importance minimum "error" pour error.log
})

const log =
  process.env.NODE_ENV === 'production'
    ? winston.createLogger({
        level: 'info', // Niveau d'importance minimum pris en compte
        format: productionFormat,
        transports: errorFileTransport
      })
    : winston.createLogger({
        level: 'info', // Niveau d'importance minimum pour le logging
        format: developmentFormat,
        transports: consoleTransport
      })

export default log
