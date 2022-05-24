const mongoose = require('mongoose');

module.exports.errorHandler = (err, req, res, next) => {
  console.log(err)
  if (err instanceof mongoose.Error) err.status = 400  // TODO handle better
  res.status(err.status || 500).send({  // don't log specific error messages for non handled errors
    'Error': err.status ? err.message : 'An internal error occured'  
  });
}