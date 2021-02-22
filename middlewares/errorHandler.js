module.exports = (err, req, res, next) => {
  switch (err.name) {
    case "SequelizeValidationError":
      const errors = err.errors.map(el => el.message)

      res.status(400).json({
        errors
      })
      break;

    case "SequelizeUniqueConstraintError":
      const unique = err.errors.map(el => el.message)
      res.status(400).json({
        errors: unique
      })
      break;

    case "deviceUnique":
      res.status(400).json({
        errors: ['arduinoUniqueKey must be unique']
      })
      break
    case "authValidate":
      res.status(401).json({
        errors: 'invalid email/password'
      })
      break;

    case "unauthorize":
      res.status(401).json({
        errors: 'unauthorize action!'
      })
      break;

    case "notFound":
      res.status(404).json({
        errors: 'not found!'
      })
      break;

    case "alreadyExist":
      res.status(400).json({
        errors: 'Schedule on this date and time already exist'
      })
      break;

    default:
      res.status(500).json({
        errors: err.message
      })
      break;
  }
}