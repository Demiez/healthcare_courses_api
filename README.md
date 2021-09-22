# Healthcare Courses API Spec

## Project Scope

Create the backend API for a healthcare courses directory website. Due to COVID-19 situation there's a high demand for the healthcare courses. There are Medical Training Centers or Colleges, which provide allied-health education of clinical knowledge & skills in form of specific courses as a service. All of the functionality below needs to be fully implemented in the project.

### Medical Training Centers/Colleges (mtcs)

- List all MTCs in the database
  - Pagination
  - Select specific fields in result
  - Limit number of results
  - Filter by fields
- Search MTCs by radius from zipcode
  - Use a geocoder to get exact location and coords from a single address field
- Get single MTC
- Create new MTC
  - Authenticated users only
  - Must have the role "provider" or "admin"
  - Only one MTC per healthcare provider (admins can create more)
  - Field validation via Mongoose?
- Upload a photo for MTC
  - Owner only
  - Photo will be uploaded to local filesystem
- Update MTC
  - Owner only
  - Validation on update
- Delete MTC
  - Owner only
- Calculate the average cost of all courses provided by the MTC
- Calculate the average rating from the reviews for MTC

### Healthcare Courses

- List all healthcare courses for MTC
- List all healthcare courses in general
  - Pagination, filtering and so on
- Get single healthcare course
- Create new healthcare course
  - Authenticated users only
  - Must have the role "provider" or "admin"
  - Only the owner or an admin can create a course for MTC
  - Providers can create multiple courses
- Update course
  - Owner only
- Delete course
  - Owner only

### Reviews

- List all reviews for MTC
- List all reviews in general
  - Pagination, filtering, etc
- Get a single review
- Create a review
  - Authenticated users only
  - Must have the role "user" or "admin" (no providers)
- Update review
  - Owner only
- Delete review
  - Owner only

### Users & Authentication

- Authentication will be done using JWT/cookies
  - JWT and cookie should expire in 30 days
- User registration
  - Register as a "user" or "provider"
  - Once registered, a token will be sent along with a cookie (token = xxx)
  - Passwords must be hashed
- User login
  - User can login with email and password
  - Plain text password will be compared with stored hashed password
  - Once logged in, a token will be sent along with a cookie (token = xxx)
- User logout
  - Cookie will be sent to set token = none
- Get user
  - Route to get the currently logged in user (via token)
- Password reset (lost password)
  - User can request to reset password
  - A hashed token will be emailed to the users registered email address
  - A put request can be made to the generated url to reset password
  - The token will expire after 10 minutes
- Update user info
  - Authenticated user only
  - Separate route to update password
- User CRUD
  - Admin only
- Users can only be made admin by updating the database field manually

## Security

- Encrypt passwords and reset tokens
- Prevent NoSQL injections
- Add headers for security (helmet)
- Prevent cross site scripting - XSS
- Add a rate limit for requests of 100 requests per 10 minutes
- Protect against http param polution
- Use cors to make API public (for now)

## Logging

- Use winston library
- Implement logging for info and error events
- Add transports both for console and file (./logs)
- Differentiate development and production logging application?

## Documentation

- Use Swagger to create API spec
- Additionaly try use Postman to create documentation?
- Additionaly try use docgen to create HTML files from Postman?
- Additionaly try add html files as the / route for the api

## Deployment (Digital Ocean, AWS or GCP???)

- Push to Github
- Create a droplet
- Clone repo on to server
- Use PM2 process manager?
- Enable firewall (ufw) and open needed ports
- Create an NGINX reverse proxy for port 80
- Connect a domain name
- Install an SSL using Let's Encrypt (won't need for AWS, decide later on)

## Code Related Suggestions

- Add Dependency Injection (typedi)
- Implement unit tests with Mocha/Chai/Sinon
- Implement integration tests with Mocha/Chai/Sinon
- Add mutation testing?
- NPM scripts for dev and production env
- Config file for important constants
- Use controller methods with documented descriptions/routes
- Error handling middleware
- Authentication middleware for protecting routes and setting user roles
- Validation with information including field and clarification message
- Use async/await (create middleware to clean up controller methods)
- Create a database seeder to import and destroy data

## Dependencies updates

- moved from "mongodb-memory-server": "^7.3.6" to "mongodb-memory-server-core": "^7.4.0"
