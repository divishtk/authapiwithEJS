---
title: "Info on JWT Web Tokens"
seoTitle: "Understanding JWT: JSON Web Tokens Explained"
seoDescription: "Learn about JSON Web Tokens (JWTs), their structure, uses for authentication and authorization, and how to implement them in web applications"
datePublished: Thu Jan 23 2025 11:23:27 GMT+0000 (Coordinated Universal Time)
cuid: cm698visc001l09il3c04fneb
slug: info-on-jwt-web-tokens
cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1736777202730/68cdcf95-e362-49b2-9e6d-b250c1456148.webp
ogImage: https://cdn.hashnode.com/res/hashnode/image/upload/v1737631378444/ed785e4c-5427-4988-bcd1-35ebb515dbd1.png
tags: postman, mongodb, nodejs, backend, apis, jwt, token, prettier

---

## What are tokens ?

JSON Web Tokens (JWT) are a compact, secure, and standardized way to represent claims or information between two parties (e.g., client and server). They are commonly used for **authentication** and **authorization** in web apps.

A JWT consists of three parts, separated by dots (.)

* Header
    
* Payload
    
* Signature
    

### Header -

It contains metadata about the token, such as the type of token (JWT) and the hashing algorithm used.

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload -

Contains the **claims** or the data being transmitted, such as user information, expiration time, etc.Overall it contians the data like user\_id ,name ,dob ,etc via javascript object. For example

```json
{
  "user_id": 1997,
  "name": "Divisht Kori",
  "dob": "1997-04-05"
}
```

### Signature -

It is just a combination of hashed header and payload with jwt secret key we provide in code.

**HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)**

**Note** - Tokens are seperated by dots ***(Header.Payload.Signature)***. For example

**eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9<mark>.</mark>eyJfaWQiOiI2NzgyNjIyZDhjNWQzMWE5ZGNkN2ZkYmIiLCJlbWFpbCI6ImRAZ21haWwuY29tIiwidXNlck5hbWUihdmlvbnMiLCJmdWxsbmFtZSI6IkRpdmlzaHQgS29yaSIsImlhdCI6MTczNjY4ODAxMSwiZXhwIjoxNzM2Nzc0NDExfQ<mark>.</mark>flWXW8OOHe9\_pRoeeJfQDVVT-YMZtbV3EeWT1pVkcXU**

---

## Types of Tokens

* Access Token
    
* Refresh Token
    

### Access Token

An **access token** is a string that represents the authorization to access specific resources on behalf of a user or application.Foe example if user want to access some specific routes access token is required. It is issued by an authentication server after the user successfully logs in or authenticates. Access tokens are of short-lived and are used in conjunction with APIs to validate user identity and role permission.

1\. **Authentication:**

• A user logs in with credentials (For exaple - username and password).

• The server verifies the credentials check the DB, if user exists backend issues an access token to the client.

2\. **Token Usage:**

• The client includes the access token via some API requests (e.g., in the Authorization header as Bearer &lt;token&gt;).

• The server verifies the token to ensure it is valid and that the user is authorized to access the resource.

3\. **Token Expiry:**

• Access tokens are designed to expire after a short period (e.g., 15 minutes to a few hours).

• This minimizes security risks in case the token is compromised.

4\. **Renewal (Optional):**

• After the access token expires, the client uses a **refresh token** to obtain a new access token without requiring the user to log in again.

### Refresh Token

A **refresh token** is a special type of token used to obtain a new access token without requiring the user to log in again. Unlike access tokens, which are short-lived, refresh tokens are designed to last longer (e.g., days or weeks).

**How Refresh Tokens Work**

1\. **Login Phase:**

• When a user logs in, the server generates both an **access token** and a **refresh token**.

• The access token is used to authenticate API requests.

• The refresh token is securely stored (for example in an HTTP-only cookie or client storage).

2\. **Access Token Expiry:**

• Once the access token expires, the client sends the refresh token to the server to request a new access token.

3\. **Token Renewal:**

• The server verifies the refresh token.

• If valid, a new access token (and optionally, a new refresh token) is issued.

4\. **Invalid or Compromised Token:**

• If the refresh token is invalid or compromised, the user must reauthenticate.

---

## Step by step working of access token in Node

1. Install a npm packages.
    
    <div data-node-type="callout">
    <div data-node-type="callout-emoji">💡</div>
    <div data-node-type="callout-text">npm install express jsonwebtoken dotenv body-parse</div>
    </div>
    
