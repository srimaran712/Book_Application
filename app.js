const Express=require('express')
const app=Express()
app.use(Express.urlencoded())///collect details and send the server

//the other name of schema is a database




//when we using the ejs we have set our engine to ejs
// when your invluding the ejs file it must be in the views folder is inbuilt
app.set("view engine","ejs")

//if we want to connect our express application to mysql database we need to install a modukle called mysql2
const db=require('mysql2/promise')

//creating a connetion to the datrabse using this
const databaseConnection=db.createPool({
    host:"localhost",
    user:"root",
    password:"ManiRTU123^6",
    database:"books_application"
})


//using get method we can access the files

app.get('/',function(req,res){
    res.render("home.ejs")
})

//getting the book creation form
app.get('/create/books',async function(req,res){

    const authorsData=await databaseConnection.query("select * from authors")
    console.log(authorsData[0])
    const output=authorsData[0]
    res.render('bookform.ejs',{output:output})
})


//we need collect details from the form

app.post('/create/books', async function(req,res){
    const data=[req.body.title,req.body.description,req.body.id]

    await databaseConnection.query("insert into books(bookTitle,bookDescription,aid) values(?)",[data])
    res.redirect('/');
})

//we are going to collect the details of the author
app.get('/create/authors',async function(req,res){
   
    res.render("authorForm.ejs")
})

//collecting details of the author using post method

app.post('/create/authors',async function(req,res){
   const data= [req.body.authorname,req.body.email]

   await databaseConnection.query("insert into authors(authorName,authorEmail) values(?)",[data])

   res.redirect('/')
})


///display all details of book from the database

app.get('/display/books',async function(req,res){
    const bookData= await databaseConnection.query("select * from books")
    console.log(bookData[0])
    const booksData=bookData[0]

    res.render('displaybook.ejs',{books:booksData})
})


///display the individual details of the book


app.get('/display/books/:id',async function(req,res){
   const Id= req.params.id
  const bookDetails= await databaseConnection.query("select * from books where booksId=?",[Id])
  const bookDetail=bookDetails[0]
  console.log(bookDetail)
  res.render('individualbook.ejs',{book:bookDetail})


})


///deleting details from the database

app.get('/delete/books/:id',async function(req,res){
    const ID=req.params.id;

 await databaseConnection.query("delete  from books where booksId=?",[ID])
    
    res.render('deleteOne.ejs')

   
})

///this will delete all the books

app.get('/delete/books',async function(req,res){
    await databaseConnection.query("delete from books")
 
    res.redirect('/display/books')
})

//we are going to work with updation for updation we will render form ejs file , on that we pass books data in the values of input
//using post to collect all the detaila and updated in the table using update from table name set( columns nammes that you want to edit set values ???for multipes values use this )

app.get('/update/books/:id',async function(req,res){
   const Id= req.params.id // getting the values that stored in the variable id in the path

   const updatebookData= await databaseConnection.query("select * from books where booksId=?",[Id])
   const updatedata=updatebookData[0]

   res.render("updateform.ejs",{update:updatedata})
})

//collecting details from tthe upated form using urlencoded

app.post('/update/books/:id', async function(req,res){
    const Id= req.params.id
   const title= req.body.title
   const description= req.body.description
   await databaseConnection.query("update  books set bookTitle =?,bookDescription=?  where booksId=?",[title,description,Id])
   res.redirect("/display/books")
})
app.listen("3000")