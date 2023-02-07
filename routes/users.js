// importing router from express for api
const router = require("express").Router();
// importing model
let User = require("../models/userModels");

let  http  = require( "../server.js")

User = User.getModel;

// view User



const io = require("socket.io")(http);

let users = [];

io.on("connection", socket => {
console.log("Connected");
socket.emit("welcome", "Welcome to Socket Programming: " + socket.id);

socket.on("message", async data => {
const message = {
username: data.username,
message: data.message
};
socket.to(data.room).broadcast.emit("newMessage", message);
console.log(`${data.username} sent a message to ${data.room}`);
try {
  const newMessage = new gmModel({
    from_user: data.username,
    room: data.room,
    message: data.message
  });
  await newMessage.save();
} catch (error) {
  throw new Error(error.message);
}

});

socket.on("newUser", name => {
if (!users.includes(name)) {
users.push(name);
}
socket.id = name;
});

socket.on("joinroom", (room, username) => {
socket.join(room);
socket.to(room).broadcast.emit("joined", username);
});

socket.on("leaveRoom", (room, username) => {
socket.to(room).broadcast.emit("left", username);
});

socket.on("disconnect", () => {
  console.log(`${socket.id} disconnected`);
});
});







//-------------------------------------------------------------------//

// Login and Register User

router.post("/signup", async (req, res) => {
  const user = req.body;
  const userExists = await User.findOne({ username: user.email });
  if (userExists) {
    res.status(400).json("User already Exists");
    // throw new Error('User already exists')
  } else {
    const newUser = new User(req.body);
    try {
      await newUser.save();
      res.status(201).send(newUser);
    } catch (error) {
      const errors = handleErrors(error);
      res.status(500).json({ errors });
    }
  }
});

router.post("/login", async (req, res) => {
  try {
    // adding user info email and password in user variable
    const user = req.body;
    // checking if user exists

    const userExists = await User.findOne({ email: user.username });
    // if user is there we validate password and if its right we sent 200 logged in
    if (userExists) {
      const isValid = await userExists.checkPassword(user.password);

      if (isValid) {
        res
        .status(200)
        .send({
          status: true,
          username: user.username,
          message: "User logged in successfully",
         
        });
         
      
      } else {
        return res
          .status(401)
          .send({ status: false, message: "Invalid  password" });
      }
    }
    // or sending error
    else {
      return res
        .status(401)
        .send({ status: false, message: "Invalid Username and password" });
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.status(500).json({ errors });
  }
});


const handleErrors = (err) => {
  // screating json error for all the fields

  let errors = { first_name: "", last_name: "", email: ""};

  // catching the unique error msg for emails
  if (err.code === 11000) {
    errors.email = "that email is already registered";
    return errors;
  } else if (err.message.includes("User validation failed")) {
    // looking for errors genereated from validation script

    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  } else {
    // for any other errors we run into
    errors = { message: "Error while instering New User" };
  }
  return errors;
};
// adding user when he clicks on submi
router.post('/login', async (req, res) => {
  const user = new userModel(req.body);
  try {
    await user.save((err) => {
      if(err){
          if (err.code === 11000) {
             return res.redirect('/signup?err=username')
          }
        
        res.send(err)
      }else{
        res.sendFile(__dirname + '/login.html')
      }
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html")
})

router.post('/', async (req, res) => {
  const username=req.body.username
  const password=req.body.password

  const user = await userModel.find({username:username});
  try {
      if(user.length != 0){
      if(user[0].password==password){
          return res.redirect('/?uname='+username)
      }
      else{
          return res.redirect('/login?wrong=pass')
      }
      }else{
      return res.redirect('/login?wrong=uname')
      }
  } catch (err) {
      res.status(500).send(err);
  }
});
router.get("/index", (req,res) =>{
  res.sendFile(__dirname + "/index.html")
})

router.get("/main", (req, res) => {
  res.sendFile(__dirname + "/main.html")
})


router.get('/main/:room', async (req, res) => {
  const room = req.params.room
  const msg = await gmModel.find({room: room}).sort({'date_sent': 'desc'}).limit(10);
  res.sendFile(__dirname + '/main.html')
});



router.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html")
})

router.post("/chathistory",async(req,res)=>{
try {
  const { room } = req.body
  const result = await gmModel.find({ room: room})
  res.status(200).send(result)
}
catch (e) {
  res.status(400).send({ error: e.message });
}
})
module.exports = router;
