const express = require('express');
const router = express.Router();
const Joi = require ('joi');

const courses= [
    {id:1, name:'course #1'},
    {id:2, name:'course #2'},
    {id:3, name:'course #3'},
]

router.get('/', (req, res) => {
    res.send(courses)
  })

router.post('/', (req,res) =>{
    console.log(req.body);
    const { error }=validateCourse(req.body) //result.error
    if(error)return res.status(400).send(error.details[0].message)
   
    const course={
        id:courses.length+1,
        name:req.body.name
    }
    courses.push(course);
    res.send(course);
})

router.get('/:id', (req, res) => {
    const course=courses.find(c=>c.id===parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found');
    res.send(courses)
  })

router.put('/:id',(req,response)=>{
    console.log(req);
    //Look up the course
    //if not existing return 404
    const course=courses.find(c=>c.id===parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found');
   
    //validate
    //if invalid return 404 bad request
     // const result=validateCourse(req.body)
    const { error }=validateCourse(req.body) //result.error
    if(error) return res.status(400).send(error.details[0].message)
    
    //update course
    course.name=req.body.name;
    //return the update course
    response.send(course);
})


router.delete('/:id', (req,res)=>{
    //lookup the courses
    // not exist, return 404
    const course=courses.find(c=>c.id===parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found');

    //Delete
    const index=courses.indexOf(course);
    courses.splice(index,1);

    //return the same course
    res.send(course);
})

function validateCourse(course){
    //validate
    //if invalid return 404 bad request
    const schema =Joi.object ({
        name : Joi.string().min(3).required()
    });
    return schema.validate(course);

}

module.exports = router;