/**** Modules using****/

var express = require('express'),
    bodyParser = require('body-parser'),
    multiparty = require('multiparty'),
    fs = require('node-fs'),
    _ = require('lodash');
crypto = require('crypto');
var appRoot = require('app-root-path');

/**** Create Router System ****/

var router = express.Router();

/**** Require connection database ****/

    require('./models/db');
/**** Models : Instances for our documents in database ****/
var Category = require('./models/Category');

var Person = require('./models/Person');
var User = require('./models/User');
var subCategory = require('./models/subCategory');
var Product = require('./models/Product');

/*** URI for WebService REST****/

/*** Resource for Category ***/
router
    .use(bodyParser.json())
    .route('/cats')
        .get(function(req, res){
        Category
            .find()
            .populate({
                path: 'subCats',
                select: 'designation fields'
            })
            .exec(function(error, Cats){
                if(error){
                    console.log('Error: ' + error);
                }else{
                    res.json(Cats);
                }
            });
    });
router
    .use(bodyParser.json())
    .route('/category')
        .get(function (req,res) {

            Category
                .find()
                .populate('subCats')
                .exec(function(err, categories){
                        if(err) {
                            console.log('Error: ' + err);
                        }else{
                            return res.send(categories);
                        }
                 })
        })
        .post(function (req, res) {

            var category = new Category({
                designation: req.body.designation,
                description: req.body.description
            });
            category.save(function(err, cat){
                if(!err){
                    res.send({status: 'success', message: 'Categorie ajouter avec succès', cat:cat})
                }
                else{
                    res.send({status: 'error', message: 'Impossible d\'ajouter cette catégorie'});
                }
            });
    });

router
    .param('id', function(req, res, next){
        req.dbQuery = {id: req.params.id};
        next();
    })
    .route('/category/:id')
        .get(function (req, res) {
            Category.findOne({_id:req.dbQuery.id}, function(err, pc) {
                if(!pc) {
                    res.statusCode = 404;
                    return res.json({ error: 'Not found' });
                }

                if(!err) {
                    return res.json(pc);
                } else {

                    res.statusCode = 500;
                    console.log('Internal error(%d): %s', res.statusCode, err.message);
                    return res.send({ error: 'Server error' });
                }
            });
        })
        .put(function(req, res){
            Category.findOne(req.dbQuery.id, function(error, category) {
                if(!category) {
                    return res.send({status: 'error', message: 'Catégorie n\'existe pas'});
                }
                else{
                    category.designation = req.body.designation;
                    category.description = req.body.description;
                    category.save(function(err, cat){
                        if(!err){
                            res.send({status: 'success', message: 'Categorie modifié avec succès', cat:cat})
                        }else{
                            console.log(err);
                            return false;
                        }
                    });
                }
            });
        })
        .delete(function (req, res) {
            Category.findOne(req.dbQuery.id, function(err, category) {
                if(category.subCats.length != 0){
                    return res.send({status: 'error', message: 'Impossible de suppriumer la catégorie'});
                }
                if(!category) {
                    return res.send({status: 'error', message: 'Catégorie n\'existe pas'});
                }
                category.remove(function(err) {
                    if(!err) {
                        return res.send({status: 'success', message:'La categorie a bien été supprimé'});
                    } else {
                        return res.send({ error: 'Server error' });
                    }
                })
            });

        });

/*** Resource for Product ***/

/** function return allProducts **/

function getAllProducts(req,res){
    Product.find(function(err, products) {
        if(!err) {
            return res.json(products);
        } else {
            res.statusCode = 500;
            console.log('Internal error(%d): %s',res.statusCode,err.message);
            return res.json({ error: 'Server error' });
        }
    });
}

router
    .use(bodyParser.json())
    .route('/product')
    .get(function (req,res) {
        getAllProducts(req,res);
    })
    .post(function (req, res) {
        var product = new Product({
            designation: req.body.designation,
            description: req.body.description,
            price: req.body.price,
            scategory_name: req.body.scategory_name,
            scategory_id: req.body.scategory_id
        });
        product.save(function(err,product){
            if(err){
                res.send({status: 'error', message: 'Erreur d\'ajout de produit!! merci de réessayer plutard'});
            }
            else{
                res.send({status: 'success', message: 'Produit a bien été ajouté',product: product});
            }
        });
    });
