# RMS-Confidentiality-Integrity
 Developed a record management system that ensure the integrity and confidentiality in the system. This is my seven (7th) semester of BS Software Engineering project for the course CS-3002 Information Security presented to Dr.Fahad Samad.
 
 # Tech
 * React JS
 * Node JS + Express JS
 * Bcrypt (Hashing), JsonWebToken (JWT) Authentication, Node-Forge (Digital Certificate + Certificate Request), Crypto JS (Asymmetric Key Pair + Digital Signature)
 * NodeMailer (sending email)
 * MySql
 * Postman for API Testing

# Introduction
A user details is an essential element that needs to be validated to prevent attack,manipulating and breaching of the data. 

The physical record management system is a tedious job that is carried out daily in the schools, universities etc. 
To ensure the system works perfectly, I will perform confidentiality and integrity.

The system will allow users to register within the system through which we will generate its
public and private keys at runtime.

The user will be able to register with the system, keys will be generated and a private key will
be provided to the user in hashed form on its email to perform digital signature from the
browser/client.

The confidentiality will be maintained through authenticating user, validating user id and
tokenization through which the system will allow the operations right to the user. There will
exist a Certificate Authority (CA) that will issue a certificate to the user through which the
system will maintain the confidence on the user. When the user wants to Edit the Record, the
user will create a digital signature, digital certificate and data to the application server. The
application server will then verify the certificate, obtain the public key from it and then verify
the digital signature. After doing this, it will update the student record.
This system is built to secure the data of the users of the organization and by maintaining the
confidentiality and integrity in the system.

# Architecture
The system is built using Model View Controller (MVC) architecture. The system consists of
three main entities server that include Client Server, Application Server and CA Server. The
below system diagram displays the communication between these entities.

![IS_Project_Architecture2](https://user-images.githubusercontent.com/87481047/209209162-c6a77987-13e6-4a8c-aa7a-bf2acca7ebcb.png)


The responsibility of the Application Server is to handle all the request from the users. It also stores all the information in the database. The Application Server will pass the request of the creation of Asymmetric key to the Client Server. The Client Server is also responsible for creating the Certificate Request (CSR) and provide this request to the Certificate Authority (CA). The CA’s Server will issue a Certificate to the Client Server. The Client Server will create a Digital Signature. It will provide the Digital Signature and Digital Certificate to the Application Server. The Application Server will verify the Digital Signature provided by the Client Server and upon verification, it will then obtain the public key and verify the Digital Signature. After verification, it will then update the record.

# Features
* Signup
* Login
* Add Student Details
* View Students Details
* Edit Student Record

# Conclusion
The secure record management is necessary in the organization that could maintain the integrity and confidentiality in the system and does not allow any illegal and unauthorize acccess of the system by any other party. Therefore, such a secure system is a must in an organization to protect their data from data breach and unauthorized data access.

**All the details are mentioned in the report folder containing Project Report File.**

