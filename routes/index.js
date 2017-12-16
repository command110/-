//引入集合操作方法
var User = require('../model/User');
//引入一个加密插件
var crypto = require('crypto');
//未登录情况下，不允许访问发表和退出
// function checkLogin(req,res,next) {
//     if(!req.session.user){
//         req.flash('error','未登录');
//         return res.redirect('/login');
//     }
//     next();
// }
module.exports = function (app) {
    //主页
    app.get('/',function (req,res) {
       User.getAll(null,function(err,docs){
           if(err){
               return res.redirect('/')
           }
           console.log(docs);
           res.render('index',{
               user: req.session.user,
               title:'添加页面',
               success: req.flash('success').toString(),
               error: req.flash('error').toString(),
               docs:docs
           })
       })
    })
    // 添加页面
    app.get('/add',function (req,res) {
             res.render('add', {
            title: '添加页面',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString(),
        })

    })
    //添加行为
    app.post('/add',function (req,res) {
    //把数据存放到数据库中
    //    1.收集数据
        var username = req.body.username;
        var password = req.body.password;
        var  name = req.body.name;
        var tel = req.body.tel;
        var email = req.body.email;

        var newUser = new User({
            username :username,
            password: password,
            name:name,
            tel:tel,
            email:email

        })
        //5.将用户信息存入数据库，并且跳转到首页
        newUser.save(function (err,user) {
            if(err){
                req.flash('error',err);
                return res.redirect('/add');
            }
            req.flash('success','注册成功');
            return res.redirect('/');

        })

    })
    //删除
    app.get('/remove/:name/:time',function (req,res) {
        User.remove(req.params.name,req.params.time,function (err) {
            if(err){
                req.flash('error',err);
                return res.redirect('/');
            }
            req.flash('success','删除成功');
            return res.redirect('/');
        })
    })
    //编辑的路由
    app.get('/edit/:name/:time',function (req,res) {
        User.edit(req.params.name,req.params.time,function (err,doc) {
            if(err){
                req.flash('error',err);
                return res.redirect('/');
            }
            return res.render('edit',{
                title:'编辑页面',
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString(),
                doc:doc
            })
        })
    })
    //修改行为
    app.post('/edit/:name/:time',function(req,res){
        User.update(req.params.name,req.params.time,req.body.content,function(err,doc){
            // var url =  encodeURI('/u/'+req.params.name +'/'+req.params.time);
            if(err){
                req.flash('error',err);
                return res.redirect('/')
            }
            req.flash('success','修改成功');
            return res.redirect('/')
        })
    })
    //登录
    app.get('/login',function (req,res) {
        res.render('login',{
            title:'登录页面',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        })
    })
    //登录行为
    app.post('/login',function (req,res) {
        

    })
    // 退出
    app.get('/logout',function (req,res) {
        req.session.user = null;
        req.flash('success','成功退出');
        res.redirect('/');
    })
}
