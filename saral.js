var express = require('express');
var app = express();
var fs = require('fs');
app.use(express.json());

app.get("/courses",function(req,res){
    fs.readFile('courses.json',function(err,data){
        console.log(data);
        res.end(data);
    });
})
app.get("/courses/:id",function(req,res){
    fs.readFile('courses.json',function(err,data){
    var users = JSON.parse( data );
    for(let i = 0;i < users.length;i++){  
        if(users[i]["id"]== req.params.id){
            let user = users[i] 
            console.log( user );
            res.end( JSON.stringify(user));
        }else{
            res.status(404).send();
        }
        } 
       
    });
})


// adding a course
app.post('/courses', function (req, res) {
    fs.access('courses.json',fs.F_OK,function(err){
        if(err){
            console.error("open error: " + err);
        }else if(req.body.name&& req.body.discription&& Object.keys(req.body).length==2) {
            fs.readFile('courses.json',function(err,data){
            let all_data = JSON.parse(data);
            const new_course = {
                "name" : req.body.name,
                "discription":req.body.discription,
                "id":all_data.length+1
            }
            all_data.push(new_course)
            console.log(all_data)
            fs.writeFile('courses.json',JSON.stringify(all_data)),function(err){
                if(err)
                    return console.log(err);
            }
            res.end(JSON.stringify(all_data));
        });    
        }else{
            res.end("thoda galat h")
        }
    
    });

 });
//  editing a course by id

 app.put('/courses/:id',function(req,res) {
    fs.readFile('courses.json',function(err,data){
        let all_data = JSON.parse(data);
    for(let i = 0;i<all_data.length;i++){
        if(all_data[i]["id"]== req.params.id){
            console.log("sahi hai")
            if(req.body.hasOwnProperty('name')){
                 all_data[req.params.id-1].name=req.body.name;
            }
            if(req.body.hasOwnProperty('description')){
                all_data[req.params.id-1].description=req.body.description;
            }
            fs.writeFileSync('course.json',JSON.stringify(all_data,null,2))
            return res.json(all_data[req.params.id-1]);
        }
    }    


     })
 });
//  getting all the exercise by its course id
app.get('/courses/:id/exercise',function(req,res) {
    fs.readFile('coursesexersise.json',function(err,data){
        let all_data =JSON.parse(data);
        var coursearry=[];
        for(let i = 0;i<all_data.length;i++){
            if(all_data[i]["courseId"]==req.params.id){
                console.log("aagagya")
                coursearry.push(all_data[i])
                

            }else if (all_data.length -1 == i){
                res.end( JSON.stringify("galat id hai"));
            }
        }res.end( JSON.stringify(coursearry));
    })
})

// create exercise 

app.post('/courses/:id/exercise',function(req,res){
    fs.access('coursesexersise.json',fs.F_OK,function(err){
        if(err){
            console.error("open error: " + err);
        }else if(req.body.name&& req.body.content&&req.body.hint&& Object.keys(req.body).length==3) {
            fs.readFile('coursesexersise.json',function(err,data){
            let all_data = JSON.parse(data);
            const new_course = {
                "name" : req.body.name,
                "courseId":parseInt(req.params.id),
                "content":req.body.content,
                "hint":req.body.hint,
                "id":all_data.length+1
            }
            all_data.push(new_course)
            console.log(all_data)
            fs.writeFile('coursesexersise.json',JSON.stringify(all_data,null,2)),function(err){
                if(err)
                    return console.log(err);
            }
            res.end(JSON.stringify(new_course));
        });    
        }else{
            res.end("thoda galat h")
        }
    
    });

})
// get the exercisr by its id the exercise
app.get('/courses/:id/exercise/:nid',function(req,res){
    fs.readFile('coursesexersise.json',function(err,data){
        var course =JSON.parse(data);
    for(let i =0;i<course.length;i++){    
        if(course[i]["courseId"]==[req.params.id]&&course[i]["id"]==[req.params.nid]){
            res.end( JSON.stringify(course[i],null,2));
            console.log("sahi chalra h")
    }
    }});
})
// edit the exercise by its own id
app.put('/courses/:id/exercise/:nid',function(req,res){
    fs.readFile('coursesexersise.json',function(err,data){
        let all_data = JSON.parse(data);
        console.log(req.params.nid);
    for(let i = 0;i<all_data.length;i++){
        if((all_data[i]["courseId"]== req.params.id)&&all_data[i]["id"]==req.params.nid ){
            console.log("sahi hai");
            if(req.body.hasOwnProperty('name')){
                 all_data[i].name=req.body.name;
            }
            if(req.body.hasOwnProperty('content')){
                all_data[i].content=req.body.content;
            }
            if(req.body.hasOwnProperty('hint')){
                all_data[i].hint=req.body.hint;
            }
            fs.writeFileSync('coursesexersise.json', JSON.stringify(all_data, null, 2), (err, data) );
            return res.json(all_data);
        }
    }


     })
})
// getting the submmision
app.get('/courses/:id/exercises/:nid/submissions',function(req,res){
    fs.readFile('coursessubmission.json',function(err,data){
        let all_data =JSON.parse(data);
        // console.log(all_data);
    for(let i =0;i<all_data.length;i++){  
        if(all_data[i]["courseId"]==req.params.id&&all_data[i]["exerciseId"]==req.params.nid){
            res.end( JSON.stringify(all_data[i],null,2));
            console.log("sahi chalra h")
    }
    }});
})
app.post('/courses/:id/exercises/:nid/submissions',function(req,res){
    fs.access('coursessubmission.json',fs.F_OK,function(err){
        if(err){
            console.error("open error: " + err);
        }else if(req.body.content&&req.body.username&& Object.keys(req.body).length==2) {
            fs.readFile('coursessubmission.json',function(err,data){
            let all_data = JSON.parse(data);
            let new_submission = {
                "id":all_data.length+1,
                "courseId":req.params.id,
                "exerciseId":req.params.nid,
                "content":req.body.content,
                "username":req.body.username
            }
            all_data.push(new_submission )
            console.log(all_data)
            fs.writeFileSync('coursessubmission.json',JSON.stringify(all_data,null,2));
            res.end(JSON.stringify(new_submission));
        });    
        }else{
            res.end("thoda galat h")
        }
    
    });
})


app.listen(8090);