router
    .param('id', function(req, res, next){
        req.dbQuery = {id: req.params.id};
        next();
    })
    .route('/product/:id')
    .get(function (req, res) {
        Product.findOne({_id:req.dbQuery.id}, function(err, product) {
            if(!product) {
                res.statusCode = 404;
                return res.json({ error: 'Not found' });
            }

            if(!err) {
                return res.json(product);
            } else {

                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error' });
            }
        });
    })
    .put(function(req, res){
        Product.findOne({_id:req.dbQuery.id}, function(err, product) {
            if(!product) {
                res.statusCode = 404;
                return res.json({ error: 'Not found' });
            }
            if(!err) {
                product.designation = req.body.designation;
                product.description = req.body.description;
                product.price = req.body.price;

                product.save(function(err,product){
                    if(!err){
                        res.send(product);
                    }else{
                        console.log('error');
                    }
                });
            } else {

                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error' });
            }
        });
    })
    .delete(function (req, res) {
        Product.findOne({_id:req.dbQuery.id}, function(err, products) {
            if(!products) {
                res.statusCode = 404;
                return res.send({ error: 'Not found' });
            }
            products.remove(function(err,product) {
                if(!err) {
                    product.images.forEach(function (image) {
                        fs.unlinkSync(appRoot+'/public/assets/images/'+ image.name);
                        return res.send({status: 'success', message:'Le produit a bien été supprimé'});
                    })
                } else {
                    res.statusCode = 500;
                    console.log('Internal error(%d): %s',res.statusCode,err.message);
                    return res.send({ error: 'Server error' });
                }
            })
        });
    });
router
    .use(bodyParser.json())
    .route('/upload/:id')
    .post(function(req, res) {
        var form = new multiparty.Form({uploadDir: appRoot + '/public/assets/images.tmp'});
        form.parse(req, function (err, fields, files) {
            _(_.values(files)).forEach(function (value) {
                _.forEach(_.values(value), function (v) {
                    var target_path = appRoot + '/public/assets/images/' + v.originalFilename;
                    fs.renameSync(v.path, target_path, function (err) {
                        if (err)console.error(err.stack);
                    });
                    Product.findOne({_id: req.params.id}, function (err, product) {
                        if (!product) {
                            res.statusCode = 404;
                            return res.json({error: 'Not found'});
                        }
                        if (!err) {
                            product.images.push({name: v.originalFilename});
                            product.save(function (err, product) {
                                if (!err) {
                                    res.send({
                                        status: 'success',
                                        message: 'Images a bien été attacher a le Produit',
                                        product: product
                                    });
                                } else {
                                    console.log(err);
                                }
                            });

                        } else {

                            res.statusCode = 500;
                            console.log('Internal error(%d): %s', res.statusCode, err.message);
                            return res.send({error: 'Server error'});
                        }
                    });
                })
            });
        });
    });


/*** Resource for Sub Category ***/

router
    .use(bodyParser.json())
    .route('/scategory')
    .get(function (req,res) {
        subCategory
            .find()
            .populate({
                path: '_categoryId',
                select: 'designation'
            })
            .exec(function(error, subCats){
                if(error){
                    console.log('Error: ' + error);
                }else{
                    res.send(subCats);
                }
            });
    })
    .post(function (req, res) {
        var fields = {'category': '', 'designation': '', 'description': ''};
        if(!req.body.category[0]){
            return res.send({status: 'error', message: 'Choisir une catégorie', scategory: {}});
        }
        Category
            .findOne({_id: req.body.category[0]}, function(error, category){
                if(error){
                    return res.send({status: 'success', message: 'Categorie n\'existe pas', scategory: {}});
                }
                var subCat = new subCategory({
                    designation: req.body.designation[0],
                    description: req.body.description[0]
                });
                subCat._categoryId = category;
                _.forIn(req.body, function (value, key) {
                        if (!_.hasIn(fields, key)) {
                            subCat.fields.push(value);
                        }
                });

                subCat.save(function(err,sCat){
                    if(!err){

                        category.subCats.push(sCat);
                        category.save(function (e) {
                            if(!e){
                                subCategory
                                    .findOne({_id: sCat._id})
                                    .populate({
                                        path: '_categoryId',
                                        select: 'designation'
                                    })
                                    .exec(function(er, subCat){
                                        if(er){
                                            console.log('Error: ' + er);
                                        }else{
                                            res.send({status: 'success', message: 'SCategorie ajouter avec succès', scategory: subCat});
                                        }
                                    });
                            }else{
                                res.send({status: 'error', message: 'Impossible d\'ajouter cette scatégorie'});
                            }
                        });
                    }
                });
            })
    });
router
    .param('id', function(req, res, next){
        req.dbQuery = {id: req.params.id};
        next();
    })
    .route('/scategory/:id')
    .get(function (req, res) {
        subCategory.findOne({_id:req.dbQuery.id}, function(err, pc) {
            if(!pc) {
                res.statusCode = 404;
                return res.json({ error: 'Not found' });
            }

            if(!err) {
                return res.json(pc);
            } else {

                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error' });
            }
        });
    })
    .put(function(req, res){
        subCategory.findOne({_id:req.dbQuery.id}, function(err, pc) {
            if(!pc) {
                res.statusCode = 404;
                return res.json({ error: 'Not found' });
            }
            if(!err) {
                pc.designation = req.body.designation;
                pc.description = req.body.description;
                pc.save(function(err, scategory){
                    if(!err){
                        return res.send({status: 'success', message: 'SCategorie a été modifier avec succès', scategory:scategory});
                    }else{
                        console.log('error');
                    }
                });
            } else {

                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error' });
            }
        });
    })
