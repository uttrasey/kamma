# Kamma code test

- see the hosted version here https://uttrasey.github.io/kamma/
- Opted for a really simple delivery of HTML/CSS served by Github pages
- I had the CSS in the HTML until I needed a second file
- design is pretty responsive and mobile friendly
- I've minified the deployed files for speed
- simple commit hook does the pre-processing of the files into the `/docs` folder which is then hosted by Github
- I had more of a debate around how to do the email/DB stage. There are services out there like Netflify and Firebase which are simpler than something like AWS. I know that Kamma use AWS and I find the seperation quite nice so decided to expose an endpoint to handle DB storage (Dynamo) and email (SES). The serverless library makes developing these kinds of things very simple.
- I'm a firm believer in the benefits of few well written tests... in a more serious environment JEST would be included.

Picked up all the low hanging fruit on Lighthouse

![lighthouse](./lighthouse.png)

