const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const FormDataModel = require ('./models/FormData');


const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/ArogyaBite');


  

app.post('/register', (req, res)=>{
   

    const {email, password} = req.body;
    FormDataModel.findOne({email: email})
    .then(user => {
        if(user){
            res.json("Already registered")
        }
        else{
            FormDataModel.create(req.body)
            .then(log_reg_form => res.json(log_reg_form))
            .catch(err => res.json(err))
        }
    })
    
})

app.post('/login', (req, res)=>{
    // To find record from the database
    const {email, password} = req.body;
    FormDataModel.findOne({email: email})
    .then(user => {
        if(user){
            // If user found then these 2 cases
            if(user.password === password) {
                res.json("Success");
            }
            else{
                res.json("Wrong password");
            }
        }
        // If user not found then 
        else{
            res.json("No records found! ");
        }
    })
})

app.get('/get-profile', (req, res) => {
    const email = req.query.email;
    FormDataModel.findOne({ email })
      .then(user => res.json(user))
      .catch(err => res.status(500).json(err));
  });
  
  app.put('/update-profile', (req, res) => {
    console.log("Received update request body:", req.body);
    const { email, age, height, weight, gender, foodPreference, allergies, activityLevel } = req.body;
    FormDataModel.findOneAndUpdate(
      { email },
      { age, height, weight, gender, foodPreference, allergies, activityLevel },
      { new: true }
    )
    //   .then(updatedUser => res.json(updatedUser))
    .then(updatedUser => {
        console.log("Updated user:", updatedUser); 
        res.json(updatedUser);
      })
      .catch(err => res.status(500).json(err));
  });
  
app.get('/get-allergies', (req, res) => {
    const { email } = req.query; 
    FormDataModel.findOne({ email })
      .then(user => {
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        res.json({ allergies: user.allergies || [] }); 
      })
      .catch(err => {
        console.error("Error fetching allergies:", err);
        res.status(500).json({ error: "Server error" });
      });
  });

app.listen(3001, () => {
    console.log("Server listining on http://127.0.0.1:3001");

});