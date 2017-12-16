// 面对对象编程
//链接数据库实例
var mongodb = require('./db');
//创建一个构造函数 命名为user 里面的username，password email 分别存放用户名 密码和email

function User(user) {
    this.username = user.username;
    this.password = user.password;
    this.email = user.email;
    this.name = user.name;
    this.tel = user.tel;
}
module.exports = User;
//格式化时间
function formatDate(num){
    return num < 10 ? '0'+ num:num
}
User.prototype.save = function (callback) {
    //收集时间
    var date = new Date();
    var now = date.getFullYear() + '-' + formatDate(date.getMonth() + 1) + '-' + formatDate(date.getDate()) + '' + formatDate(date.getHours()) + ':' + formatDate(date.getMinutes()) + ':' + formatDate(date.getSeconds());

    //收集即将存入数据库的数据
    var user = {
        username :this.username,
        password :this.password,
        email:this.email,
        name:this.name,
        tel:this.tel,
        content: this.content,
        time:now
    }
    //打开数据库
    mongodb.open(function (err,db) {
        //如果在打开数据库的时候发生错误，将错误结果返回给回调.
        if(err){
            return callback(err);
        }
        //读取users集合
        db.collection('users',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            //将数据插入到users集合中
            collection.insert(user,{safe:true},function (err,user) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,user[0]);//User是一个注册成功后的返回对象，里面包含了查询的相关信息。
            })
        })
    })

}
User.get = function (username,callback) {
//    打开数据库
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('users',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            //查询出name为指定用户名的用户信息，将结果返回
            collection.findOne({},function (err,user) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,user)
            })
        })
    })
}

//添加
User.getAll = function(name,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {}
            if(name){
                query.name = name;
            }
            collection.count(query,function(err){
                if(err){
                    mongodb.close();
                    return callback(err);
                }
                collection.find(query).sort({time:-1}).toArray(function(err,docs){
                    console.log(docs);
                    mongodb.close();
                    if(err){
                        return callback(err);
                    }
                    return callback(null,docs);
                })
            })
        })
    })
}

//删除
User.remove = function (name,time,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('users',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.remove({
                name:name,
                time:time
            },{
                w:1
            },function (err) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null);
            })
        })
    })
}

//编辑
User.edit=function(name,time,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err)
        }
        db.collection('users',function(err,collection){//读取集合
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({//查询数据
                name:name,
                time:time,
            },function(err,doc){
                mongodb.close();
                if(err){
                    return callback(err)
                }
                return callback(null,doc)
            })
        })
    })

}
User.update= function(name,time,content,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('users',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.update({
                name:name,
                time:time
            },{
                $set:{content:content}
            },function (err,doc) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,doc);
            })
        })
    })
}
module.exports = User