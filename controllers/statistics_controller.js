var models = require('../models/models.js');
// Objeto para guadar las estadisticas
var sttts = {cQuizes:0, cComments:0, cQuizesWithComment:0, cQuizesWithoutComment:0, mediaComments:0};


exports.show = function(req, res){


    // OJO
    // LAS CONSULTAS SE ANIDAN PARA CONTROLAR SU SECUENCIA DE EJECUCIÓN.
    // DEBIDO A QUE LA FUNCION DE EXITO (THEN) ES ASINCRONA, EL METODO EJECUTARIA EL
    // RENDER ANTES DE TENER LOS VALORES RECUPERADOS. LO CUAL HARIA QUE
    // LAS ESTADISTICAS NO SE MOSTRARAN CON LOS ULTIMOS MOVIMIENTOS, A '0' LA PRIMERA VEZ.

    // Número de Quizes
    models.Quiz.count().then(function(c) {
        sttts.cQuizes = c;
        console.log("There are " + sttts.cQuizes + " quizes!");

        // Número de Comments
        models.Comment.count().then(function(c){
            sttts.cComments = c;
            console.log("There are " + sttts.cComments + " comments!");

            // Número Quizes con Comments
            models.Quiz.count({
                distinct: true,
                include: [
                    { model: models.Comment, required: true }
                ]
            }).then(function(c){
                sttts.cQuizesWithComment = c;
                console.log("There are " + sttts.cQuizesWithComment + " quiz with comments!");

                // Número de Quizes sin Comments
                sttts.cQuizesWithoutComment = (sttts.cQuizes - sttts.cQuizesWithComment);
                console.log ("There are " + sttts.cQuizesWithoutComment + " quiz without comments!");
                // Número medio de Comments por Quiz
                sttts.mediaComments = (sttts.cComments / sttts.cQuizes).toFixed(2);
                console.log ("Media :" + sttts.mediaComments );

                res.render('statistics/show', {statistics: sttts, errors: []} );
            });


        });


    });







};