var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req, res) {
  // Si no existe el parámetro search, busca todos los elementos.
  if (req.query.search === undefined)
  {
    models.Quiz.findAll().then(
      function(quizes) {
        res.render('quizes/index', { quizes: quizes});
      }
    ).catch(function(error) { next(error);})
  }
  else {
    // Si se ha especificado un patrón de búsqueda, filtra las
    // preguntas que satisfacen el patrón.
    models.Quiz.findAll({where: ["pregunta like ?", "%"+req.query.search+"%"]}).then(
      function(quizes) {
        res.render('quizes/index', { quizes: quizes});
      }
    ).catch(function(error) { next(error);})
  }
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};
