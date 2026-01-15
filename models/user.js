const mongoose=require("mongoose")
const Schema=mongoose.Schema
const passportLocalMongoose=require("passport-local-mongoose").default

const userSchema= new Schema({
    email:{
        type:String,
        required:true,
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema)

// userSchema.plugin(passportLocalMongoose);


// Relax 🙂 this is **very common confusion**. I’ll explain **slowly, in very simple English**, step-by-step.

// ---

// ## First: what is Passport?

// **Passport** is an **authentication library**
// 👉 It helps answer:

// * “Who is this user?”
// * “Is this user logged in?”
// * “Is the password correct?”

// Passport itself does **nothing alone** — it needs a **strategy**.

// ---

// ## What is `passport-local`?

// **passport-local** =
// 👉 username + password authentication
// 👉 stored in **your database**

// Example:

// ```
// username: nisar
// password: ****
// ```

// ---

// ## What is `passport-local-mongoose`?

// This is the **magic helper** 🪄

// Instead of you writing:

// * password hashing
// * password comparison
// * login logic
// * register logic

// 👉 **passport-local-mongoose does ALL of this for you automatically**

// That’s why people love it.

// ---

// ## Now let’s read YOUR code line by line 👇

// ### 1️⃣ Imports

// ```js
// const mongoose = require("mongoose")
// const Schema = mongoose.Schema
// const passportLocalMongoose = require("passport-local-mongoose")
// ```

// * `mongoose` → database
// * `Schema` → structure of user data
// * `passport-local-mongoose` → authentication helper

// ---

// ### 2️⃣ User Schema

// ```js
// const userSchema = new Schema({
//     email:{
//         type:String,
//         required:true,
//     }
// });
// ```

// You ONLY wrote:

// * email

// ❓ **Where is username and password??**

// WAIT ⏳ we’ll see next.

// ---

// ### 3️⃣ This line is THE KEY 🔑

// ```js
// userSchema.plugin(passportLocalMongoose);
// ```

// 🔥 THIS LINE AUTOMATICALLY ADDS:

// ✅ `username`
// ✅ `hash` (hashed password)
// ✅ `salt`
// ✅ helper methods like:

// * `User.register()`
// * `User.authenticate()`
// * `User.login()`

// So **YOU DON’T NEED TO DEFINE THEM MANUALLY**

// ---

// ### 4️⃣ Export model

// ```js
// module.exports = mongoose.model("User", userSchema)
// ```

// Now your `User` model already has:

// ```
// {
//   email,
//   username,
//   hash,
//   salt
// }
// ```

// ---

// ## Why you didn’t define password in schema?

// Because **YOU SHOULD NEVER STORE PASSWORDS DIRECTLY**

// Instead:

// * password → hashed
// * stored as `hash + salt`

// Passport-local-mongoose does this securely for you.

// ---

// ## What happens during REGISTER?

// ```js
// User.register(new User({ username, email }), password)
// ```

// Behind the scenes:

// 1. Password is hashed
// 2. Salt is added
// 3. Hash is stored
// 4. Password is NEVER saved

// ---

// ## What happens during LOGIN?

// ```js
// passport.authenticate("local")
// ```

// Behind the scenes:

// 1. User enters password
// 2. Password is hashed again
// 3. Compared with stored hash
// 4. If match → login success ✅

// ---

// ## Simple analogy 🧠

// Think of `passport-local-mongoose` as:

// > “I’ll handle passwords bro, you just chill.”

// You only care about:

// * email
// * username

// ---

// ## Final 1-line summary

// > **passport-local-mongoose automatically adds username, password hashing, salting, and authentication logic so you don’t have to write insecure code.**

// You’re learning the **right way** 👍
// Next good topics (tell me when ready):

// * `serializeUser / deserializeUser`
// * login vs session
// * auth vs authorization