2. Setup of environment variables , kindly create a .env file in the root of your project with the following:
    
    ```javascript
    JWT_EXPIRES_IN=15m 
    ACCESS_TOKEN_SECRET=your_refresh_secret_key 
    ACCESS_TOKEN_EXPIRES_IN=7d
    PORT=8000
    ```
    
    3. Create the user model
        
    
    ```javascript
    import mongoose, { Schema } from "mongoose";
    import jwt from "jsonwebtoken";
    import bcrypt from "bcrypt";
    
    const userSchema = new mongoose.Schema(
      {
        userName: {
          type: String,
          required: true,
          unique: true,
          lowercase: true,
          trim: true,
          index: true,
        },
        email: {
          type: String,
          required: true,
          unique: true,
          lowercase: true,
          trim: true,
        },
        fullName: {
          type: String,
          required: true,
          unique: true,
          trim: true,
          index: true,
        },
        avatar: {
          type: String, //cloudinary url
        },
        coverImage: {
          type: String, //cloudinary url
        },
    
        watchedHistory: [
          {
            type: Schema.Types.ObjectId,
            ref: "Video",
          },
        ],
    
        password: {
          type: String,
          required: [true, "Password is required"],
        },
    
        refreshedToken: {
          type: String,
        },
      },
      {
        timestamps: true,
      }
    );
    
    
    const generateJwtToken = (userData) => {
    
        return jwt.sign(
            userData,
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn : process.env.ACCESS_TOKEN_EXPIRY
            }
        )
    
    }
    
    
    
    export const User = mongoose.model("User", userSchema);
    ```
    
3. The Jwt **sign()** method will create token for you which will consist of **signature**, **header** & **payload**.Here payload we are passing **user\_id & email.** It depends on users what payload they want to pass that we will look at user controller. After we need to pass secret key as well as token expiry which are already their in your env file.
    
4. Create the user controller.
    

```javascript
const loginUser = asyncHander(async (req, resp, next) => {
  try {
    const { userID, email } = req.body;

    if (!userID && !email) {
      throw new apiErrors(400, "Username or email is required");
    }

    const uId = await User.findOne({ userID, email });
    if (!uId) throw new apiErrors(404, "User or email does not exists");

    //generate token
    const loginPayload = {
      uId,
      email: uId.email,
    };

    const token = generateJwtToken(loginPayload);

    return resp.status(201).json({
      token: token,
      message: "Login Sucessfully",
    });
  } catch (error) {
    console.log("er", error);
    resp.status(500).json({
      error: error.message,
    });
  }
});
```

Here we are calling **generateJwtToken()** function & passing loginPayload which consists of data userId and email. Now access token is generated it will look something like this

**eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1SWQiOnsiX2lkIjoiNjc3YmU5MDA1ZDlmMzhjZDk4Mjg5YTIwIiwidXNlcklEIjoiMTIiLCJlbWFpbCI6ImFAZ21haWwuY29tIiwiZnJvbnRQaWMiOiJodHRwOi8vcmVzLmNsb3VkaW5hcnkuY29tL2RncXZ0NHQxNC9pbWFnZS91cGxvYWQvdjE3MzYxNzM4MjEvbnBpdnBseDdobmxwZ2Vpbnl1d20ucG5nIiwidGh1bWJuYWlsIjoiaHR0cDovL3Jlcy5jbG91ZGluYXJ5LmNvbS9kZ3F2dDR0MTQvaW1hZ2UvdXBsb2FkL3YxNzM2MTczODIzL3pyMWs4NTB6dDRseWVqdjN5MzVjLnBuZyIsIl9fdiI6MH0sImVtYWlsIjoiYUBnbWFpbC5jb20iLCJpYXQiOjE3Mzc1MzU3Mzl9.o4\_TXjKO\_LBM4UAQOugp6ghoYWIFoKPZHYBppmP45X4**

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1737638246263/c9c13796-2e55-4d5e-b2b6-0d4dcc3f1473.png align="center")

5. There’s something called authentication middlewares in **NodeJS**. We need to verify and match the Bearer token that we are passing via postman authorization header, whether its same or not with the token that we have got while login. Basically we are passing the authentication middleware for verification of token via routes that we will see below. So this will take care whether the token is correct or not & from that token we will fetch the user payload.
    
6. Create the middleware **(auth.middleware.js).**
    
    ```javascript
    import jwt from "jsonwebtoken";
    
    const authJWTMiddleware = async (req, res, next) => {
      //extract jwt token from req.header
      const reqHeader = req.headers.authorization;
      if (!reqHeader) return res.status(401).json({ error: " Token not found" });
    
      const token = reqHeader.split(" ")[1];
    
      if (!token) {
        return res.status(401).json({
          error: "Unauthorized Access",
        });
      }
    
      try {
        const decodedResults = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        req.decodedPaylaod = decodedResults;
        next();
      } catch (err) {
        console.log(err);
        return res.status(401).json({
          error: "Invalid Token",
        });
      }
    };
    
    export default authJWTMiddleware;
    ```
    
