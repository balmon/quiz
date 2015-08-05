// MW de autorización para accesos de HTTP restringidos
exports.loginRequired = function(req, res, next){
    if (req.session.user){
        next();
    }else{
        res.redirect("/login");
    }
};


// GET /login -- Formualario de login
exports.new = function (req, res) {

    var errors = (req.session.errors || {});
    req.session.errors = {};

    res.render('sessions/new', {errors: errors});
};

// POST /login -- Crear session
exports.create = function(req, res){
    var login = req.body.login;
    var pwd   = req.body.pwd;

    var userController = require('./user_controller');
    userController.autenticar(login, pwd, function(error, user){

        if (error){ // Si hay un error se retorna el mensaje de error de sesión
          req.session.errors = [{"message": "Se ha producido un error: "+error}];
            res.redirect("/login");
            return;
        }

        // Crear req.session.user y guardar campos id y username
        // La session se define por la existencia de: req.session.user
        req.session.user = {id: user.id, username: user.username};
        // Redirecciona a path anterior a login
        res.redirect(req.session.redir.toString());

    });

};

// DELETE /logout -- Destruir session
exports.destroy = function(req, res){
    delete req.session.user;
    res.redirect(req.session.redir.toString());
};


