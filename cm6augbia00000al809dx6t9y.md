---
title: "MongoDB Aggregation pipelines"
seoTitle: "Efficient Data Analysis with MongoDB Aggregation"
seoDescription: "Learn how to use MongoDB Aggregation Pipelines to process, transform, and analyze data with multiple stages and operations. Explore common examples"
datePublished: Fri Jan 24 2025 14:15:15 GMT+0000 (Coordinated Universal Time)
cuid: cm6augbia00000al809dx6t9y
slug: mongodb-aggregation-pipelines
ogImage: https://cdn.hashnode.com/res/hashnode/image/upload/v1737728106561/9ffe8c28-37e1-44b3-bdec-1ba01b60fdd9.png
tags: mongodb, mongoose, vscode, aggregation, pipeline, aggregation-pipeline

---

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1737631928877/31938dda-8dc9-4467-afd2-7120ec875149.png align="center")

## What are mongoDB aggregation pipelines ?

1. MongoDB’s **Aggregation Pipeline** is a framework used to process data and perform operations on collections. It allows you to transform, filter, and aggregate data in a collection using a series of stages, each with a specific operation.
    
2. The pipeline consists of multiple stages. Each stage processes the input documents and produces output, which becomes the input for the next stage.
    
3. It can perform filtering, grouping, sorting, projecting, and even complex transformations on documents.
    

## Let’s look pipelines with examples.

Before proceeding kindy inject the attached (objects) data in MongoDB [MongoDB Data sets](https://github.com/divishtk/MongoDB-Aggregation-Pipelines) like below and push it to mongo cluster.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1737639442878/eae4133b-0ae0-414d-b98f-30e41cb2ec36.png align="center")

* Basis Structure looks like
    

```javascript
db.collection.aggregate([
  { <stage1>: { <operation1> } },
  { <stage2>: { <operation2> } },
  ...
]);
```

### **Common Aggregation Stages**

1. $match & $count
    
    * Match filters documents based on a condition, similar to the find query & count does the total of documents.
        
        * For eg - `How many users are active & count them?`
            

```javascript
[
  {
    $match: {
      isActive:true
    }
  },
  {
    $count: 'Total Active Users'
  }]
```

### `OP`

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1737642980694/9f6977ec-f9ee-4694-b604-dc1f6e5cf093.png align="right")

---

2. $group & $avg
    
    * This basically groups documents by a specified key **(id)** and performs operations like sum, average, etc whereas avg calculates the average for document
        
    * For eg - `What are average age of users ?`
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1737643455851/220ef478-989a-47e6-9ec6-fbf625d2305b.png align="center")
        

---

3. $sort & $limit
    
    * Sorts documents based on a field & -1 means in descending order whereas 1 mean to ascend.
        
    * Limits perform the number of documents returned.
        
    * Eg - `List 4 common fruits among users and show only top 5?`
        

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1737644458002/82bfc023-56ff-4115-ba5d-5adda01cce99.png align="center")

* Eg - `Find total no of male and females ?`
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1737726116610/88151cf5-9b3e-4f20-857d-8cd7fd7f44f1.png align="center")
    
    * Eg - `Which country has highest no of registered users?`
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1737726243943/7bde249e-01f8-4eb4-9b70-dde81bda3f48.png align="center")
        

---

4. $unwind
    
    * Deconstructs an array field into individual documents.
        
    * Eg - `What is average no of tags per users ?`
        
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1737726703754/12f91c68-41eb-47cd-9b24-56e13884d9a4.png align="center")
    

Alternate pipeline to find average.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1737726825339/6aa7cc23-bef1-461f-a7ae-68a879bd9dcb.png align="center")

---

Eg - `How many users have enim as one of their tags ?`

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1737727032500/d9df50ec-1594-4d0e-9b15-2e3ce3dfd2b3.png align="center")

* Alternate pipleline below also we can follow.
    

```javascript
[
  {
    $match: {
      tags: "enim",
    }
  },
  {
    $count: 'Users With Enim Tags'
  }]
```

---

5. $project
    
    * It basically reshapes or filter the documents by including, excluding, or creating new fields.
        
    * Eg -  `What are the names and age of users who are inactive and have velit as tag ?`
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1737727227791/1b0657e5-be47-494f-8292-52282e2578ba.png align="center")
        
        * Eg - How many users have a phone no starting with +1(940) ?
            
            ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1737727289905/641e9e7c-d964-4ae5-9984-be297cd4104f.png align="center")
            

Eg - `Who has registered the most recently ?`

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1737727361797/8b2b426b-fb66-4359-823a-7956e6a8056e.png align="center")

---

5. $push :
    
    * We basically use this operator to add elements to an array field. It is commonly used in the context of the update operation and the **Aggregation Pipeline** to append values to an existing array.
        

* Eg - `Categorize users by their favorite fruit.`
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1737727416129/b8ff6380-8dae-4f01-a443-7f62955ba33e.png align="center")
    
    * Eg - `How many users have ad as the second tag in their list of tags ?`
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1737727601369/502a8bf6-be8a-42bf-a2ea-af28dfff3557.png align="center")
        
        * Eg - `Find users who have both enim and id as their tags ?`
            
            ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1737727665945/6e36ec43-d4e9-4fbd-a525-c2417710425b.png align="center")
            

Eg - `List all the companies located in USA with corresponding user count`

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1737727746679/33c87dd8-cce0-4824-badc-735d84dbadad.png align="center")

---

6. $lookup:
    
    * Performs a left outer join with another collection.
        
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1737727989107/538cf622-a897-4009-b322-f2860acffd44.png align="center")