7. For controller create api to fetch user profile, to make the use of Jwt tokens we will create the **getUserProfile()** .Clients must be logged in & they will have access token, they can pass their token in authorization header postman. Without login user cant see their profiles as we have applied the middleware in the routes.
    
    ```javascript
    router.route('/checkProfile').get((authJWTMiddleware),checkProfile)
    ```
    
    ```javascript
    const getUserProfile = asyncHander(async (req, resp) => {
      try {
        const currentUser = req.decodedPaylaod;
        const userId = currentUser.uId._id;
        const user = await User.findById(userId);
    
        resp.status(200).json({
          data: user,
        });
      } catch (error) {
        return resp.status(401).json({
          message: "Users not found",
        });
      }
    });
    ```
    
    9. If the user is logged in & is authenticated for to see user only profile via tokens he can see the data something like below.
        
    10. ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1737630713519/44ea6026-412c-4708-90c8-9410891cb110.png align="center")
        
8. You can visit github links and fork the projects regarding token topic [Jwt token api repo](https://github.com/divishtk/JWTTokenAPI)
    

## How to use Refresh tokens ?

1. Overall, we can use a refresh token when the access token expires, as it is only valid for a short time. With a refresh token, we can generate a new access token and log in again. Here’s how we can implement refresh tokens in a Node.js backend.
    

```javascript
const jwt = require("jsonwebtoken");

const generateJwtToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_TOKEN_SECRET, {
        expiresIn: process.env.JWT_TOKEN_EXPIRY, // Example: "15m"
    });
};
const generateRefreshToken = (userData) => {
  return jwt.sign({ userData }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });
};
```

2. **Login with Refresh Token**
    
    Modify the loginUser function to generate and return both access and refresh tokens.
    

```javascript
const loginUser = asyncHander(async (req, resp, next) => {
    const { userID, email } = req.body;

    if (!userID && !email) {
        throw new apiErrors(400, "Username or email is required");
    }

    const user = await User.findOne({ userID, email });
    if (!user) throw new apiErrors(404, "User does not exist");

    // Here we are generating tokens & passing payload
    const payload = { userID: user.userID, email: user.email };
    const accessToken = generateJwtToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Save refresh token to DB
    user.refreshToken = refreshToken;
    await user.save();

    // Send tokens to client
    return resp.status(201).json({
        accessToken,
        refreshToken,
        message: "Login Successful",
    });
});
```

3. Generally, we can also store the tokens in HTTP header cookies and set them to true.We store refresh tokens in DB as well.
    
4. Now we will create a new controller lets say **generateNewAccessToken()** using a valid refresh token when the access token expires.
    
    ```javascript
    const refreshAccessToken = asyncHander(async (req, resp) => {
        const authHeader = req.headers.authorization;
    
        // Check if the Authorization header exists and contains a token
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return resp.status(401).json({ error: "Refresh token is required" });
        }
    
        const refreshToken = authHeader.split(" ")[1]; // Extract the token after "Bearer"
    
        // Check if the refresh token exists in the database
        const user = await User.findOne({ refreshToken });
        if (!user) {
            return resp.status(403).json({ error: "Invalid refresh token" });
        }
    
        try {
            // Verify the refresh token
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
            const newAccessToken = generateJwtToken({ userID: decoded.userID, email: decoded.email });
    
            // Send the new access token
            return resp.status(200).json({
                accessToken: newAccessToken,
                message: "Access token refreshed",
            });
        } catch (error) {
            return resp.status(403).json({ error: "Invalid or expired refresh token" });
        }
    });
    ```
    
5. Set up the endpoint route.
    

```javascript
router.route('/refresh-token').post(refreshAccessToken)
```

6. Now we have the new access token & we can make the use out of it .
    
7. We can also set up the logout controller **logoutUser()** & set the refresh token to null, undefined, or 1 & create the endpoint route.
    

```javascript
const logoutUser = asyncHander(async (req, resp) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return resp.status(400).json({ error: "Refresh token is required" });
    }

    // Remove refresh token from DB
    const user = await User.findOneAndUpdate(
        { refreshToken },
        { refreshToken: null },
        { new: true }
    );

    if (!user) {
        return resp.status(404).json({ error: "User not found" });
    }

    return resp.status(200).json({ message: "Logged out successfully" });
});
```

```javascript
router.route('/logout').post(logoutUser);
```

8. You can visit the GitHub link to see how the refresh token is used in the repository [Access & Refresh token](https://github.com/divishtk/BackendNode).