# App

GymPass style app.

## FRs (Functional Requirements)
- [x] It should be possible to register;
- [x] It should be possible to authenticate;
- [x] It should be possible to obtain the profile of a logged-in user;
- [x] It should be possible to obtain the number of check-ins made by the logged-in user;
- [x] It should be possible to obtain your check-in history;
- [x] It should be possible for the user to search for nearby gyms (up to 10km);
- [x] It should be possible for the user to search for gyms by name;
- [x] It should be possible for the user to check-in at a gym;
- [x] It should be possible to validate a user's check-in;
- [x] It should be possible to register a gym;


## RBs (Business Requirements)
- [x] The user should not be able to register with an existing email;
- [x] The user cannot do 2 (two) check-ins on the same day;
- [x] The user cannot check-in if they are not within 100m (one hundred meters) of the gym;
- [ ] The check-in must be validated within 20 minutes of being created;
- [ ] The check-in must be validated only by administrators;
- [ ] The gym must be created only by administrators;


## NFRs (Non-Functional Requirements)
- [x] The user's password must be encrypted;
- [x] The application data must be stored in a POSTGRES database;
- [ ] All data lists must be paginated with 20 items per page;
- [ ] The user must be identified by a JWT (Json Web Token);

