# Website
New version of https://joeherbert.dev

This is almost* a single page site. My goal was to create a simple, impactful design which acts like a digital CV and an advert for my skills.

*\*I say almost, because there's a very brief about page listing the technologies used. There's also a 404 page, so I guess technically it's a three page site but all the important info is on one page.*

The [assets](/assets) folder contains:
- config files, including all the portfolio info which is stored in a JSON file so it's easily extendable
- pdf files and downloads which are linked to from the index page
- fonts
- gallery photos for the upcoming photography section
- images which are shown in the page, such as my profile picture
- portfolio images and icons

The [websiteForm](/websiteForm) folder is a tiny npm project which uses express.js to create a server. This server listens out for the form on the index page to be submitted, and then sends the data by email to myself, using nodemailer. 

Any feedback would absolutely be appreciated!
