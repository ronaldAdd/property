
//setting schema for course DB
const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags:[String],
  date: {type:Date,default:Date.now},
  isPublished : Boolean
});

//settitng model as a class
const Course = mongoose.model('Course',courseSchema);

//setting course object for Course class
const course = new Course({
  name:'React Native Course',
  author:'Faizal',
  tags:['React Native','frontend'],
  isPublished:true
});

//inserting course object into db
async function createCourse(){
  const result = await course.save()
  console.log(result);
}
// createCourse();

//query find courses
async function getCourses(){
  const courses=await Course
    .find({isPublished:true})
    .limit(10)
    .sort({name:1})
    .select({ name:1, tags:1});
  console.log(courses);
}
// getCourses()


async function updateCourse(id){
  const course=await Course.findById(id);
  if(!course) return;
  course.isPublished=true;
  course.author='another author';
  const result = await course.save();
  console.log(result);
}
// updateCourse('61f95f22e728a4bd8ddb8ccb');


async function removeCourse(id){
  const result = Course.deleteOne({_id:id}); //deletemoney
  //const course = await Course.findByIdAndRemove(id);
  console.log(result);
}
removeCourse('61f95f22e728a4bd8ddb8ccb');