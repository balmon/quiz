// GET /quizes/question
var models = require('../models/models.js');


// Autoload - factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find({
            where: { id: Number(quizId) },
            include: [{ model: models.Comment }]
        })
		.then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe quizId = '+quizId));
			}
		}
	).catch(function(error){ next(error); });
};

//GET /quizes
exports.index = function(req, res) {

		var srch = "%";
		if (req.query.search){ // Distinto de undefined
			srch = req.query.search.trim();
			srch = "%"+srch.replace(/ /g,"%")+"%";
		}
		models.Quiz.findAll({where:["LOWER(pregunta) like LOWER(?)", srch]}).then(function(quizes){
			res.render('quizes/index',{ quizes: quizes, errors: []});
		}).catch(function(error) { next(error); });
};

// GET /quizes/:quizId(\\d+)
exports.show = function (req, res) {
		res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// GET /quizes/:quizId(\\d+)/answer
exports.answer = function (req, res) {
		var resultado = 'Incorrecto';
		if (req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()){
			resultado = 'Correcto';
		}
			res.render('quizes/answer',
									{quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build(
		{pregunta: "Pregunta", respuesta: "Respuesta", tema:""}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

// GET /quizes/create
exports.create = function(req, res){
	var quiz = models.Quiz.build( req.body.quiz);

	quiz
	.validate()
	.then(
		function(err){
			if (err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			} else {
				//Guardar en DB los campos pregunta y respuesta de quiz
				quiz
					.save({fields: ["pregunta", "respuesta", "tema"]})
					.then(	function(){ res.redirect('/quizes'); });
			}
		}
	);
};

// GET /quizes/:quizId(\\d+)/edit
exports.edit = function(req, res){
	var quiz = req.quiz;
	res.render('quizes/edit', {quiz: quiz, errors: []});
};

//PUT /quizes/:quizId(\\d+)
exports.update = function(req, res){
	//El objeto req.quiz viene cargado del autoload (metodo exports.load)
	//Se actualizan los campos con los nuevos valores
	var quiz = req.quiz;
	quiz.pregunta = req.body.quiz.pregunta;
	quiz.respuesta = req.body.quiz.respuesta;
	quiz.tema = req.body.quiz.tema;

	quiz
		.validate()	//Se valida la entrada
		.then(
			function (err){
				if (err){
					res.render('quizes/edit', {quiz: quiz, errors: err.errors});
				} else {
					quiz
						.save ({ fields: ["pregunta", "respuesta", "tema"]})
						.then ( function(){ res.redirect('/quizes'); });
				}
			}
		)
};

//DELETE '/quizes/:quizId(\\d+)'
exports.delete = function(req, res){
	var quiz = req.quiz;
	quiz.destroy().then ( function(){
		res.redirect ('/quizes');
	}).catch( function(err){next(error);});
};
