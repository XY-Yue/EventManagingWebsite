# EventManagingWebsite
This project is a Web version of [EventManagingSystem](https://github.com/XY-Yue/EventManagingSystem), it has similar features, 
but have a Web UI written in HTML, Javascript and CSS, see README of that project for details of the design ideas and features.  
The purpose of this project is mainly for myself to gain experience on Web languages (Javascript, HTML and CSS) and design patterns such as MVP, and because of that, 
I mostly copied the design structure and features of [EventManagingSystem](https://github.com/XY-Yue/EventManagingSystem), but I designed the web UI myself to make use of the web technologies.  
I was not very familiar with server client interaction at the moment I start this project, so for now, the whole project runs on the client. By now (after this project is finished) I am planning to first try Java Spring framework and then try to add some PHP or Node to this project and do some server client interactions.  
  
## To run the project
1. Download Visual Studio Code (VSC) and install its plugin Live Server.
2. Clone or download this project EventManagingWebsite
3. In VSC, use File > Open Folder, and choose the folder of this project (EventManagingWebsite)
4. Right click Main.html (or any .html file in the project) in VSC and choose open with Live Server  
I have only run the project with Visual Studio Code's plugin Live Server on Firefox, but it should run on other browsers too except for some versions of IE.  
Due to some difficulties (see details below), I only managed to store data locally using local storage, which means I cannot provide some starting data for testing 
(I am not sure if hard coding some data in Javascript is a good idea)  

## To test the project  
So far, only organizers are allowed to add rooms, add events, etc. To register as an organizer, use invitation code "create an organizer".  
To register as a speaker, use "create an speaker" as invitation code, to register as a vip account, use "create an vip" as invitation code.  
For more details, see view/src/presenter/model/account/AccountManager.js, all invitation code can be found in the constructor.

## Thoughts on this project  
As mestioned above, the purpose of this project is mostly learning for myself, so I did not spend much time on designing the features, but copied mostly from EventManagingSystem. 
The logic in the implementations are also mostly copied from EventManagingSystem, so I did not meet much difficulties with debugging as the logic in that project is tested 
pretty well. But I still made test cases when coding to make sure the development is test driven.  
What I put most of my effort in is to explore various tool that I can use to do web development and to try the MVP pattern. Even if only Javascript, HTML and CSS are used in the project, 
I also studied things like AJAX, PHP, Node, etc.  
For MVP pattern, I took a look at some examples of the pattern, but I fell like I did not fully understand it. For example, some example says the View should be very passive, 
where it only calls methods in the presenter when a event took place, and the presenter calls methods in view to update it. But some other examples does not keep the View
that passive, where it processes user input first and then calls methods in presenter with the input. In my project, I tried to keep the view do as less things as possible.
I am looking forward to gain a better understanding on MVP in the future.  
Also, I made the project kind of in a rush, before a test and an assignment. I should definitly come back to this project later.

### What I learned from this project
1. General web design experience, including experience on JS, HTML and CSS. Also includes using the tools such as query test to pass data, DOM to modify HTML and CSS and use local storage to store data.
2. An experience of designing a GUI myself. (for the first time, a web GUI)
3. An experience of software development with a dynamic typing language (previous experience with python only has small projects).
4. Studied PHP and tried to use AJAX to communicate with it (to store file on the server), but my XMLHttpRequest cannot run PHP files for some reason, it runs other files fine.
Will definitly come back to this as soon as I learned how to communicate with the server correctly.
5. Studied JQuery and used it to keep a common navigation bar on the top and a footor at the bottom.
6. Studied Node.js and ASP, but did not make use of them.

### What I should do in the future for this project
1. Manage to store files on the server and communicate with it. In this project, I am storing all data in local storage, 
which is a bad idea for a website.
2. Use database technologies, I studied related information too, but I feel like I did not fully understand it. Which is why I did not even use IndexDB. Will definitly improve this after I gain some more knowledge (such as taking a course on this field).
3. Test the project more carefully. Even if the project is developed mostly test driven, I still need to do more testing to make sure it is bug free.
4. Add more features to the project to make it more complete. But I am not sure if it is worth it, the topic of this project is from a course project and is not very 
interesting. Therefore, the project will mostly likely to act as a platform where I try different things.
5. Make more projects, this time hopefully I can make something more useful to both myself and the society.