.delete(function (req, res) {
        subCategory.findOne({_id:req.dbQuery.id}, function(err, scategory) {
            if(scategory != 0) {
                return res.send({status: 'error', message: 'Impossible de suppriumer la catégorie'});
            }
            if(!scategory) {
                return res.send({status: 'error', message: 'sCatégorie n\'existe pas'});
            }
            scategory.remove(function(err) {
                if(!err) {
                    return res.send({status: 'success', message:'La sous categorie a bien été supprimé'});
                } else {
                    res.statusCode = 500;
                    console.log('Internal error(%d): %s',res.statusCode,err.message);
                    return res.send({ error: 'Server error' });
                }
            })
        });

    });
/////****person***////

////////////////////////**********person************//////////////


/*** Resource for Category ***/

router
    .use(bodyParser.json())
    .route('/person')
    .get(function (req,res) {

        Person
            .find()
            .exec(function(err,persons){
                if(err) {
                    console.log('Error: ' + err);
                }else{
                    return res.send(persons);
                }
            })
    })
    .post(function (req, res) {

        var person = new Person({
            username: req.body.username,
            phone: req.body.phone,
          birthdate: req.body.birthdate,
            email: req.body.email,
            password: req.body.password,
        });
        person.save(function(err, per){
            if(!err){
                res.send({status: 'success', message: 'user ajouter avec succès',per:per})
            }
            else{
                res.send({status: 'error', message: 'Impossible d\'ajouter cet person'});
            }
        });
    });

router
    .param('id', function(req, res, next){
        req.dbQuery = {id: req.params.id};
        next();
    })
    .route('/person/:id')
    .get(function (req, res) {
       Person.findOne({_id:req.dbQuery.id}, function(err, person) {
            if(!person) {
                res.statusCode = 404;
                return res.json({ error: 'Not found' });
            }

            if(!err) {
                return res.json(person);
            } else {

                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error' });
            }
        });
    })
    .put(function(req, res){
        Person.findOne(req.dbQuery.id, function(error, person) {
            if(!person) {
                return res.send({status: 'error', message: 'person n\'existe pas'});
            }
            else{
                person.username = req.body.username;
                person.phone = req.body.phone;

                person.birthdate = req.body.birthdate;

                person.email = req.body.email;

                person.password = req.body.password;
                person.save(function(err, per){
                    if(!err){
                        res.send({status: 'success', message: 'user modifié avec succès', per:per})
                    }else{
                        console.log(err);
                        return false;
                    }
                });
            }
        });
    })


    .delete(function (req, res) {
        Person.findOne(req.dbQuery.id, function(err, person) {
            if(person.length != 0){
                return res.send({status: 'error', message: 'Impossible de suppriumer le person'});
            }
            if(!person) {
                return res.send({status: 'error', message: 'user  n\'existe pas'});
            }
            person.remove(function(err) {
                if(!err) {
                    return res.send({status: 'success', message:'person a bien été supprimé'});
                } else {
                    return res.send({ error: 'Server error' });
                }
            })
        });

    });/*****************user********/

function hash(password){
    return crypto.createHash('sha256').update(password).digest('hex');
};

router
    .use(bodyParser.urlencoded())
    .use(bodyParser.json())
    .route('/register')
    .post(function(req, res){
        var user = new User({username : 'ahmed', password: hash('ahmed')});
        user.save(function(err, u){
            if(err) return res.send('error')
            return res.send(u);
        })
    });

router
    .use(bodyParser.urlencoded())
    .use(bodyParser.json())
    .route('/login')
    .post(function(req, res){
        var user = {
            username: 'ahmed',
            password: hash('ahmed')
        };
        User.findOne(user, function(error, data){
            if(!data){
                return res.send('user not found');
            }else{
                req.session.userId = data._id;
                return res.send('you are now connected');
            }
        })
    });

router
    .use(bodyParser.urlencoded())
    .use(bodyParser.json())
    .route('/logout')
    .get(function(req, res){
        req.session.destroy(function (err) {
            if(err){
                return res.send('you ca\'t not logout');
            }else{
                return res.send('logout successfuly');
            }
        })
    });

router
    .use(bodyParser.urlencoded())
    .use(bodyParser.json())
    .route('/session')
    .get(function(req, res){
        if(req.session.userId){
            return res.send(req.session.userId)
        }else{
            return res.send('you are not log in yet');
        }
    });






module.exports = router;


