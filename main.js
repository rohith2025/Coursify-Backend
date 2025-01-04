const { json } = require("body-parser")
const express = require("express")
const { MongoGCPError } = require("mongodb")

const app = express()

const PORT = 3000

const mongoose = require("mongoose")
const { clearScreenDown } = require("readline")

mongoose.connect('mongodb+srv://yelurirohith2025:I7R5u4jzIRndZ8xr@cluster0.bycww.mongodb.net/Coursify')

app.get('/',function(req,res)
{
  res.send("<h1>This is home page baby!!</h1>")
})

const Admin = mongoose.model('Admin',{username : String,password : String})

app.post('/admin/signup',async function(req,res)
{
  const username = req.headers.username
  const password = req.headers.password

  const isExists = await Admin.findOne({username : username})

  if(!isExists)
  {
    const na = new Admin({
      username : username,
      password : password
    })

    na.save()
    
    res.status(200).json(
      {
        "Msg" : "Admin Creation Success"
      }
    )
  }
  else
  {
    res.status(400).json(
      {
        "Msg" : "Admin Already Exists"
      }
    )
  }
})

const Course = mongoose.model('Courses',{title : String,description : String,price : Number})

app.post('/admin/courses',async function(req,res){
  const username = req.headers.username
  const password = req.headers.password

  const isExists = await Admin.findOne({username : username , password : password})

  if(isExists)
  {
    const title = req.headers.title
    const description = req.headers.description
    const price = req.headers.price

    const isExistss = await Course.findOne({title : title})

    if(isExistss)
    {
      res.status(400).json({
        "Msg" : " Course Already Exists" 
      })
    }
    else
    {
      const nc = new Course({
        title : title,
        description : description,
        price : price
      })
      nc.save()
      res.status(200).json({
        "Msg" : "Course Creation Success"
      })
    }
  }
  else
  {
    res.status(400).json({
      "Msg" : "Admin Bad Credentials"
    })
  }
})

app.get('/admin/showcourses', async function(req,res)
{
  const username = req.headers.username
  const password = req.headers.password

  const isExists = await Admin.findOne({username : username,password : password})

  if(isExists)
  {
    const coursess = await Course.find({},'title description price -_id')
    res.status(200).json({
      coursess
    })
  }
  else
  {
    res.status(400).json({
      "Msg" : "Bad Admin Credentials"
    })
  }
})

const User = mongoose.model('Users',{username : String , password : String , purchases : Array})

app.post('/users/signup',async function (req,res)
{
  const username = req.headers.username
  const password = req.headers.password

  const isExists = await User.findOne({username : username , password : password})

  if(!isExists)
  {
    const nu = new User({
      username : username,
      password : password
    })

    nu.save()

    res.status(200).json({
      "Msg" : "User Creation Success"
    })
  }
  else
  {
    res.status(400).json({
      "Msg" : "User Exists"
    })
  }
})

app.get('/users/courses',async function (req,res){
  const username = req.headers.username
  const password = req.headers.password

  const isExists = await User.findOne({username : username , password : password})

  if(isExists)
  {
    const courses =  await Course.find({},'title description price -_id')
    res.status(200).json({
      courses
    })
  }
  else
  {
    res.status(400).json({
      "Msg" : "Bad Credentials"
    })
  }
})

app.post('/users/courses/purchasing',async function(req,res){
  const username = req.headers.username
  const password = req.headers.password

  const isExists = await User.findOne({username : username , password : password})

  if(isExists)
  {
    const cousetitle = req.headers.cousetitle

    const courseExists = await Course.findOne({title : cousetitle})

    if(courseExists)
    {
      const isExistx = await User.findOne({username, purchases : cousetitle})
      if(!isExistx)
      {
        const updpur = await User.updateOne({username : username}, 
          {
            $push : {
              purchases : cousetitle
            }
          }
        )
        res.status(200).json({
          "Msg" : "Course Purchase Success"
        })
      }
      else
      {
        res.status(400).json(
          {
            "Msg" : "Course Already Exists"
          }
        )
      }
    }
    else
    {
      res.status(400).json(
        {
          "Msg" : "Course Not Found"
        }
      )
    }
  }
  else
  {
    res.status(400).json(
      {
        "Msg" : "Bad Credentials"
      }
    )
  }
})

app.get('/users/purchasedcourses',async function(req,res){
  const username = req.headers.username
  const password = req.headers.password

  const isExists = await User.findOne({username : username , password : password})

  if(isExists)
  {
    const course = await User.find({username},'purchases -_id')
    res.status(200).json({
      course
    })
  }
  else
  {
    res.status(400).json({
      "Msg" : "Bad Credentials"
    })
  }
})

app.get('/',async function(req,res)
{
  res.send("<h1>This is Home Page Baby</h1>")
})


app.listen(PORT,function()
{
  console.log(`App Started On Port : ${PORT}`)
})